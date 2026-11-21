"""2권(Varian 강의노트) 대체 썸네일과 공유 미리보기(og) 이미지. 흰 배경 + 구역 색 띠 + 캐릭터 픽셀 그림 + 제목.
Genspark 표지가 covers_v2/에 들어오면 목차 썸네일은 그쪽을 씁니다."""
import os, sys, importlib
B = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(B))
sys.argv = [sys.argv[0], '--v2']; sys.path.insert(0, B); sys.path.insert(0, os.path.join(ROOT, 'src', 'pages_v2'))
import make_placeholders as M, tower_v2
from PIL import Image
M.COL = {f['key']: f['color'] for f in tower_v2.FLOORS}
items = []
for n in range(1, 28):
    P = importlib.import_module(f'p{n:02d}').P; items.append((f'{n:02d}', f'CH{n:02d}', P['short_title']))
for r in range(1, 6):
    P = importlib.import_module(f'pr{r}').P; items.append((f'r{r}', f'{r}묶음 점검', P['short_title']))
items += [('idx', '미시경제학 연구실 2', 'Varian 강의노트 27장'), ('prac', '실전 연습장', '공장 · 가게 · 보험사 · 거래소')]
CAST = ['fly', 'doc', 'sia', 'moa', 'robo', 'asst', 'x1', 'x2', 'x3']
for i, (k, chip, title) in enumerate(items):
    if k.startswith('r'): M.CAST[k] = ['doc', 'moa', 'sia', CAST[6 + int(k[1]) % 3]]
    elif k not in M.CAST: M.CAST[k] = ['fly', 'doc', ['sia', 'moa'][i % 2], CAST[6 + i % 3]]
M.CAST['idx'] = ['fly', 'doc', 'sia', 'moa', 'x1', 'x2']
td = os.path.join(B, 'thumbs_ph_v2'); og = os.path.join(ROOT, 'v2', 'assets', 'og'); os.makedirs(td, exist_ok=True); os.makedirs(og, exist_ok=True)
for k, chip, t in items:
    im = M.make(k, chip, t)
    from PIL import ImageDraw
    d = ImageDraw.Draw(im); d.rectangle([60, 630 - 75, 620, 630 - 30], fill='white'); d.text((60, 630 - 70), '미시경제학 연구실 2 · 안상선', font=M.font(28), fill='#5d6278')
    im.save(os.path.join(og, f'cover_{k}.jpg'), quality=86)
    im.resize((384, 202), Image.LANCZOS).resize((384, 216)).save(os.path.join(td, f'thumb_{k}.webp'), 'WEBP', quality=80)
print('ok', len(items))
