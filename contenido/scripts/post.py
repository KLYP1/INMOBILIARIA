import numpy as np, cv2
from scipy.ndimage import binary_fill_holes
K7 = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
def refine(a, fr):
    """a: raw RVM alpha (HxW float), fr: uint8 RGB frame. Returns (alpha, decontaminated float RGB)."""
    t = np.clip((a - 0.25) / 0.5, 0, 1); a = t * t * (3 - 2 * t)
    m = (a > 0.5).astype(np.uint8)
    m = binary_fill_holes(m).astype(np.uint8)
    inner = cv2.erode(m, K7)                       # well inside the silhouette -> fully opaque
    a = np.maximum(a, inner.astype(np.float32))
    a = np.maximum(a, m.astype(np.float32) * 0.97)
    a = cv2.GaussianBlur(a.astype(np.float32), (0, 0), 0.8)
    f = fr.astype(np.float32) / 255
    band = (cv2.dilate(m, K7) > 0) & (inner == 0)  # thin band around the outline only
    core = (a > 0.97).astype(np.float32)
    num = cv2.GaussianBlur(f * core[..., None], (0, 0), 4); den = cv2.GaussianBlur(core, (0, 0), 4)[..., None] + 1e-4
    est = num / den
    edge = (band & (a > 0.02) & (a < 0.98)).astype(np.float32)
    edge = cv2.GaussianBlur(edge, (0, 0), 1.5)[..., None] * 0.85
    f = f * (1 - edge) + est * edge
    return a, f
