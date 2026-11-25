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

# Chamber doors: closed (v2) and open versions share one canvas so they register exactly when cross-faded.
for n in ['door_sun', 'door_jade', 'door_moon']:
    closed = cutout(RAW + n + '_v2.png'); opened = cutout(RAW + n + '_open.png')
    box = closed.getbbox(); ob = opened.getbbox()
    box = (min(box[0], ob[0]), min(box[1], ob[1]), max(box[2], ob[2]), max(box[3], ob[3]))
    for im, suffix in ((closed, ''), (opened, '_open')):
        im = im.crop(box); im.thumbnail((450, 600), Image.LANCZOS)
        im.save(f'public/ui/{n}{suffix}.png', optimize=True)

# Frame around the play field: the flat inside is cut out from the centre; the opening's box is written
# to public/ui/frame.json so the client can align the opening with the 6x5 grid.
import json
fr = Image.open(RAW + 'frame.png').convert('RGB')
work = fr.copy(); cx, cy = fr.width // 2, fr.height // 2
ImageDraw.floodfill(work, (cx, cy), MAGIC, thresh=40)
hole = ImageChops.difference(work, Image.new('RGB', fr.size, MAGIC)).convert('L').point(lambda v: 0 if v > 0 else 255)
hb = hole.getbbox()
outer = cutout(RAW + 'frame.png')
alpha = ImageChops.multiply(outer.getchannel('A'), hole.point(lambda v: 255 - v).filter(ImageFilter.GaussianBlur(1.0)))
fr = fr.convert('RGBA'); fr.putalpha(alpha)
ob = fr.getbbox(); fr = fr.crop(ob)
scale = 1100 / fr.width
fr = fr.resize((1100, round(fr.height * scale)), Image.LANCZOS)
fr.save('public/ui/frame.png', optimize=True)
json.dump({'w': fr.width, 'h': fr.height, 'hole': [round((hb[0] - ob[0]) * scale), round((hb[1] - ob[1]) * scale), round((hb[2] - ob[0]) * scale), round((hb[3] - ob[1]) * scale)]}, open('public/ui/frame.json', 'w'))

fit_square(cutout(RAW + 'gate_open.png', 30), 512, 0.98).save('public/ui/gate.png', optimize=True)

fit_square(cutout(RAW + 'treasure.png', 30), 320, 0.98).save('public/ui/treasure.png', optimize=True)
# The Sun Relic: the central artefact of the game world (display only, not a reel symbol).
fit_square(cutout(RAW + 'sun_relic.png', 30), 384, 0.98).save('public/ui/relic.png', optimize=True)
fit_square(cutout(RAW + 'spin.png'), 256, 0.98).save('public/ui/spin.png', optimize=True)

tile = Image.open(RAW + 'tile.png').convert('RGB')
w, h = tile.size; c = int(min(w, h) * 0.04)
tile = tile.crop((c, c, w - c, h - c)).resize((256, 256), Image.LANCZOS).convert('RGBA')
m = Image.new('L', (1024, 1024), 0); ImageDraw.Draw(m).rounded_rectangle((8, 8, 1016, 1016), 96, fill=255)
from PIL import ImageEnhance
rgb = ImageEnhance.Contrast(ImageEnhance.Brightness(tile.convert('RGB')).enhance(1.22)).enhance(1.15).convert('RGBA')  # lighter slab so symbols sit on a visible tile
rgb.putalpha(m.resize((256, 256), Image.LANCZOS)); rgb.save('public/ui/tile.png', optimize=True)

# Large pictures are stored as WebP only (smaller download; all current browsers including Safari 14+ read WebP).
import os
for n in ['bg_portrait', 'bg_landscape', 'bgfs_portrait', 'bgfs_landscape']:
    Image.open(RAW + n + '.png').convert('RGB').save(f'public/{n}.webp', quality=80, method=6)
    if os.path.exists(f'public/{n}.jpg'): os.remove(f'public/{n}.jpg')
for n in ['frame', 'gate', 'treasure', 'relic', 'door_sun', 'door_jade', 'door_moon', 'door_sun_open', 'door_jade_open', 'door_moon_open']:
    Image.open(f'public/ui/{n}.png').save(f'public/ui/{n}.webp', quality=86, method=6)
    os.remove(f'public/ui/{n}.png')

# Logo: dark background made transparent by brightness, cropped, 720 px wide.
lg = Image.open(RAW + 'logo_b.png').convert('RGB')
al = lg.convert('L').point(lambda v: 0)  # placeholder, replaced below
r, g, b2 = lg.split()
mx = ImageChops.lighter(ImageChops.lighter(r, g), b2)
al = mx.point(lambda v: max(0, min(255, round((v - 44) / 50 * 255))))
lg = lg.convert('RGBA'); lg.putalpha(al); lg = lg.crop(lg.getbbox()); lg.thumbnail((720, 720), Image.LANCZOS)
lg.save('public/logo.webp', quality=90, method=6)
print('done')
