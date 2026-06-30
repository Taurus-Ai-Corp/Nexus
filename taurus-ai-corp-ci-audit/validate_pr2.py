import json, subprocess
with open('fixes2.json') as f: fixes=json.load(f)
for fx in fixes:
    if 'PR' in fx:
        url=fx.split()[-1]
        repo='/'.join(url.split('/')[3:5])
        pr=url.split('/')[-1]
        r=subprocess.run(['gh','pr','view',pr,'-R',repo,'--json','state,mergeable,url','--jq','.state + " mergeable=" + (.mergeable // "unknown")'],capture_output=True,text=True)
        print(repo, pr, r.stdout.strip(), 'err=', r.stderr.strip()[:80])
