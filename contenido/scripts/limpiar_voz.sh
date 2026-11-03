#!/usr/bin/env bash
# Cadena de limpieza de voz usada en todos los reels y la promo de KLYP.
#   1) UVR-DeEcho-DeReverb (audio-separator)  -> quita eco y reverberación del cuarto
#   2) DeepFilterNet (-a 50..60 dB)          -> quita ruido de fondo
#   3) Nivel a -19 LUFS + EQ de voz + de-esser + compresor
# Uso: limpiar_voz.sh entrada.(mp4|mov|wav) salida.wav
# Requiere: SEP_BIN (audio-separator), SEP_MODELS (carpeta con UVR-DeEcho-DeReverb.pth), DF_BIN (deep-filter)
set -euo pipefail
IN=$1 OUT=$2
SEP_BIN=${SEP_BIN:-audio-separator}
SEP_MODELS=${SEP_MODELS:?carpeta de modelos de audio-separator}
DF_BIN=${DF_BIN:-deep-filter}
DF_ATTEN=${DF_ATTEN:-50}
W=$(mktemp -d)
ffmpeg -y -v error -i "$IN" -vn -ac 2 -ar 44100 "$W/v_in.wav"
"$SEP_BIN" "$W/v_in.wav" -m UVR-DeEcho-DeReverb.pth --model_file_dir "$SEP_MODELS" --output_dir "$W" --output_format WAV >/dev/null
ffmpeg -y -v error -i "$W/v_in_(No Reverb)_UVR-DeEcho-DeReverb.wav" -ac 1 -ar 48000 -c:a pcm_s16le "$W/v_dry.wav"
"$DF_BIN" -D -a "$DF_ATTEN" -o "$W/df" "$W/v_dry.wav" >/dev/null 2>&1
L=$(ffmpeg -hide_banner -i "$W/df/v_dry.wav" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}')
G=$(python3 -c "print(round(-19-($L),1))")
EQ="highpass=f=85,equalizer=f=220:t=q:w=1.0:g=1.5,equalizer=f=380:t=q:w=1.3:g=-2,equalizer=f=3200:t=q:w=1.0:g=2.5,equalizer=f=9000:t=q:w=1.0:g=1,deesser=i=0.35,acompressor=threshold=-24dB:ratio=3:attack=6:release=120:makeup=2"
ffmpeg -y -v error -i "$W/df/v_dry.wav" -af "volume=${G}dB,$EQ" -ar 48000 -c:a pcm_s24le "$OUT"
rm -rf "$W"
echo "listo: $OUT"
