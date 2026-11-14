# Career Tailoring Kit

One message in, tailored application out. Read `docs/career/CAREER_CONTEXT.md` first; it holds the facts. Never invent experience beyond it.

## How a tailoring request works
The user sends one message with a job posting (text or URL) and, usually, a draft cover email.
1. Read the posting. If the URL is blocked, ask for the text.
2. Pick the base template:
   - `templates/resume_eu_it.html` for German or EU English-speaking IT Specialist roles.
   - `templates/resume_en_base.html` for product, FinTech and GCC roles.
   - `templates/grant_brief.md` for HRF and other grants (a grant needs a project brief, not a CV).
3. Copy it to `variants/<company-role>/resume.html` and tailor: headline, summary, bullet order, skills keywords from the posting. Keep it to one page.
4. Build: `RESUME_PHONE="..." python3 career/build.py career/variants/<company-role>/resume.html`. Output lands in `career/out/` (git-ignored). Ask the user for the phone number if it is needed; it is kept out of this public repo.
5. Hone the user's draft email: keep their voice, cut filler, no em dashes, no pipes, no semicolon chains, no AI-sounding phrasing. Save it as `variants/<company-role>/email.md`.
6. Send the PDF, DOCX and the email text to the user. List gaps between the posting and the CV honestly.

## Style rules (from the user)
- No marks that read as AI output: no em dashes, no pipes, no guillemets, no decorative symbols, minimal spacing.
- Persian CVs are written natively, never translated.
- Job application email: aria.sarrafzadeh@gmail.com.

## Germany and EU IT Specialist route
- An interview does not replace the degree for the visa. The legal route is the EU Blue Card for IT specialists without a degree: at least 3 years of IT work experience in the last 7 years, a job offer at or above the reduced salary threshold (reported as about EUR 45,934 gross per year for 2026; verify on make-it-in-germany.com), and Federal Employment Agency approval.
- Evidence needed: employer references, payslips or insurance records, and project descriptions covering 3+ years of IT work.
- The degree certificate is unavailable, so the EU template says "Software Engineering studies, all coursework completed". Do not claim a completed degree on EU applications.

## Build requirements
Node with Playwright (preinstalled in cloud sessions) and `pip install python-docx`.
