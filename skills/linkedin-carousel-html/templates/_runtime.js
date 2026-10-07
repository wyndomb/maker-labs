// Inlined into carousel.html by scripts/carousel.mjs.
// Opened normally: scaled preview with a Save as PDF button.
// ?slide=N  one slide at full size (PNG export)
// ?sheet=1  all slides in a small grid (overview image)
// ?check=1  measures every slide and writes a JSON report into the page
(function () {
  var root = document.documentElement;
  var q = new URLSearchParams(location.search);
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var W = 1080, H = 1350;

  if (q.has('slide')) {
    root.classList.add('mode-slide');
    var keep = parseInt(q.get('slide'), 10) - 1;
    slides.forEach(function (s, i) { if (i !== keep) s.remove(); });
    return;
  }
  if (q.has('sheet')) { root.classList.add('mode-sheet'); return; }
  if (q.has('check')) {
    root.classList.add('mode-check');
    var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    ready.then(function () { writeReport(); }, function () { writeReport(); });
    return;
  }

  // Preview mode
  root.classList.add('mode-preview');
  function fit() {
    var s = Math.min(1, (window.innerWidth - 48) / W, (window.innerHeight - 140) / H);
    root.style.setProperty('--preview-scale', Math.max(0.25, s).toFixed(3));
  }
  fit();
  window.addEventListener('resize', fit);
  var bar = document.createElement('div');
  bar.className = 'toolbar';
  bar.innerHTML = '<strong>' + slides.length + ' slides</strong><span>1080 x 1350. In Chrome or Edge, Save as PDF keeps this exact size.</span>';
  var btn = document.createElement('button');
  btn.textContent = 'Save as PDF';
  btn.onclick = function () { window.print(); };
  bar.appendChild(btn);
  document.body.appendChild(bar);

  // ---------- checker ----------
  function alpha(color) {
    if (!color || color === 'transparent') return 0;
    var m = color.match(/rgba?\(([^)]+)\)/);
    if (!m) return 1;
    var p = m[1].split(/[,\/\s]+/).filter(Boolean);
    return p.length >= 4 ? parseFloat(p[3]) : 1;
  }
  function snippet(t) {
    t = t.replace(/\s+/g, ' ').trim();
    return t.length > 48 ? t.slice(0, 45) + '...' : t;
  }
  function blockOf(node, slide) {
    var el = node.parentElement;
    while (el && el !== slide) {
      var d = getComputedStyle(el).display;
      if (d !== 'inline' && d !== 'contents') return el;
      el = el.parentElement;
    }
    return slide;
  }

  function measure(slide, index) {
    var R = slide.getBoundingClientRect();
    var errors = [], warnings = [];
    var blocks = [], byEl = new Map();

    // Text blocks: tight boxes around the text each block-level element owns.
    var walker = document.createTreeWalker(slide, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      if (!node.nodeValue.trim()) continue;
      var el = blockOf(node, slide);
      var b = byEl.get(el);
      if (!b) {
        b = { el: el, text: '', fs: 0, top: Infinity, left: Infinity, bottom: -Infinity, right: -Infinity,
              decor: !!el.closest('[data-decor]') };
        byEl.set(el, b);
        blocks.push(b);
      }
      b.text += ' ' + node.nodeValue;
      b.fs = Math.max(b.fs, parseFloat(getComputedStyle(node.parentElement).fontSize) || 0);
      var range = document.createRange();
      range.selectNodeContents(node);
      var rects = range.getClientRects();
      for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        if (!r.width || !r.height) continue;
        b.top = Math.min(b.top, r.top - R.top);
        b.left = Math.min(b.left, r.left - R.left);
        b.bottom = Math.max(b.bottom, r.bottom - R.top);
        b.right = Math.max(b.right, r.right - R.left);
      }
    }
    blocks = blocks.filter(function (b) { return isFinite(b.top); });
    // Glyph boxes are taller than the letters. Trim so tight leading is not read as overlap.
    blocks.forEach(function (b) {
      var inset = Math.min(b.fs * 0.15, (b.bottom - b.top) / 3);
      b.itop = b.top + inset;
      b.ibottom = b.bottom - inset;
    });
    var content = blocks.filter(function (b) { return !b.decor; });
    var padBottom = parseFloat(getComputedStyle(slide).paddingBottom) || 0;

    // 1. Text cut off by the slide edge.
    content.forEach(function (b) {
      var sides = [];
      if (b.ibottom > H + 1) sides.push('bottom');
      if (b.itop < -1) sides.push('top');
      if (b.right > W + 1) sides.push('right');
      if (b.left < -1) sides.push('left');
      if (sides.length) { errors.push('Text runs off the ' + sides.join(' and ') + ' edge: "' + snippet(b.text) + '"'); return; }

      // Pushed into the slide's own bottom margin: the layout holds more than it has room for.
      var flow = true;
      for (var p = b.el; p && p !== slide; p = p.parentElement) {
        if (/absolute|fixed/.test(getComputedStyle(p).position)) { flow = false; break; }
      }
      if (flow && padBottom > 0 && b.ibottom > H - padBottom + 2) {
        errors.push('Slide is overfull, text is pushed into the bottom margin: "' + snippet(b.text) + '"');
      }

      // A word too long for its line sticks out of its own box.
      var box = b.el.getBoundingClientRect();
      if (b.right > box.right - R.left + 3 || b.left < box.left - R.left - 3) {
        warnings.push('A word is too long for its line and sticks out of its box: "' + snippet(b.text) + '"');
      }
    });

    // 2. Text cut off inside a box that hides its overflow.
    var all = slide.querySelectorAll('*');
    for (var k = 0; k < all.length; k++) {
      var e = all[k];
      if (e.closest('[data-decor]')) continue;
      var cs = getComputedStyle(e);
      var clips = /hidden|clip/.test(cs.overflowX + cs.overflowY);
      if (clips && (e.scrollHeight > e.clientHeight + 2 || e.scrollWidth > e.clientWidth + 2) && e.textContent.trim()) {
        errors.push('Text is clipped inside a box: "' + snippet(e.textContent) + '"');
      }
    }

    // 3. Text sitting on top of other text.
    for (var a = 0; a < content.length; a++) {
      for (var c = a + 1; c < content.length; c++) {
        var A = content[a], B = content[c];
        if (A.el.contains(B.el) || B.el.contains(A.el)) continue;
        var w = Math.min(A.right, B.right) - Math.max(A.left, B.left);
        var h = Math.min(A.ibottom, B.ibottom) - Math.max(A.itop, B.itop);
        if (w > 6 && h > 6) warnings.push('Text overlaps: "' + snippet(A.text) + '" and "' + snippet(B.text) + '"');
      }
    }

    // 4. Empty bands. Ink = all text (decor text too) plus small boxes with a fill, border or image.
    var ink = blocks.map(function (b) { return { top: b.itop, bottom: b.ibottom, label: snippet(b.text) }; });
    for (var m = 0; m < all.length; m++) {
      var x = all[m];
      if (x.closest('[data-decor]')) continue;
      var s = getComputedStyle(x);
      var tag = x.tagName.toLowerCase();
      var border = parseFloat(s.borderTopWidth) + parseFloat(s.borderBottomWidth) +
                   parseFloat(s.borderLeftWidth) + parseFloat(s.borderRightWidth);
      var painted = alpha(s.backgroundColor) > 0.02 || s.backgroundImage !== 'none' ||
                    (border > 0 && alpha(s.borderTopColor) > 0.02) || tag === 'img' || tag === 'svg';
      if (!painted) continue;
      var xr = x.getBoundingClientRect();
      if (!xr.width || !xr.height || xr.height > H * 0.5) continue; // tall boxes are containers
      ink.push({ top: xr.top - R.top, bottom: xr.bottom - R.top, label: snippet(x.textContent) || tag });
    }
    ink = ink.map(function (i) { return { top: Math.max(0, i.top), bottom: Math.min(H, i.bottom), label: i.label }; })
             .filter(function (i) { return i.bottom > i.top; })
             .sort(function (p, n) { return p.top - n.top; });
    var merged = [];
    ink.forEach(function (i) {
      var last = merged[merged.length - 1];
      if (last && i.top <= last.bottom) { if (i.bottom > last.bottom) { last.bottom = i.bottom; last.label = i.label; } }
      else merged.push({ top: i.top, bottom: i.bottom, label: i.label });
    });
    var gap = 0, gapAfter = '', gapAt = 0, covered = 0;
    merged.forEach(function (i, n) {
      covered += i.bottom - i.top;
      if (n > 0) {
        var g = i.top - merged[n - 1].bottom;
        if (g > gap) { gap = g; gapAfter = merged[n - 1].label; gapAt = merged[n - 1].bottom; }
        if (g <= 64) covered += g; // normal spacing between elements counts as filled
      }
    });
    var topMargin = merged.length ? merged[0].top : H;
    var bottomMargin = merged.length ? H - merged[merged.length - 1].bottom : H;
    var allow = parseFloat(slide.getAttribute('data-allow-gap')) || 180;
    if (gap > allow) {
      warnings.push('Empty band of ' + Math.round(gap) + 'px starting at y=' + Math.round(gapAt) + ', below "' + gapAfter + '"');
    }
    if (bottomMargin > Math.max(allow, 200)) warnings.push('Bottom ' + Math.round(bottomMargin) + 'px of the slide is empty');

    // 5. Word count against the template's budget for this slide.
    var words = content.reduce(function (n, b) { return n + b.text.trim().split(/\s+/).filter(Boolean).length; }, 0);
    var maxWords = parseInt(slide.getAttribute('data-max-words'), 10) || 110;
    if (words > maxWords) warnings.push(words + ' words, budget for this slide is ' + maxWords);

    var type = (slide.className.match(/\b(hook|content|cta)\b/) || ['slide'])[0];
    return {
      n: index + 1, type: type, words: words, maxWords: maxWords,
      fill: Math.round((covered / H) * 100), largestGap: Math.round(gap),
      topMargin: Math.round(topMargin), bottomMargin: Math.round(bottomMargin),
      errors: errors, warnings: warnings
    };
  }

  function writeReport() {
    var failed = [];
    if (document.fonts) {
      document.fonts.forEach(function (f) { if (f.status === 'error') failed.push(f.family.replace(/"/g, '') + ' ' + f.weight); });
    }
    var report = { slides: slides.map(measure), fontsFailed: failed };
    var out = document.createElement('script');
    out.type = 'application/json';
    out.id = 'carousel-report';
    out.textContent = JSON.stringify(report).replace(/</g, '\\u003c');
    document.body.appendChild(out);
  }
})();
