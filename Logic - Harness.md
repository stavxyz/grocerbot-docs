# Harness

What the system is now, and the standard the visual documentation reconciles against.

**This document is a template.** It has to be written for the app being documented before the first real run, because the whole method depends on it: every source gets weighed against this standard, and without it there is nothing to reconcile against. The filled-in DRAPER version sits at `03 - Example/Logic - Harness (DRAPER).md`, with its full architecture reference beside it at `03 - Example/Before-After - How Draper Runs.html`. Read them once for shape and depth, then write this one about your own system.

What it needs to hold, in whatever structure fits the system:

## 1. What the system is now

The current intended architecture, stated concretely enough that a claim from an old source can be tested against it. Name the real parts: the units of work, what triggers them, what they read, where results land, what gets logged. If the intended architecture is itself still forming, say so and state the best current aim; the reasoning Logic treats this document as the aim, not as proven fact.

## 2. Outside the system

What deliberately does not run through the main architecture: plain glue code, manual steps, third-party syncs. Naming this boundary is half the value; the hardest documentation calls are usually about whether something is a real unit of the system or just plumbing.

## 3. What it replaced

If the current architecture replaced an earlier one, describe the old shape and why it was wrong, in enough detail that the old shape is recognisable on sight in the sources. Most of what sits in `01 - Sources` will describe the old system accurately and confidently, and without this section that material gets drawn back onto the boards as if it were current.

## 4. Where the correction came from

The decisions that set the current direction: who ruled what, where that ruling is recorded. This is what lets a run distinguish a real decision from a confident old description.

---

## Sources

List the specific files in `01 - Sources` that carry this standard's key decisions, so a run can verify the claims here rather than take them on faith.
