"""Person matte for a plain-wall take -> VP9 WebM with alpha (her pixels + alpha), to layer graphics behind her.
usage: alpha_matte.py in.mp4 out.webm"""
import sys, subprocess, numpy as np, torch, cv2
S = "/tmp/claude-0/-home-user-INMOBILIARIA/9406ee51-8b45-5b3e-82f1-af43d6c82d4f/scratchpad/"
sys.path.insert(0, S + "tools/RobustVideoMatting"); sys.path.insert(0, S)
from model import MattingNetwork
from post import refine
torch.set_num_threads(4)
net = MattingNetwork("resnet50").eval(); net.load_state_dict(torch.load(S + "models/rvm_resnet50.pth", map_location="cpu"))
W, H = 1920, 1080
dec = subprocess.Popen(["ffmpeg", "-v", "error", "-i", sys.argv[1], "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
enc = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", f"{W}x{H}", "-r", "30", "-i", "-",
                        "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "6M", "-deadline", "good", "-cpu-used", "4", "-row-mt", "1", "-auto-alt-ref", "0", sys.argv[2]], stdin=subprocess.PIPE)
rec = [None] * 4; n = 0
while True:
    buf = dec.stdout.read(W * H * 3)
    if len(buf) < W * H * 3: break
    fr = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
    x = torch.from_numpy(fr.copy()).permute(2, 0, 1).float().div(255)[None, None]
    with torch.no_grad():
        _, pha, *rec = net(x, *rec, downsample_ratio=0.4)
    a, f = refine(pha[0, 0, 0].numpy(), fr)
    rgba = np.dstack([(np.clip(f, 0, 1) * 255).astype(np.uint8), (np.clip(a, 0, 1) * 255).astype(np.uint8)])
    enc.stdin.write(rgba.tobytes()); n += 1
    if n % 150 == 0: print("frames", n, flush=True)
enc.stdin.close(); enc.wait(); dec.wait(); print("done", n)
