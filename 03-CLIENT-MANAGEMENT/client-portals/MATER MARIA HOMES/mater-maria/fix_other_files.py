#!/usr/bin/env python3

# --- about.html ---
with open("public/about.html", "r", encoding="utf-8") as f:
    html = f.read()
html = html.replace(
    'content="Board-supervised governance. ISO 9001 certified. Led by the Diocese of Kanjirappally.",',
    'content="Governance led by the Diocese of Kanjirappally.",'
)
with open("public/about.html", "w", encoding="utf-8") as f:
    f.write(html)
print("about.html updated.")

# --- terms.html ---
with open("public/terms.html", "r", encoding="utf-8") as f:
    html = f.read()
html = html.replace(
    'Operations are ISO 9001 certified and governed by a board-supervised management structure.',
    'Operations are governed by a professional management structure.'
)
with open("public/terms.html", "w", encoding="utf-8") as f:
    f.write(html)
print("terms.html updated.")

# --- invest.html ---
with open("public/invest.html", "r", encoding="utf-8") as f:
    html = f.read()
# Meta description
html = html.replace(
    'content="Board-supervised share-deposit programmes. 10% annual interest, guest privileges, and dividend participation.",',
    'content="Share-deposit programmes. 10% annual interest, guest privileges, and dividend participation.",'
)
# Hero paragraph
html = html.replace(
    'Board-supervised share-deposit programmes with 10% annual interest, guest privileges, and the option to convert to personal residence. A world-class future for your family.',
    'Share-deposit programmes with 10% annual interest, guest privileges, and the option to convert to personal residence. A world-class future for your family.'
)
# ISO 9001 trust badge
html = html.replace(
    '      <div class="trust-badge"><div class="icon">🏛️</div><div class="label">ISO 9001 Certified</div></div>\n',
    ''
)
with open("public/invest.html", "w", encoding="utf-8") as f:
    f.write(html)
print("invest.html updated.")
