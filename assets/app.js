/* ==========================================================================
   慶應水球部 共通スクリプト（app.js）
   1) 正本データ（canon.js）を各ページへ差し込む
   2) タブ切り替え（URLの #ハッシュ と連動。リンクで特定タブを直接開ける）
   通常はこのファイルを編集する必要はありません。
   ========================================================================== */
(function () {
  'use strict';
  var C = window.CANON;
  if (!C) return;

  /* ---------- 小さな道具 ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function get(path) {
    return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, C);
  }
  function pick(item, v) { return (v && item[v] != null) ? item[v] : item.def; }
  function telHref(t) { return 'tel:' + t.replace(/[^\d#+]/g, '').replace('#', '%23'); }
  function em(e) { return e ? '<span class="em" aria-hidden="true">' + e + '</span>' : ''; }
  function list(items, cls) {
    return '<ul class="' + (cls || 'bullets') + '">' + items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
  }

  /* ---------- ブロック描画 ---------- */
  var R = {
    about: function (v) {
      return '<p>' + esc(pick(C.club.about, v)) + '</p>' + (v === 'plain' ? '' : '<p>' + esc(C.club.spirit) + '</p>');
    },

    milestones: function () {
      return '<ol class="milestones">' + C.club.milestones.map(function (m) {
        return '<li><h3>' + esc(m.title) + '</h3><p>' + esc(m.body) + '</p></li>';
      }).join('') + '</ol>';
    },

    'vision-body': function (v) { return '<p>' + esc(pick(C.vision.body, v)) + '</p>'; },

    attitudes: function () {
      return C.attitudes.map(function (a, i) {
        return '<article class="attitude">' +
          '<h3><span class="attitude-num">' + (i + 1) + '</span>' + em(a.emoji) + esc(a.name) + '</h3>' +
          '<p>' + esc(a.body) + '</p>' +
          '<dl class="pair"><div><dt>🤔 なぜ必要か</dt><dd>' + esc(a.why) + '</dd></div>' +
          '<div><dt>💭 自問の例</dt><dd>' + esc(a.ask) + '</dd></div></dl>' +
        '</article>';
      }).join('');
    },

    tools3: function (v) {
      var plain = v === 'plain';
      return '<ul class="tools3">' + C.tools3.map(function (t) {
        return '<li><span class="tool-em" aria-hidden="true">' + t.emoji + '</span><div>' +
          '<h3>' + esc(plain ? t.plainName : t.name) + '<small>' + esc(plain ? t.plainSub : t.sub) + '</small></h3>' +
          '<p>' + esc(plain ? t.plain : t.def) + '</p></div></li>';
      }).join('') + '</ul>';
    },

    stance: function () {
      var s = C.stance;
      return '<p>' + esc(s.support) + '</p>' +
        '<div class="line-box">' +
          '<h3>⚖️ 自由に伴う責任と線引き</h3>' +
          '<p class="line-criterion"><span>基準</span>' + esc(s.criterion) + '</p>' +
          '<ol class="line-steps">' + s.steps.map(function (st, i) {
            return '<li><span class="line-step-n">' + (i + 1) + '段目</span><strong>' + esc(st.who) + '</strong><p>' + esc(st.what) + '</p></li>';
          }).join('') + '</ol>' +
          '<p class="line-purpose">' + esc(s.purpose) + '</p>' +
        '</div>';
    },

    eval360: function (v) {
      var e = C.eval360;
      var text = e[v] || e.def;
      return '<div class="note note-eval"><h3>' + em(e.emoji) + '360°評価<small>' + esc(e.freq) + '</small></h3><p>' + esc(text) + '</p></div>';
    },

    roles: function (v, el) {
      var rows = C.roles.map(function (r) {
        return '<div class="role"><dt>' + em(r.emoji) + esc(r.name) +
          (el.hasAttribute('data-term') ? '<span class="term">任期 ' + esc(r.term) + '</span>' : '') +
          '</dt><dd>' + esc(pick(r, v)) + '</dd></div>';
      });
      if (el.hasAttribute('data-director')) {
        rows.push('<div class="role"><dt>' + em(C.director.emoji) + esc(C.director.name) + '</dt><dd>' + esc(pick(C.director, v)) + '</dd></div>');
      }
      return '<dl class="roles">' + rows.join('') + '</dl>';
    },

    layers: function () {
      return '<ol class="layers">' + C.layers.map(function (l) {
        return '<li><span class="layer-label">' + em(l.emoji) + esc(l.label) + '</span><strong>' + esc(l.who) + '</strong><p>' + esc(l.what) + '</p></li>';
      }).join('') + '</ol>';
    },

    teams: function () {
      return '<div class="teams">' + C.teams.map(function (t) {
        return '<article class="team team-' + t.color + '"><h3>' + em(t.emoji) + esc(t.name) + '<small>' + esc(t.old) + '</small></h3>' +
          '<p>' + esc(t.def) + '</p>' +
          '<p class="bench"><strong>' + esc(t.bench.title) + '</strong>' + esc(t.bench.note) + '</p>' +
          '<ul class="chips">' + t.bench.members.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>' +
        '</article>';
      }).join('') + '</div><p class="small">' + esc(C.benchNote) + '</p>';
    },

    kyoseikai: function (v) {
      var k = C.kyoseikai;
      var items = k.support.filter(function (s) { return v !== 'student' || s.forStudent; }).map(function (s) { return s.text; });
      return '<p>' + esc(k.def) + '</p>' + list(items);
    },

    practice: function (v) {
      var p = C.practice;
      if (v === 'welcome') {
        return '<dl class="spec">' +
          '<div><dt>🏫 平日</dt><dd><strong>' + p.weekday.start + '〜' + p.weekday.end + '</strong><small>' + p.weekday.warmup + 'に体操開始（' + esc(p.weekday.note) + '）</small></dd></div>' +
          '<div><dt>☀️ 土日祝</dt><dd><strong>' + esc(p.weekend.sessions) + '</strong><small>' + esc(p.weekend.gather) + 'に体操開始</small></dd></div>' +
          '<div><dt>🏋️ 筋トレ</dt><dd><strong>' + esc(p.weight) + '</strong></dd></div>' +
          '<div><dt>🛌 お休み</dt><dd><strong>' + esc(p.off) + '</strong></dd></div>' +
        '</dl>';
      }
      return '<dl class="roles">' +
        '<div class="role"><dt>平日</dt><dd>' + p.weekday.start + '〜' + p.weekday.end + '（' + p.weekday.warmup + 'に体操開始。' + esc(p.weekday.note) + '）</dd></div>' +
        '<div class="role"><dt>土日祝・休暇中</dt><dd>' + esc(p.weekend.sessions) + '（' + esc(p.weekend.gather) + 'に体操開始）</dd></div>' +
        '<div class="role"><dt>筋力トレーニング</dt><dd>' + esc(p.weight) + '</dd></div>' +
        '<div class="role"><dt>お休み</dt><dd>' + esc(p.off) + '</dd></div>' +
      '</dl>';
    },

    seasons: function (v) {
      return '<ol class="seasons">' + C.seasons.map(function (s) {
        var name = v === 'welcome' ? s.alias + 'シーズン' : s.name;
        return '<li><div class="season-head"><strong>' + em(s.emoji) + esc(name) + '</strong><span>' + esc(s.months) + '</span>' +
          (v === 'welcome' ? '' : '<em>' + esc(s.phase) + '</em>') + '</div>' +
          '<p>' + esc(v === 'welcome' ? s.plain : pick(s, v)) + '</p></li>';
      }).join('') + '</ol>';
    },

    awards: function (v, el) {
      var withWinners = el.hasAttribute('data-winners');
      return '<div class="awards">' + C.awards.map(function (a) {
        var html = '<article class="award award-' + a.id + '">' +
          '<h3>' + em(a.emoji) + esc(a.name) + (a.scope ? '<small>' + esc(a.scope) + '</small>' : '') + '</h3>' +
          '<p>' + esc(pick(a, v)) + '</p>' +
          '<p class="award-timing">' + esc(a.timing) + '</p>';
        if (withWinners) {
          html += '<ul class="winners">' + a.winners.map(function (w) {
            return '<li><span class="w-year">' + w.year + '年度</span><span class="w-name">' + esc(w.name) + '</span><p>' + esc(w.reason) + '</p></li>';
          }).join('') + '<li class="w-next">' + a.next + '年度　選考中</li></ul>';
        }
        return html + '</article>';
      }).join('') + '</div>';
    },

    comms: function () {
      return '<p>' + esc(C.commsIntro) + '</p><div class="comms">' + C.comms.map(function (c) {
        return '<article class="comm"><h3>' + em(c.emoji) + esc(c.name) + '<small>' + esc(c.place) + '</small></h3>' +
          '<p class="comm-desc">' + esc(c.desc) + '</p>' +
          '<ul class="comm-items">' + c.items.map(function (it) {
            return '<li><strong>' + esc(it.what) + '</strong><span><b>誰が</b>' + esc(it.who) + '</span><span><b>いつ</b>' + esc(it.when) + '</span></li>';
          }).join('') + '</ul>' +
        '</article>';
      }).join('') + '</div>';
    },

    diary: function (v) {
      return '<div class="note note-diary"><h3>📓 BOTで書く日誌</h3><p>' + esc(pick(C.diary, v)) + '</p></div>';
    },

    tactics: function () {
      var t = C.tactics;
      return '<h3>' + esc(t.title) + '</h3><p>' + esc(t.body) + '</p>' +
        '<ol class="tsteps">' + t.steps.map(function (s) { return '<li><span>' + esc(s.when) + '</span><strong>' + esc(s.what) + '</strong></li>'; }).join('') + '</ol>' +
        '<p class="small">' + esc(t.stepsNote) + '</p>' +
        '<h3>🤖 戦術AI</h3><p>' + esc(t.ai.body) + '</p>' +
        '<p><a class="btn" href="' + esc(t.ai.url) + '" target="_blank" rel="noopener">' + esc(t.ai.label) + '</a></p>';
    },

    hotlines: function () {
      return '<ul class="hotlines">' + C.safety.hotlines.map(function (h) {
        var num = h.tel ? '<a href="' + telHref(h.tel) + '">' + esc(h.tel) + '</a>' : '';
        return '<li class="' + (h.primary ? 'hot-primary' : '') + '"><span class="hot-label">' + em(h.emoji) + esc(h.label) + '</span>' +
          '<strong>' + esc(h.name) + '</strong><span class="hot-num">' + num + (h.ext ? '<small>' + esc(h.ext) + '</small>' : '') + '</span></li>';
      }).join('') + '</ul>';
    },

    'safety-student': function () {
      return '<ol class="steps">' + C.safety.student.map(function (s) {
        return '<li><h3>' + em(s.emoji) + esc(s.title) + '</h3><p>' + esc(s.body) + '</p></li>';
      }).join('') + '</ol>' +
      '<h3>🛟 日常の安全対策</h3>' + list(C.safety.prevention);
    },

    'safety-full': function () {
      var s = C.safety;
      return '<p>' + esc(s.responsible) + '</p>' +
        '<h3>🚨 傷病者発生時の流れ</h3>' +
        '<ol class="steps">' + s.flow.map(function (f) { return '<li><h3>' + esc(f.title) + '</h3><p>' + esc(f.body) + '</p></li>'; }).join('') + '</ol>' +
        '<h3>🛟 日常の安全対策</h3>' + list(s.prevention) +
        '<h3>📝 事故発生後の対応</h3>' + list(s.followup);
    },

    'safety-guardian': function () { return '<p>' + esc(C.safety.guardian) + '</p>'; }
  };

  function renderAll(root) {
    root.querySelectorAll('[data-c]').forEach(function (el) {
      var val = get(el.getAttribute('data-c'));
      if (val != null) el.textContent = val;
    });
    root.querySelectorAll('[data-render]').forEach(function (el) {
      var fn = R[el.getAttribute('data-render')];
      if (fn) el.innerHTML = fn(el.getAttribute('data-v'), el);
    });
  }

  /* ---------- タブ ---------- */
  function initTabs() {
    var nav = document.querySelector('[role="tablist"]');
    if (!nav) return;
    var tabs = Array.prototype.slice.call(nav.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });

    function show(i, opts) {
      opts = opts || {};
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      // タブバー自体の横スクロールだけを動かす（ページの縦位置は動かさない）
      var bar = tabs[i].parentNode;
      bar.scrollTo({ left: tabs[i].offsetLeft - (bar.clientWidth - tabs[i].offsetWidth) / 2, behavior: opts.instant ? 'auto' : 'smooth' });
      if (opts.focus) tabs[i].focus();
      if (!opts.fromHash) history.replaceState(null, '', '#' + panels[i].id);
      if (!opts.instant) {
        // 新しいタブの先頭を表示する。タブバーは固定表示で offsetTop が動くため、
        // 直前のコースロープの下端を基準にする
        var rope = document.querySelector('.lane-rope');
        var top = rope ? rope.offsetTop + rope.offsetHeight : 0;
        if (window.scrollY > top) window.scrollTo({ top: top, behavior: 'auto' });
      }
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(i); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') n = 0;
        if (e.key === 'End') n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); show(n, { focus: true }); }
      });
    });

    function fromHash() {
      var id = location.hash.slice(1);
      var i = panels.findIndex(function (p) { return p.id === id; });
      show(i < 0 ? 0 : i, { instant: true, fromHash: true });
    }
    window.addEventListener('hashchange', fromHash);
    fromHash();

    // ページ内リンク（別タブへの誘導）
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-goto]');
      if (!a) return;
      var i = panels.findIndex(function (p) { return p.id === a.getAttribute('data-goto'); });
      if (i >= 0) { e.preventDefault(); show(i); }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderAll(document);
    document.querySelectorAll('[data-updated]').forEach(function (el) { el.textContent = C.updated; });
    initTabs();
  });
})();
