#!/usr/bin/env python3
"""블로그 빌드: blog/src/*.md → blog/posts/*.html, blog/index.html

사용법(저장소 루트에서):  python3 blog/build.py
- main-*.md : 본편(직접 쓴 원고)
- app-*.md  : 부록(버전2 연구실 정의에서 처음 한 번 생성, 이후 원고를 고쳐 쓰면 됨)
- map.md    : 버전1↔버전2 대응표
"""
import json, re, os, glob, html
import markdown

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'blog', 'src')
OUT = os.path.join(ROOT, 'blog', 'posts')
AUTHOR = '글 · 안상선 ((주)M-Robo 대표)'
SITE = '미시경제학 연구실 블로그'

def read(p):
    s = open(p, encoding='utf-8').read()
    m = re.match(r'---json\n(.*?)\n---\n(.*)', s, re.S)
    return json.loads(m.group(1)), m.group(2)

def link(prefix, href):
    return href if href.startswith('http') else prefix + href

CSS = """:root{--ink:#1d2030;--muted:#545a6e;--rule:#d9dce5;--soft:#f5f6f9;--green:#137a45;--blue:#2457b8;--violet:#6a3fc2;--red:#c0392b;--teal:#127c86}
*{box-sizing:border-box}body{margin:0;background:#fff;color:var(--ink);font-family:Pretendard,"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",system-ui,sans-serif;line-height:1.85;font-size:17px}
header.top{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;padding:14px 24px;border-bottom:1px solid var(--rule)}
header.top a.brand{font-weight:800;color:var(--green);text-decoration:none}header.top nav a{margin-left:14px;font-size:14px;color:var(--blue)}
main{max-width:760px;margin:0 auto;padding:26px 20px 60px}
.series{font-size:13px;font-weight:700;color:var(--green);letter-spacing:.03em;margin:0}
h1{font-size:clamp(26px,4.4vw,38px);line-height:1.3;margin:6px 0 8px}
.byline{color:var(--muted);font-size:14px;margin:0 0 20px}
.summary{border:1px solid var(--rule);border-left:4px solid var(--green);background:#f3f8f5;border-radius:0 12px 12px 0;padding:12px 18px;margin:0 0 26px}
.summary b{display:block;font-size:14px;margin-bottom:4px}.summary ul{margin:0;padding-left:20px}.summary li{margin:3px 0}
article h2{font-size:22px;margin:34px 0 8px;padding-top:6px;border-top:1px solid #eef0f4}
article p{margin:10px 0}article ul,article ol{padding-left:22px}article li{margin:4px 0}
article strong{color:#0e5a33}
article table{border-collapse:collapse;width:100%;font-size:15px;margin:12px 0}article th,article td{border-bottom:1px solid var(--rule);padding:6px 8px;text-align:left;vertical-align:top}article th{background:var(--soft)}
.labbox{border:1px solid var(--rule);border-radius:16px;padding:16px 18px;margin:34px 0 18px;background:var(--soft)}
.labbox h2{border:0;margin:0 0 8px;padding:0;font-size:20px}
.say{display:flex;gap:10px;align-items:flex-start;background:#fff;border:1px solid var(--rule);border-left:4px solid var(--c);border-radius:10px;padding:8px 10px;margin:8px 0}
.say img{width:48px;height:48px;image-rendering:pixelated;object-fit:contain;flex:none}.say b{font-size:13px;display:block}.say p{margin:0;font-size:15px}
.go{display:inline-block;margin-top:10px;background:var(--blue);color:#fff;text-decoration:none;font-weight:700;border-radius:10px;padding:8px 14px}
.go.alt{background:#fff;color:var(--blue);border:1px solid var(--blue);margin-left:6px}
.read{margin:18px 0}.read h3{font-size:16px;margin:12px 0 4px}.read ul{margin:0;padding-left:20px}
nav.pn{display:flex;justify-content:space-between;gap:12px;margin-top:34px;border-top:1px solid var(--rule);padding-top:14px;font-size:15px}
nav.pn a{color:var(--blue);text-decoration:none;max-width:48%}
.note{font-size:13px;color:var(--muted)}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;margin:12px 0 26px}
.card{border:1px solid var(--rule);border-radius:14px;padding:12px 14px;text-decoration:none;color:var(--ink);background:#fff}
.card:hover{border-color:var(--blue)}.card .k{font-size:12px;font-weight:700;color:var(--green)}.card .t{font-weight:700;margin:2px 0}.card .d{font-size:14px;color:var(--muted)}
footer{max-width:760px;margin:0 auto;padding:18px 20px 40px;color:var(--muted);font-size:12px;border-top:1px solid var(--rule)}footer a{color:var(--blue)}
"""

def page(prefix, title, body, desc=''):
    return f"""<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(title)} — {SITE}</title><meta name="description" content="{html.escape(desc)}">
<meta property="og:title" content="{html.escape(title)}"><meta property="og:description" content="{html.escape(desc)}">
<link rel="stylesheet" href="{prefix}blog/blog.css"></head><body>
<header class="top"><a class="brand" href="{prefix}blog/index.html">{SITE}</a><nav><a href="{prefix}index.html">처음</a><a href="{prefix}blog/index.html">글 목차</a><a href="{prefix}v1/index.html">버전1 연구실</a><a href="{prefix}v2/index.html">버전2 연구실</a><a href="{prefix}v1/practice/index.html">실전 연습장</a></nav></header>
<main>{body}</main>
<footer>{AUTHOR} · <a href="https://adminmrobo.github.io/who_am_i/who_am_i.html">저자 소개</a><br>캐릭터 이름·설정·그림 © 안상선 ((주)M-Robo). 모든 권리 보유. 무단 복제·수정·배포·상업적 이용 금지.<br>수치는 교육용 모형의 예시값입니다. 실제 추정치, 정책 효과, 투자 권고가 아닙니다.</footer>
</body></html>"""

WHO = {'doc': ('박사', '#6a3fc2'), 'asst': ('조수 하루', '#c2306b'), 'fly': ('초파리 연구원', '#c0392b'), 'robo': ('Money-Robo', '#127c86')}
def say(prefix, who, text):
    n, c = WHO[who]
    return f'<div class="say" style="--c:{c}"><img src="{prefix}assets/chars/{who}.webp" alt="{n}"><div><b>{n}</b><p>{html.escape(text)}</p></div></div>'

def render_post(meta, md, prev, nxt, kind):
    P = '../../'
    body = markdown.markdown(md, extensions=['tables'])
    series = f'본편 {meta["no"]}편 · {meta["topic"]}' if kind == 'main' else (f'부록 {meta["no"]}장 · {meta["chapter"]}' if kind == 'app' else '안내')
    out = [f'<p class="series">{html.escape(series)}</p><h1>{html.escape(meta["title"])}</h1><p class="byline">{AUTHOR}</p>']
    if meta.get('summary'):
        out.append('<div class="summary"><b>세 줄 요약</b><ul>' + ''.join(f'<li>{html.escape(x)}</li>' for x in meta['summary']) + '</ul></div>')
    out.append('<article>' + body + '</article>')
    if meta.get('lab'):
        href, label = meta['lab']
        box = [f'<section class="labbox"><h2>직접 실험해 보기</h2><p><b>{html.escape(label)}</b>에서 두 캐릭터의 선택을 같은 조건으로 겨뤄 볼 수 있습니다.</p>']
        if meta.get('fly'): box.append(say(P, 'fly', meta['fly']))
        if meta.get('robo'): box.append(say(P, 'robo', meta['robo']))
        if meta.get('try'): box.append(say(P, 'doc', '결과를 보기 전에 누가 이길지 먼저 예상해 보세요. ' + meta['try']))
        box.append(f'<a class="go" href="{link(P, href)}">연구실 열기 →</a>')
        if meta.get('practice'): box.append(f'<a class="go alt" href="{link(P, meta["practice"])}">실전 연습장 →</a>')
        box.append('</section>')
        out.append(''.join(box))
    reads = []
    if meta.get('v1'): reads.append('<h3>버전1 교과서(내 노트 중심)</h3><ul>' + ''.join(f'<li><a href="{link(P,h)}">{html.escape(t)}</a></li>' for h, t in meta['v1']) + '</ul>')
    if meta.get('v2'): reads.append('<h3>' + ('교과서 순서로 읽는 부록' if kind == 'main' else '함께 읽을 글') + '</h3><ul>' + ''.join(f'<li><a href="{link(P,h)}">{html.escape(t)}</a></li>' for h, t in meta['v2']) + '</ul>')
    if reads: out.append('<section class="read"><h2 style="font-size:20px;margin:0">더 읽기</h2>' + ''.join(reads) + '</section>')
    pn = '<nav class="pn">' + (f'<a href="{prev[0]}">← {html.escape(prev[1])}</a>' if prev else '<span></span>') + (f'<a href="{nxt[0]}" style="text-align:right">{html.escape(nxt[1])} →</a>' if nxt else '<span></span>') + '</nav>'
    out.append(pn)
    return page(P, meta['title'], ''.join(out), ' '.join(meta.get('summary', []))[:160])

# ---------- appendix sources (generated once from v2 lab definitions) ----------
MAIN_OF = {1:3,2:4,3:4,4:3,5:3,6:3,7:2,8:2,9:2,10:2,11:8,12:2,13:1,14:4,15:5,16:5,17:6,18:6,19:6,20:6,21:6,22:7,23:7,24:7,25:8,26:1,27:1}
PRACTICE_OF = {**{i:'factory' for i in (1,2,3,4,5,6,13)}, 14:'shop', 11:'insurer', 25:'insurer', **{i:'exchange' for i in (17,18,19,20,21)}, 22:'shop', 24:'shop'}
PRACTICE_NAME = {'factory':'공장','shop':'가게','insurer':'보험사','exchange':'거래소'}

def gen_appendix(specs, chapters, main_titles):
    for i in range(1, 28):
        p = os.path.join(SRC, f'app-{i:02d}.md')
        if os.path.exists(p):
            continue
        v = specs[i]
        ch = chapters[i]
        meta = {"no": i, "chapter": ch, "title": v['question'] if v['question'].endswith('?') else v['title'],
                "summary": v.get('takeaways', [])[:3],
                "lab": [f"v2/labs/lab{i:02d}.html", f"제{i}장 연구실 · {v['title']}"],
                "fly": f"내 선택은 '{v['duel']['flyChoice'].rstrip('.')}'. 조건부터 확인하자.", "robo": f"나는 '{v['duel']['roboChoice'].rstrip('.')}'(으)로 간다!",
                "try": f"판정 기준은 '{v['duel']['criterion']}'입니다. 조건을 하나씩 바꾸며 결론이 언제 뒤집히는지 찾아보세요.",
                "v2": [[f"blog/posts/main-{MAIN_OF[i]}.html", f"본편 {MAIN_OF[i]}편 · {main_titles[MAIN_OF[i]]}"],
                       [f"v2/chapters/ch{i:02d}/index.html", f"버전2 교과서 제{i}장 {ch} — 이론·예제·연습문제"]]}
        if i in PRACTICE_OF:
            meta["practice"] = f"v2/practice/index.html#{PRACTICE_OF[i]}"
        lines = [f"## 이 장의 질문\n\n{v['intro']}\n",
                 "## 왜 이 장을 읽나\n\n" + '\n'.join(f"- {w}" for w in v.get('why', [])) + '\n',
                 "## 개념정리\n"]
        for L in v.get('ladder', []):
            t = re.sub(r'^(\d단계|첫째 단계|둘째 단계|셋째 단계)\s*·\s*', '', L['title'])
            lines.append(f"**{L['title']}** — {L['anchor']}\n")
            if L.get('formula'):
                lines.append(f"> 핵심 식: {L['formula']}\n")
            if L.get('limit'):
                lines.append(f"이 단계의 한계: {L['limit']}\n")
        if v.get('assumptions'):
            lines.append("## 이 장의 가정\n\n" + '\n'.join(f"- {a}" for a in v['assumptions']) + '\n')
        if i in PRACTICE_OF:
            lines.append(f"## 실전 연습장에서\n\n마지막 장의 **{PRACTICE_NAME[PRACTICE_OF[i]]}** 시뮬레이터에서 이 장의 원리를 다른 장면으로 다시 연습할 수 있습니다.\n")
        lines.append("<p class=\"note\">이 부록은 Hal R. Varian 『Microeconomic Analysis』 제3판의 장 순서를 따라 읽는 동행 노트입니다. 해당 책의 본문·문제·증명을 옮기거나 대신하지 않으며, 설명과 수치는 독자적으로 구성한 교육용 예시입니다.</p>\n")
        with open(p, 'w', encoding='utf-8') as f:
            f.write('---json\n' + json.dumps(meta, ensure_ascii=False, indent=0) + '\n---\n' + '\n'.join(lines))

def main():
    import subprocess
    os.makedirs(OUT, exist_ok=True)
    mains = sorted(glob.glob(os.path.join(SRC, 'main-*.md')), key=lambda p: int(re.findall(r'\d+', os.path.basename(p))[0]))
    main_meta = {read(p)[0]['no']: read(p)[0] for p in mains}
    specs_path = os.environ.get('SPECS')
    if specs_path:
        raw = json.load(open(specs_path))
        specs = {int(re.findall(r'lab(\d+)', k)[0]): v for k, v in raw.items() if 'microeconomics-v2' in k}
        tb = open(os.path.join(ROOT, 'v2', 'textbook.html'), encoding='utf-8').read()
        chapters = {int(n): t for n, t in re.findall(r'<h2><a href="chapters/ch(\d+)/index.html">([^<]*)', tb)}
        gen_appendix(specs, chapters, {k: v['title'] for k, v in main_meta.items()})
    apps = sorted(glob.glob(os.path.join(SRC, 'app-*.md')))
    # main posts
    for i, p in enumerate(mains):
        meta, md = read(p)
        prev = (f'main-{meta["no"]-1}.html', f'본편 {meta["no"]-1}편') if i > 0 else ('map.html', '대응표')
        nxt = (f'main-{meta["no"]+1}.html', f'본편 {meta["no"]+1}편 · ' + main_meta[meta["no"]+1]['title']) if meta['no'] + 1 in main_meta else ('app-01.html', '부록 1장으로')
        open(os.path.join(OUT, f'main-{meta["no"]}.html'), 'w', encoding='utf-8').write(render_post(meta, md, prev, nxt, 'main'))
    app_meta = {}
    for p in apps:
        meta, md = read(p); app_meta[meta['no']] = meta
    for n, meta in app_meta.items():
        md = read(os.path.join(SRC, f'app-{n:02d}.md'))[1]
        prev = (f'app-{n-1:02d}.html', f'부록 {n-1}장') if n > 1 else ('main-8.html', '본편 8편')
        nxt = (f'app-{n+1:02d}.html', f'부록 {n+1}장 · ' + app_meta[n+1]['chapter']) if n + 1 in app_meta else None
        open(os.path.join(OUT, f'app-{n:02d}.html'), 'w', encoding='utf-8').write(render_post(meta, md, prev, nxt, 'app'))
    # crosswalk
    meta, md = read(os.path.join(SRC, 'map.md'))
    open(os.path.join(OUT, 'map.html'), 'w', encoding='utf-8').write(render_post(meta, md, None, ('main-1.html', '본편 1편부터 읽기'), 'map'))
    # index
    P = '../'
    cards_main = ''.join(f'<a class="card" href="posts/main-{n}.html"><div class="k">본편 {n}편 · {html.escape(m["topic"])}</div><div class="t">{html.escape(m["title"])}</div><div class="d">{html.escape(m["summary"][0])}</div></a>' for n, m in sorted(main_meta.items()))
    groups = [('생산자 · 1–6장', range(1, 7)), ('소비자와 실증 · 7–12장', range(7, 13)), ('시장과 전략 · 13–16장', range(13, 17)), ('일반균형과 시간 · 17–21장', range(17, 22)), ('후생과 정보 · 22–25장', range(22, 26)), ('수학과 최적화 · 26–27장', range(26, 28))]
    app_html = ''.join(f'<h3>{g}</h3><div class="cards">' + ''.join(f'<a class="card" href="posts/app-{n:02d}.html"><div class="k">제{n}장 · {html.escape(app_meta[n]["chapter"])}</div><div class="t">{html.escape(app_meta[n]["title"])}</div></a>' for n in r) + '</div>' for g, r in groups)
    body = f"""<p class="series">미시경제학 · 질문으로 읽기</p><h1>{SITE}</h1><p class="byline">{AUTHOR}</p>
<p>이 블로그는 두 축으로 읽습니다. <b>본편</b>은 제 강의 노트를 바탕으로 한 질문 여덟 개를 하나씩 풀어 갑니다. <b>부록</b>은 교과서의 27개 장을 순서대로 따라가며 각 장의 질문과 핵심을 짧게 정리합니다. 글마다 직접 조건을 바꿔 볼 수 있는 연구실이 연결되어 있고, 마지막에는 공장·가게·보험사·거래소를 운영해 보는 실전 연습장이 있습니다.</p>
<div class="cards"><a class="card" href="posts/map.html"><div class="k">처음 읽는 분께</div><div class="t">두 축 대응표</div><div class="d">본편 8편과 교과서 27장이 어떻게 이어지는지 한눈에</div></a><a class="card" href="../v1/practice/index.html"><div class="k">마지막 장</div><div class="t">실전 연습장</div><div class="d">공장·가게·보험사·거래소 시뮬레이터</div></a></div>
<h2>본편 · 질문으로 읽는 미시경제학</h2><div class="cards">{cards_main}</div>
<h2>부록 · 교과서와 함께 읽기</h2>{app_html}"""
    open(os.path.join(ROOT, 'blog', 'index.html'), 'w', encoding='utf-8').write(page(P, SITE, body, '질문으로 읽는 미시경제학 본편 8편과 교과서 27장 부록'))
    open(os.path.join(ROOT, 'blog', 'blog.css'), 'w', encoding='utf-8').write(CSS)
    print('main', len(main_meta), 'appendix', len(app_meta))

if __name__ == '__main__':
    main()
