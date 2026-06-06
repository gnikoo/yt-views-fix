/**
 * YouTube Layout Fix — content.js
 *
 * The new layout puts channel name, SVG icon, view count, and time
 * all in a single ytContentMetadataViewModelMetadataRow.
 *
 * We split it into two rows to match the old layout:
 *   Row 1: Channel Name
 *   Row 2: 12K views • 10 years ago
 */

"use strict";

function fixRow(row) {
  if (row.dataset.ytlfFixed) return;

  // Only target rows with the play-button leading icon — that's the new layout
  const leadingIcon = row.querySelector(".ytContentMetadataViewModelLeadingIcon");
  if (!leadingIcon) return;

  // --- Extract channel name ---
  // It's an <a> tag inside a ytAttributedStringLink in this same row
  const channelLink = row.querySelector("a.ytAttributedStringLink");
  let channelHTML = null;
  if (channelLink) {
    // Grab the full span wrapper around the link so we keep its styling
    const channelSpan = channelLink.closest("span.ytContentMetadataViewModelMetadataText");
    if (channelSpan) channelHTML = channelSpan.outerHTML;
  }

  // --- Extract views and time from aria-labels ---
  const allMetaSpans = Array.from(row.querySelectorAll(
    "span.ytContentMetadataViewModelMetadataText"
  ));

  let viewsText = null;
  let timeText = null;

  for (const span of allMetaSpans) {
    const label = (span.getAttribute("aria-label") || "").toLowerCase();
    const text = span.textContent.trim();
    if (!viewsText && label.includes("view")) {
      viewsText = formatViews(label, text);
    } else if (!timeText && label.includes("ago")) {
      timeText = label.charAt(0).toUpperCase() + label.slice(1); // capitalise first letter
    }
  }

  if (!viewsText && !timeText) return;

  const statsText = [viewsText, timeText].filter(Boolean).join(" • ");

  // --- Rewrite the row ---
  row.innerHTML = "";

  // Row 1: channel name (re-insert original HTML if we have it)
  if (channelHTML) {
    const channelWrapper = document.createElement("span");
    channelWrapper.innerHTML = channelHTML;
    row.appendChild(channelWrapper.firstChild);
  }

  // Row 2: views • time — insert a <br> to split onto a new line,
  // but since this is all one div we just append both as block-level spans
  // by wrapping each in a div so they stack naturally.
  // Actually the cleanest approach: insert a sibling row after this one.
  const statsRow = document.createElement("div");
  statsRow.role = "group";
  statsRow.className = row.className; // inherit same row styling
  statsRow.dataset.ytlfFixed = "1";

  const statsSpan = document.createElement("span");
  statsSpan.className =
    "ytAttributedStringHost ytContentMetadataViewModelMetadataText " +
    "ytAttributedStringWhiteSpacePreWrap ytAttributedStringLinkInheritColor ytlf-restored";
  statsSpan.setAttribute("dir", "auto");
  statsSpan.textContent = statsText;
  statsRow.appendChild(statsSpan);

  // Insert the new stats row after this row
  row.parentNode.insertBefore(statsRow, row.nextSibling);

  row.dataset.ytlfFixed = "1";
}

/**
 * Formats the view count for display.
 * aria-label e.g. "12 thousand views" → "12K views"
 * If already short like "96K views", keep as-is.
 */
function formatViews(ariaLabel, fallbackText) {
  const match = ariaLabel.match(/([\d.,]+)\s*(thousand|million|billion)?\s*views?/i);
  if (!match) return fallbackText + (fallbackText.toLowerCase().includes("view") ? "" : " views");
  const num = match[1];
  const mag = (match[2] || "").toLowerCase();
  const suffix = mag === "billion" ? "B" : mag === "million" ? "M" : mag === "thousand" ? "K" : "";
  return `${num}${suffix} views`;
}

// ─── Run on all metadata rows ─────────────────────────────────────────────────

function fixAll() {
  document.querySelectorAll(
    ".ytContentMetadataViewModelMetadataRow"
  ).forEach(fixRow);
}

// Debounced MutationObserver for lazy-loaded content
let rafId = null;
const observer = new MutationObserver(() => {
  if (rafId) return;
  rafId = requestAnimationFrame(() => { fixAll(); rafId = null; });
});
observer.observe(document.documentElement, { childList: true, subtree: true });

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", fixAll);
} else {
  fixAll();
}

// YouTube SPA navigation
window.addEventListener("yt-navigate-finish", () => setTimeout(fixAll, 400));
