
/* 동적 대시보드: 장마다 한 화면(조절기 · 숫자 카드 4개 · 그림 2개 · 해석), 목차에서는 탭으로 8개 */
var DASHES={};
function niceTicks(lo,hi,n){var span=hi-lo||1,step=Math.pow(10,Math.floor(Math.log10(span/n))),e=span/n/step;step*=e>=5?10:e>=2?5:e>=1?2:1;var t=[],s=Math.ceil(lo/step)*step;for(var v=s;v<=hi+step*1e-6;v+=step)t.push(+v.toFixed(10));return t}
function dChart(c,spec,H){var W=fit(c,H),ctx=c.getContext('2d');ctx.clearRect(0,0,W,H);
  var L=52,R=14,T=30,B=40,pw=W-L-R,ph=H-T-B;txt(ctx,spec.title,L,18,COL.text,13,'left',true);
  if(spec.t==='fn'){spec.draw(c,H);return}
  if(spec.t==='bar'){var n=spec.vals.length,vmax=Math.max.apply(null,spec.vals.concat([0])),vmin=Math.min.apply(null,spec.vals.concat([0])),mx=spec.ymax||(vmax>0?vmax*1.18:0),mn=vmin<0?vmin*1.18:0;if(mx-mn<1e-9)mx=1;var rng=mx-mn,bw=pw/n,Y=function(v){return T+ph-(v-mn)/rng*ph},y0=Y(0);
    ctx.strokeStyle=COL.rule;ctx.beginPath();ctx.moveTo(L,y0+.5);ctx.lineTo(L+pw,y0+.5);ctx.stroke();
    if(spec.hline!=null){var hy=Y(spec.hline);ctx.save();ctx.setLineDash([5,4]);ctx.strokeStyle=COL.a;ctx.beginPath();ctx.moveTo(L,hy);ctx.lineTo(L+pw,hy);ctx.stroke();ctx.restore();txt(ctx,spec.hlabel||'',L+2,hy-5,COL.a,11,'left',true)}
    spec.vals.forEach(function(v,i){var yv=Y(v),top=Math.min(yv,y0),bh=Math.abs(yv-y0),x=L+i*bw+bw*.2;ctx.fillStyle=(spec.cols&&spec.cols[i])||COL.s;ctx.fillRect(x,top,bw*.6,Math.max(bh,1));txt(ctx,(spec.fy||String)(v),x+bw*.3,v>=0?yv-6:yv+14,COL.text,bw<44?10:12,'center',true);txt(ctx,spec.labels[i],x+(spec.pair?bw*.8:bw*.3),T+ph+16,COL.muted,11,'center')});return}
  if(spec.t==='hist'){var bins=spec.bins||30,cnt=new Array(bins).fill(0),lo=spec.lo,hi=spec.hi;spec.vals.forEach(function(v){var k=Math.floor((v-lo)/(hi-lo)*bins);if(k>=0&&k<bins)cnt[k]++});var m=Math.max.apply(null,cnt)||1;
    ctx.fillStyle=spec.c||'rgba(63,95,168,.55)';cnt.forEach(function(k,i){var bh=k/m*ph;ctx.fillRect(L+i*pw/bins+1,T+ph-bh,pw/bins-2,bh)});
    ctx.strokeStyle=COL.rule;ctx.beginPath();ctx.moveTo(L,T+ph+.5);ctx.lineTo(L+pw,T+ph+.5);ctx.stroke();niceTicks(lo,hi,5).forEach(function(t){var x=L+(t-lo)/(hi-lo)*pw;txt(ctx,(spec.fx||String)(t),x,T+ph+16,COL.muted,11,'center')});
    (spec.marks||[]).forEach(function(mk,i){var x=L+(mk.x-lo)/(hi-lo)*pw;if(x<L||x>L+pw)return;ctx.save();ctx.strokeStyle=mk.c||COL.r;ctx.setLineDash([4,3]);ctx.beginPath();ctx.moveTo(x,T);ctx.lineTo(x,T+ph);ctx.stroke();ctx.restore();txt(ctx,mk.l,x+(i%2?-4:4),T+10+(i%3)*13,mk.c||COL.r,11,i%2?'right':'left',true)});
    if(spec.xl)txt(ctx,spec.xl,L+pw,H-6,COL.muted,11,'right');return}
  /* line */
  var xs=spec.xs,x0=xs[0],x1=xs[xs.length-1],ylo=spec.ymin,yhi=spec.ymax;if(ylo==null||yhi==null){var all=[];spec.ys.forEach(function(s){s.d.forEach(function(v){if(isFinite(v))all.push(v)})});if(ylo==null)ylo=Math.min.apply(null,all);if(yhi==null)yhi=Math.max.apply(null,all);if(yhi===ylo)yhi=ylo+1;var pad=(yhi-ylo)*.08;if(spec.ymin==null)ylo-=pad;if(spec.ymax==null)yhi+=pad}
  function X(v){return spec.logx?L+(Math.log(v)-Math.log(x0))/(Math.log(x1)-Math.log(x0))*pw:L+(v-x0)/(x1-x0)*pw}function Y(v){return T+ph-(v-ylo)/(yhi-ylo)*ph}
  ctx.strokeStyle=COL.rule;ctx.lineWidth=1;niceTicks(ylo,yhi,4).forEach(function(t){var y=Y(t);ctx.beginPath();ctx.moveTo(L,y+.5);ctx.lineTo(L+pw,y+.5);ctx.stroke();txt(ctx,(spec.fy||String)(t),L-6,y+4,COL.muted,11,'right')});
  var xt=spec.logx?[1,3,10,30,100,300,1000,3000,10000,30000,100000].filter(function(v){return v>=x0&&v<=x1}):niceTicks(x0,x1,5);xt.forEach(function(t){txt(ctx,(spec.fx||String)(t),X(t),T+ph+16,COL.muted,11,'center')});
  if(spec.band){ctx.fillStyle='rgba(19,138,82,.08)';var b=spec.band,b0=clamp(X(b[0]),L,L+pw),b1=clamp(X(b[1]),L,L+pw);if(b1>b0)ctx.fillRect(b0,T,b1-b0,ph)}
  if(spec.hline!=null){ctx.save();ctx.setLineDash([5,4]);ctx.strokeStyle=COL.a;ctx.beginPath();ctx.moveTo(L,Y(spec.hline));ctx.lineTo(L+pw,Y(spec.hline));ctx.stroke();ctx.restore();txt(ctx,spec.hlabel||'',L+pw-2,Y(spec.hline)<T+16?Y(spec.hline)+14:Y(spec.hline)-5,COL.a,11,'right',true)}
  var lx=L+pw;spec.ys.forEach(function(s,si){ctx.save();ctx.strokeStyle=s.c;ctx.lineWidth=s.w||2.2;if(s.dash)ctx.setLineDash(s.dash);ctx.beginPath();var st=false;s.d.forEach(function(v,i){if(!isFinite(v)){st=false;return}var px=X(xs[i]),py=Y(clamp(v,ylo,yhi));if(!st){ctx.moveTo(px,py);st=true}else ctx.lineTo(px,py)});ctx.stroke();if(s.fill){ctx.lineTo(X(x1),Y(ylo));ctx.lineTo(X(x0),Y(ylo));ctx.closePath();ctx.globalAlpha=.12;ctx.fillStyle=s.c;ctx.fill()}ctx.restore();
    if(s.n&&spec.ys.length>1){ctx.save();ctx.font='700 11px "IBM Plex Sans KR",system-ui,sans-serif';var tw=ctx.measureText('● '+s.n).width;ctx.restore();lx-=tw+12;txt(ctx,'● '+s.n,lx+12,18,s.c,11,'left',true)}});
  if(spec.mark&&X(spec.mark.x)>=L-1&&X(spec.mark.x)<=L+pw+1){var mx_=X(spec.mark.x);ctx.save();ctx.strokeStyle=COL.r;ctx.setLineDash([4,3]);ctx.beginPath();ctx.moveTo(mx_,T);ctx.lineTo(mx_,T+ph);ctx.stroke();ctx.restore();if(spec.mark.y!=null){ctx.fillStyle=COL.r;ctx.beginPath();ctx.arc(mx_,Y(clamp(spec.mark.y,ylo,yhi)),5,0,7);ctx.fill()}if(spec.mark.l)txt(ctx,spec.mark.l,mx_+(mx_>L+pw*.7?-6:6),T+ph-8,COL.r,11,mx_>L+pw*.7?'right':'left',true)}
  if(spec.xl)txt(ctx,spec.xl,L+pw,H-4,COL.muted,11,'right');if(spec.yl)txt(ctx,spec.yl,4,T-10+0,COL.muted,11,'left')}

function Dash(el,key){var D=DASHES[key];if(!D){el.innerHTML='';return}el.innerHTML='';var p={},seed=1,ctl={},playing=false;
  var head=h('div',{class:'dhead'});head.innerHTML='<div><span class="eyebrow">동적 대시보드 · '+esc(D.tag||'')+'</span><h3>'+D.title+'</h3><p class="muted" style="font-size:14px">'+(D.sub||'')+'</p></div>';var hb=h('div',{class:'dbtns'});head.appendChild(hb);el.appendChild(head);
  var row=ctrlRow(el);var K=kpis(el,4);var g=h('div',{class:'dgrid'});el.appendChild(g);var c1=mkCanvas(g,240,D.title+' 그림 1'),c2=mkCanvas(g,240,D.title+' 그림 2');var I=insight(el);
  D.params.forEach(function(q){p[q[0]]=q[5];ctl[q[0]]=slider(row,q[1],q[2],q[3],q[4],q[5],q[6],function(v){p[q[0]]=v;draw()})});
  var pb=action(hb,'▶ 재생: '+(D.playLabel||'천천히 바꿔 보기'),function(){if(playing){playing=false;return}var q=D.params.filter(function(x){return x[0]===D.play})[0];if(!q)return;if(reduce){ctl[q[0]].set(q[3]);return}playing=true;pb.textContent='■ 멈춤';var t0=null,from=q[2],to=q[3];function step(ts){if(!playing){pb.textContent='▶ 재생: '+(D.playLabel||'천천히 바꿔 보기');return}if(!t0)t0=ts;var u=Math.min(1,(ts-t0)/4500),v=from+(to-from)*(D.playLog?(Math.pow(to/from,u)*from-from)/(to-from):u);v=Math.round(v/q[4])*q[4];ctl[q[0]].set(+v.toFixed(6));if(u<1)requestAnimationFrame(step);else{playing=false;pb.textContent='▶ 재생: '+(D.playLabel||'천천히 바꿔 보기')}}requestAnimationFrame(step)},true);
  if(D.random)action(hb,'↻ 다시 뽑기',function(){seed++;draw()});
  action(hb,'처음 값',function(){playing=false;D.params.forEach(function(q){ctl[q[0]].set(q[5])})});
  function draw(){var o=D.f(p,rng(seed*7919+13));K(o.k);dChart(c1,o.c[0],240);dChart(c2,o.c[1],240);I(o.note);c1._spec=o.c[0];c2._spec=o.c[1]}
  addMod(c1,function(dt){if(!dt&&c1._spec){dChart(c1,c1._spec,240);dChart(c2,c2._spec,240)}});draw();return {stop:function(){playing=false}}}
function initDash(){var el=$('.dash[data-dash]');if(el)Dash(el,el.dataset.dash);var tabs=$('.dtabs');if(tabs){var box=$('#dashbox'),cur=null;$$('button',tabs).forEach(function(b){b.addEventListener('click',function(){$$('button',tabs).forEach(function(x){x.setAttribute('aria-pressed','false')});b.setAttribute('aria-pressed','true');if(cur)cur.stop();cur=Dash(box,b.dataset.k);var a=$('#dashlink');if(a){a.href=b.dataset.f+'#dash';a.textContent='CH'+(+b.dataset.k)+' 해설 페이지에서 자세히 보기 →'}})});var f=$('button',tabs);if(f)f.click()}}

function rng0(){return 0}
function seqv(a,b,n){var o=[];for(var i=0;i<n;i++)o.push(a+(b-a)*i/(n-1));return o}
function logseq(a,b,n){var o=[];for(var i=0;i<n;i++)o.push(a*Math.pow(b/a,i/(n-1)));return o}
function lgam(x){var c=[76.18009172947146,-86.50532032941677,24.01409824083091,-1.231739572450155,.1208650973866179e-2,-.5395239384953e-5],y=x,t=x+5.5;t-=(x+.5)*Math.log(t);var s=1.000000000190015;for(var j=0;j<6;j++)s+=c[j]/++y;return -t+Math.log(2.5066282746310005*s/x)}
function betaPdf(x,a,b){if(x<=0||x>=1)return 0;return Math.exp((a-1)*Math.log(x)+(b-1)*Math.log(1-x)+lgam(a+b)-lgam(a)-lgam(b))}
function normCdf(z){var t=1/(1+.2316419*Math.abs(z)),d=.3989423*Math.exp(-z*z/2),p=d*t*(.3193815+t*(-.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));return z>0?1-p:p}
function P1(v){return (v*100).toFixed(1)+'%'}function P0(v){return Math.round(v*100)+'%'}
function won(v){return Math.abs(v)>=1e8?(v/1e8).toFixed(1)+'억':Math.abs(v)>=1e4?nf(Math.round(v/1e4))+'만':nf(Math.round(v))}

function F1(v,d){return Number(v).toFixed(d==null?1:d)}

