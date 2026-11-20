---
name: doomer-agent
description: Study a batch of saved short-form videos (Instagram reels, TikToks, YouTube Shorts) and turn what they teach into a few reusable skills. Use when someone shares video links or a saved collection and wants their agent to learn from them.
---

# Doomer Agent

Review the saved videos the user has not had time to revisit. Extract practical techniques worth repeating and turn them into reusable skills.

## 1. Before you start

Collect any missing essentials in a single message:

- **What job the skills are for.** "Editing my Instagram reels" or "writing cold emails for my agency." This matters more than anything else. Skills built for a specific job are useful; skills built for "content" are generic.
- **Where the videos are.** A list of links, or the name of a saved collection.
- **Anything about their style you should respect.** Their existing preferences win over whatever the videos say.

If they only gave you links and it's obvious what the job is, skip the questions and start.

Tell them up front that going through video uses a good amount of usage, and suggest starting with 5 to 15 videos on one topic.

## 2. Get each video

Work through these access options in order, stopping at the first that succeeds:

1. **Through an available browser tool.** Use Claude in Chrome in Claude, or a connected browser/computer-use tool in Codex. Check which tools are actually available; this skill does not add browser access. Use the person's logged-in browser when direct access is blocked. Open each link, read the caption, and grab the lowest-quality video and audio the page loads. If Chrome blocks multiple downloads from one page, bundle the files into one download.
2. **From their collection directly.** If they named a collection instead of pasting links, open it in their browser and work through it. Skip anything that isn't about the job (memes, ads, off-topic posts) and tell them what you skipped.
3. **Local files or text.** If browser access is unavailable, work from video files the person provides using available local tools. Otherwise ask them to paste the caption and a transcript. Say that you'll miss anything that's only shown on screen.

Keep the files only as long as you need them. Delete only temporary files you created or downloaded for this task when you're done, and tell them you did. Keep user-provided originals and generated skills.

## 3. Study each video

Record the following for each video:

- **Transcript.** Transcribe the audio with whatever speech-to-text you have.
- **Frames.** Pull frames every half second for the first 3 seconds, then evenly through the rest. Look at the on-screen text, cuts, graphics, and layout. The first 3 seconds usually carry the hook, so look closely there.
- **Caption and CTA.** What it asks the viewer to do.
- **The actual teaching.** What would someone do differently after watching it? Write it as steps or rules, not a summary.

Exclude videos without actionable teaching, and identify each exclusion with a reason.

## 4. Turn it into skills

- **Group by job, not by video.** Aim for 2 to 4 skills that cover the work start to finish (for content: write it, check it, edit it). Don't make one skill per video.
- **Keep what's specific.** Numbers, steps, exact phrasing, timing, tools. Cut motivational filler and anything that would be true of any video on the topic.
- **Respect their style.** Where a video's advice clashes with how the person already works, keep their way and note the clash, with how the skill handles it.
- **Credit the source.** In each skill, list which videos each technique came from, with links.
- **Write it so it can be used cold.** A new chat with no context should be able to follow the skill.

Each skill is a folder with a `SKILL.md`. Start the file with frontmatter:

```
---
name: short-kebab-case-name
description: One sentence on what it does and when to use it.
---
```

Then the instructions: when to use it, the steps, the rules, what the output looks like, and the sources.

## 5. Deliver the skills

- Offer the skills for review as folders containing `SKILL.md`. In Codex, save approved skills under `.agents/skills/<skill-name>/SKILL.md` in the target project; use `~/.agents/skills/` only when the person wants them available across projects. In Claude, provide a ZIP for each skill folder to upload under Customize > Skills (with code execution enabled).
- Write a short report: each skill, what it's for, one example prompt that triggers it, and a table of every video with what it taught and which skill it went into.
- Suggest running it again when they've saved more videos, and offer to update the existing skills instead of making new ones.
