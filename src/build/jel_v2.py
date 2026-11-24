"""2권 경제학 색인어 — JEL 분류(American Economic Association, Journal of Economic Literature).
코드와 영문 이름은 AEA 공식 목록(https://www.aeaweb.org/econlit/jelCodes.php?view=jel, 2026-11-25 확인)에서 옮겼고,
한국어 이름은 이 시리즈가 옮긴 것이다. 개념마다 대표 코드 하나, 장마다 분류 목록을 둔다."""
JEL_SRC = 'https://www.aeaweb.org/econlit/jelCodes.php?view=jel'
JEL = {
 'C13': ('Estimation: General', '추정 일반'),
 'C18': ('Methodological Issues: General', '계량 방법론 일반'),
 'C61': ('Optimization Techniques • Programming Models • Dynamic Analysis', '최적화 기법·계획 모형·동태 분석'),
 'C62': ('Existence and Stability Conditions of Equilibrium', '균형의 존재와 안정 조건'),
 'C65': ('Miscellaneous Mathematical Tools', '기타 수학 도구'),
 'C72': ('Noncooperative Games', '비협조 게임'),
 'C73': ('Stochastic and Dynamic Games • Evolutionary Games • Repeated Games', '동태·반복 게임'),
 'D11': ('Consumer Economics: Theory', '소비자 이론'),
 'D12': ('Consumer Economics: Empirical Analysis', '소비자 실증 분석'),
 'D15': ('Intertemporal Household Choice • Life Cycle Models and Saving', '가계의 기간 간 선택·생애주기와 저축'),
 'D21': ('Firm Behavior: Theory', '기업 행동 이론'),
 'D23': ('Organizational Behavior • Transaction Costs • Property Rights', '조직 행동·거래비용·재산권'),
 'D24': ('Production • Cost • Capital • Capital, Total Factor, and Multifactor Productivity • Capacity', '생산·비용·자본·생산성'),
 'D25': ('Intertemporal Firm Choice: Investment, Capacity, and Financing', '기업의 기간 간 선택: 투자·설비·자금조달'),
 'D33': ('Factor Income Distribution', '요소소득 분배'),
 'D41': ('Perfect Competition', '완전경쟁'),
 'D42': ('Monopoly', '독점'),
 'D43': ('Oligopoly and Other Forms of Market Imperfection', '과점과 불완전경쟁'),
 'D51': ('Exchange and Production Economies', '교환경제와 생산경제'),
 'D52': ('Incomplete Markets', '불완비 시장'),
 'D53': ('Financial Markets', '금융시장(일반균형)'),
 'D61': ('Allocative Efficiency • Cost–Benefit Analysis', '배분 효율·비용편익 분석'),
 'D62': ('Externalities', '외부성'),
 'D63': ('Equity, Justice, Inequality, and Other Normative Criteria and Measurement', '형평·정의·불평등과 규범 기준'),
 'D71': ('Social Choice • Clubs • Committees • Associations', '사회선택'),
 'D81': ('Criteria for Decision-Making under Risk and Uncertainty', '위험·불확실성 아래 의사결정 기준'),
 'D82': ('Asymmetric and Private Information • Mechanism Design', '비대칭 정보·메커니즘 설계'),
 'D83': ('Search • Learning • Information and Knowledge • Communication • Belief • Unawareness', '탐색·학습·정보와 지식'),
 'G11': ('Portfolio Choice • Investment Decisions', '포트폴리오 선택·투자 결정'),
 'G12': ('Asset Pricing • Trading Volume • Bond Interest Rates', '자산가격 결정'),
 'H23': ('Externalities • Redistributive Effects • Environmental Taxes and Subsidies', '외부성·환경세와 보조금'),
 'H41': ('Public Goods', '공공재'),
 'L11': ('Production, Pricing, and Market Structure • Size Distribution of Firms', '생산·가격 결정과 시장구조'),
 'L12': ('Monopoly • Monopolization Strategies', '독점·독점화 전략'),
 'L13': ('Oligopoly and Other Imperfect Markets', '과점과 불완전 시장'),
}
# 장(쪽)마다 분류 목록 — 첫 코드가 대표
PAGE = {
 '01': ['D24'], '02': ['D21', 'D24'], '03': ['D21', 'C61'], '04': ['D24', 'C61', 'D33'], '05': ['D24', 'C65'], '06': ['D24', 'C65'],
 '07': ['D11'], '08': ['D11'], '09': ['D11', 'D12'], '10': ['D11', 'D61'], '11': ['D81', 'C65'], '12': ['C13', 'C18'],
 '13': ['D41', 'L11'], '14': ['D42', 'L12', 'D61'], '15': ['C72', 'C73'], '16': ['D43', 'L13', 'C73'],
 '17': ['D51', 'D61'], '18': ['D51', 'D24', 'D61'], '19': ['D15', 'D25', 'C61'], '20': ['G12', 'D52', 'D53', 'G11'], '21': ['C62', 'D51', 'C65'],
 '22': ['D63', 'D61', 'D71'], '23': ['H41', 'D82'], '24': ['D62', 'H23', 'D23'], '25': ['D82', 'D83', 'D81'],
 '26': ['C65'], '27': ['C61'],
 'R1': ['D24', 'D21', 'C65'], 'R2': ['D11', 'D61', 'D81', 'C13'], 'R3': ['D41', 'D42', 'D43', 'C72', 'C73'],
 'R4': ['D51', 'D61', 'D25', 'G12', 'G11', 'C62', 'C61'], 'R5': ['D63', 'D61', 'H41', 'D82', 'D62', 'H23', 'D23', 'D83'],
}
# 개념·용어(영문 이름)마다 대표 코드
_C = '''
D24: production function, diminishing returns, output elasticity, production possibility set, free disposal, marginal cost, isocost line, average cost,
 homogeneous of degree one, long-run cost, Le Chatelier principle, switching price, isoprofit line (supporting line), real wage, divisibility,
 marginal product, returns to scale, isoquant, homogeneity of degree one, cost minimization, conditional factor demand, cost function,
 properties of the cost function, Shephard's lemma, short-run cost, activity analysis, duality in production, marginal rate of technical substitution,
 constant returns to scale, efficient scale
D21: contribution margin, interior solution, sunk cost, avoidable fixed cost, supply function, factor demand, homogeneity, relative price,
 profit maximization, value of marginal product, shutdown decision, profit function, Hotelling's lemma
D33: labor share of output
C61: value function, Lagrange multiplier, Bellman equation, Euler and Bellman equations, envelope theorem, constrained optimization,
 Karush-Kuhn-Tucker conditions, shadow price, feasible set, Lagrangian, complementary slackness, constraint qualification
C65: homogeneous function, convex function, concave function, negative semidefinite, Jensen's inequality, Cauchy-Schwarz inequality,
 implicit function theorem, gradient, definiteness of the Hessian, directional derivative, Euler's homogeneous function theorem, eigenvalue,
 saddle point, quasiconcave, convex hull
D11: budget set, utility function, ordinal utility, corner solution, indirect utility function, Hicksian demand, completeness, transitivity,
 directly revealed preferred, local nonsatiation, Afriat's theorem, identification, subsistence quantity, supernumerary income, Engel curve,
 non-homotheticity, Roy's identity, quasilinear preferences, substitution effect, income effect, compensated bundle, utility maximization,
 marginal rate of substitution, expenditure function, expenditure matrix, generalized axiom of revealed preference, limits of revealed preference,
 Stone-Geary demand, income elasticity, Slutsky matrix, Hicksian decomposition, price elasticity of demand
D61: equivalent variation, compensating variation, consumer surplus, deadweight loss, total surplus, Pareto efficiency, Pareto improvement,
 utility possibility frontier, second welfare theorem, fundamental welfare theorems, production efficiency, product-mix efficiency
D81: expected utility, risk premium, actuarially fair premium, loading factor, certainty equivalent, risk aversion, insurance demand
C13: endogenous variable, ordinary least squares, probability limit, exclusion restriction, weak instrument, simultaneity, simultaneity bias, instrumental variable
D41: price taker, average variable cost, producer surplus, market supply, free entry, firm supply curve, competitive equilibrium, long-run competitive equilibrium
L11: constant-cost industry
D42: marginal revenue, Lerner index, resale (arbitrage), monopoly pricing, price ceiling under monopoly, price discrimination
C72: strategy, Nash equilibrium, dominant strategy, indifference principle, best response, mixed strategy equilibrium
C73: backward induction, discount factor, grim trigger strategy, subgame perfection, collusion in repeated games
D43: oligopoly, Bertrand competition, cartel, Cournot equilibrium, Stackelberg equilibrium
D51: endowment, pure exchange economy, Edgeworth box, general equilibrium, factor box, marginal rate of transformation, aggregate excess demand,
 demand with endowments, Walras' law, contract curve, production possibility frontier
D15: present value, discounting, time preference, perfect capital market
D25: net present value, Fisher separation
G12: no arbitrage, risk-neutral probability, capital asset pricing model, state prices, replicating portfolio
D52: complete market, incomplete market
G11: diversification
C62: fixed point theorem, local stability, linearization, existence and uniqueness of equilibrium, comparative statics, tâtonnement stability
D63: utilitarianism, social welfare function, maximin (Rawlsian) criterion
D71: Arrow's impossibility theorem
H41: public good, non-rivalry, non-excludability, Lindahl price, Samuelson condition, free riding
D82: VCG (Clarke) mechanism, incentive compatibility constraint, adverse selection, signaling, moral hazard
D62: pecuniary externality, marginal social cost, internalization, externality
H23: tradable permits, Pigouvian tax
D23: transaction cost, Coase theorem
D83: Bayesian updating, expected value of perfect information, value of information, search theory
'''
CONCEPT = {}
for line in _C.strip().split('\n'):
    pass
_cur = None
for chunk in _C.replace('\n ', ' ').strip().split('\n'):
    code, names = chunk.split(':', 1)
    assert code in JEL, code
    for nm in names.split(', '):
        nm = nm.strip().rstrip(',')
        if nm: CONCEPT[nm] = code
for k, v in PAGE.items():
    for c in v: assert c in JEL, (k, c)

def page_codes(num):
    return PAGE.get(str(num).upper(), [])

def label(code, lang='ko'):
    en, ko = JEL[code]
    return ko if lang == 'ko' else en
