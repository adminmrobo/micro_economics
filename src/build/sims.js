/* 미시경제학 실험 모듈 (설명용 모형, 숫자는 가상 단위) */
function S0(el,cfg,hgt,label){return mkCanvas(el,hgt,label,cfg&&cfg.wide)}
function nt(lo,hi,n){var span=hi-lo||1,step=Math.pow(10,Math.floor(Math.log10(span/n))),e=span/n/step;step*=e>=5?10:e>=2?5:e>=1?2:1;var t=[],s=Math.ceil(lo/step-1e-9)*step;for(var v=s;v<=hi+step*1e-6;v+=step)t.push(+v.toFixed(10));return t}
function f1(v,d){d=d==null?1:d;return (Math.abs(v)<1e-9?0:v).toFixed(d)}
/* 좌표 상자: o={xlo,xhi,ylo,yhi,xl,yl,title,fx,fy} */
function plot(c,H,o){var W=fit(c,H),ctx=c.getContext('2d');ctx.clearRect(0,0,W,H);grid(ctx,W,H);
  var L=o.L||54,R=o.R||16,T=o.T||(o.title?30:16),B=o.B||36,pw=W-L-R,ph=H-T-B;
  function X(v){return L+(v-o.xlo)/(o.xhi-o.xlo)*pw}function Y(v){return T+ph-(v-o.ylo)/(o.yhi-o.ylo)*ph}
  ctx.save();ctx.strokeStyle=COL.rule;ctx.lineWidth=1;nt(o.ylo,o.yhi,4).forEach(function(t){var y=Y(t);ctx.beginPath();ctx.moveTo(L,y+.5);ctx.lineTo(L+pw,y+.5);ctx.stroke();txt(ctx,(o.fy||String)(t),L-6,y+4,COL.muted,11,'right')});
  nt(o.xlo,o.xhi,5).forEach(function(t){txt(ctx,(o.fx||String)(t),X(t),T+ph+15,COL.muted,11,'center')});
  ctx.strokeStyle=COL.muted;ctx.beginPath();ctx.moveTo(L,T);ctx.lineTo(L,T+ph);ctx.lineTo(L+pw,T+ph);ctx.stroke();ctx.restore();
  if(o.title)txt(ctx,o.title,L,18,COL.text,13,'left',true);if(o.xl)txt(ctx,o.xl,L+pw,H-4,COL.muted,11,'right');if(o.yl)txt(ctx,o.yl,L+4,T+12,COL.muted,11,'left');
  var P={ctx:ctx,W:W,H:H,X:X,Y:Y,L:L,T:T,pw:pw,ph:ph,o:o};
  P.fn=function(f,col,w,dash,a,b){a=a==null?o.xlo:a;b=b==null?o.xhi:b;ctx.save();ctx.strokeStyle=col;ctx.lineWidth=w||2.2;if(dash)ctx.setLineDash(dash);ctx.beginPath();var st=false;for(var i=0;i<=160;i++){var x=a+(b-a)*i/160,y=f(x);if(!isFinite(y)||y<o.ylo-(o.yhi-o.ylo)*.01||y>o.yhi+(o.yhi-o.ylo)*.01){st=false;continue}var px=X(x),py=Y(clamp(y,o.ylo-(o.yhi-o.ylo)*.02,o.yhi+(o.yhi-o.ylo)*.02));if(!st){ctx.moveTo(px,py);st=true}else ctx.lineTo(px,py)}ctx.stroke();ctx.restore()};
  P.seg=function(x0,y0,x1,y1,col,w,dash){ctx.save();ctx.strokeStyle=col;ctx.lineWidth=w||2;if(dash)ctx.setLineDash(dash);ctx.beginPath();ctx.moveTo(X(x0),Y(y0));ctx.lineTo(X(x1),Y(y1));ctx.stroke();ctx.restore()};
  P.dot=function(x,y,col,r,lab,dx,dy){ctx.fillStyle=col;ctx.beginPath();ctx.arc(X(x),Y(y),r||5,0,7);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke();if(lab)txt(ctx,lab,X(x)+(dx==null?8:dx),Y(y)+(dy==null?-8:dy),col,12,(dx||8)<0?'right':'left',true)};
  P.poly=function(pts,col,alpha){ctx.save();ctx.globalAlpha=alpha==null?.18:alpha;ctx.fillStyle=col;ctx.beginPath();pts.forEach(function(p,i){i?ctx.lineTo(X(p[0]),Y(p[1])):ctx.moveTo(X(p[0]),Y(p[1]))});ctx.closePath();ctx.fill();ctx.restore()};
  P.lab=function(s,x,y,col,al,b){txt(ctx,s,X(x),Y(y),col||COL.text,11,al||'left',b)};
  P.key=function(items){var x=L+8;items.forEach(function(it){txt(ctx,'● '+it[0],x,T+12,it[1],11,'left',true);ctx.save();ctx.font='700 11px "IBM Plex Sans KR",system-ui,sans-serif';x+=ctx.measureText('● '+it[0]).width+14;ctx.restore()})};
  return P}
function rows(el){return ctrlRow(el)}
function S(row,l,a,b,st,v,fmt,on){return slider(row,l,a,b,st,v,fmt||function(x){return String(x)},on)}
function fx(d){return function(v){return Number(v).toFixed(d)}}

/* ===== CH00 모형을 읽는 방법 ===== */
/* 두 시장: Dx=a+.4py−b·px, Dy=40+.4px−b·py, Si=5+pi */
SIMS.twomarket=function(el,cfg){var c=S0(el,cfg,260,'x시장의 수요·공급과 두 가지 균형'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var a0=cfg.a0||40,a=a0+(cfg.shift||20),b=cfg.b||1,mode=1;
  S(row,'x 수요가 늘어난 크기',0,40,1,a-a0,function(v){return '+'+v},function(v){a=a0+v;draw()});
  S(row,'가격에 대한 반응 b',0.5,2,0.1,b,fx(1),function(v){b=v;draw()});
  buttons(row,'y가격',[[0,'고정(부분균형)'],[1,'함께 반응(동시균형)']],1,function(v){mode=v;draw()});
  function solve(aa,bb){var A=bb+1,g=.4,det=A*A-g*g;var px=((aa-5)*A+g*35)/det,py=(A*35+g*(aa-5))/det;return [px,py]}
  function draw(){var base=solve(a0,b),pyb=base[1],part=(a+.4*pyb-5)/(b+1),sim=solve(a,b),pxs=mode?sim[0]:part,pys=mode?sim[1]:pyb;
    var P=plot(c,260,{xlo:0,xhi:70,ylo:0,yhi:50,xl:'수량 x',yl:'가격 pₓ',title:'x시장 — 회색 공급, 초록 수요(바뀐 뒤), 점선 수요(처음)'});
    P.fn(function(q){return q-5},COL.muted,2.4,null,5,55);
    function dinv(aa,py){return function(q){return (aa+.4*py-q)/b}}
    P.fn(dinv(a0,pyb),COL.s,1.8,[5,4],0,70);P.fn(dinv(a,pys),COL.g,2.4,null,0,70);
    P.dot(base[0]+5,base[0],COL.s,5,'처음 E₀',8,14);P.dot(part+5,part,COL.a,5,mode?'':'부분균형',8,-8);if(mode)P.dot(pxs+5,pxs,COL.g,6,'동시균형',8,-10);
    stamp(P.ctx,P.W,'설명용 모형 · 가상 단위');
    K([[f1(base[0],2)+' → '+f1(part,2),'pₓ (y가격 고정)','a'],[f1(base[0],2)+' → '+f1(sim[0],2),'pₓ (y가격도 반응)','g'],[f1(pyb,2)+' → '+f1(mode?sim[1]:pyb,2),'pᵧ','m'],[f1((sim[0]-base[0])/((part-base[0])||1e-9),3)+'배','동시균형 ÷ 부분균형 반응','i']]);
    E('부분균형: pₓ* = (a + 0.4·<em>p̄ᵧ</em> − 5) ÷ (b + 1) → a가 1 늘면 pₓ는 <i>'+f1(1/(b+1),3)+'</i> 오름 · 동시균형: (b+1) ÷ [(b+1)² − 0.4²] = <i>'+f1((b+1)/((b+1)*(b+1)-.16),3)+'</i>');
    I(mode?[['g','y가격도 함께 풀면 x가격이 조금 더 올라요. x가 비싸지자 대체재 y의 수요가 늘고, 올라간 y가격이 다시 x수요를 밀어 올리는 되먹임이 생기기 때문이에요.'],['a','같은 충격이라도 "무엇을 고정했는가"에 따라 답이 달라집니다. 이 차이가 부분균형과 동시균형의 차이예요.']]:[['a','y가격을 처음 값에 묶어 두면 x시장만 풀어요. 계산은 쉽지만 y시장을 거쳐 돌아오는 영향을 빼먹습니다.'],['g','버튼을 "함께 반응"으로 바꿔 x가격이 얼마나 더 움직이는지 비교해 보세요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* 효율과 형평: 효용가능경계 Ua²+Ub²≤100 */
SIMS.frontier=function(el,cfg){var c=S0(el,cfg,270,'두 사람의 효용가능경계와 배분 점'),row=rows(el),K=kpis(el,4),I=insight(el);
  var th=cfg.theta||.9,e=cfg.e||1;
  S(row,'A의 몫 θ',0.02,0.98,0.02,th,fx(2),function(v){th=v;draw()});
  S(row,'경계까지 쓰는 정도 e',0.4,1,0.02,e,function(v){return Math.round(v*100)+'%'},function(v){e=v;draw()});
  function draw(){var ua=10*e*Math.sqrt(th),ub=10*e*Math.sqrt(1-th);var P=plot(c,270,{xlo:0,xhi:11,ylo:0,yhi:11,xl:'A의 효용',yl:'B의 효용',title:'효용가능경계 — 경계 위 = 파레토 효율'});
    P.poly([[0,0]].concat(Array.from({length:41},function(_,i){var t=i/40*Math.PI/2;return [10*Math.cos(t),10*Math.sin(t)]})),COL.s,.08);
    P.fn(function(x){return Math.sqrt(Math.max(0,100-x*x))},COL.s,2.4,null,0,10);P.seg(0,0,10,10,COL.muted,1,[4,4]);P.lab('똑같이 나누는 선',7.4,7.9,COL.muted);
    P.dot(ua,ub,e>=.999?COL.g:COL.r,6,e>=.999?'효율적 배분':'낭비가 있는 배분');
    if(e<.999){P.seg(ua,ub,10*Math.sqrt(th),10*Math.sqrt(1-th),COL.g,1.5,[3,3]);}
    stamp(P.ctx,P.W,'설명용 좌표');
    var eff=e>=.999,gap=Math.abs(ua-ub);
    K([[f1(ua,1)+' / '+f1(ub,1),'A / B의 효용','i'],[eff?'예':'아니요','파레토 효율인가','g'],[f1(gap,1),'두 효용의 차이(형평 지표)','a'],[f1(ua+ub,1),'효용의 합(참고)','m']]);
    I([[eff?'g':'r',eff?'경계 위의 점이에요. 누군가를 더 낫게 하려면 다른 사람을 덜 낫게 할 수밖에 없어요. 이것이 파레토 효율입니다.':'경계 안쪽이라 둘 다 더 좋아질 여지가 남아 있어요(점선 방향). 낭비가 있는 배분이에요.'],[gap>4?'a':'g',gap>4?'효율적이어도 한 사람에게 크게 치우칠 수 있어요. 효율과 형평은 서로 다른 질문입니다.':'두 사람 몫이 비슷해요. 그래도 "공평한가"는 이 그림이 아니라 사회가 고른 기준으로 판단해요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* 매몰비용과 한계조건: N(q)=aq−bq²/2−cq, 0≤q≤Q, 전체 Π=N−S */
SIMS.sunk=function(el,cfg){var c=S0(el,cfg,260,'앞으로의 순편익 곡선과 최적 참여 횟수'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var a=cfg.a||60,b=cfg.b||2,cc=cfg.c||30,Q=cfg.Q||25,Sk=cfg.S||200;
  S(row,'한 번 더 할 때 비용 c',5,70,1,cc,null,function(v){cc=v;draw()});
  S(row,'가능한 최대 횟수 Q',5,40,1,Q,null,function(v){Q=v;draw()});
  S(row,'이미 낸 돈(매몰비용) S',0,600,10,Sk,null,function(v){Sk=v;draw()});
  function N(q){return a*q-b*q*q/2-cc*q}
  function draw(){var qi=(a-cc)/b,qs=clamp(qi,0,Q);var P=plot(c,260,{xlo:0,xhi:40,ylo:-700,yhi:600,xl:'참여 횟수 q',yl:'순편익',title:'초록 = 앞으로의 순편익 N(q) · 빨강 점선 = 이미 낸 돈까지 뺀 전체 성과'});
    P.seg(0,0,40,0,COL.muted,1);P.fn(N,COL.g,2.4,null,0,Q);P.fn(N,'rgba(19,138,82,.25)',1.5,[4,4],Q,40);P.fn(function(q){return N(q)-Sk},COL.r,1.8,[5,4],0,Q);
    P.seg(Q,-700,Q,600,COL.a,1,[3,3]);P.lab('최대 Q',Q+.5,560,COL.a);
    P.dot(qs,N(qs),COL.fly,6,'초파리 q*='+f1(qs,1));P.dot(Q,N(Q),COL.robo,6,'주판봇 Q',8,16);
    stamp(P.ctx,P.W,'가상 단위');
    K([[f1(qs,1)+'회','최적 횟수 q*','g'],[f1(N(qs),0),'q*의 앞으로 순편익','g'],[f1(N(Q),0),'Q까지 채울 때','a'],[f1(N(qs)-Sk,0),'q*의 전체 성과(S 포함)','r']]);
    E('한계편익 a − b·q = 한계비용 c → q = (a − c) ÷ b = ('+a+' − '+cc+') ÷ '+b+' = <i>'+f1(qi,1)+'</i> → 0과 Q 사이로 자르면 <b>'+f1(qs,1)+'</b>');
    I([['g','S를 아무리 바꿔도 q*는 그대로예요. 이미 낸 돈은 어느 선택을 하든 똑같이 빠지기 때문에 비교에서 지워집니다.'],[N(qs)-Sk<0?'a':'g',N(qs)-Sk<0?'최선을 골라도 전체 성과는 '+f1(N(qs)-Sk,0)+'으로 손실이에요. 그래도 그만두는 것(0회, 전체 −S)보다는 나아요.':'전체 성과도 플러스예요.'],[qi>Q?'a':'i',qi>Q?'계산한 q가 Q보다 커서 Q가 최적이에요. 이때는 두 사람의 선택이 같아집니다.':qi<=0?'한 번 더 할 때 비용이 너무 커서 0회가 최적이에요(중단).':'q*보다 더 하면 마지막 몇 번은 얻는 것보다 드는 것이 커요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* ===== CH01 소비자 선택 ===== */
function cdU(x,y,al){return Math.pow(x,al)*Math.pow(y,1-al)}
SIMS.budget=function(el,cfg){var c=S0(el,cfg,280,'예산선과 무차별곡선'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var px=cfg.px||4,py=cfg.py||2,m=cfg.m||100,al=cfg.al||.8,sh=.5;
  S(row,'x 가격',1,10,.5,px,null,function(v){px=v;draw()});
  S(row,'x를 좋아하는 정도 α',.1,.9,.05,al,fx(2),function(v){al=v;draw()});
  S(row,'x에 쓰는 돈의 비율',.05,.95,.05,sh,function(v){return Math.round(v*100)+'%'},function(v){sh=v;draw()});
  function draw(){var x=sh*m/px,y=(1-sh)*m/py,u=cdU(x,y,al),mrs=al*y/((1-al)*x),pr=px/py,xm=m/px,ym=m/py;
    var P=plot(c,280,{xlo:0,xhi:Math.max(30,xm*1.1),ylo:0,yhi:Math.max(55,ym*1.1),xl:'x간식 수량',yl:'y간식',title:'파랑 = 예산선 · 보라 = 지금 묶음을 지나는 무차별곡선'});
    P.poly([[0,0],[xm,0],[0,ym]],COL.s,.08);P.seg(xm,0,0,ym,COL.s,2.4);
    P.fn(function(xx){return Math.pow(u/Math.pow(xx,al),1/(1-al))},COL.m,2,null,.3,P.o.xhi);
    var xs=al*m/px,ys=(1-al)*m/py;P.dot(xs,ys,COL.g,5,'최적',8,16);P.dot(x,y,COL.a,6,'지금 묶음');
    stamp(P.ctx,P.W,'가상 단위');
    K([['('+f1(x,1)+', '+f1(y,1)+')','지금 묶음 (x, y)','a'],[f1(mrs,2),'교환 의향 MRS','m'],[f1(pr,2),'시장 교환비 pₓ/pᵧ','i'],[f1(u,2)+' / '+f1(cdU(xs,ys,al),2),'효용: 지금 / 최적','g']]);
    E('MRS = α·y ÷ [(1 − α)·x] = '+al+'×'+f1(y,1)+' ÷ ('+f1(1-al,2)+'×'+f1(x,1)+') = <i>'+f1(mrs,2)+'</i> · 가격비 = '+px+' ÷ '+py+' = <b>'+f1(pr,2)+'</b>');
    I([[Math.abs(mrs-pr)<.05?'g':'a',Math.abs(mrs-pr)<.05?'교환 의향과 시장 교환비가 같아요. 예산선과 무차별곡선이 맞닿는 접점이 최적입니다.':mrs>pr?'x 하나를 얻으려고 y를 '+f1(mrs,2)+'개까지 내줄 마음인데, 시장에서는 '+f1(pr,2)+'개면 돼요. x를 늘리고 y를 줄이면 더 만족스러워요.':'시장에서 x 하나는 y '+f1(pr,2)+'개 값인데 내 마음은 '+f1(mrs,2)+'개뿐이에요. x를 줄이고 y를 늘리세요.'],['i','예산을 다 쓰는 점은 모두 같은 돈이에요. 같은 돈이라도 만족(효용)은 묶음마다 다릅니다.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

SIMS.demand=function(el,cfg){var c=S0(el,cfg,260,'가격과 수요량: 곡선 위 이동과 곡선 이동'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var al=cfg.al||.5,m0=cfg.m||120,m=m0,px=cfg.px||10;
  S(row,'x 가격 pₓ',2,20,1,px,null,function(v){px=v;draw()});
  S(row,'소득 m',60,240,10,m,null,function(v){m=v;draw()});
  S(row,'x 선호 α',.2,.8,.05,al,fx(2),function(v){al=v;draw()});
  function draw(){var x=al*m/px;var P=plot(c,260,{xlo:0,xhi:40,ylo:0,yhi:22,xl:'x 수요량',yl:'가격 pₓ',title:'초록 = 지금 수요곡선 x = α·m ÷ pₓ · 점선 = 처음(m='+m0+', α='+(cfg.al||.5)+')'});
    P.fn(function(q){return (cfg.al||.5)*m0/q},COL.muted,1.6,[5,4],2,40);P.fn(function(q){return al*m/q},COL.g,2.4,null,1,40);P.dot(x,px,COL.a,6,'(x='+f1(x,1)+', p='+px+')');
    stamp(P.ctx,P.W,'코브-더글러스 예시');
    K([[f1(x,2),'x 수요량','g'],[f1(px*x,1),'x에 쓰는 돈','a'],[Math.round(al*100)+'%','x 지출 비중(=α)','m'],[m===m0&&al===(cfg.al||.5)?'곡선 위 이동':'곡선 자체 이동','지금 바뀐 것','i']]);
    E('x* = α·m ÷ pₓ = '+al+' × '+m+' ÷ '+px+' = <i>'+f1(x,2)+'</i> · 지출 pₓ·x* = α·m = <b>'+f1(al*m,1)+'</b>');
    I([['i','가격만 바꾸면 점이 같은 곡선을 따라 움직여요(수요량의 변화). 소득이나 선호를 바꾸면 곡선 자체가 옮겨 가요(수요의 변화).'],['a','이 예시에서는 가격이 2배가 되면 수량이 절반이 되고, x에 쓰는 돈은 그대로예요. 이는 코브-더글러스 선호의 특별한 성질이지 모든 상품의 법칙은 아닙니다.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* 가격 상승의 대체효과·소득효과, 보상변화(CV)·동등변화(EV)·소비자잉여 변화 */
SIMS.slutsky=function(el,cfg){var c=S0(el,cfg,280,'가격 인상 전후의 예산선과 세 점'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var al=cfg.al||.5,m=cfg.m||120,p0=cfg.p0||10,p1=cfg.p1||20,py=cfg.py||5;
  S(row,'오른 뒤 x 가격',p0,30,1,p1,null,function(v){p1=v;draw()});
  S(row,'x 선호 α',.2,.8,.05,al,fx(2),function(v){al=v;draw()});
  function draw(){var xA=al*m/p0,yA=(1-al)*m/py,u0=cdU(xA,yA,al),xC=al*m/p1,yC=yA,
     /* 보상수요: 새 가격에서 처음 효용 */ e1=u0*Math.pow(p1/al,al)*Math.pow(py/(1-al),1-al),xB=al*e1/p1,yB=(1-al)*e1/py,
     u1=cdU(xC,yC,al),e0u1=u1*Math.pow(p0/al,al)*Math.pow(py/(1-al),1-al),CV=e1-m,EV=m-e0u1,dCS=al*m*Math.log(p1/p0);
    var P=plot(c,280,{xlo:0,xhi:14,ylo:0,yhi:30,xl:'x',yl:'y',title:'A 처음 · B 보상받은 새 가격 · C 실제 새 선택'});
    P.seg(m/p0,0,0,m/py,COL.muted,1.6,[5,4]);P.seg(m/p1,0,0,m/py,COL.s,2.4);P.seg(e1/p1,0,0,e1/py,COL.m,1.6,[3,3]);
    P.fn(function(x){return Math.pow(u0/Math.pow(x,al),1/(1-al))},'rgba(168,50,159,.45)',1.5,null,.5,14);
    P.dot(xA,yA,COL.muted,5,'A');P.dot(xB,yB,COL.m,5,'B',8,14);P.dot(xC,yC,COL.g,6,'C',-8,-8);
    stamp(P.ctx,P.W,'코브-더글러스 예시');
    K([[f1(xA,2)+' → '+f1(xC,2),'x 수량 A → C','i'],[f1(xB-xA,2)+' / '+f1(xC-xB,2),'대체효과 / 소득효과','m'],[f1(CV,1)+' / '+f1(EV,1),'보상변화 CV / 동등변화 EV','a'],[f1(dCS,1),'수요곡선 왼쪽 면적(소비자잉여 감소)','g']]);
    E('대체효과 A→B: 같은 만족을 유지하며 상대가격만 바뀜 · 소득효과 B→C: 실질소득이 줄어든 몫 · 정상재라 <b>EV ≤ ΔCS ≤ CV</b>: '+f1(EV,1)+' ≤ '+f1(dCS,1)+' ≤ '+f1(CV,1));
    I([['g','가격이 오르면 x가 줄어드는 이유는 두 가지예요. 상대적으로 비싸져서 덜 사는 대체효과, 같은 돈으로 살 수 있는 양이 줄어서 덜 사는 소득효과.'],['a','"가격 인상으로 얼마를 잃었나"는 기준에 따라 세 숫자가 나와요. 수요곡선 면적은 두 정확한 측정(CV·EV) 사이에 있는 근삿값입니다.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* ===== CH02 생산자 선택 ===== */
SIMS.isoquant=function(el,cfg){var c=S0(el,cfg,270,'등량곡선과 규모수익'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var A=cfg.A||1,al=cfg.al||.5,sc=1,rs=1;
  S(row,'노동 기여 α',.2,.8,.05,al,fx(2),function(v){al=v;draw()});
  S(row,'투입을 모두 몇 배로',1,3,.1,sc,function(v){return '×'+v.toFixed(1)},function(v){sc=v;draw()});
  buttons(row,'기술',[[0.8,'규모수익 체감'],[1,'불변'],[1.2,'체증']],1,function(v){rs=v;draw()});
  function q(L,K){return A*Math.pow(Math.pow(L,al)*Math.pow(K,1-al),rs)}
  function draw(){var L0=4,K0=4,q0=q(L0,K0),q1=q(L0*sc,K0*sc);var P=plot(c,270,{xlo:0,xhi:14,ylo:0,yhi:14,xl:'노동 L',yl:'자본 K',title:'등량곡선 — 같은 산출을 내는 투입 묶음'});
    [q0,q1].forEach(function(qq,i){P.fn(function(L){return Math.pow(Math.pow(qq/A,1/rs)/Math.pow(L,al),1/(1-al))},i?COL.g:COL.muted,i?2.4:1.6,i?null:[5,4],.3,14)});
    P.seg(0,0,13,13,COL.s,1,[3,3]);P.dot(L0,K0,COL.muted,5,'처음');P.dot(L0*sc,K0*sc,COL.g,6,'×'+sc.toFixed(1));
    stamp(P.ctx,P.W,'가상 단위');
    K([[f1(q0,2),'처음 산출','i'],[f1(q1,2),'투입 ×'+sc.toFixed(1)+' 뒤 산출','g'],['×'+f1(q1/q0,2),'산출 배수','a'],[f1((al/(1-al))*(K0/L0),2),'기술적 대체율 MRTS(처음 점)','m']]);
    E('q = A·(L<sup>α</sup>K<sup>1−α</sup>)<sup>'+rs+'</sup> → 투입 ×t 이면 산출 ×t<sup>'+rs+'</sup> = <i>×'+f1(q1/q0,2)+'</i>');
    I([[rs===1?'g':'a',rs===1?'투입을 두 배로 하면 산출도 정확히 두 배예요(규모수익 불변).':rs>1?'투입보다 산출이 더 빨리 늘어요(규모수익 체증). 크게 지을수록 유리한 기술이에요.':'투입을 늘려도 산출은 덜 늘어요(규모수익 체감).'],['i','등량곡선의 기울기(MRTS)는 노동 한 단위를 더 쓰면 같은 산출을 유지하며 줄일 수 있는 자본의 양이에요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

SIMS.isocost=function(el,cfg){var c=S0(el,cfg,280,'같은 산출을 가장 싸게 만드는 투입 배합'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var A=cfg.A||1,al=cfg.al||.5,w=cfg.w||4,r=cfg.r||1,q=cfg.q||10;
  S(row,'임금 w',1,10,.5,w,null,function(v){w=v;draw()});S(row,'자본 사용료 r',1,10,.5,r,null,function(v){r=v;draw()});S(row,'노동 기여 α',.2,.8,.05,al,fx(2),function(v){al=v;draw()});
  function draw(){var t=((1-al)/al)*(w/r),Ls=(q/A)*Math.pow(t,-(1-al)),Ks=t*Ls,Cs=w*Ls+r*Ks,Le=q/A,Ce=(w+r)*Le;
    var P=plot(c,280,{xlo:0,xhi:Math.max(22,Ls*1.6),ylo:0,yhi:Math.max(30,Ks*1.4,Le*2),xl:'노동 L',yl:'자본 K',title:'초록 = 등량곡선(q='+q+') · 파랑 = 최소 등비용선 · 빨강 점선 = 반반 배합의 등비용선'});
    P.fn(function(L){return Math.pow(q/A/Math.pow(L,al),1/(1-al))},COL.g,2.4,null,.4,P.o.xhi);
    P.seg(Cs/w,0,0,Cs/r,COL.s,2.2);P.seg(Ce/w,0,0,Ce/r,COL.r,1.6,[5,4]);
    P.dot(Ls,Ks,COL.fly,6,'최소비용',8,-8);P.dot(Le,Le,COL.robo,6,'반반',8,14);
    stamp(P.ctx,P.W,'가상 단위');
    K([['('+f1(Ls,1)+', '+f1(Ks,1)+')','최소비용 배합 (L, K)','g'],[f1(Cs,1),'최소 총비용','g'],[f1(Ce,1),'반반 배합 총비용','r'],[Math.round(w*Ls/Cs*100)+'%','노동비용 비중(=α)','m']]);
    E('MPₗ ÷ MPₖ = w ÷ r → K/L = [(1−α)/α]·(w/r) = <i>'+f1(t,2)+'</i> · 반반이 최적인 조건: w/r = α/(1−α) = '+f1(al/(1-al),2));
    I([[Math.abs(Ce-Cs)<.01?'g':'a',Math.abs(Ce-Cs)<.01?'지금은 상대가격이 기술 비중과 맞아서 반반 배합이 곧 최소비용이에요.':'반반 배합은 같은 산출에 '+f1(Ce-Cs,1)+'만큼 더 써요. 비싼 투입을 덜 쓰는 쪽으로 옮기면 비용이 줄어듭니다.'],['i','등비용선과 등량곡선이 맞닿는 점: 마지막 1원이 노동과 자본에서 똑같은 산출을 낼 때예요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* 경쟁기업: VC=q³/3−4q²+20q, F=30 */
SIMS.shutdown=function(el,cfg){var c=S0(el,cfg,280,'가격과 비용곡선: 공급과 조업중단'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var p=cfg.p||12,F=cfg.F||30;
  S(row,'시장가격 P',4,30,.5,p,null,function(v){p=v;draw()});S(row,'고정비 F',0,80,5,F,null,function(v){F=v;draw()});
  function MC(q){return q*q-8*q+20}function AVC(q){return q*q/3-4*q+20}function ATC(q){return AVC(q)+F/q}
  function draw(){var qs=p>=8?4+Math.sqrt(Math.max(0,p-4)):0,pr=qs>0?p*qs-(qs*qs*qs/3-4*qs*qs+20*qs)-F:-F;
    var P=plot(c,280,{xlo:0,xhi:10,ylo:0,yhi:32,xl:'생산량 q',yl:'가격·비용',title:'빨강 MC · 주황 AVC · 보라 ATC · 파랑 = 시장가격'});
    P.fn(MC,COL.r,2.2,null,2,9.8);P.fn(AVC,COL.a,2,null,.5,10);P.fn(ATC,COL.m,2,null,.8,10);P.seg(0,p,10,p,COL.s,2);
    P.dot(6,8,COL.a,4,'조업중단점',8,16);if(qs>0)P.dot(qs,p,COL.g,6,'q*='+f1(qs,2));
    stamp(P.ctx,P.W,'가상 단위');
    var atcmin=1e9;for(var q=.5;q<10;q+=.01)atcmin=Math.min(atcmin,ATC(q));
    K([[f1(qs,2),'최적 생산량','g'],[f1(pr,1),'생산할 때 이윤','i'],[f1(-F,1),'멈출 때 이윤(−F)','r'],[qs>0?(pr>=0?'생산·이익':'생산·손실 감수'):'조업중단','판단','a']]);
    E('P = MC(올라가는 쪽)에서 생산 · 단, P < AVC의 최저점(<b>8</b>)이면 멈춤 · 손익분기점 = ATC 최저점 ≈ <i>'+f1(atcmin,2)+'</i>');
    I([[qs>0&&pr<0?'a':'g',qs>0&&pr<0?'이윤이 마이너스지만 생산이 나아요. 멈춰도 고정비 '+F+'는 나가니, 가변비용을 넘는 매출로 고정비 일부를 메우는 편이 손실이 작아요.':qs>0?'가격이 평균비용보다 높아 이익이 나요.':'가격이 평균가변비용 최저점보다 낮아요. 만들수록 손해라 멈추는 게 최선입니다.'],['i','그래서 경쟁기업의 단기 공급곡선은 AVC 최저점 위쪽의 MC 곡선이에요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* ===== CH03 시장지배력 ===== */
SIMS.monopoly=function(el,cfg){var c=S0(el,cfg,270,'매출 꼭대기와 이윤 꼭대기'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var a=cfg.a||100,b=cfg.b||1,cc=cfg.c||20,d=cfg.d||1,F=cfg.F||0;
  S(row,'단위 비용 c',0,80,2,cc,null,function(v){cc=v;draw()});S(row,'비용 증가 속도 d',0,3,.25,d,fx(2),function(v){d=v;draw()});
  function R(q){return (a-b*q)*q}function V(q){return cc*q+d*q*q/2}
  function draw(){var qR=a/(2*b),qP=Math.max(0,(a-cc)/(2*b+d)),piR=R(qR)-V(qR)-F,piP=R(qP)-V(qP)-F;
    var P=plot(c,270,{xlo:0,xhi:a/b,ylo:-1500,yhi:2800,xl:'판매량 q',yl:'금액',title:'파랑 = 매출 R(q) · 빨강 = 변동비 · 초록 = 이윤'});
    P.seg(0,0,a/b,0,COL.muted,1);P.fn(R,COL.s,2.2);P.fn(V,COL.r,1.8,[5,4]);P.fn(function(q){return R(q)-V(q)-F},COL.g,2.4);
    P.dot(qR,R(qR),COL.robo,5,'매출 꼭대기');P.dot(qP,piP,COL.fly,6,'이윤 꼭대기',8,16);
    stamp(P.ctx,P.W,'가상 단위');
    K([[f1(qR,1)+' / '+f1(qP,1),'판매량: 매출최대 / 이윤최대','i'],[f1(a-b*qR,1)+' / '+f1(a-b*qP,1),'가격','m'],[f1(piR,0),'매출최대의 이윤','r'],[f1(piP,0),'이윤최대의 이윤','g']]);
    E('한계수입 MR = a − 2b·q · 한계비용 MC = c + d·q → MR = MC: q = (a − c) ÷ (2b + d) = <i>'+f1(qP,2)+'</i>');
    I([[cc===0&&d===0?'g':'a',cc===0&&d===0?'비용이 0이면 매출 꼭대기가 곧 이윤 꼭대기예요.':'매출 꼭대기에서는 마지막 한 개를 팔아 버는 돈(MR=0)이 그 한 개를 만드는 비용보다 작아요. 거기까지 팔면 이윤이 줄어요.'],['i','더 팔려면 모든 손님의 가격을 내려야 해서 MR은 가격보다 작아요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

SIMS.dwl=function(el,cfg){var c=S0(el,cfg,270,'독점·경쟁·가격상한의 잉여 비교'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var a=cfg.a||100,b=cfg.b||1,cc=cfg.c||20,cap=a;
  S(row,'단위 비용 c',0,60,2,cc,null,function(v){cc=v;draw()});
  S(row,'가격 상한(규제)',0,a,1,a,function(v){return v>=a?'없음':v},function(v){cap=v;draw()});
  function draw(){var qc=(a-cc)/b,qm=(a-cc)/(2*b),pm=a-b*qm,p,q;
    if(cap>=pm){p=pm;q=qm}else if(cap>=cc){p=cap;q=Math.min((a-cap)/b,qc)}else{p=cap;q=0}
    var CS=(a-p)*q/2+0,PS=(p-cc)*q,W0=(a-cc)*qc/2,DWL=W0-CS-PS;
    var P=plot(c,270,{xlo:0,xhi:a/b,ylo:0,yhi:a,xl:'수량',yl:'가격',title:'초록 소비자잉여 · 파랑 생산자잉여 · 빨강 사중손실'});
    P.poly([[0,a],[0,p],[q,p]],COL.g,.22);P.poly([[0,p],[0,cc],[q,cc],[q,p]],COL.s,.22);P.poly([[q,cc],[q,a-b*q],[qc,cc]],COL.r,.25);
    P.seg(0,a,a/b,0,COL.text,2.2);P.seg(0,cc,a/b,cc,COL.r,1.8);P.fn(function(x){return a-2*b*x},COL.m,1.6,[5,4],0,a/(2*b));P.lab('MR',a/(2*b)*.55,a*.42,COL.m);
    if(cap<a)P.seg(0,cap,a/b,cap,COL.a,1.5,[3,3]);P.dot(q,p,COL.a,6,'거래점');
    stamp(P.ctx,P.W,'가상 단위');
    K([[f1(q,1)+' / '+f1(qc,1),'거래량 / 경쟁 수준','i'],[f1(p,1),'가격','m'],[f1(CS,0)+' / '+f1(PS,0),'소비자 / 생산자 잉여','g'],[f1(DWL,0),'사중손실','r']]);
    E('독점: MR = MC → q = (a − c) ÷ 2b = '+f1(qm,1)+', 가격 '+f1(pm,1)+' · 경쟁: P = MC → q = '+f1(qc,1)+' · 상한이 MC와 같으면 사중손실 0');
    I([[cap>=pm?'a':'g',cap>=pm?'독점은 거래를 경쟁 수준의 절반으로 줄여요. 사라진 거래의 가치가 사중손실이에요.':'가격 상한을 MC 쪽으로 내리면 독점기업도 더 팔게 되어 사중손실이 줄어요.'],[cap<cc?'r':'i',cap<cc?'상한이 비용보다 낮으면 아무도 팔지 않아요. 규제가 너무 세면 시장이 사라집니다.':'상한은 c 근처가 좋지만, 실제로는 기업의 비용을 정확히 알기 어려워요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

SIMS.pricedisc=function(el,cfg){var c=S0(el,cfg,260,'두 손님 집단: 같은 가격 vs 다른 가격'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var a1=cfg.a1||100,b1=cfg.b1||1,a2=cfg.a2||60,b2=cfg.b2||1,cc=cfg.c||20,mode=1;
  S(row,'학생 집단의 최대 지불의사',30,100,5,a2,null,function(v){a2=v;draw()});
  buttons(row,'가격 정책',[[0,'모두 같은 가격'],[1,'집단별 가격(3급)']],1,function(v){mode=v;draw()});
  function draw(){var q1=Math.max(0,(a1-cc)/(2*b1)),q2=Math.max(0,(a2-cc)/(2*b2)),p1=a1-b1*q1,p2=a2-b2*q2,pd=(p1-cc)*q1+(p2-cc)*q2;
    /* 단일가격: 두 수요 합산 후 이윤 최대(격자 탐색) */
    var best=-1,bp=0;for(var p=cc;p<=a1;p+=.25){var Q=Math.max(0,(a1-p)/b1)+Math.max(0,(a2-p)/b2),pi=(p-cc)*Q;if(pi>best){best=pi;bp=p}}
    var u1=Math.max(0,(a1-bp)/b1),u2=Math.max(0,(a2-bp)/b2);
    var P=plot(c,260,{xlo:0,xhi:100,ylo:0,yhi:100,xl:'수량',yl:'가격',title:'파랑 = 직장인 수요 · 분홍 = 학생 수요 · 빨강 = 비용'});
    P.seg(0,a1,a1/b1,0,COL.s,2.2);P.seg(0,a2,a2/b2,0,COL.asst,2.2);P.seg(0,cc,100,cc,COL.r,1.6);
    if(mode){P.dot(q1,p1,COL.s,6,'직장인 '+f1(p1,0));P.dot(q2,p2,COL.asst,6,'학생 '+f1(p2,0),8,16)}else{P.seg(0,bp,100,bp,COL.a,1.8,[5,4]);P.dot(u1,bp,COL.s,5,'');P.dot(u2,bp,COL.asst,5,'',8,16);P.lab('같은 가격 '+f1(bp,1),62,bp+3,COL.a,'left',true)}
    stamp(P.ctx,P.W,'가상 단위');
    K([[mode?f1(p1,0)+' / '+f1(p2,0):f1(bp,1)+' / '+f1(bp,1),'가격 (직장인 / 학생)','m'],[mode?f1(q1+q2,1):f1(u1+u2,1),'총판매량','i'],[f1(best,0),'같은 가격일 때 이윤','a'],[f1(pd,0),'집단별 가격일 때 이윤','g']]);
    E('집단별 MRᵢ = MC: 탄력적인(값에 민감한) 집단에 낮은 가격 · 단일가격은 두 수요를 더한 뒤 MR = MC');
    I([['g','값에 민감한 학생에게는 낮게, 덜 민감한 직장인에게는 높게 받으면 이윤이 '+f1(pd-best,0)+' 늘어요.'],[u2<=0&&!mode?'a':'i',u2<=0&&!mode?'같은 가격에서는 학생이 아예 사지 않아요. 집단별 가격이 학생 거래를 되살릴 수도 있어요.':'가격차별은 되팔기를 막을 수 있고 집단을 구별할 수 있을 때만 가능해요(학생증, 시간대 등).']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* ===== CH04 게임이론 ===== */
SIMS.pd=function(el,cfg){var c=S0(el,cfg,250,'두 연구원의 보수표와 최선의 대응'),row=rows(el),K=kpis(el,3),I=insight(el);
  var g=cfg.g||5,h0=cfg.h||5,Pp=cfg.P||5;
  S(row,'일탈의 추가 보수 g',0,10,1,g,null,function(v){g=v;draw()});S(row,'협조의 추가 보수 h',1,10,1,h0,null,function(v){h0=v;draw()});
  function draw(){var C=Pp+h0,D=C+g,Sx=0,W=fit(c,250),ctx=c.getContext('2d');ctx.clearRect(0,0,W,250);grid(ctx,W,250);
    var cx=W/2,x0=cx-150,y0=40,cw=150,ch=80,M=[[[C,C],[Sx,D]],[[D,Sx],[Pp,Pp]]];
    txt(ctx,'B: 협조',x0+cw*.5,y0-10,COL.fly,12,'center',true);txt(ctx,'B: 일탈',x0+cw*1.5,y0-10,COL.robo,12,'center',true);
    txt(ctx,'A: 협조',x0-10,y0+ch*.5+4,COL.fly,12,'right',true);txt(ctx,'A: 일탈',x0-10,y0+ch*1.5+4,COL.robo,12,'right',true);
    for(var i=0;i<2;i++)for(var j=0;j<2;j++){var nash=(i===1&&j===1&&g>=0)||(g<0);var X0=x0+j*cw,Y0=y0+i*ch;ctx.fillStyle=(i===1&&j===1)?'rgba(210,63,44,.10)':(i===0&&j===0?'rgba(19,138,82,.08)':'#fff');ctx.fillRect(X0,Y0,cw,ch);ctx.strokeStyle=COL.rule;ctx.strokeRect(X0,Y0,cw,ch);
      txt(ctx,'A '+M[i][j][0]+'  ·  B '+M[i][j][1],X0+cw/2,Y0+ch/2+5,COL.text,14,'center',true);}
    txt(ctx,'빨강 = 서로 일탈(내시균형) · 초록 = 서로 협조',cx,y0+2*ch+26,COL.muted,11,'center');
    stamp(ctx,W,'가상 보수');
    K([[C+' / '+D,'협조 C / 일탈 D (상대 협조 시)','g'],[Pp+' / '+Sx,'일탈 P / 혼자 협조 S (상대 일탈 시)','r'],[g>0?'일탈':'무차별','상대가 무엇을 하든 유리한 선택','a']]);
    I([[g>0?'r':'g',g>0?'상대가 협조하면 일탈이 '+g+' 더 받고, 상대가 일탈해도 일탈이 '+Pp+' 더 받아요. 그래서 둘 다 일탈합니다(내시균형).':'g가 0이면 상대가 협조할 때 일탈해도 더 얻는 게 없어요.'],['a','둘 다 협조하면 '+C+'씩으로 더 좋은데도, 한 번만 하는 게임에서는 그 결과가 지켜지지 않아요. 이것이 죄수의 딜레마입니다.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

SIMS.cournot=function(el,cfg){var c=S0(el,cfg,260,'기업 수에 따른 가격과 생산량'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var a=cfg.a||100,b=cfg.b||1,cc=cfg.c||20,n=cfg.n||2;
  S(row,'경쟁 기업 수 n',1,12,1,n,null,function(v){n=v;draw()});S(row,'단위 비용 c',0,60,2,cc,null,function(v){cc=v;draw()});
  function pr(k){return cc+(a-cc)/(k+1)}
  function draw(){var Q=n*(a-cc)/(b*(n+1)),p=pr(n),pi=(p-cc)*Q/n;var P=plot(c,260,{xlo:1,xhi:12,ylo:0,yhi:a*.75,xl:'기업 수 n',yl:'가격',title:'초록 = 쿠르노 균형 가격 · 빨강 점선 = 비용(완전경쟁 가격) · 파랑 점선 = 독점 가격'});
    P.fn(pr,COL.g,2.4,null,1,12);P.seg(1,cc,12,cc,COL.r,1.6,[5,4]);P.seg(1,pr(1),12,pr(1),COL.s,1.4,[3,3]);P.dot(n,p,COL.a,6,'n='+n);
    stamp(P.ctx,P.W,'가상 단위');
    K([[f1(p,1),'시장 가격','a'],[f1(Q,1),'총생산량','i'],[f1(pi,0),'기업 하나의 이윤','m'],[f1((p-cc)/p*100,0)+'%','가격 중 이윤 몫(마크업)','r']]);
    E('기업 i의 최선: qᵢ = (a − c − b·Q₋ᵢ) ÷ 2b → 대칭 균형 qᵢ = (a − c) ÷ [b(n + 1)] · P = c + (a − c) ÷ (n + 1)');
    I([[n===1?'a':'g',n===1?'한 기업이면 독점 가격이에요.':'기업이 '+n+'개면 각자 남의 생산량을 보고 최선의 양을 고른 결과, 가격이 독점보다 낮아져요.'],['i','기업 수가 늘수록 가격은 비용 쪽으로 다가가요. 수가 적은 과점에서는 가격이 비용보다 꽤 높게 남습니다.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

SIMS.repeated=function(el,cfg){var c=S0(el,cfg,260,'계속 협조 vs 한 번 일탈의 보수 흐름'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var d=cfg.d||.6,Pp=cfg.P||5,h0=cfg.h||5,g=cfg.g||5;
  S(row,'미래를 중시하는 정도 δ',.05,.95,.05,d,fx(2),function(v){d=v;draw()});S(row,'일탈의 추가 보수 g',1,10,1,g,null,function(v){g=v;draw()});
  function draw(){var C=Pp+h0,D=C+g,Vc=C/(1-d),Vd=D+d*Pp/(1-d),ds=g/(g+h0);var cumC=[],cumD=[],sc=0,sd=0;for(var t=0;t<12;t++){sc+=C*Math.pow(d,t);sd+=(t?Pp:D)*Math.pow(d,t);cumC.push(sc);cumD.push(sd)}
    var P=plot(c,260,{xlo:0,xhi:11,ylo:0,yhi:Math.max(Vc,Vd)*1.1,xl:'기간',yl:'누적 현재가치',title:'초록 = 계속 협조 · 주황 = 지금 일탈 후 처벌'});
    P.fn(function(t){return cumC[Math.min(11,Math.round(t))]},COL.g,2.4);P.fn(function(t){return cumD[Math.min(11,Math.round(t))]},COL.robo,2.4);
    P.seg(0,Vc,11,Vc,COL.g,1,[3,3]);P.seg(0,Vd,11,Vd,COL.robo,1,[3,3]);
    stamp(P.ctx,P.W,'가상 보수');
    K([[f1(Vc,1),'계속 협조의 현재가치','g'],[f1(Vd,1),'일탈의 현재가치','a'],[f1(ds,2),'협조가 지켜지는 최소 δ','m'],[Vc>=Vd?'협조 유지':'일탈 유혹 승','이 δ에서','i']]);
    E('V협조 = C ÷ (1 − δ) · V일탈 = D + δ·P ÷ (1 − δ) → 협조 조건 δ ≥ g ÷ (g + h) = '+g+' ÷ ('+g+' + '+h0+') = <i>'+f1(ds,2)+'</i>');
    I([[Vc>=Vd?'g':'r',Vc>=Vd?'미래를 충분히 중시하면, 오늘 한 번 더 얻는 '+g+'보다 앞으로 잃을 협조의 가치가 커요.':'δ가 '+f1(ds,2)+'보다 낮으면 미래를 가볍게 보는 셈이라 일탈이 이득이에요.'],['a','처벌(서로 일탈)은 그 자체가 내시균형이라 실제로 실행할 만해요. 이 점이 위협을 믿을 만하게 만듭니다.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* ===== CH05 일반균형과 자산 ===== */
SIMS.edgeworth=function(el,cfg){var c=S0(el,cfg,280,'두 사람 교환경제: 가격과 초과수요'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var aA=cfg.aA||.6,aB=cfg.aB||.3,wA=[8,2],wB=[2,8],p=cfg.p||1;
  S(row,'x의 상대가격 p = pₓ/pᵧ',.2,3,.05,p,fx(2),function(v){p=v;draw()});S(row,'A의 x 선호 αA',.2,.8,.05,aA,fx(2),function(v){aA=v;draw()});
  function dem(al,w,pp){var I=pp*w[0]+w[1];return [al*I/pp,(1-al)*I]}
  function draw(){var dA=dem(aA,wA,p),dB=dem(aB,wB,p),z=dA[0]+dB[0]-10,ps=(aA*wA[1]+aB*wB[1])/((1-aA)*wA[0]+(1-aB)*wB[0]);
    var P=plot(c,280,{xlo:0,xhi:10,ylo:0,yhi:10,xl:'A의 x (B는 오른쪽에서)',yl:'A의 y',title:'에지워스 상자 — 점: 처음 가진 것(ω), A·B가 원하는 곳'});
    P.seg(0,10,10,10,COL.muted,1);P.seg(10,0,10,10,COL.muted,1);
    var xa=Math.max(0,wA[0]-(10-wA[1])/p),xb=Math.min(10,wA[0]+wA[1]/p);P.fn(function(x){return wA[1]-p*(x-wA[0])},COL.s,2,null,xa,xb);P.lab('가격선(기울기 −p)',xb>8?6.2:xb-1.5,1.2,COL.s);
    P.dot(wA[0],wA[1],COL.muted,5,'ω');P.dot(dA[0],dA[1],COL.doc,6,'A가 원함');P.dot(10-dB[0],10-dB[1],COL.asst,6,'B가 원함',8,16);
    stamp(P.ctx,P.W,'가상 단위');
    K([[f1(z,2),'x의 초과수요 (원함 − 있음)',Math.abs(z)<.05?'g':'r'],[f1(ps,3),'균형 상대가격 p*','g'],['('+f1(dA[0],1)+', '+f1(dA[1],1)+')','A가 원하는 묶음','m'],['('+f1(dB[0],1)+', '+f1(dB[1],1)+')','B가 원하는 묶음','a']]);
    E('x 초과수요 = αA(p·8 + 2)/p + αB(p·2 + 8)/p − 10 → 0이 되는 p* = <i>'+f1(ps,3)+'</i> · 왈라스 법칙: x시장이 맞으면 y시장도 맞음');
    I([[Math.abs(z)<.05?'g':z>0?'r':'a',Math.abs(z)<.05?'두 사람이 원하는 점이 상자 안 같은 곳에서 만나요. 이 가격에서 두 시장이 함께 청산됩니다.':z>0?'x를 원하는 양이 있는 양보다 많아요. x가 상대적으로 싸다는 뜻이니 p를 올려 보세요.':'x가 남아돌아요. p를 내려 보세요.'],['i','가격 두 개 중 비율만 중요해요. 둘 다 두 배로 해도 선택은 같습니다.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

SIMS.intertemp=function(el,cfg){var c=S0(el,cfg,270,'오늘과 내일의 소비: 이자율과 저축'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var y1=cfg.y1||100,y2=cfg.y2||44,r=cfg.r||.1,be=cfg.be||.9;
  S(row,'이자율 r',0,.3,.01,r,function(v){return Math.round(v*100)+'%'},function(v){r=v;draw()});S(row,'참을성 β',.5,1,.05,be,fx(2),function(v){be=v;draw()});
  function draw(){var W=y1+y2/(1+r),c1=W/(1+be),c2=(y1-c1)*(1+r)+y2,s=y1-c1;
    var P=plot(c,270,{xlo:0,xhi:180,ylo:0,yhi:200,xl:'오늘 소비 c₁',yl:'내일 소비 c₂',title:'파랑 = 두 기간 예산선(기울기 −(1+r)) · 점 = 소득 그대로 쓰기'});
    P.seg(W,0,0,W*(1+r),COL.s,2.4);P.dot(y1,y2,COL.muted,5,'소득점');P.dot(c1,c2,COL.g,6,'최적');
    P.fn(function(x){var u=Math.log(c1)+be*Math.log(c2);return Math.exp((u-Math.log(x))/be)},'rgba(168,50,159,.6)',1.6,null,30,180);
    stamp(P.ctx,P.W,'가상 단위');
    K([[f1(W,1),'평생 소득의 현재가치','i'],[f1(c1,1)+' / '+f1(c2,1),'오늘 / 내일 소비','g'],[f1(s,1),s>=0?'저축':'차입','a'],[f1(1/(1+r),3),'내일 1원의 오늘 가치','m']]);
    E('현재가치 W = y₁ + y₂ ÷ (1 + r) = '+y1+' + '+y2+' ÷ '+f1(1+r,2)+' = <i>'+f1(W,1)+'</i> · ln 효용이면 c₁ = W ÷ (1 + β)');
    I([['g','내일의 돈은 이자율로 나눠 오늘 가치로 바꿔야 오늘 돈과 같은 단위로 더할 수 있어요.'],[s>=0?'i':'a',s>=0?'이자율이 오르면 저축 1원이 내일 더 많아져요. 이 예에서는 저축이 '+f1(s,1)+'이에요.':'내일 소득에 비해 오늘이 부족해서 빌려 쓰는 선택이 나왔어요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

SIMS.portfolio2=function(el,cfg){var c=S0(el,cfg,260,'두 자산 혼합 비중과 위험(분산)'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var s1=cfg.s1||10,s2=cfg.s2||25,rho=cfg.rho==null?.5:cfg.rho,w=cfg.w||.5;
  S(row,'자산 2의 흔들림 σ₂',5,30,1,s2,null,function(v){s2=v;draw()});S(row,'함께 움직이는 정도 ρ',-.95,.95,.05,rho,fx(2),function(v){rho=v;draw()});S(row,'자산 1 비중 w',0,1,.05,w,fx(2),function(v){w=v;draw()});
  function V(x){return x*x*s1*s1+(1-x)*(1-x)*s2*s2+2*x*(1-x)*rho*s1*s2}
  function draw(){var den=s1*s1+s2*s2-2*rho*s1*s2,wi=den>0?(s2*s2-rho*s1*s2)/den:1,ws=clamp(wi,0,1);
    var P=plot(c,260,{xlo:0,xhi:1,ylo:0,yhi:Math.max(V(0),V(1))*1.05,xl:'자산 1 비중 w',yl:'분산',title:'초록 = 혼합 분산 V(w) · 점 = 지금 비중 / 최소분산 / 자산 1 집중',fx:fx(1)});
    P.fn(V,COL.g,2.4);P.dot(w,V(w),COL.fly,6,'지금');P.dot(ws,V(ws),COL.g,5,'최소',8,16);P.dot(1,V(1),COL.robo,6,'집중',-8,-8);
    stamp(P.ctx,P.W,'가상 자산 · 투자 권유 아님');
    K([[f1(V(w),1),'지금 혼합의 분산','a'],[f1(V(1),1),'자산 1 집중의 분산','m'],[f1(ws,2),'최소분산 비중 w*','g'],[f1(V(ws),1),'최소 분산','g']]);
    E('V(w) = w²σ₁² + (1−w)²σ₂² + 2w(1−w)ρσ₁σ₂ → w* = (σ₂² − ρσ₁σ₂) ÷ (σ₁² + σ₂² − 2ρσ₁σ₂) = <i>'+f1(wi,3)+'</i> (0~1로 자름)');
    I([[V(w)<=V(1)?'g':'r',V(w)<=V(1)?'지금 비중은 자산 1에만 담는 것보다 덜 흔들려요.':'위험한 자산 2를 너무 많이 섞어서 오히려 더 흔들려요. 나눈다고 늘 안전해지는 건 아닙니다.'],['i','ρ가 낮을수록(반대로 움직일수록) 섞는 효과가 커요. 두 기대수익률은 같다고 두었으니 이 비교는 위험만 본 거예요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* ===== CH06 후생·시장실패·정부 ===== */
SIMS.surplus=function(el,cfg){var c=S0(el,cfg,270,'거래량을 바꿀 때의 총잉여'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var Qf=40;S(row,'거래량 Q (강제로 정함)',0,70,1,Qf,null,function(v){Qf=v;draw()});
  function draw(){var Qs=40,Ps=60,W0=(100-20)*Qs/2,q=Qf,Wq=q<=80?(80*q-q*q):0,dwl=W0-Wq;
    var P=plot(c,270,{xlo:0,xhi:80,ylo:0,yhi:100,xl:'수량 Q',yl:'가격',title:'파랑 수요 P = 100 − Q · 빨강 공급 P = 20 + Q'});
    P.poly([[0,100],[0,20],[q,20+q],[q,100-q]],COL.g,.2);if(q!==Qs)P.poly(q<Qs?[[q,100-q],[q,20+q],[Qs,Ps]]:[[Qs,Ps],[q,20+q],[q,100-q]],COL.r,.3);
    P.seg(0,100,80,20,COL.s,2.2);P.seg(0,20,80,100,COL.r,2.2);P.seg(q,0,q,100,COL.a,1.5,[3,3]);P.dot(Qs,Ps,COL.g,5,'경쟁균형');
    stamp(P.ctx,P.W,'가상 단위');
    K([[q,'정한 거래량','a'],[f1(Wq,0),'총잉여(초록)','g'],[f1(W0,0),'최대 총잉여(Q=40)','i'],[f1(dwl,0),'잃은 잉여(빨강)','r']]);
    E('총잉여 W(Q) = ∫₀^Q [(100 − x) − (20 + x)] dx = 80Q − Q² → W′ = 0 에서 Q = <i>40</i> (수요 = 공급인 곳)');
    I([[q===Qs?'g':'r',q===Qs?'경쟁균형에서 총잉여가 가장 커요. 더 사고팔 이득이 남지 않고, 손해 보는 거래도 없어요.':q<Qs?'Q가 균형보다 작으면 사고 싶은 사람과 팔고 싶은 사람이 있는데도 거래가 막혀요.':'Q가 균형보다 크면 비용이 가치보다 큰 거래까지 억지로 하는 셈이에요.'],['i','이것이 후생경제학 제1정리의 작은 그림이에요. 외부효과·시장지배력·정보 문제가 없을 때의 이야기입니다.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

SIMS.tax=function(el,cfg){var c=S0(el,cfg,280,'세금의 귀착: 구매자 가격과 판매자 수취가격'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var b=cfg.b||1,s=cfg.s||1,t=cfg.t||20,payer=cfg.payer||0;
  S(row,'수요 기울기 b',.25,4,.25,b,fx(2),function(v){b=v;draw()});S(row,'공급 기울기 s',.25,4,.25,s,fx(2),function(v){s=v;draw()});S(row,'단위당 세금 τ',0,90,2,t,null,function(v){t=v;draw()});
  buttons(row,'고지서 받는 쪽',[[0,'판매자'],[1,'구매자']],payer,function(v){payer=v;draw()});
  function draw(){var Q0=80/(b+s),P0=100-b*Q0,Q=Math.max(0,(80-t)/(b+s)),Pb=Q>0?100-b*Q:null,Ps=Q>0?20+s*Q:null,Bc=Q>0?(Pb-P0)*Q:0,Bs=Q>0?(P0-Ps)*Q:0,R=t*Q,DWL=40*Q0-(b*Q*Q/2+s*Q*Q/2+R);
    var P=plot(c,280,{xlo:0,xhi:Math.max(10,80/(Math.min(b,s))*1.05),ylo:0,yhi:110,xl:'수량',yl:'가격',title:'파랑 수요 · 빨강 공급 · 초록 세수 · 주황 사중손실'});
    if(Q>0){P.poly([[0,Pb],[Q,Pb],[Q,Ps],[0,Ps]],COL.g,.22);P.poly([[Q,Pb],[Q,Ps],[Q0,P0]],COL.a,.35)}
    P.fn(function(q){return 100-b*q},COL.s,2.2,null,0,100/b);P.fn(function(q){return 20+s*q},COL.r,2.2);
    if(payer)P.fn(function(q){return 100-b*q-t},COL.s,1.4,[5,4],0,100/b);else P.fn(function(q){return 20+s*q+t},COL.r,1.4,[5,4]);
    P.dot(Q0,P0,COL.muted,5,'세전');if(Q>0){P.dot(Q,Pb,COL.s,5,'구매자 '+f1(Pb,1));P.dot(Q,Ps,COL.r,5,'판매자 '+f1(Ps,1),8,16)}
    stamp(P.ctx,P.W,'가상 단위');
    K([[f1(Q0,1)+' → '+f1(Q,1),'거래량','i'],[f1(Bc,0)+' / '+f1(Bs,0),'가격부담: 구매자 / 판매자','m'],[f1(R,0),'세수','g'],[f1(DWL,0),'사중손실','a']]);
    E('구매자 몫 = b ÷ (b + s) = <i>'+Math.round(b/(b+s)*100)+'%</i> · 판매자 몫 = s ÷ (b + s) = '+Math.round(s/(b+s)*100)+'% — 고지서를 누가 받든 같음');
    I([['g','고지서를 판매자에서 구매자로 바꿔도 모든 숫자가 그대로예요. 부담은 법이 아니라 기울기(반응 정도)가 나눕니다.'],[b>s?'a':'i',b>s?'수요가 가파르면(가격에 덜 반응하면) 구매자가 더 많이 부담해요.':'공급이 가파르면 판매자가 더 많이 부담해요.'],[t>=80?'r':'i',t>=80?'세금이 80 이상이면 거래가 사라져 세수도 0이에요.':'세금을 올리면 세수는 처음엔 늘다가 거래가 줄면서 줄어요. 사중손실은 세금의 제곱에 가깝게 커집니다.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

SIMS.extern=function(el,cfg){var c=S0(el,cfg,270,'외부비용과 피구세'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var D=cfg.D||20,t=0;S(row,'1단위당 이웃 피해 D',0,40,2,D,null,function(v){D=v;draw()});S(row,'부과하는 세금 t',0,40,2,t,null,function(v){t=v;draw()});
  function draw(){var Qm=Math.max(0,(80-t)/2),Qo=Math.max(0,(80-D)/2),W=function(q){return 80*q-q*q-D*q},loss=W(Qo)-W(Qm);
    var P=plot(c,270,{xlo:0,xhi:60,ylo:0,yhi:110,xl:'생산량',yl:'가격·비용',title:'파랑 수요(사회적 가치) · 빨강 사적 비용 · 보라 사회적 비용 = 사적 + D'});
    P.seg(0,100,60,40,COL.s,2.2);P.seg(0,20,60,80,COL.r,2.2);P.seg(0,20+D,60,80+D,COL.m,2,[5,4]);
    P.dot(Qm,100-Qm,COL.a,6,'시장 거래');P.dot(Qo,100-Qo,COL.g,5,'사회 최적',8,16);
    stamp(P.ctx,P.W,'가상 단위');
    K([[f1(Qm,1),'시장 거래량','a'],[f1(Qo,1),'사회 최적 거래량','g'],[f1(t*Qm,0),'세수','i'],[f1(Math.abs(loss),0),'남은 후생 손실','r']]);
    E('사회 최적: 수요 = 사적 비용 + D → Q = (80 − D) ÷ 2 = <i>'+f1(Qo,1)+'</i> · 피구세 t = D 이면 시장이 스스로 그 양을 고름');
    I([[t===D?'g':'a',t===D?'세금이 피해와 같아서 시장 거래량이 사회 최적과 같아졌어요.':t<D?'세금이 피해보다 작아 아직 너무 많이 만들어요.':'세금이 피해보다 커서 이번엔 너무 적게 만들어요.'],['i','외부효과는 가격에 들어가지 않은 비용이에요. 세금, 거래 가능한 허가권, 당사자 협상(코즈) 등으로 그 비용을 가격에 넣을 수 있어요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* ===== CH07 정보경제학 ===== */
SIMS.infovalue=function(el,cfg){var c=S0(el,cfg,250,'정보 없이 vs 신호를 산 뒤의 기대비용'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var p=cfg.p||.4,L=cfg.L||50,cc=cfg.c||15,t=cfg.t||.8,f=cfg.f==null?2:cfg.f;
  S(row,'위험 확률 p',0,1,.05,p,fx(2),function(v){p=v;draw()});S(row,'신호 정확도 t',.5,1,.05,t,fx(2),function(v){t=v;draw()});S(row,'정보료 f',0,12,.5,f,null,function(v){f=v;draw()});
  function draw(){var C0=Math.min(cc,p*L),pr=p*t+(1-p)*(1-t),ps=1-pr,qr=pr>0?p*t/pr:0,qs=ps>0?p*(1-t)/ps:0,Cs=pr*Math.min(cc,L*qr)+ps*Math.min(cc,L*qs),ev=C0-Cs,epi=C0-p*Math.min(cc,L);
    var labs=['정보 없이','신호(무료)','신호+정보료','완전정보'],vals=[C0,Cs,Cs+f,p*Math.min(cc,L)],cols=[COL.fly,COL.s,COL.robo,COL.g];
    var W=fit(c,250),ctx=c.getContext('2d');ctx.clearRect(0,0,W,250);grid(ctx,W,250);dChart(c,{t:'bar',title:'기대비용 비교 (낮을수록 좋음)',vals:vals.map(function(v){return +v.toFixed(2)}),labels:labs,cols:cols,ymax:Math.max(30,C0*1.3,Cs+f+3)},250);stamp(ctx,W,'가상 단위');
    K([[f1(C0,1),'정보 없이 최선','a'],[f1(qr*100,0)+'%','위험 신호 뒤 위험 확률','m'],[f1(ev,1),'신호의 총가치(EVSI)','g'],[f1(ev-f,1),'정보료 뺀 순가치','r']]);
    E('위험 신호 뒤 확률 = p·t ÷ [p·t + (1−p)(1−t)] = <i>'+f1(qr,3)+'</i> · 정보의 가치 = 정보 없을 때 비용 − 정보 쓸 때 비용 (완전정보 상한 '+f1(epi,1)+')');
    I([[ev>f?'g':'r',ev>f?'신호가 아껴 주는 '+f1(ev,1)+'이 정보료 '+f+'보다 커서 사는 편이 유리해요.':'정보료가 신호의 가치보다 커요. 더 잘 알게 되어도 지갑에는 손해입니다.'],['i','신호를 보고도 행동이 바뀌지 않으면 그 신호의 가치는 0이에요. 정보의 가치는 "결정을 바꾸는 힘"입니다.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

SIMS.lemons=function(el,cfg){var c=S0(el,cfg,260,'중고차 시장의 역선택: 가격을 따라 품질이 무너지는 과정'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var k=cfg.k||1.5,cert=0;S(row,'사는 사람이 매기는 가치 배수 k',1,2.5,.05,k,function(v){return '×'+v.toFixed(2)},function(v){k=v;draw()});
  S(row,'품질 인증을 받은 차의 비율',0,1,.1,cert,function(v){return Math.round(v*100)+'%'},function(v){cert=v;draw()});
  function draw(){/* 품질 θ~U[0,1000]. 파는 사람 가치 θ, 사는 사람 가치 kθ. 인증 차는 품질 공개 → 그대로 거래. 미인증: 가격 p에서 θ≤p만 나옴, 평균 p/2 → 사는 사람 지불의사 k·p/2 */
    var ps=[1000],p=1000;for(var i=0;i<10;i++){p=Math.min(1000,k*p/2);ps.push(p)}var pe=k>=2?1000:0,share=(1-cert)*(pe/1000)+cert;
    var P=plot(c,260,{xlo:0,xhi:10,ylo:0,yhi:1000,xl:'반복(사는 사람이 평균 품질을 다시 따진 횟수)',yl:'미인증 차 가격',title:'초록 = 미인증 차 시장의 가격 흐름 (품질 0~1000이 고르게 섞인 출발)'});
    P.fn(function(t){return ps[Math.min(10,Math.round(t))]},COL.g,2.4);for(var j=0;j<=10;j++)P.dot(j,ps[j],COL.g,3,'');
    stamp(P.ctx,P.W,'설명용 모형');
    K([[f1(ps[10],0),'10번 뒤 미인증 차 가격','r'],[Math.round(share*100)+'%','거래되는 차의 비율','g'],[f1(k*500,0),'모두 팔 때 사는 사람의 평균 가치','i'],[k>=2?'유지':'붕괴','미인증 시장','a']]);
    E('가격 p에서는 품질 ≤ p 인 차만 나옴 → 평균 품질 p/2 → 사는 사람 지불의사 k·p/2 · k < 2 이면 매번 가격이 줄어 <i>0으로</i>');
    I([[k>=2?'g':'r',k>=2?'사는 사람이 차를 아주 높게 평가하면 평균 품질로도 거래가 유지돼요.':'좋은 차 주인은 그 가격에 팔지 않으니 나쁜 차만 남고, 그걸 아는 사는 사람은 더 깎고… 시장이 무너져요(역선택).'],[cert>0?'g':'i',cert>0?'인증(신호·검사)이 있는 차는 품질이 보여서 거래가 살아나요. 정보를 드러내는 장치가 시장을 지켜요.':'정보가 한쪽에만 있으면 서로 이득인 거래도 사라질 수 있어요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

SIMS.incentive=function(el,cfg){var c=S0(el,cfg,260,'성과급 비율과 노력·위험·총잉여'),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var r=cfg.r||2,s2=cfg.s2||.5,be=cfg.be||.5;
  S(row,'성과급 비율 β',0,1,.05,be,fx(2),function(v){be=v;draw()});S(row,'성과의 운(잡음) σ²',0,2,.1,s2,fx(1),function(v){s2=v;draw()});S(row,'직원의 위험 싫어함 r',0,4,.25,r,fx(2),function(v){r=v;draw()});
  function TS(b){return b-b*b/2-r*b*b*s2/2}
  function draw(){var bs=1/(1+r*s2),e=be,rp=r*be*be*s2/2;
    var P=plot(c,260,{xlo:0,xhi:1,ylo:-.2,yhi:.6,xl:'성과급 비율 β',yl:'총잉여',title:'초록 = 총잉여 = 노력의 성과 − 노력 비용 − 위험 비용',fx:fx(1),fy:fx(1)});
    P.seg(0,0,1,0,COL.muted,1);P.fn(TS,COL.g,2.4);P.fn(function(b){return b-b*b/2},COL.s,1.4,[5,4]);P.lab('위험 비용이 없다면',.62,.5,COL.s);
    P.dot(be,TS(be),COL.a,6,'지금');P.dot(bs,TS(bs),COL.g,5,'최적 β*',8,16);
    stamp(P.ctx,P.W,'설명용 모형');
    K([[f1(e,2),'직원이 고르는 노력(=β)','i'],[f1(rp,3),'위험 프리미엄','r'],[f1(TS(be),3),'총잉여','g'],[f1(bs,2),'최적 성과급 β*','m']]);
    E('노력 e = β (비용 e²/2일 때) · 위험 비용 = r·β²·σ²/2 → β* = 1 ÷ (1 + r·σ²) = <i>'+f1(bs,3)+'</i>');
    I([['g','성과급을 키우면 더 열심히 하지만, 운에 따라 월급이 흔들리는 위험도 직원이 떠안아요.'],[s2===0||r===0?'i':'a',s2===0||r===0?'운이 없거나 위험을 싫어하지 않으면 전부 성과급(β=1)이 최적이에요.':'성과가 운에 많이 좌우될수록, 직원이 위험을 싫어할수록 최적 성과급은 작아져요. 유인과 위험 나누기의 맞바꿈입니다.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* ===== 대결 ===== */
DUELS.sunk=function(){var a=60,b=2,c=30,Q=25,N=function(q){return a*q-b*q*q/2-c*q},qs=(a-c)/b;return {fly:N(qs),robo:N(Q),say:'앞으로의 순편익: 초파리(최적 '+qs+'회) '+N(qs)+', 주판봇(최대 '+Q+'회) '+N(Q)+'. 이미 낸 200은 두 계획 모두에서 똑같이 빠져요.'}};
DUELS.basket=function(){var m=100,px=4,py=2,al=.8,u=function(x,y){return Math.pow(x,al)*Math.pow(y,1-al)},f=u(al*m/px,(1-al)*m/py),r=u(m/(2*px),m/(2*py));return {fly:f,robo:r,say:'같은 예산 100으로, 선호에 맞춘 묶음(20, 10)의 효용 '+f.toFixed(2)+', 반반 묶음(12.5, 25)의 효용 '+r.toFixed(2)+'이에요.'}};
DUELS.mix=function(){var q=10,A=1,al=.5,w=4,r=1,t=((1-al)/al)*(w/r),L=(q/A)*Math.pow(t,-(1-al)),K=t*L,f=w*L+r*K,e=(w+r)*q/A;return {fly:f,robo:e,say:'같은 산출 10을 만드는 비용: 최소비용 배합(L '+L.toFixed(1)+', K '+K.toFixed(1)+') '+f.toFixed(1)+', 반반 배합(10, 10) '+e.toFixed(1)+'.'}};
DUELS.revpeak=function(){var a=100,b=1,c=20,d=1,R=function(q){return (a-b*q)*q},V=function(q){return c*q+d*q*q/2},qR=a/(2*b),qP=(a-c)/(2*b+d);return {fly:R(qP)-V(qP),robo:R(qR)-V(qR),say:'이윤: 초파리(MR=MC, '+qP.toFixed(1)+'개) '+(R(qP)-V(qP)).toFixed(0)+', 주판봇(매출 꼭대기, '+qR+'개) '+(R(qR)-V(qR)).toFixed(0)+'.'}};
DUELS.repeat=function(){var d=.4,P=5,h=5,g=5,C=P+h,D=C+g;return {fly:C/(1-d),robo:D+d*P/(1-d),say:'δ = 0.4일 때 현재가치: 계속 협조 '+(C/(1-d)).toFixed(2)+', 한 번 일탈 '+(D+d*P/(1-d)).toFixed(2)+'. 협조가 지켜지려면 δ ≥ 0.5가 필요해요.'}};
DUELS.diversify=function(){var s1=10,s2=25,rho=.5,w=.5,V=function(x){return x*x*s1*s1+(1-x)*(1-x)*s2*s2+2*x*(1-x)*rho*s1*s2};return {fly:V(w),robo:V(1),say:'분산: 초파리(반반 섞기) '+V(w).toFixed(1)+', 주판봇(자산 1 집중) '+V(1).toFixed(1)+'. 자산 2가 훨씬 위험해서 반반은 오히려 더 흔들려요.'}};
DUELS.incidence=function(){var b=2,s=1,t=20,Q0=80/(b+s),P0=100-b*Q0,Q=(80-t)/(b+s),Pb=100-b*Q,Bc=(Pb-P0)*Q,fly=b/(b+s)*t*Q,robo=t*Q;return {fly:Math.abs(fly-Bc),robo:Math.abs(robo-Bc),say:'실제 구매자 가격부담 '+Bc.toFixed(1)+'. 초파리 예측 '+fly.toFixed(1)+'(오차 '+Math.abs(fly-Bc).toFixed(1)+'), 주판봇 예측 '+robo.toFixed(1)+'(구매자가 고지서를 받으니 전부, 오차 '+Math.abs(robo-Bc).toFixed(1)+').'}};
DUELS.info=function(){function cost(f){var p=.4,L=50,c=15,t=.8,C0=Math.min(c,p*L),pr=p*t+(1-p)*(1-t),ps=1-pr,qr=p*t/pr,qs=p*(1-t)/ps,Cs=pr*Math.min(c,L*qr)+ps*Math.min(c,L*qs);return {fly:C0,robo:Cs+f}}var A=cost(2),B=cost(8);
  return {cond:true,condA:{label:'정보료 2일 때',fly:A.fly,robo:A.robo},condB:{label:'정보료 8일 때',fly:B.fly,robo:B.robo},fly:A.fly,robo:A.robo,say:'기대비용: 정보료 2면 초파리 '+A.fly.toFixed(1)+' vs 주판봇 '+A.robo.toFixed(1)+', 정보료 8이면 '+B.fly.toFixed(1)+' vs '+B.robo.toFixed(1)+'. 승패가 정보료에 따라 뒤집혀요.'}};
