#!/usr/bin/env python3
import re

path = "public/index-landing.html"
with open(path, "r", encoding="utf-8") as f:
    html = f.read()

# --- FIX 1: BOOK MY VISIT → ENQUIRE NOW ---
html = html.replace(
    '<button type="submit" class="form-submit" id="form-submit-btn">BOOK MY VISIT</button>',
    '<button type="submit" class="form-submit" id="form-submit-btn">ENQUIRE NOW</button>'
)

# --- FIX 2: Remove "Board-supervised" and "ISO 9001" references ---
# Meta description line 9
html = html.replace(
    'content="Board-supervised wellness estate in Kanjirappally, Kerala.',
    'content="Wellness estate in Kanjirappally, Kerala.'
)
# JSON-LD line 46
html = html.replace(
    '"Premium integrated retirement and wellness estate in Kanjirappally, Kerala. Board-supervised, ISO 9001 certified, 100% solar net-zero.",',
    '"Premium integrated retirement and wellness estate in Kanjirappally, Kerala. 100% solar net-zero.",'
)
# Hero text line 1000
html = html.replace(
    '<p class="hero-h2" style="text-align:center">Board-supervised · ISO 9001 · <em>Net-Zero Solar</em></p>',
    '<p class="hero-h2" style="text-align:center"><em>Net-Zero Solar</em></p>'
)
# Paragraph line 1246
html = html.replace(
    'Board-supervised share-deposit programmes with predictable returns.',
    'Share-deposit programmes with predictable returns.'
)

# --- FIX 3: Make hero-text-backing transparent ---
# Desktop
html = html.replace(
    '.hero-text-backing{background:rgba(25,29,35,.55);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:clamp(24px,3.5vw,40px) clamp(28px,4vw,48px);max-width:100%;overflow:visible}',
    '.hero-text-backing{background:transparent;border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:clamp(24px,3.5vw,40px) clamp(28px,4vw,48px);max-width:100%;overflow:visible}'
)
# Mobile override line ~278
html = html.replace(
    '.hero-text-group .hero-text-backing{padding:18px 14px!important;border-radius:14px!important;background:rgba(25,29,35,.5)!important}',
    '.hero-text-group .hero-text-backing{padding:18px 14px!important;border-radius:14px!important;background:transparent!important}'
)
# Tablet override line ~349
html = html.replace(
    '.hero-text-group .hero-text-backing{padding:14px 10px!important;border-radius:12px!important;background:rgba(25,29,35,.6)!important}',
    '.hero-text-group .hero-text-backing{padding:14px 10px!important;border-radius:12px!important;background:transparent!important}'
)

# --- FIX 4: Move coordinators outside footer with light bg + dark cards ---
old_coordinators = '''    <!-- Country Coordinators -->
    <div style="border-top:1px solid rgba(255,255,255,.06);padding-top:32px;margin-bottom:32px">
      <h4 style="text-align:center;margin-bottom:24px">Global Country Coordinators</h4>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;text-align:center">
        <div><span style="font-size:20px">🇦🇺</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">Australia</div><div style="font-size:13px;color:var(--text-muted)">Vipin Augustine<br><a href="tel:+61415934654" style="color:var(--accent-gold)">+61 415 934 654</a></div></div>
        <div><span style="font-size:20px">🇦🇺</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">Australia</div><div style="font-size:13px;color:var(--text-muted)">Aneesh James<br><a href="tel:+61432896323" style="color:var(--accent-gold)">+61 432 896 323</a></div></div>
        <div><span style="font-size:20px">🇨🇦</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">Canada</div><div style="font-size:13px;color:var(--text-muted)">Jacob Antony<br><a href="tel:+14038708524" style="color:var(--accent-gold)">+1 403 870 8524</a></div></div>
        <div><span style="font-size:20px">🇩🇪</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">Germany</div><div style="font-size:13px;color:var(--text-muted)">Roy Joseph<br><a href="tel:+393517552646" style="color:var(--accent-gold)">+39 351 755 2646</a></div></div>
        <div><span style="font-size:20px">🇮🇳</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">India</div><div style="font-size:13px;color:var(--text-muted)">Fr. Mathew Puthumana<br><a href="tel:+919447080356" style="color:var(--accent-gold)">+91 94470 80356</a></div></div>
        <div><span style="font-size:20px">🇮🇳</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">India</div><div style="font-size:13px;color:var(--text-muted)">Thomas Abraham<br><a href="tel:+917356927730" style="color:var(--accent-gold)">+91 73569 27730</a></div></div>
        <div><span style="font-size:20px">🇮🇳</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">India</div><div style="font-size:13px;color:var(--text-muted)">Paul Jose<br><a href="tel:+91940939936" style="color:var(--accent-gold)">+91 94093 9936</a></div></div>
        <div><span style="font-size:20px">🇮🇹</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">Italy</div><div style="font-size:13px;color:var(--text-muted)">Tomy George<br><a href="tel:+393283688700" style="color:var(--accent-gold)">+39 328 368 8700</a></div></div>
        <div><span style="font-size:20px">🇮🇱</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">Israel</div><div style="font-size:13px;color:var(--text-muted)">Beena Joseph<br><a href="tel:+972556800609" style="color:var(--accent-gold)">+972 55 680 0609</a></div></div>
        <div><span style="font-size:20px">🇮🇪</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">Ireland</div><div style="font-size:13px;color:var(--text-muted)">Ashwin Tomy<br><a href="tel:+353892620965" style="color:var(--accent-gold)">+353 89 262 0965</a></div></div>
        <div><span style="font-size:20px">🇰🇼</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">Kuwait</div><div style="font-size:13px;color:var(--text-muted)">Nixon George<br><a href="tel:+96566899495" style="color:var(--accent-gold)">+965 6689 9495</a></div></div>
        <div><span style="font-size:20px">🇸🇦</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">Saudi Arabia</div><div style="font-size:13px;color:var(--text-muted)">Denny Joseph<br><a href="tel:+966506467103" style="color:var(--accent-gold)">+966 50 646 7103</a></div></div>
        <div><span style="font-size:20px">🇴🇲</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">Oman</div><div style="font-size:13px;color:var(--text-muted)">Jobin George<br><a href="tel:+919847043715" style="color:var(--accent-gold)">+91 98470 43715</a></div></div>
        <div><span style="font-size:20px">🇬🇧</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">United Kingdom</div><div style="font-size:13px;color:var(--text-muted)">Sony Chacko<br><a href="tel:+447723306974" style="color:var(--accent-gold)">+44 7723 306 974</a></div></div>
        <div><span style="font-size:20px">🇦🇪</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">UAE</div><div style="font-size:13px;color:var(--text-muted)">Rajeev Abraham<br><a href="tel:+971505786471" style="color:var(--accent-gold)">+971 50 578 6471</a></div></div>
        <div><span style="font-size:20px">🇦🇪</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">UAE</div><div style="font-size:13px;color:var(--text-muted)">Binoj Kurian<br><a href="tel:+971558828941" style="color:var(--accent-gold)">+971 55 882 8941</a></div></div>
      </div>
    </div>'''

new_coordinators = '''</div>
</footer>

<!-- COUNTRY COORDINATORS — light strip with dark cards -->
<section class="coordinators-strip" style="background:var(--bg-body);padding:48px 0">
  <div class="container">
    <h4 style="text-align:center;margin-bottom:32px;color:var(--text-heading)">Global Country Coordinators</h4>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;text-align:center">
      <div style="background:var(--bg-dark);border-radius:12px;padding:18px 12px"><span style="font-size:20px">🇦🇺</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">Australia</div><div style="font-size:13px;color:var(--text-muted)">Vipin Augustine<br><a href="tel:+61415934654" style="color:var(--accent-gold)">+61 415 934 654</a></div></div>
      <div style="background:var(--bg-dark);border-radius:12px;padding:18px 12px"><span style="font-size:20px">🇦🇺</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">Australia</div><div style="font-size:13px;color:var(--text-muted)">Aneesh James<br><a href="tel:+61432896323" style="color:var(--accent-gold)">+61 432 896 323</a></div></div>
      <div style="background:var(--bg-dark);border-radius:12px;padding:18px 12px"><span style="font-size:20px">🇨🇦</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">Canada</div><div style="font-size:13px;color:var(--text-muted)">Jacob Antony<br><a href="tel:+14038708524" style="color:var(--accent-gold)">+1 403 870 8524</a></div></div>
      <div style="background:var(--bg-dark);border-radius:12px;padding:18px 12px"><span style="font-size:20px">🇩🇪</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">Germany</div><div style="font-size:13px;color:var(--text-muted)">Roy Joseph<br><a href="tel:+393517552646" style="color:var(--accent-gold)">+39 351 755 2646</a></div></div>
      <div style="background:var(--bg-dark);border-radius:12px;padding:18px 12px"><span style="font-size:20px">🇮🇳</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">India</div><div style="font-size:13px;color:var(--text-muted)">Fr. Mathew Puthumana<br><a href="tel:+919447080356" style="color:var(--accent-gold)">+91 94470 80356</a></div></div>
      <div style="background:var(--bg-dark);border-radius:12px;padding:18px 12px"><span style="font-size:20px">🇮🇳</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">India</div><div style="font-size:13px;color:var(--text-muted)">Thomas Abraham<br><a href="tel:+917356927730" style="color:var(--accent-gold)">+91 73569 27730</a></div></div>
      <div style="background:var(--bg-dark);border-radius:12px;padding:18px 12px"><span style="font-size:20px">🇮🇳</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">India</div><div style="font-size:13px;color:var(--text-muted)">Paul Jose<br><a href="tel:+91940939936" style="color:var(--accent-gold)">+91 94093 9936</a></div></div>
      <div style="background:var(--bg-dark);border-radius:12px;padding:18px 12px"><span style="font-size:20px">🇮🇹</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">Italy</div><div style="font-size:13px;color:var(--text-muted)">Tomy George<br><a href="tel:+393283688700" style="color:var(--accent-gold)">+39 328 368 8700</a></div></div>
      <div style="background:var(--bg-dark);border-radius:12px;padding:18px 12px"><span style="font-size:20px">🇮🇱</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">Israel</div><div style="font-size:13px;color:var(--text-muted)">Beena Joseph<br><a href="tel:+972556800609" style="color:var(--accent-gold)">+972 55 680 0609</a></div></div>
      <div style="background:var(--bg-dark);border-radius:12px;padding:18px 12px"><span style="font-size:20px">🇮🇪</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">Ireland</div><div style="font-size:13px;color:var(--text-muted)">Ashwin Tomy<br><a href="tel:+353892620965" style="color:var(--accent-gold)">+353 89 262 0965</a></div></div>
      <div style="background:var(--bg-dark);border-radius:12px;padding:18px 12px"><span style="font-size:20px">🇰🇼</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">Kuwait</div><div style="font-size:13px;color:var(--text-muted)">Nixon George<br><a href="tel:+96566899495" style="color:var(--accent-gold)">+965 6689 9495</a></div></div>
      <div style="background:var(--bg-dark);border-radius:12px;padding:18px 12px"><span style="font-size:20px">🇸🇦</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">Saudi Arabia</div><div style="font-size:13px;color:var(--text-muted)">Denny Joseph<br><a href="tel:+966506467103" style="color:var(--accent-gold)">+966 50 646 7103</a></div></div>
      <div style="background:var(--bg-dark);border-radius:12px;padding:18px 12px"><span style="font-size:20px">🇴🇲</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">Oman</div><div style="font-size:13px;color:var(--text-muted)">Jobin George<br><a href="tel:+919847043715" style="color:var(--accent-gold)">+91 98470 43715</a></div></div>
      <div style="background:var(--bg-dark);border-radius:12px;padding:18px 12px"><span style="font-size:20px">🇬🇧</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">United Kingdom</div><div style="font-size:13px;color:var(--text-muted)">Sony Chacko<br><a href="tel:+447723306974" style="color:var(--accent-gold)">+44 7723 306 974</a></div></div>
      <div style="background:var(--bg-dark);border-radius:12px;padding:18px 12px"><span style="font-size:20px">🇦🇪</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">UAE</div><div style="font-size:13px;color:var(--text-muted)">Rajeev Abraham<br><a href="tel:+971505786471" style="color:var(--accent-gold)">+971 50 578 6471</a></div></div>
      <div style="background:var(--bg-dark);border-radius:12px;padding:18px 12px"><span style="font-size:20px">🇦🇪</span><div style="font-size:14px;color:#fff;font-weight:600;margin-top:4px">UAE</div><div style="font-size:13px;color:var(--text-muted)">Binoj Kurian<br><a href="tel:+971558828941" style="color:var(--accent-gold)">+971 55 882 8941</a></div></div>
    </div>
  </div>
</section>

<!-- FOOTER (outside main — correct semantic structure) -->'''

html = html.replace(old_coordinators, new_coordinators)

with open(path, "w", encoding="utf-8") as f:
    f.write(html)

print("index-landing.html updated successfully.")
