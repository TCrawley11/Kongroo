import io
import textwrap
from PIL import Image, ImageDraw, ImageFont

# Visual novel dialogue panel style constants
_PANEL_COLOR = (10, 10, 25, 210)       # near-black, slightly blue, semi-transparent
_BORDER_COLOR = (100, 160, 230)        # soft blue border
_TEXT_COLOR = (235, 235, 235)          # off-white body text
_PADDING = 24
_PANEL_HEIGHT_RATIO = 0.27             # panel takes ~27% of image height
_BORDER_RADIUS = 14


def overlay_dialogue(image_bytes: bytes, story_text: str) -> bytes:
    base = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    width, height = base.size

    panel_height = int(height * _PANEL_HEIGHT_RATIO)
    panel_top = height - panel_height - _PADDING

    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    panel_rect = [_PADDING, panel_top, width - _PADDING, height - _PADDING]
    draw.rounded_rectangle(panel_rect, radius=_BORDER_RADIUS, fill=_PANEL_COLOR)
    draw.rounded_rectangle(panel_rect, radius=_BORDER_RADIUS, outline=_BORDER_COLOR, width=2)

    font = _load_font(size=20)
    usable_width = width - _PADDING * 4
    # Approximate chars per line based on average glyph width
    chars_per_line = max(20, int(usable_width / 11))
    wrapped = "\n".join(textwrap.wrap(story_text, width=chars_per_line))

    draw.text(
        (_PADDING * 2, panel_top + _PADDING),
        wrapped,
        font=font,
        fill=_TEXT_COLOR,
        spacing=7,
    )

    composed = Image.alpha_composite(base, overlay).convert("RGB")
    out = io.BytesIO()
    composed.save(out, format="PNG")
    return out.getvalue()


def _load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    # Prefer a clean sans-serif; fall back to Pillow's built-in default.
    candidates = [
        "/System/Library/Fonts/Helvetica.ttc",                          # macOS
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",              # Linux
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()
