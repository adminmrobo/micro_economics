"""2권(교과서판 강의노트) 목차 첫 화면과 건물 보기 쪽. 1권 home.py의 스타일·그림 함수를 그대로 쓴다."""
import html, re, os
import tower  # build.py가 tower_v2를 tower로 등록
import home as H1
e = html.escape
def strip(s): return re.sub('<[^>]+>', '', s)
def chl(n): return f'CH{n}'
css = H1.css; tower_svg = H1.tower_svg
WHO_PAGE = H1.WHO_PAGE
GROUPS = tower.GROUPS
THUMB_KEYS = [f'{i:02d}' for i in range(1, 28)] + ['r1', 'r2', 'r3', 'r4', 'r5', 'idx', 'prac']
PROV = ('이 쪽들의 주 자료는 저자가 Hal R. Varian 『Microeconomic Analysis』로 진행한 강의의 <b>강의노트</b>입니다. '
        '노트는 <b>2005년·2008년·2011년</b> 세 번 업데이트했고, 실제 강의에는 <b>2014년·2015년</b>에 사용했습니다.')
LEAD = ('교과서 순서를 따른 미시경제학 2권입니다. 생산자(CH01~06) → 소비자(CH07~12) → 시장(CH13~16) → 일반균형(CH17~21) → 후생·정보(CH22~25) → 수학 부록(CH26~27)의 27장을 '
        '각각 한 쪽으로 만들었어요. 장마다 <b>수식으로 푼 답을 그래프로 다시 검증</b>하고, 끝에서 <b>복습 대시보드</b>로 정리하며, 주요 개념을 파이썬으로 짜 보는 <b>생성 AI 프롬프트</b>를 붙였어요.')

def nav_html(label):
    NAV = [('micro', '이 강의노트는'), ('map', '목차'), ('building', '건물 보기'), ('keys', '한 줄 핵심'), ('dash', '종합 대시보드'), ('path', '개념 흐름'), ('how', '식구·사용법'), ('about', '자료와 원칙')]
    a = ''.join(f'<a href="{"tower.html" if i == "building" else "#" + i}">{e(t)}</a>' for i, t in NAV)
    return f'<nav class="top" aria-label="섹션 바로가기"><div class="wrap"><a class="logo" href="index.html"><i></i>{e(label)}</a><div class="links">{a}<a href="../index.html">1권 →</a></div></div></nav>\n'

def index_page(P, B):
    import build_extra as X
    M = B.Moods(); L = X.lessons(B)
    for k, v in B.DEFM.items(): M.add(k, v)
    have = [k for g in GROUPS for k in g[1] if k in L]
    revs = {}
    for f in sorted(os.listdir(B.PAGES)):
        if re.match(r'pr\d\.py$', f):
            R = B.load(os.path.join(B.PAGES, f)); revs[R['key']] = R
    o = [B.head(P, P['title'], P['desc'], P['file']), nav_html(B.SERIES_SHORT), B.cover(P, M, 'cover_index'), X.thumbs_css(B), css()]
    kp = ''.join(f'<div class="kpi {c}"><b>{v}</b><span>{t}</span></div>' for v, t, c in P['kpis'])
    tiles = ''
    for gname, keys, rk, col in GROUPS:
        for k in keys:
            if k in L: tiles += f'<a class="mt th-{k}" href="{L[k]["file"]}" title="{e(chl(k) + " " + strip(L[k]["short_title"]))}"><span>{int(k)}</span><i class="sr">{e(chl(k) + " " + strip(L[k]["short_title"]))}</i></a>'
        if rk and rk in revs: tiles += f'<a class="mt th-{rk}" href="{revs[rk]["file"]}" title="{e(revs[rk]["short_title"])}"><span>정리</span><i class="sr">{e(revs[rk]["short_title"])}</i></a>'
    tiles += '<a class="mt th-prac" href="practice/index.html" title="실전 연습장"><span>실전</span><i class="sr">실전 연습장</i></a><a class="mt th-tower bld" href="tower.html" title="건물 보기 · 더 마켓"><span>건물</span><i class="sr">건물 보기 · 더 마켓 3D</i></a>'
    o.append(f'<header class="hero ihero" id="hero"><div class="wrap ihero-grid"><div class="hero-text"><span class="eyebrow">{e(P["eyebrow"])}</span><h1>{P["title"]}</h1><p class="q">{P["question"]}</p><p class="lead2">{LEAD}</p>{H1.byline()}<section class="kpis k4">{kp}</section></div><nav class="mosaic m2" aria-label="표지로 고르는 전체 장">{tiles}</nav></div><div class="wrap"><div class="dialog">{"".join(B.say(*t, M) for t in P["hero_talk"])}</div></div></header>')
    o.append('<style>.mosaic.m2{grid-template-columns:repeat(6,1fr)}.mosaic.m2 .mt span{font-size:13px}@media(max-width:700px){.mosaic.m2{grid-template-columns:repeat(5,1fr)}}</style>')
    feats = ''.join(f'<div><span class="en">{a}</span><b>{b}</b><p>{c}</p></div>' for a, b, c in P['features'])
    talk = ''.join(B.say(*t, M) for t in P['micro_talk'])
    o.append(f'<section class="level" id="micro"><div class="wrap stack"><div class="lvhead"><h2>이 강의노트는 — Varian 교과서 강의의 노트</h2><p class="lead">{PROV}</p></div>'
             f'<div class="tw"><table class="tb"><tr><th>연도</th><th>무엇을 했나</th></tr>' + ''.join(f'<tr><td><b>{a}</b></td><td>{b}</td></tr>' for a, b in P['history']) + '</table></div>'
             f'<h3>이 판에서 장마다 하는 일</h3><div class="bys">{feats}</div><div class="talk">{talk}</div>'
             f'<div class="dash panel" data-dash="mk" id="mclab" aria-label="직접 해 보기: 수요·원가·세금을 바꿔 시장 균형 보기 대시보드"></div></div></section>')
    T = P['three']
    o.append(f'<section class="level" id="three"><div class="wrap"><div class="three"><h2>처음 오신 분께 — 이 과정을 3줄로</h2><ol><li><b>무엇을</b><span>{T["what"]}</span></li><li><b>왜 중요한가</b><span>{T["why"]}</span></li><li><b>업무에서는</b><span>{T["work"]}</span></li></ol><p class="ok">수식을 몰라도 됩니다. 장마다 단계별 한 가지 핵심 → 일상 비유 → 실험만 봐도 충분하고, 수식 풀이는 접어 두었어요. 그래프 검증은 그 풀이가 맞는지 그림으로 확인하는 곳이에요.</p></div></div></section>')
    def card(n):
        Q = L[n]; lis = ''.join(f'<li>{e(strip(l["title"]))}</li>' for l in Q['levels']) + f'<li class="duel">⚔ 대결: {e(strip(Q["duel"]["question"]))}</li>'
        return f'<a href="{Q["file"]}"><span class="ct th-{n}" aria-hidden="true"></span><b>{chl(n)} · {e(Q["short_title"])}</b><strong>{e(strip(Q["title"]))}</strong><small>{e(strip(Q["question"]))}</small><ol>{lis}</ol></a>'
    blocks = ''
    for gi, (gname, keys, rk, col) in enumerate(GROUPS):
        cs = ''.join(card(k) for k in keys if k in L)
        if rk and rk in revs:
            R = revs[rk]; cs += f'<a class="review" href="{R["file"]}"><span class="ct th-{rk}" aria-hidden="true"></span><b>요약 · 퀴즈</b><strong>{e(R["short_title"])}</strong><ol><li>장별 요약정리</li><li>원자료 확인 문제</li><li>업무 계산 문제</li><li>장별 점수</li></ol></a>'
        pend = [k for k in keys if k not in L]
        note = f'<p class="muted">준비 중: {", ".join(chl(k) for k in pend)} — 원본은 <a href="../archive/v2/index.html">보관함</a>에서 볼 수 있어요.</p>' if pend else ''
        blocks += f'<h3>{gi+1}부 · {gname} ({chl(keys[0])}~{chl(keys[-1])})</h3><div class="chapx">{cs}</div>{note}'
    blocks += '<h3>마지막 장</h3><div class="chapx"><a class="review" href="practice/index.html"><span class="ct th-prac" aria-hidden="true"></span><b>시뮬레이터</b><strong>실전 연습장 — 공장·가게·보험사·거래소</strong><ol><li>생산·비용 결정</li><li>가격·수요 결정</li><li>위험·정보 결정</li><li>균형·자산 결정</li></ol></a></div>'
    o.append(f'<section class="level" id="map"><div class="wrap stack"><div class="lvhead"><h2>목차</h2><p class="lead">27장과 구역별 요약정리 및 퀴즈, 마지막 실전 연습장입니다.</p></div>{blocks}</div></section>')
    o.append(f'<section class="level" id="building"><div class="wrap stack"><div class="lvhead"><h2>건물로 둘러보기 — 더 마켓(THE MARKET)</h2><p class="lead">{e(tower.COMPANY["motto"])}. 장 하나가 매장 하나, 매장 하나가 한 층이에요.</p></div>'
             f'<a class="bldcard" href="tower.html"><div class="pic">{tower_svg(384, 216)}</div><div><h3>건물 보기 — 3D 마켓 빌딩</h3><p class="muted" style="margin:0">로비부터 옥상 실전 장터까지 {len(tower.FLOORS)}개 층</p><ul><li>생산자·소비자·시장·일반균형·후생·정보 구역이 아래에서 위로 쌓여 있어요.</li><li>층을 누르면 매장(장) 안내 카드가 열리고, 각 장 쪽 맨 위에서는 그 층의 평면을 보여 줘요.</li></ul><span class="go">건물 보기 →</span></div></a></div></section>')
    kc = ''.join(f'<div class="kcard"><a href="{L[n]["file"]}"><b>{chl(n)}</b> {e(L[n]["short_title"])}</a><ol>' + ''.join(f'<li>{e(strip(l["key"]))}</li>' for l in L[n]['levels'] if l.get('key')) + '</ol></div>' for n in have)
    o.append(f'<section class="level" id="keys"><div class="wrap stack"><div class="lvhead"><h2>한 줄 핵심 모음</h2><p class="lead">각 장 단계마다 맨 위에 둔 "가져갈 한 가지"를 모았어요.</p></div><div class="kgrid">{kc}</div></div></section>')
    tabs = ''.join(f'<button class="bt" type="button" aria-pressed="false" data-k="{n}" data-f="{L[n]["file"]}">{chl(n)}</button>' for n in have)
    o.append(f'<section class="level" id="dash"><div class="wrap stack"><div class="lvhead"><h2>종합 대시보드 — 장별 복습 대시보드를 한 화면에서</h2><p class="lead">장 버튼을 누르면 그 장 끝의 복습 대시보드가 열립니다.</p></div><div class="dtabs" role="group" aria-label="장 고르기">{tabs}</div><div class="dash panel" id="dashbox"></div><p><a id="dashlink" href="{L[have[0]]["file"]}#dash">해설 페이지에서 자세히 보기 →</a></p></div></section>')
    o.append('<section class="level" id="path"><div class="wrap stack"><div class="lvhead"><h2>개념 흐름</h2><p class="lead">앞 장이 남긴 질문이 다음 장의 이유가 되도록 이어 두었어요.</p></div><div class="tw"><table class="tb"><tr><th>장</th><th>핵심 질문</th><th>남긴 질문 → 다음 장</th></tr>' + ''.join(f'<tr><td>{chl(n)}</td><td>{e(strip(L[n]["question"]))}</td><td>{e(strip(L[n]["next_q"]))}</td></tr>' for n in have) + '</table></div></div></section>')
    how = ''.join(f'<div><b>{a}</b><p>{b}</p></div>' for a, b in P['how'])
    o.append(f'<section class="level" id="how"><div class="wrap stack"><div class="lvhead"><h2>연구실 식구와 사용법</h2></div>{B.crew_html(M)}<div class="steps four">{how}</div></div></section>')
    ab = ''.join(f'<li>{x}</li>' for x in P['about'])
    o.append(f'<section class="level" id="about"><div class="wrap stack"><div class="lvhead"><h2>자료와 원칙</h2></div><ul style="margin:0;padding-left:20px">{ab}</ul>{B.say("doc","front","수식으로 풀었으면 그래프로 한 번 더. 두 답이 겹치면 그때 믿어요.",M)}</div></section>')
    o.append(B.footer(P, '<p><a href="KG_00_registry.json">2권 지식 그래프 등록부(JSON)</a> · <a href="../docs/AUDIT_REPORT_v2.md">2권 감사보고서</a> · <a href="../index.html">1권(강의 노트 8장)</a> · <a href="../archive/v2/index.html">2권 원본(버전2_강화판) 보관함</a></p>'))
    G = {'version': '1.0', 'page': 'index', 'nodes': [], 'edges': []}
    P.setdefault('levels', []); P['quiz'] = {}
    o.append(B.sprites(M)); o.append(B.tail(P, G, {'gloss': {}, 'core': [], 'quiz': {}, 'dashes': {n: L[n]['dash'] for n in have if L[n].get('dash')}}))
    return ''.join(o), None

def tower_page(base_css, site):
    blk = tower.tower_html('lobby', standalone=True)
    return f"""<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>건물 보기 — 더 마켓(THE MARKET) · 미시경제학 연구실 2</title>
<meta name="description" content="미시경제학 2권 27장을 가상의 종합 시장 빌딩 '더 마켓'의 층으로 둘러보는 3D 건물 안내.">
<meta property="og:title" content="건물 보기 — 더 마켓"><meta property="og:image" content="{site}../assets/og/v2_cover_idx.jpg"><meta property="og:url" content="{site}tower.html">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;700&display=swap">
<style>
{base_css}
</style></head><body>
<nav class="top" aria-label="바로가기"><div class="wrap"><a class="logo" href="index.html"><i></i>미시경제학 연구실 2</a><div class="links"><a href="index.html">← 목차</a><a href="index.html#map">장 목록</a><a href="../index.html">1권</a></div></div></nav>
{blk}
<section class="level"><div class="wrap stack"><div class="lvhead"><h2>이 건물은</h2><p class="lead">{e(tower.COMPANY["motto"])}. 아래층부터 생산자·소비자·시장·일반균형·후생과 정보 구역, 맨 위에 수학 부록 층과 옥상 실전 장터가 있어요.</p></div>
<p class="muted" style="font-size:14px">{e(tower.COMPANY["note"])} 3D는 three.js(jsdelivr CDN)로 그립니다. 불러오지 못하면 안내판만으로 이동할 수 있어요.</p><p><a href="index.html">← 목차로 돌아가기</a></p></div></section>
<footer id="footer"><div class="wrap stack"><p>글 · 안상선 ((주)M-Robo 대표) · <a href="{WHO_PAGE}" target="_blank" rel="noopener">저자 소개</a><br>캐릭터 이름·설정·그림의 저작권은 안상선(개인)에게 있으며 허락 없이 쓸 수 없습니다.</p></div></footer>
</body></html>
"""
