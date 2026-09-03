(function () {
  if (window.__splashTinaViewLinksLoaded) return;
  window.__splashTinaViewLinksLoaded = true;
  var LINK_CLASS = 'splash-tina-row-view-link';
  var STYLE_ID = 'splash-tina-row-view-link-style';

  function addStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = '.' + LINK_CLASS + '{display:inline-flex!important;align-items:center!important;margin-left:10px!important;padding:2px 8px!important;border-radius:6px!important;background:#eff6ff!important;border:1px solid #bfdbfe!important;color:#1d4ed8!important;font-size:12px!important;font-weight:700!important;line-height:1.4!important;text-decoration:none!important;vertical-align:middle!important;position:relative!important;z-index:9999!important;}' +
      '.' + LINK_CLASS + ':hover{background:#dbeafe!important;color:#1e40af!important;text-decoration:none!important;}';
    document.head.appendChild(style);
  }

  function text(el) { return (el && el.textContent ? el.textContent : '').replace(/s+/g, ' ').trim(); }
  function slugify(value) {
    return String(value || '').toLowerCase().replace(/\/g, '/').replace(/^/+|/+$/g, '').replace(/.(mdx?|json)$/i, '').split('/').map(function (part) {
      return part.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }).filter(Boolean).join('/');
  }
  function activeCollection() {
    var url = location.href.toLowerCase();
    var body = text(document.body);
    if (url.indexOf('blog') !== -1 || /(^|s)Blogs(s|$)/.test(body)) return 'blog';
    if (url.indexOf('page') !== -1 || /(^|s)Pages(s|$)/.test(body)) return 'page';
    return null;
  }
  function rowCells(row) {
    var cells = Array.prototype.slice.call(row.querySelectorAll('td,[role="cell"]'));
    if (cells.length) return cells;
    var kids = Array.prototype.slice.call(row.children || []).filter(function (el) { return text(el); });
    return kids;
  }
  function urlFromPath(rowText) {
    rowText = String(rowText || '').replace(/\/g, '/');
    var b = rowText.match(/src/content/blog/([^s]+?).(mdx?|json)/i);
    if (b) return '/blog/' + slugify(b[1]) + '/';
    var p = rowText.match(/src/content/page/([^s]+?).(mdx?|json)/i);
    if (p) {
      var ps = slugify(p[1]);
      return (!ps || ps === 'home' || ps === 'index') ? '/' : '/' + ps + '/';
    }
    return null;
  }
  function urlFromRow(row) {
    var rowText = text(row);
    if (/Titles+Filenames+Extensions+Template/i.test(rowText)) return null;
    var direct = urlFromPath(rowText);
    if (direct) return direct;
    var collection = activeCollection();
    if (!collection) return null;
    var cells = rowCells(row);
    var filename = '';
    if (cells.length >= 4) filename = text(cells[1]);
    if (!filename || /filename/i.test(filename)) {
      var match = rowText.match(/([A-Za-z0-9][A-Za-z0-9_-]*)s+.mdx/);
      if (match) filename = match[1];
    }
    var slug = slugify(filename);
    if (!slug || slug === 'filename' || slug === 'extension' || slug === 'template') return null;
    return collection === 'blog' ? '/blog/' + slug + '/' : ((slug === 'home' || slug === 'index') ? '/' : '/' + slug + '/');
  }
  function bestTarget(row) {
    var cells = rowCells(row);
    if (cells.length >= 4 && !/filename/i.test(text(cells[1]))) return cells[1];
    var pathLine = Array.prototype.slice.call(row.querySelectorAll('*')).find(function (el) { return /src/content/(blog|page)//i.test(text(el)); });
    return pathLine || cells[0] || row;
  }
  function collectRows() {
    var rows = Array.prototype.slice.call(document.querySelectorAll('tr,[role="row"]'));
    if (rows.length) return rows;
    var candidates = Array.prototype.slice.call(document.querySelectorAll('main div, main a'));
    var seen = [];
    candidates.forEach(function (el) {
      var t = text(el);
      if (/src/content/(blog|page)//i.test(t) || /.mdx/i.test(t)) {
        var row = el.closest('[class*="row"],[role="row"],tr') || el.parentElement || el;
        if (seen.indexOf(row) === -1) seen.push(row);
      }
    });
    return seen;
  }
  function inject() {
    addStyle();
    collectRows().forEach(function (row) {
      if (!row || row.querySelector('.' + LINK_CLASS)) return;
      var url = urlFromRow(row);
      if (!url) return;
      var a = document.createElement('a');
      a.className = LINK_CLASS;
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = 'View';
      a.title = 'Open frontend: ' + url;
      a.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); window.open(url, '_blank', 'noopener,noreferrer'); });
      var target = bestTarget(row);
      target.appendChild(document.createTextNode(' '));
      target.appendChild(a);
    });
  }
  var timer = null;
  function schedule(){ clearTimeout(timer); timer = setTimeout(inject, 100); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule); else schedule();
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  setInterval(inject, 700);
  console.log('[Splash Tina View Links] loaded');
})();