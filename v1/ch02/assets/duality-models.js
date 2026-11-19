(function(g){'use strict';
function cost(w,r,q){return q*q*w*r/(w+r)}
function profit(p,w,r){return p*p*(1/w+1/r)/4}
function solve(s){const {w,r,q,p}=s;return{C:cost(w,r,q),Lc:(q*r/(w+r))**2,Kc:(q*w/(w+r))**2,Q:p*(1/w+1/r)/2,L:(p/(2*w))**2,K:(p/(2*r))**2,pi:profit(p,w,r)}}
function diff(f,x){const h=1e-4*Math.max(1,x);return (f(x+h)-f(x-h))/(2*h)}
function audit(s){const a=solve(s),{w,r,q,p,t}=s;const w2=w*2,mid=(w+w2)/2;return{shephard:diff(v=>cost(v,r,q),w)-a.Lc,hotelling:diff(v=>profit(v,w,r),p)-a.Q,costConcavity:cost(mid,r,q)-(cost(w,r,q)+cost(w2,r,q))/2,profitConvexity:(profit(p,w,r)+profit(2*p,w,r))/2-profit(1.5*p,w,r),costHomogeneity:cost(t*w,t*r,q)-t*a.C,profitHomogeneity:profit(t*p,t*w,t*r)-t*a.pi,cww:-2*q*q*r*r/(w+r)**3,cwr:2*q*q*w*r/(w+r)**3,crr:-2*q*q*w*w/(w+r)**3}}
const plans=[{L:0,Q:0},{L:2,Q:4},{L:6,Q:5}];
function discrete(p,w){const values=plans.map(x=>p*x.Q-w*x.L),pi=Math.max(...values);return{values,pi,indices:values.map((v,i)=>Math.abs(v-pi)<1e-8?i:-1).filter(i=>i>=0)}}
function frontier(L){return L<2-1e-10?0:L<6-1e-10?4:5}
function hull(L){return L<=2?2*L:L<=6?4+(L-2)/4:5}
const api={cost,profit,solve,diff,audit,plans,discrete,frontier,hull};if(typeof module!=='undefined')module.exports=api;g.Duality=api;
})(typeof window!=='undefined'?window:globalThis);
