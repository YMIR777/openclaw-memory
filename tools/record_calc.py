#!/usr/bin/env python3
import subprocess, os

frames = []
tmpdir = '/tmp/calc_frames'
os.makedirs(tmpdir, exist_ok=True)

def make_frame(expr_text, result_text, step, total=8):
    bg = (30, 30, 30)
    from PIL import Image, ImageDraw, ImageFont
    w, h = 360, 640
    img = Image.new('RGB', (w, h), bg)
    d = ImageDraw.Draw(img)

    try:
        font_large = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 48)
        font_small = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 20)
        font_btn = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 26)
    except:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()
        font_btn = ImageFont.load_default()

    # Expression line
    d.text((w-20, 120), expr_text, font=font_small, fill=(142, 142, 147), anchor='rt')

    # Result
    d.text((w-20, 160), result_text, font=font_large, fill=(255, 255, 255), anchor='rt')

    # Button grid
    btns = [
        ['AC', '+/-', '%', '÷'],
        ['7', '8', '9', '×'],
        ['4', '5', '6', '-'],
        ['1', '2', '3', '+'],
        ['0', '.', '=']
    ]

    btn_w, btn_h = 72, 72
    gap = 12
    start_x = (w - 4*gap - 4*btn_w) // 2
    start_y = 280

    colors = {'AC':'#A5A5A5', '+/-':'#A5A5A5', '%':'#A5A5A5',
              '÷':'#FF9500', '×':'#FF9500', '-':'#FF9500', '+':'#FF9500', '=':'#FF9500',
              '0':'#333', '1':'#333', '2':'#333', '3':'#333', '4':'#333',
              '5':'#333', '6':'#333', '7':'#333', '8':'#333', '9':'#333', '.':'#333'}

    for row_i, row in enumerate(btns):
        for col_i, btn in enumerate(row):
            x = start_x + col_i * (btn_w + gap)
            y = start_y + row_i * (btn_h + gap)
            if btn == '0':
                x = start_x  # left-align zero
                bw = btn_w * 2 + gap
            else:
                bw = btn_w

            color = colors.get(btn, '#333')
            r = 36
            d.ellipse([x, y, x+bw, y+btn_h], fill=color)

            text_color = '#000' if btn in ['AC', '+/-', '%'] else '#FFF'
            d.text((x + bw//2, y + btn_h//2), btn, font=font_btn, fill=text_color, anchor='mm')

    path = f'{tmpdir}/frame_{step:03d}.png'
    img.save(path)
    frames.append(path)

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    subprocess.run(['pip3', 'install', 'pillow'], check=True)
    from PIL import Image, ImageDraw, ImageFont

# Generate frames showing: 0 → 1 → 12 → 12+ → 12+2 → 12+2* → 12+2*8 → 12+2*8+ → 12+2*8+8 → =25
steps = [
    ('', '0'),
    ('1', '1'),
    ('12', '12'),
    ('12+', '12'),
    ('12+2', '2'),
    ('12+2×', '2'),
    ('12+2×8', '8'),
    ('12+2×8+', '8'),
    ('12+2×8+8', '8'),
    ('25', '25'),
]

for i, (expr, res) in enumerate(steps):
    make_frame(expr, res, i, len(steps))

# Compile video
output = '/tmp/calculator_demo.mp4'
cmd = ['ffmpeg', '-y', '-framerate', '2', '-i', f'{tmpdir}/frame_%03d.png',
       '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-vf', 'scale=360:640',
       '-t', '5', output]
result = subprocess.run(cmd, capture_output=True, text=True)
if result.returncode != 0:
    print('Error:', result.stderr[-500:])
else:
    print(f'Done: {output}')