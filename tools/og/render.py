#!/usr/bin/env python3
"""Render the share image and icons into public/.

  python tools/og/render.py

Writes:
  public/og.png               1200x630 Open Graph / Twitter card (from og.html)
  public/apple-touch-icon.png 180x180 (from icon.html)
  public/favicon.ico          16/32/48 downscaled from the 180px icon (needs Pillow)

Uses headless Chrome so the card is set in Manrope exactly like the site. Google Fonts
load over the network; --virtual-time-budget gives them time before the shot is taken.
These are committed assets — re-run only when the palette, wordmark, or thesis changes.
"""
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
PUBLIC = HERE.parent.parent / "public"
CHROME_CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "/usr/bin/google-chrome",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
]


def chrome():
    for c in CHROME_CANDIDATES:
        if Path(c).exists():
            return c
    sys.exit("No Chrome/Edge found; edit CHROME_CANDIDATES in tools/og/render.py")


def shot(html, out, w, h):
    """Screenshot the top-left w x h of the page.

    --window-size is the OUTER window: on Windows Chrome 140 a 1200x630 request gave a
    1178x532 viewport, which chopped the bottom of the card. So ask for a window well
    larger than the card, and crop. Each page fixes its own body size, so anything
    outside w x h is blank and the crop is exact.
    """
    from PIL import Image
    with tempfile.TemporaryDirectory() as profile:
        raw = Path(profile) / "raw.png"
        cmd = [
            chrome(), "--headless=new", "--disable-gpu", "--hide-scrollbars",
            "--force-device-scale-factor=1", f"--user-data-dir={profile}",
            f"--window-size={w + 240},{h + 320}", "--virtual-time-budget=8000",
            f"--screenshot={raw}", html.resolve().as_uri(),
        ]
        subprocess.run(cmd, check=True, timeout=90, capture_output=True)
        Image.open(raw).convert("RGB").crop((0, 0, w, h)).save(out, optimize=True)
    print(f"wrote {out.relative_to(PUBLIC.parent)} ({w}x{h})")


def main():
    PUBLIC.mkdir(exist_ok=True)
    shot(HERE / "og.html", PUBLIC / "og.png", 1200, 630)
    shot(HERE / "icon.html", PUBLIC / "apple-touch-icon.png", 180, 180)
    try:
        from PIL import Image
    except ImportError:
        print("Pillow not installed; skipping favicon.ico")
        return
    icon = Image.open(PUBLIC / "apple-touch-icon.png").convert("RGBA")
    icon.save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    print("wrote public/favicon.ico (16/32/48)")


if __name__ == "__main__":
    main()
