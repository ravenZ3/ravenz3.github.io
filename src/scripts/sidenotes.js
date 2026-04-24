/**
 * sidenotes.js
 *
 * Moves Markdown footnotes ([^1]) from the inline <section class="footnotes">
 * into the right-margin sidenote column, positioned vertically next to
 * their inline reference superscript.
 *
 * On screens narrower than 1001px, does nothing (footnotes stay inline).
 */
(function () {
  'use strict';

  function initSidenotes() {
    if (window.innerWidth <= 1000) return;

    const column = document.getElementById('sidenote-column');
    if (!column) return;

    // Astro/remark renders footnotes as:
    //   <sup><a id="user-content-fnref-1" ...>1</a></sup>   (in prose)
    //   <section class="footnotes"> <ol> <li id="user-content-fn-1"> ... </li> </ol> </section>
    const footnoteSection = document.querySelector('.footnotes');
    if (!footnoteSection) return;

    const footnoteItems = footnoteSection.querySelectorAll('li[id]');
    if (footnoteItems.length === 0) return;

    // Build a map: number → li content (minus the back-ref arrow)
    const fnMap = new Map();
    footnoteItems.forEach((li, idx) => {
      const clone = li.cloneNode(true);
      // Remove the ↩ backref link
      const backref = clone.querySelector('.footnote-backref, a[data-footnote-backref]');
      if (backref) backref.remove();
      // Strip trailing whitespace nodes
      while (clone.lastChild && clone.lastChild.nodeType === 3 && !clone.lastChild.textContent.trim()) {
        clone.removeChild(clone.lastChild);
      }
      fnMap.set(String(idx + 1), clone.innerHTML.trim());
    });

    // Find all inline footnote references in the prose
    const refs = document.querySelectorAll(
      '.prose sup a[id^="user-content-fnref"], ' +
      '.prose a[id^="user-content-fnref"], ' +
      '.prose sup[id^="fnref"]'
    );

    // Fallback: look for any superscript that links to #fn-
    const allRefs = refs.length > 0 ? refs : document.querySelectorAll('.prose sup a[href*="#fn"]');

    if (allRefs.length === 0) return;

    // Get the column's top offset for positioning
    const columnRect = column.getBoundingClientRect();
    const columnTop  = column.offsetTop;

    // Track the lowest bottom of previously placed sidenotes to avoid overlap
    let lastBottom = 0;

    allRefs.forEach((ref) => {
      // Extract the note number from href or id
      let num = null;

      const href = ref.getAttribute('href') || '';
      const m = href.match(/#(?:user-content-)?fn-?(\d+)/);
      if (m) num = m[1];

      if (!num) {
        const idAttr = ref.getAttribute('id') || ref.closest('sup')?.getAttribute('id') || '';
        const m2 = idAttr.match(/fnref-?(\d+)/);
        if (m2) num = m2[1];
      }

      if (!num || !fnMap.has(num)) return;

      // Position: vertical offset of the <sup> anchor relative to document
      const refEl   = ref.closest('sup') || ref;
      const refRect = refEl.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const refTop  = refRect.top + scrollY;

      // Place the sidenote at the same vertical position as the ref,
      // but never overlapping the previous sidenote
      const topPx = Math.max(refTop - columnTop, lastBottom + 8);

      const sidenote = document.createElement('div');
      sidenote.className = 'sidenote-item';
      sidenote.style.top = topPx + 'px';
      sidenote.innerHTML = `<span class="sidenote-num">${num}</span>${fnMap.get(num)}`;

      column.appendChild(sidenote);

      // Update lastBottom after layout — use a rAF to measure rendered height
      requestAnimationFrame(() => {
        const snRect = sidenote.getBoundingClientRect();
        lastBottom = Math.max(lastBottom, topPx + sidenote.offsetHeight + 4);
      });
    });

    // Hide the original footnote section on wide screens
    if (footnoteSection) {
      footnoteSection.classList.add('hide-on-wide');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidenotes);
  } else {
    initSidenotes();
  }
})();
