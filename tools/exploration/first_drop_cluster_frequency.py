# Exploratory first-drop analysis only (no cascades, no payouts). Seeded.
import random, sys
def run(weights, minc, n, seed=20261123, R=5, C=6):
    rng = random.Random(seed); syms = list(range(len(weights)))
    hit = 0; big = {}
    for _ in range(n):
        g = rng.choices(syms, weights, k=R*C); seen = [False]*(R*C); best = 0
        for i in range(R*C):
            if seen[i]: continue
            s = g[i]; st=[i]; seen[i]=True; sz=0
            while st:
                p=st.pop(); sz+=1; r,c=divmod(p,C)
                for q,ok in ((p-C,r>0),(p+C,r<R-1),(p-1,c>0),(p+1,c<C-1)):
                    if ok and not seen[q] and g[q]==s: seen[q]=True; st.append(q)
            best=max(best,sz)
        if best>=minc: hit+=1
    return hit/n
N=300000
cases = {
 "5 sym uniform": [1]*5,
 "5 sym skewed 30/25/20/15/10": [30,25,20,15,10],
 "5 sym skewed + 8% specials(as blockers)": [27.6,23,18.4,13.8,9.2,8],
 "7 sym uniform": [1]*7,
 "7 sym skewed 24/20/17/14/11/8/6": [24,20,17,14,11,8,6],
}
for name,w in cases.items():
    print(f"{name:45s}", " ".join(f"min{m}: {run(w,m,N)*100:6.2f}%" for m in (5,6,8)))
