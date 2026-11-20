/* Pure model functions. All numeric examples are labelled in the HTML. */
(function(root){'use strict';
function production({q,w,r,k}){const L=q*q/k,cs=w*L+r*k,cl=2*q*Math.sqrt(w*r),Ll=q*Math.sqrt(r/w),Kl=q*Math.sqrt(w/r);return{q,w,r,k,L,cs,cl,Ll,Kl,vc:w*L,fc:r*k,mc:2*w*q/k,avc:w*q/k,ac:cs/q,al:cl/q};}
const vc=q=>12*q-3*q*q+q*q*q/3,mc=q=>12-6*q+q*q;
function profit({p,F}){const shutdown=5.25,tie=Math.abs(p-shutdown)<1e-9,q=p>shutdown?3+Math.sqrt(p-3):0,revenue=p*q,variable=vc(q),total=F+variable,pi=revenue-total,qr=revenue-variable;let lo=4.5,hi=30;for(let i=0;i<80;i++){let m=(lo+hi)/2;if(2*m*m*m/3-3*m*m-F>0)hi=m;else lo=m;}const qb=(lo+hi)/2;return{p,F,q,revenue,variable,total,pi,qr,shutdown,tie,tieQ:tie?4.5:null,breakQ:qb,breakP:mc(qb),status:q===0?(tie?'조업·중단 무차별 (표시는 중단)':'단기 조업중단'):pi>=-1e-8?'조업·경제적 이윤 0 이상':'손실이지만 조업'};}
function factors({a,A,w,s,b,output,input}){const beta=output?b:0,sigma=input?s:0;const mrp=L=>a*A/(2*Math.sqrt(L))-beta*A*A;let lo=1e-10,hi=1;while(mrp(hi)>w+2*sigma*hi)hi*=2;for(let i=0;i<100;i++){let m=(lo+hi)/2;if(mrp(m)>w+2*sigma*m)lo=m;else hi=m;}const L=(lo+hi)/2,q=A*Math.sqrt(L),price=a-beta*q,wage=w+sigma*L,mp=A/(2*Math.sqrt(L)),MR=a-2*beta*q,MRP=MR*mp,MFC=w+2*sigma*L,VMP=price*mp,revenue=price*q,cost=wage*L;return{a,A,w,s,b,output,input,beta,sigma,L,q,price,wage,mp,MR,MRP,MFC,VMP,revenue,cost,pi:revenue-cost};}
function rent({a,b,t,s,N,rate,land}){let L,wage,transfer,R;if(land){L=Math.min(N,a/b);wage=Math.max(0,a-b*N);transfer=0;R=wage*L;}else{L=Math.max(0,(a-t)/(b+s));wage=L? t+s*L:t;transfer=t*L+.5*s*L*L;R=.5*s*L*L;}return{a,b,t,s,N,rate,land,L,wage,transfer,rent:R,total:wage*L,value:R/rate,unused:land?N-L:0};}
const monopoly=(a,b,c)=>({q:a/(2*(b+c)),p:a-b*a/(2*(b+c))});
const api={production,profit,vc,mc,factors,rent,monopoly};if(typeof module!=='undefined')module.exports=api;root.ProducerModels=api;
})(typeof window!=='undefined'?window:globalThis);
