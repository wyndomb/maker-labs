# CLAUDE.md Generator

Give Claude (and Codex) an operating manual for any project, so it knows what the project is for, where things live, and what good work looks like, without you explaining it every session.

## What it does

It scans your project folder, works out four things, and proposes instructions built around them:

- **Work**: the job the project exists to do, such as writing a weekly newsletter or delivering client reports.
- **Input**: the material that job starts from.
- **Output**: what should exist when the job is done, and where it is saved.
- **Key Standard**: the one requirement the output must meet.

You see a proposal first, with every point marked as observed in your files, inferred, or unknown, plus a few questions about what it couldn't tell. Nothing is written until you approve. Then it creates or updates `CLAUDE.md` (read by Claude) and `AGENTS.md` (read by Codex), kept in sync, with rules, playbooks for repeated tasks, the files to read first, and a map of where work goes.

It works for code and non-code projects alike: a newsletter folder, a client folder, a course, or a software repository.

## Where it works

- **Cowork with your project folder connected, or Claude Code:** the full version. It scans the folder and saves both files to its root.
- **Claude chat:** there is no folder to scan, so it offers a lighter version. Describe your project and share a few key files, such as a README or template, and you get both files to download. Check the paths against your real folder before using them.

## Safe by design

The scanner lists file and folder names only. It does not read file contents, skips `.env` files, keys, and credential files, ignores dependency and build folders, and stays inside the project you point it to. Claude then reads a handful of representative files, preferring templates over private records, and never copies secrets or personal details into the manuals. The scanner needs Python 3.9 or later.

## Try it

"Use CLAUDE.md Generator to set up this project folder."

"Use CLAUDE.md Generator to improve my existing CLAUDE.md and create a matching AGENTS.md."
