# YT Views Fix

Restores the classic YouTube homepage metadata layout that YouTube replaced in 2025/2026.

**Before:** Channel name, a play-button SVG icon, abbreviated view count and time on a single line — e.g. `Channel Name ▶ 12K 10y ago`

**After:** The classic two-line format — e.g.
```
Channel Name
12K views • 10 years ago
```

## What it fixes
- Removes the play-button SVG icon that replaced the word "views"
- Restores the full word "views" after the count
- Expands abbreviated time back to full words (10y → 10 years ago, 6mo → 6 months ago, etc.)
- Splits the metadata back onto two lines so the channel name sits on its own line

## Installing on Firefox

1. Download the latest release zip and unzip it
2. Go to `about:debugging` in the Firefox address bar
3. Click **This Firefox** on the left
4. Click **Load Temporary Add-on...**
5. Open the unzipped folder and select `manifest.json`

> Note: temporary add-ons are removed when Firefox restarts. For a permanent install, the extension is available on [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/yt-views-fix/).

## License

[CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/) — Free for personal use. No commercial use. No redistribution of modified versions without permission.

Copyright (c) 2026 gnik0074
