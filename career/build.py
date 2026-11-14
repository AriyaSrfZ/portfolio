"""Build a tailored resume into PDF and DOCX.

Usage: python3 career/build.py career/variants/<slug>/resume.html
Output: career/out/<slug>/Ariya_Sarrafzadeh_Resume_<SLUG>.pdf and .docx (git-ignored)
Phone: set RESUME_PHONE to include it; otherwise the phone line is left out.
"""
import html, os, re, shutil, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
src = Path(sys.argv[1]).resolve()
slug = src.parent.name if src.parent.name not in ('templates',) else src.stem
out = ROOT / 'out' / slug
out.mkdir(parents=True, exist_ok=True)
for f in (ROOT / 'fonts').glob('*.woff2'):
    shutil.copy(f, out / f.name)

page = src.read_text(encoding='utf-8')
phone = os.environ.get('RESUME_PHONE', '').strip()
page = page.replace('{{PHONE}}', phone) if phone else page.replace('<span><b>Phone</b>{{PHONE}}</span>', '')
work = out / 'resume.html'
work.write_text(page, encoding='utf-8')

name = f"Ariya_Sarrafzadeh_Resume_{slug.upper().replace('-', '_')}"
subprocess.run(['node', str(ROOT / 'render.mjs'), str(work), str(out / f'{name}.pdf')], check=True)

from docx import Document
from docx.shared import Pt, RGBColor, Mm
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

CARBON, PAT, OCH = RGBColor(0x20, 0x27, 0x25), RGBColor(0x52, 0x7C, 0x78), RGBColor(0x8A, 0x75, 0x56)
d = Document(); s = d.sections[0]; s.page_width, s.page_height = Mm(210), Mm(297)
s.left_margin = s.right_margin = Mm(16); s.top_margin = s.bottom_margin = Mm(12)
st = d.styles['Normal']; st.font.name = 'Calibri'; st.font.size = Pt(10); st.paragraph_format.space_after = Pt(1.5)

def t(x): return html.unescape(re.sub(r'<[^>]+>', '', x)).strip()
def para(parts, space=1.5, before=0):
    p = d.add_paragraph(); p.paragraph_format.space_after = Pt(space); p.paragraph_format.space_before = Pt(before)
    for txt, b, c, sz in parts:
        r = p.add_run(txt); r.bold = b; r.font.color.rgb = c
        if sz: r.font.size = Pt(sz)
    return p
def h2(x):
    p = para([(x.upper(), True, PAT, 11)], 2, 8)
    pPr = p._p.get_or_add_pPr(); bdr = OxmlElement('w:pBdr'); b = OxmlElement('w:bottom')
    for k, v in (('val', 'single'), ('sz', '4'), ('space', '1'), ('color', 'D9DEDB')): b.set(qn('w:' + k), v)
    bdr.append(b); pPr.append(bdr)

para([(t(re.search(r'<h1>(.*?)</h1>', page).group(1)), True, CARBON, 20)], 0)
para([(t(re.search(r'class="role">(.*?)</div>', page).group(1)), True, PAT, 12)], 3)
for line in re.search(r'class="contact">(.*?)</div>', page, re.S).group(1).split('<br>'):
    parts = []
    for lab, val in re.findall(r'<b>(.*?)</b>(.*?)</span>', line):
        parts += [(lab + ': ', True, OCH, None), (t(val) + '    ', False, CARBON, None)]
    if parts: para(parts)
main = page[page.index('<main>'):]
pat = r'<h2>(.*?)</h2>|<p class="sum">(.*?)</p>|<div class="jh"><h3>(.*?)</h3>(?:<span class="date">(.*?)</span>)?</div>|<div class="sub">(.*?)</div>|<li>(.*?)</li>|<div><b>(.*?)</b>(.*?)</div>'
for m in re.finditer(pat, main, re.S):
    g = m.groups()
    if g[0]: h2(t(g[0]))
    elif g[1]: para([(t(g[1]), False, CARBON, None)])
    elif g[2]: para([(t(g[2]), True, CARBON, 10.5)] + ([('    ' + t(g[3]), True, OCH, 9.5)] if g[3] else []), 0.5, 4)
    elif g[4]: para([(t(g[4]), True, PAT, 9.5)])
    elif g[5]:
        p = d.add_paragraph(style='List Bullet'); r = p.add_run(t(g[5])); r.font.color.rgb = CARBON; p.paragraph_format.space_after = Pt(1)
    elif g[6] is not None:
        parts = []
        for sg in re.split(r'(<b>.*?</b>)', '<b>' + g[6] + '</b>' + g[7]):
            if not sg: continue
            parts.append((t(sg) + ' ', True, CARBON, None) if sg.startswith('<b>') else (t(sg.replace('<br>', ' | ')) + ' ', False, CARBON, None))
        para(parts)
d.save(out / f'{name}.docx')
print(out / f'{name}.pdf'); print(out / f'{name}.docx')
