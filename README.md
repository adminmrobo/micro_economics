# 미시경제학 연구실 — 질문하고 실험하고 계산으로 확인하는 미시경제학

> 가진 것(제약) 안에서 원하는 것(목적)을 가장 잘 이루는 선택은 무엇이고, 그 선택들이 만나면 가격은 어디서 멈출까?

저자의 강의 노트 「미시경제학 연구실 버전1_강화판」 CH0~CH07을 **비전공 독자용 연구실 해설 페이지**로 다시 만든 시리즈입니다. 형식은 [데이터 사이언티스트를 위한 베이지안 통계학](https://adminmrobo.github.io/bayesian-statistics-for-data-scientists/)과 같습니다. 박사 · 조수(하루) · 초파리 연구원 · 주판봇이 진행하고, 인턴1 시아·인턴2 모아가 대결 시작·판정과 실험 정리를, 아직 공개되지 않은 식구 X1·X2·X3가 방청석에서 질문을 맡습니다.

- **바로 보기:** https://adminmrobo.github.io/micro_economics/
- 글 · 안상선 ((주)M-Robo 대표) · [저자 소개](https://adminmrobo.github.io/who_am_i/who_am_i.html)

## 건물 보기 — C&C 마켓 타워 (3D)

장 쪽의 맨 첫 화면은 가상의 경제연구원 **C&C(Choice & Constraint)** 의 마켓 타워입니다. 장 하나가 연구실 하나, 연구실 하나가 한 층입니다. 층 평면의 방이 곧 그 쪽의 단계(안내 데스크=3줄 요약, 단계 ①②③, 상황실=대시보드, 대결 홀, 정리 데스크, 자료실)입니다.

| 층 | 연구실 | 쪽 |
|---|---|---|
| R | 옥상 실전 연습장 | 공장·가게·보험사·거래소 시뮬레이터 |
| 9F | 기말 점검 라운지 | 기말 요약정리 및 퀴즈 (CH04~CH07) |
| 8F | 정보·계약센터 | CH07 정보경제학 |
| 7F | 공공정책·조세연구실 | CH06 후생과 공공경제 |
| 6F | 시장 청산소 · 자산운용실 | CH05 일반균형과 자산시장 |
| 5F | 전략·협상센터 | CH04 게임과 과점 |
| 4M | 중간 점검 라운지 | 중간 요약정리 및 퀴즈 (CH0~CH03) |
| 4F | 가격전략실 | CH03 시장이론 |
| 3F | 생산·원가본부 | CH02 생산자이론 |
| 2F | 소비자 행동연구실 | CH01 소비자이론 |
| 1F | 모형 설계실 | CH0 경제모형과 수학적 사고 |
| L | 로비 · 안내 데스크 | 목차 · 건물 보기(tower.html) |

3D는 three.js(jsdelivr CDN)로 그립니다. 불러오지 못하면 오른쪽 안내판만으로 그대로 이동할 수 있어요.

## 구성

| 쪽 | 단계 ①②③ | 대결 (결과) |
|---|---|---|
| [CH0](00_economic_models.html) 경제모형과 수학적 사고 | 고정과 설명 · 효율과 형평 · 제약과 최적화 | 본전을 뽑으려면 끝까지? (초파리) |
| [CH01](01_consumer_choice.html) 소비자이론 | 예산과 선호 · 최적 선택과 수요 · 가격 변화와 후생 | 반반 vs 선호 맞춤 장바구니 (초파리) |
| [CH02](02_producer_choice.html) 생산자이론 | 생산함수 · 비용최소화 · 공급과 조업중단 | 반반 vs 최소비용 배합 (초파리) |
| [CH03](03_market_power.html) 시장이론 | 한계수입과 이윤 · 사중손실과 규제 · 가격차별 | 매출 꼭대기 vs 이윤 꼭대기 (초파리) |
| [중간 정리](03m_midterm_review.html) | 장별 요약 · 원자료 문제 20 · 업무 계산 4 | — |
| [CH04](04_game_theory.html) 게임과 과점 | 내시균형 · 쿠르노 과점 · 반복과 협조 | δ = 0.4의 협조 vs 일탈 (주판봇) |
| [CH05](05_general_equilibrium.html) 일반균형과 자산시장 | 교환과 균형 · 시간과 이자율 · 위험 나누기 | 반반 섞기 vs 집중 (주판봇) |
| [CH06](06_welfare_policy.html) 후생과 공공경제 | 총잉여 · 조세 귀착 · 외부성과 피구세 | 세금 부담 예측 (초파리) |
| [CH07](07_information.html) 정보경제학 | 정보의 가치 · 역선택과 신호 · 성과급 | 예보를 살까 (조건부) |
| [기말 정리](07f_final_review.html) | 장별 요약 · 원자료 문제 20 · 업무 계산 4 | — |
| [실전 연습장](practice/index.html) | 공장 · 가게 · 보험사 · 거래소 | — |

각 장 페이지: 3D 건물 → 표지 → 히어로 → 3줄 요약 → 연구실 식구 → 왜 이 주제인가 → 단계 ①②③(가져갈 한 가지 · 왜 이 방법 · 조수가 묻는 수식 · 일상/경제학 비유 · 대화 · 실험 · 풀이와 한계 · 업무 팁 · 퀴즈 2) → 한눈에 보는 대시보드 → 대결 → 정리 → 아웃트로 → 지식 색인 → 온톨로지·서지 꾸러미 → 바닥글.

## 정확성과 감사

- 뜻이 불분명하거나 틀린 원자료 용어 20건을 바로잡았습니다. 목록과 근거는 [docs/AUDIT_REPORT.md](docs/AUDIT_REPORT.md)(감사보고서)와 각 쪽 바닥글 "원자료와 다르게 쓴 곳"에 있습니다.
- 모든 예시값은 다시 계산했고, 실험 데이터는 가상 단위의 설명용 모형입니다. CH05는 교육용이며 투자 자문이 아닙니다.
- 그림 지시문 20장(표지 12 · 대결 장면 8)은 16비트 RPG 픽셀아트·낮의 연구실 기준이며 프롬프트 감사(P1~P14)를 통과했습니다.

## 파일

```
index.html · tower.html            목차 · 3D 건물 보기
00_…html ~ 07_…html                장 해설 (한 파일)
03m_… · 07f_…html                  중간·기말 요약정리 및 퀴즈
practice/index.html                마지막 장 · 실전 연습장
KG_00_registry.json                시리즈 지식 그래프 등록부
assets/og/cover_*.jpg              공유 미리보기(대체 이미지)
docs/AUDIT_REPORT.md               감사보고서
docs/IMG_PROMPTS_all.md            그림 지시문 20장 (Genspark용)
docs/COVER_PROMPTS_series.md       표지 12장만 모은 지시문
docs/PROMPT_AUDIT_table.md         프롬프트 감사 자동 점검표
src/pages/*.py                     페이지 데이터
src/build/                         빌드 도구 (sims.js 실험 24개, dash.js 대시보드 8개, tower.* 3D 건물)
v2/                                2권(Varian 강의노트 27장) — 아래 "2권" 참고
archive/                           이전 판 원본 — 버전1(8장)·버전2(교과서 27장)·블로그 35편
```

## 2권 — Varian 『Microeconomic Analysis』 강의노트 (27장)

- **바로 보기:** https://adminmrobo.github.io/micro_economics/v2/
- 저자가 Hal R. Varian 『Microeconomic Analysis』로 진행한 강의의 강의노트입니다. 노트는 2005·2008·2011년 세 번 업데이트했고, 실제 강의에는 2014·2015년에 사용했습니다.
- 장마다: 3단계 설명 → **수식 풀이를 그래프로 다시 검증**(단계마다 1개, 모두 81개) → 대결 → **복습용 동적 대시보드**(장 끝) → **파이썬 코드 생성 AI 프롬프트 3개**.
- 박사·조수(하루)·초파리 연구원·주판봇과 인턴1 시아·인턴2 모아, 방청석 X1·X2·X3가 모든 장에 나옵니다.
- 경제학 색인어: 장마다 JEL 분류 코드(미국경제학회), 개념·용어 220개마다 대표 JEL 코드를 붙였고 온톨로지 꾸러미에 `dct:subject`로 들어갑니다. 위키데이터 연결은 `src/build/link_external.py`로 확인한 것만 싣습니다.
- 건물 콘셉트: **The Market(더 마켓)** — 생산자(01~06)·소비자(07~12)·시장(13~16)·일반균형(17~21)·후생·정보(22~25) 구역과 구역 점검 r1~r5, 수학 부록(26·27), 옥상 실전 연습장.

```
v2/index.html · v2/tower.html      2권 목차 · 3D 건물 보기
v2/01_…html ~ v2/27_…html          장 해설
v2/r1_…html ~ v2/r5_…html          구역 점검(요약·원자료 문제·업무 계산)
v2/practice/index.html             실전 연습장
v2/assets/og/cover_*.jpg           2권 공유 미리보기(대체 이미지)
v2/terms.html · v2/KG_terms_index.csv   2권 경제학 색인어(JEL 분류)
docs/AUDIT_REPORT_v2.md            2권 감사보고서
docs/COVER_PROMPTS_v2.md           2권 표지 지시문 34장(16비트 RPG 픽셀아트, 흰 배경)
src/pages_v2/*.py                  2권 페이지 데이터
```

```bash
cd src
python3 build/build.py ../v2 --v2        # 2권 34쪽 + KG 등록부
python3 build/make_placeholders_v2.py    # (선택) 2권 대체 썸네일·공유 미리보기
```

## 다시 빌드하기

```bash
cd src
python3 build/build.py ..                # 저장소 루트에 12쪽 + KG 등록부 생성
python3 build/make_placeholders.py       # (선택) 대체 썸네일·공유 미리보기
python3 build/make_docs.py               # (선택) 그림 지시문과 프롬프트 감사표
```

받은 표지는 `src/build/covers/cover_{키}.webp`(1600×900)로 넣고 다시 빌드하면 표지와 목차 썸네일이 바뀝니다.

## 권리

캐릭터 이름·설정·그림 © 안상선 ((주)M-Robo). 모든 권리 보유. 무단 복제·수정·배포·상업적 이용 금지.
교육 구성 참고: ahnboat_lab_explainer, 안상선 ((주)M-Robo), 저작자표시-비영리 4.0 국제. 이 고지는 캐릭터에 별도 이용권을 부여하지 않습니다.
2권(버전2)의 장 배열은 Hal R. Varian 『Microeconomic Analysis』 제3판을 따르지만, 해당 책의 본문·문제·증명을 옮기거나 대신하지 않습니다.
