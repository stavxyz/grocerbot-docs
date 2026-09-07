# Doc Review, September 3, 2026

Buck's review pass on the visual documentation in Figma, packaged for Erik.

## Contents

- `01` through `06` `.m4a`: the voice reviews, in order. 06 is the extra quick thought.
- `transcripts/`: verbatim markdown transcripts, one per review, plus `07-visual-overview.md` for the video.
- `visual-overview-original.mov`: the original camera file (1.4GB, kept out of git and out of the deploy).
- `visual-overview-web.mp4`: web friendly H.264 version (85MB), what the site plays.
- `all-transcripts.zip`: every transcript in one download.
- `index.html`: the review site. Static, no build step, no dependencies. Serve this folder as-is.
- `.vercelignore`: keeps the original MOV out of the upload.

## Deploy

From this folder:

```
npx vercel login        (first time only)
npx vercel --prod --yes
```

The printed URL is the link to send. Any static host works the same way; every file it needs is in this folder and under 100MB.

Deployed manually via Vercel import, root directory set to this folder.
