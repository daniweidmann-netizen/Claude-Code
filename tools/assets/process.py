"""Turns the raw generated images in assets/reference/raw into game files under public/.

Reproducible, automatic steps only (recorded in assets/ASSET_REGISTER.md):
  * cutout: the flat dark background connected to the image border is made
    transparent (flood fill with tolerance), the edge is feathered,
  * crop to content, centre on a square or keep aspect, resize.
usage: python3 tools/assets/process.py
"""
from PIL import Image, ImageDraw, ImageFilter, ImageChops
RAW = 'assets/reference/raw/'
MAGIC = (255, 0, 255)

def cutout(path, tol=34):
    im = Image.open(path).convert('RGB')
    w, h = im.size
    work = im.copy()
    seeds = [(x, y) for x in range(0, w, max(1, w // 24)) for y in (0, h - 1)] + \
            [(x, y) for y in range(0, h, max(1, h // 24)) for x in (0, w - 1)]
    for s in seeds:
        if work.getpixel(s) != MAGIC:
            r, g, b = work.getpixel(s)
            if max(r, g, b) < 70:          # only start from dark background pixels
                ImageDraw.floodfill(work, s, MAGIC, thresh=tol)
    bg = Image.new('RGB', im.size, MAGIC)
    mask = ImageChops.difference(work, bg).convert('L').point(lambda v: 255 if v > 0 else 0)
    mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
    out = im.convert('RGBA'); out.putalpha(mask)
    return out

def fit_square(im, size, fill=0.92):
    im = im.crop(im.getbbox())
    s = size * fill / max(im.size)
    im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
    out = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    out.paste(im, ((size - im.width) // 2, (size - im.height) // 2), im)
    return out

symbols = ['sapphire', 'scarab', 'chalice', 'crown', 'jade_mask_b', 'wild_a', 'compass', 'key', 'explorer']
for i, n in enumerate(symbols):
    if n == 'explorer':
        # Portrait fills the frame: keep the picture, round it into a medallion instead of cutting it out.
        im = Image.open(RAW + n + '.png').convert('RGBA').resize((256, 256), Image.LANCZOS)
        m = Image.new('L', (1024, 1024), 0); ImageDraw.Draw(m).ellipse((40, 40, 984, 984), fill=255)
        im.putalpha(m.resize((256, 256), Image.LANCZOS))
    else:
        im = fit_square(cutout(RAW + n + '.png'), 256, 0.9)
    im.save(f'public/symbols/sym{i}.png', optimize=True)

for i, n in enumerate(['st1_discovery', 'st2_treasure', 'st3_ancient', 'st4_relic', 'st5_temple']):
    fit_square(cutout(RAW + n + '.png'), 192, 0.98).save(f'public/ui/station{i + 1}.png', optimize=True)

for n in ['door_sun', 'door_jade', 'door_moon']:
    im = cutout(RAW + n + '.png'); im = im.crop(im.getbbox())
    im.thumbnail((360, 480), Image.LANCZOS); im.save(f'public/ui/{n}.png', optimize=True)

fit_square(cutout(RAW + 'treasure.png', 30), 320, 0.98).save('public/ui/treasure.png', optimize=True)
fit_square(cutout(RAW + 'spin.png'), 256, 0.98).save('public/ui/spin.png', optimize=True)

tile = Image.open(RAW + 'tile.png').convert('RGB')
w, h = tile.size; c = int(min(w, h) * 0.04)
tile = tile.crop((c, c, w - c, h - c)).resize((256, 256), Image.LANCZOS).convert('RGBA')
m = Image.new('L', (1024, 1024), 0); ImageDraw.Draw(m).rounded_rectangle((8, 8, 1016, 1016), 96, fill=255)
tile.putalpha(m.resize((256, 256), Image.LANCZOS)); tile.save('public/ui/tile.png', optimize=True)

for n in ['portrait', 'landscape']:
    Image.open(RAW + f'bgfs_{n}.png').convert('RGB').save(f'public/bgfs_{n}.jpg', quality=86, optimize=True)
print('done')
