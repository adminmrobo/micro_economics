"""Genspark 표지를 받기 전까지 쓰는 대체 썸네일(목차용)과 공유 미리보기(og) 이미지.
흰 배경 + 장 색 띠 + 캐릭터 픽셀 그림 + 제목. 받은 표지가 covers/에 들어오면 썸네일은 그쪽을 씁니다."""
import os, sys, json, base64, io
from PIL import Image, ImageDraw, ImageFont
B = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(B))
sys.path.insert(0, B); import tower
SP = json.load(open(os.path.join(B, 'sprites.json')))
FONT = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
def font(sz):
    for idx in (1, 0):
        try: return ImageFont.truetype(FONT, sz, index=idx)
        except Exception: pass
    return ImageFont.load_default()
def sprite(key):
    a = SP['alias'].get(key, key); d = SP['img'][a].split(',', 1)[1]
    return Image.open(io.BytesIO(base64.b64decode(d))).convert('RGBA')
COL = {f['key']: f['color'] for f in tower.FLOORS}
ITEMS = [('00', 'CH0', '경제모형과 수학적 사고'), ('01', 'CH01', '소비자이론'), ('02', 'CH02', '생산자이론'), ('03', 'CH03', '시장이론'),
         ('03m', '중간 정리', '요약정리 및 퀴즈 CH0~CH03'), ('04', 'CH04', '게임과 과점'), ('05', 'CH05', '일반균형과 자산시장'),
         ('06', 'CH06', '후생과 공공경제'), ('07', 'CH07', '정보경제학'), ('07f', '기말 정리', '요약정리 및 퀴즈 CH04~CH07'),
         ('idx', '미시경제학 연구실', '질문하고 실험하고 계산으로 확인하는'), ('prac', '실전 연습장', '공장 · 가게 · 보험사 · 거래소')]
CAST = {'03m': ['doc', 'moa', 'x1', 'asst'], '07f': ['doc', 'sia', 'x3', 'asst'], 'idx': ['fly', 'doc', 'asst', 'robo', 'sia', 'moa'], 'prac': ['robo', 'asst', 'fly', 'x2']}
MOOD = {'doc': 'front', 'asst': 'smile', 'fly': 'point', 'robo': 'coin', 'sia': 'start', 'moa': 'judge', 'x1': 'watch', 'x2': 'watch', 'x3': 'watch'}
def make(k, chip, title, W=1200, H=630):
    col = COL.get({'idx': 'lobby', 'prac': 'roof'}.get(k, k), '#3f5fa8')
    im = Image.new('RGB', (W, H), 'white'); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, W, 18], fill=col); d.rectangle([0, H - 10, W, H], fill=col)
    for x in range(0, W, 24):
        for y in range(40, H - 20, 24): d.point((x, y), fill='#e6e9f2')
    d.rounded_rectangle([60, 70, 60 + d.textlength(chip, font=font(40)) + 40, 130], 12, fill=col)
    d.text((80, 74), chip, font=font(40), fill='white')
    d.text((60, 160), title, font=font(64 if len(title) < 14 else 48), fill='#1d2030')
    d.text((60, H - 70), '미시경제학 연구실 · 안상선', font=font(28), fill='#5d6278')
    cast = CAST.get(k, ['fly', 'doc', 'asst', 'robo'])
    s = 220 if len(cast) <= 4 else 170; x0 = W - 60 - s * len(cast) + 30 * (len(cast) - 1)
    for i, w in enumerate(cast):
        sp = sprite(f'{w}_{MOOD[w]}').resize((s, s), Image.NEAREST)
        im.paste(sp, (x0 + i * (s - 30), H - 40 - s), sp)
    return im
if __name__ == '__main__':
    td = os.path.join(B, 'thumbs_ph'); og = os.path.join(ROOT, 'assets', 'og'); os.makedirs(td, exist_ok=True); os.makedirs(og, exist_ok=True)
    for k, chip, t in ITEMS:
        im = make(k, chip, t)
        im.save(os.path.join(og, f'cover_{k}.jpg'), quality=86)
        im.resize((384, 202), Image.LANCZOS).crop((0, 0, 384, 202)).resize((384, 216)).save(os.path.join(td, f'thumb_{k}.webp'), 'WEBP', quality=80)
    print('ok', len(ITEMS))
