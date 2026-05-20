#!/usr/bin/env python3

path = "public/index-landing.html"
with open(path, "r", encoding="utf-8") as f:
    html = f.read()

broken = '''\n\n<!-- FOOTER (outside main — correct semantic structure) -->
    <div class="footer-bottom"><span>&copy; 2026 Mater Maria Homes. All rights reserved.</span><div class="footer-flags">🇦🇺 🇨🇦 🇩🇪 🇮🇳 🇮🇹 🇮🇱 🇮🇪 🇰🇼 🇸🇦 🇴🇲 🇬🇧 🇦🇪</div></div>
  </div>
</footer>'''

clean = '''\n\n<footer class="footer" style="padding-top:30px">
  <div class="container">
    <div class="footer-bottom"><span>&copy; 2026 Mater Maria Homes. All rights reserved.</span><div class="footer-flags">🇦🇺 🇨🇦 🇩🇪 🇮🇳 🇮🇹 🇮🇱 🇮🇪 🇰🇼 🇸🇦 🇴🇲 🇬🇧 🇦🇪</div></div>
  </div>
</footer>'''

html = html.replace(broken, clean)

with open(path, "w", encoding="utf-8") as f:
    f.write(html)

print("Fixed footer fragment.")
