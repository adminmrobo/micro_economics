"""표지·대결 장면 Genspark 지시문(16비트 RPG 픽셀아트, 낮의 연구실)과 프롬프트 감사(P1~P14) 자동 점검 → docs/"""
import os, re
B = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(B)); D = os.path.join(ROOT, 'docs')
STYLE = ('STYLE: detailed 16-bit SNES-era RPG pixel art, crisp visible square pixels, bold dark outlines (#1d1a22), 2-3 tone shading with small highlights. '
         'Match the attached reference images exactly in proportions, colors and pixel density. Not a vector illustration, not anime cel painting, not watercolor, not 3D render.')
MOOD = 'MOOD: bright daytime laboratory - white walls, large sunlit windows, soft natural light, small props in lavender, mint and pink. Background stays white and bright.'
CH = {
 'doc': 'Professor: chibi scientist, thin teal rectangular glasses, spiky black hair with one white streak, short tied-back ponytail, white lab coat over black vest and black tie, dark trousers.',
 'asst': 'Haru (assistant): long pink hair with two round buns and navy streaks, blue eyes, lavender hoodie under a white lab coat, blue jeans, white sneakers.',
 'robo': 'AbaBot: boxy beige retro CRT-monitor robot with rounded corners, dark green screen face drawn only with mint pixel blocks, short antenna on a small square base topped with one red-brown abacus bead, gray segmented arms, two small dark gray tank treads, wooden abacus with red-brown beads.',
 'fly': 'Fruit fly researcher: small anthropomorphic fruit fly, black body, big red compound eyes, blue helmet with a gold stripe and pink and blue cables, white lab coat over a black vest, black gloves, transparent wings.',
 'sia': 'Sia (intern 1): chibi girl maid intern, long straight jet-black hair to the waist with side-swept bangs, calm gray eyes, small silver drop earrings, charcoal-black long-sleeved maid dress with white lace cuffs, white high collar with a large soft gray bow, long white frilled apron, no headdress.',
 'moa': 'Moa (intern 2): chibi girl maid intern, long ash-beige wavy hair to the waist with neat bangs, white frilled maid headband with a thin white ribbon over the left ear, big round amber-brown eyes, white shirt with a red and navy plaid bow tie, camel knit cardigan, white frilled apron.',
 'xs': 'X1, X2, X3 (hidden spectators): three small cute chibi silhouettes, solid deep navy-black bodies (#1B1A2E) with a thin purple rim light, round white dot eyes, two pink cheek pixels, no mouth; X1 has a long side ponytail and a big pink ribbon, X2 a round beret and round glasses with two teal reflections, X3 is tiny with a cat-ear hood and a yellow pom-pom; cute, not scary.'}
RULES = ('RULES: Height ratio Professor 1.00, Haru 0.90, Sia 0.88, Moa 0.86, AbaBot 0.72, X1-X3 0.45, fruit fly 0.41. Do not mirror the Professor or Haru; keep their faces and hair parting as in the references. '
         'Ignore the Korean labels printed on the reference sheet; do not draw them.')
BAN = ('Absolutely NO text, letters, numbers, speech bubbles, captions or logos anywhere (cards, screens, price tags, charts and books stay blank or striped). No night scene, no neon, no dark background. '
       'AbaBot is NOT a white round-headed robot, has no black pill-shaped visor, no yellow or gold eyes, no ball antenna, no cyan chest light, no gold coins, and never floats. '
       'No microscope, no insects other than the fruit fly researcher, no real brands, no real people, no weapons, no cigarettes, no alcohol, no blood, no real money bills.')
COMP = ('COMPOSITION: the page frame crops the top and bottom, so keep every face and hand inside the middle 50% of the height and inside 12% side margins. '
        'Keep the bottom-left corner plain and bright for a small label.')
# 키: (제목, 장면, 포즈 목록, 등장 캐릭터)
P = {
 '00': ('CH0 경제모형과 수학적 사고', 'a big whiteboard-like glass panel with two simple crossing lines (one rising, one falling) and a dotted line, a balance scale holding a sealed envelope on one side, and a ticket stub pinned to a corkboard', [('doc', 'center, pointing at the crossing point of the two lines with an open palm, calm smile'), ('asst', 'right of center, holding a blank clipboard, looking at the scale'), ('fly', 'left, facing right, crossing out the pinned ticket stub with a pencil, skeptical'), ('robo', 'far right, facing left, hugging the ticket stub board proudly'), ('xs', 'tiny, peeking from behind the glass panel at the bottom edge')], ['doc', 'asst', 'fly', 'robo', 'xs']),
 '01': ('CH01 소비자이론', 'a snack shelf with two kinds of blank-wrapped snacks (round ones and square ones), two shopping baskets and a small tilted ramp line drawn on the floor in mint tape', [('doc', 'center-back, presenting the shelf'), ('asst', 'right, filling one basket mostly with round snacks'), ('fly', 'left, comparing two baskets on a small balance'), ('robo', 'far right, splitting snacks exactly half and half into a basket'), ('moa', 'front-left, holding a blank scorecard, ready to judge')], ['doc', 'asst', 'fly', 'robo', 'moa']),
 '02': ('CH02 생산자이론', 'a small lab workshop line with workers\' gloves on one bench and small boxy machines on another, a conveyor carrying identical sample boxes, and a large curved floor line', [('doc', 'center, gesturing between gloves and machines'), ('asst', 'right, counting sample boxes'), ('fly', 'left, moving one machine closer and one glove away'), ('robo', 'far right, lining up gloves and machines in perfectly equal rows'), ('sia', 'front-left, raising a small blank start flag')], ['doc', 'asst', 'fly', 'robo', 'sia']),
 '03': ('CH03 시장이론', 'a single bakery-style counter inside the lab with blank price tags, a hill-shaped mint ribbon and a lower green ribbon arching beside it, and two queues of tiny blank cardboard customer cutouts', [('doc', 'center-back, holding up a blank price tag'), ('asst', 'right, arranging two queues'), ('fly', 'left, standing by the top of the lower green ribbon'), ('robo', 'far right, climbing to the top of the tall mint ribbon'), ('moa', 'front, holding a blank scorecard')], ['doc', 'asst', 'fly', 'robo', 'moa']),
 '03m': ('중간 요약정리 및 퀴즈', 'a bright lounge corner with four closed binders on a low shelf, a small chalk-free whiteboard with blank quiz cards, and a halfway ribbon', [('doc', 'tapping the board'), ('asst', 'handing out blank cards'), ('moa', 'holding a blank score tally'), ('xs', 'sitting on a bench raising hands')], ['doc', 'asst', 'moa', 'xs']),
 '04': ('CH04 게임과 과점', 'a shared lab instrument on a central table with a booking calendar of blank squares, two chairs facing each other and a 2x2 grid of colored floor tiles (green, red, two beige)', [('doc', 'center, standing on the grid edge as host'), ('asst', 'right, holding the calendar'), ('fly', 'left, offering a handshake across the table'), ('robo', 'far right, sneaking a hand toward the instrument'), ('sia', 'front-left, holding a blank start flag'), ('xs', 'audience row at the bottom edge')], ['doc', 'asst', 'fly', 'robo', 'sia', 'xs']),
 '05': ('CH05 일반균형과 자산시장', 'a big transparent box on the floor with apples on one side and tangerines on the other, a two-pan scale, and several woven baskets holding eggs spread apart', [('doc', 'center, balancing the scale'), ('asst', 'right, trading an apple for tangerines'), ('fly', 'left, putting eggs into separate baskets'), ('robo', 'far right, carefully holding one sturdy basket'), ('moa', 'front, holding a blank scorecard')], ['doc', 'asst', 'fly', 'robo', 'moa']),
 '06': ('CH06 후생과 공공경제', 'a small festival food stall inside the lab with blank menu boards, a mailbox holding a blank envelope, and a small factory model with a soft gray puff cloud drifting toward a neighbor\'s laundry line', [('doc', 'center-back, pointing at the gap between two blank price boards'), ('asst', 'right, handing a blank envelope to the stall'), ('fly', 'left, measuring the gray puff with a ruler'), ('robo', 'far right, holding the envelope high, sure it settles everything'), ('sia', 'front-left, explaining with a small pointer'), ('xs', 'peeking from behind the laundry line')], ['doc', 'asst', 'fly', 'robo', 'sia', 'xs']),
 '07': ('CH07 정보경제학', 'a lab door to a sunny balcony with a covered instrument, a small weather vane, a toy used car with a blank inspection stamp card, and a desk with a blank contract sheet', [('doc', 'center, holding a blank forecast card'), ('asst', 'right, putting a cover over the instrument'), ('fly', 'left, inspecting the toy car with a magnifying glass'), ('robo', 'far right, holding a coin-free blank ticket for the forecast'), ('moa', 'front, thinking pose with a blank scorecard')], ['doc', 'asst', 'fly', 'robo', 'moa']),
 '07f': ('기말 요약정리 및 퀴즈', 'a sunny lounge with eight closed binders lined up, a doorway glowing toward a rooftop market, and blank quiz cards', [('doc', 'opening the doorway'), ('asst', 'placing the last binder'), ('sia', 'holding a blank start flag'), ('xs', 'cheering on a bench')], ['doc', 'asst', 'sia', 'xs']),
 'idx': ('시리즈 대표 표지', 'a bright lab with a tall glass building model in the middle whose floors glow in different soft colors, small market stalls around its base', [('doc', 'center-back, presenting the model'), ('asst', 'right, holding a clipboard'), ('fly', 'left, looking up at the model skeptically'), ('robo', 'far right, pointing at the tallest floor'), ('sia', 'front-left, smiling'), ('moa', 'front-right, holding a scorecard'), ('xs', 'peeking from the lowest floor')], ['doc', 'asst', 'fly', 'robo', 'sia', 'moa', 'xs']),
 'prac': ('마지막 장 · 실전 연습장', 'a rooftop mini market square in daylight with four small booths: a tiny factory booth, a shop counter, an umbrella-style insurance desk, and an exchange board with blank tiles', [('robo', 'running the shop counter'), ('asst', 'at the factory booth'), ('fly', 'at the insurance desk'), ('doc', 'at the exchange board'), ('xs', 'shopping as customers')], ['robo', 'asst', 'fly', 'doc', 'xs'])}
NAMES = {'doc': 'Professor', 'asst': 'Haru', 'fly': 'Fruit fly researcher', 'robo': 'AbaBot', 'sia': 'Sia', 'moa': 'Moa', 'xs': 'X1, X2, X3'}
REF = {'doc': 'ref_doctor.png', 'asst': 'ref_haru.png', 'fly': 'ref_fly.png', 'robo': 'ref_jupanbot_E13.png', 'sia': 'ref_sia.png', 'moa': 'ref_moa.png', 'xs': 'ref_x123.png'}
def prompt(k, scene, poses, cast, aspect='16:9 wide website cover illustration, at least 1920x1080.'):
    lines = [aspect, f'SCENE: {scene}.', 'POSES:'] + [f'- {NAMES[w]}: {p}.' for w, p in poses]
    lines += [COMP, 'Friendly rivalry, the moment before any result; nobody is winning or losing.', '', STYLE, MOOD, '', 'CHARACTERS (exactly as in the references):'] + [f'- {CH[w]}' for w in cast] + ['', RULES, '', BAN]
    return '\n'.join(lines)
def audit(t, cast):
    c = {'P1 픽셀아트 명시': 'pixel art' in t, 'P2 일러스트·벡터·3D 배제': all(x in t for x in ('Not a vector', 'not 3D')), 'P3 낮의 연구실': 'daytime' in t and 'No night' in t,
         'P4 고정 외형(등장 전원)': all(CH[w][:20] in t for w in cast), 'P5 주판봇 혼동 방지': ('AbaBot is NOT' in t) or ('robo' not in cast), 'P6 박사·조수 반전 금지': 'Do not mirror' in t,
         'P7 키 비율': 'Height ratio' in t, 'P8 글자·숫자·말풍선·로고 금지': 'NO text, letters, numbers, speech bubbles' in t, 'P9 참고 그림 이름표 무시': 'Ignore the Korean labels' in t,
         'P10 비율·크기': '1920x1080' in t or '1200x800' in t, 'P11 위험 소품·실존 브랜드 금지': 'no real brands' in t and 'no weapons' in t, 'P12 생물 소품 금지': 'No microscope, no insects' in t,
         'P13 결과 전 승패 암시 금지': 'nobody is winning' in t, 'P14 연구실 금지어 없음': not re.search('\uC0AC\uB2E4\uB9AC|\uAD00\uD1B5|\uCE78|\uC7A5\uBD80', t)}
    return c
if __name__ == '__main__':
    os.makedirs(D, exist_ok=True)
    L = ['# 그림 지시문 모음 — 미시경제학 연구실 (Genspark용)', '', '표지 12장 + 대결 장면 8장. 모두 16비트 RPG 픽셀아트, 낮의 연구실(흰 배경)입니다. 각 요청에 해당 참고 그림(fruitfly-lab-expressions 캐릭터 팩)을 함께 올리세요.',
         '받은 표지는 `src/build/covers/cover_{키}.webp`(1600×900)로 넣고 다시 빌드하면 페이지 표지와 목차 썸네일이 바뀝니다. 그 전까지는 캐릭터 대체 표지와 `make_placeholders.py`의 대체 썸네일을 씁니다.', '']
    C = ['# 표지 지시문 — 미시경제학 연구실 (12장)', '']
    rows = []
    for k, (title, scene, poses, cast) in P.items():
        t = prompt(k, scene, poses, cast)
        refs = ', '.join(REF[w] for w in cast)
        blk = [f'## 표지 cover_{k} — {title}', '', f'참고 그림: {refs} · 저장 이름: cover_{k}.png', '', '```text', t, '```', '']
        L += blk; C += blk; rows.append((f'cover_{k}', audit(t, cast)))
    L += ['---', '', '# 대결 장면 (3:2, 결과 전 장면)', '']
    for k, (title, scene, poses, cast) in P.items():
        if not k[:2].isdigit() or k.endswith(('m', 'f')): continue
        dc = ['fly', 'robo', 'sia', 'moa', 'xs']
        t = prompt(k, f'duel stage version of the {title} theme: {scene}; the fruit fly researcher and AbaBot face each other across a mint tape line, each showing their own choice with props', [('fly', 'left of the line, confident but calm'), ('robo', 'right of the line, excited'), ('sia', 'one side of the line holding a small blank start flag'), ('moa', 'other side holding a blank scorecard'), ('xs', 'audience row at the bottom edge, curious')], dc, '3:2 illustration, at least 1200x800.')
        L += [f'## 대결 sc_{k}_duel — {title}', '', '```text', t, '```', '']; rows.append((f'sc_{k}_duel', audit(t, dc)))
    open(os.path.join(D, 'IMG_PROMPTS_all.md'), 'w').write('\n'.join(L)); open(os.path.join(D, 'COVER_PROMPTS_series.md'), 'w').write('\n'.join(C))
    keys = list(rows[0][1].keys())
    A = ['| 그림 | ' + ' | '.join(k.split(' ')[0] for k in keys) + ' |', '|' + '---|' * (len(keys) + 1)]
    fail = 0
    for n, c in rows:
        A.append(f'| {n} | ' + ' | '.join('통과' if c[k] else '**실패**' for k in keys) + ' |'); fail += sum(1 for k in keys if not c[k])
    A += ['', '항목: ' + ' · '.join(keys), '', f'실패 {fail}건 / 점검 {len(rows) * len(keys)}건']
    open(os.path.join(D, 'PROMPT_AUDIT_table.md'), 'w').write('\n'.join(A)); print('prompts', len(rows), 'fail', fail)
