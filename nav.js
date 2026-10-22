/* The site bar for every hub page: brand · page tabs · search · guide (?) · language. Driven by hub.config.js.
   Include on every page:  <script src="hub.config.js"></script> <script src="nav.js" defer></script>
   - Language: text in class="en" / class="ko" (your two codes); remembered per browser; "hub-lang" event on change.
   - Tooltips: data-tip="…" (and data-tip-<lang>="…") on anything.
   - Facts: <span data-fact="site.live"></span> is filled from HUB.facts (per-language values: { en, ko }).
   - Search: the button, "/" or ⌘K. Results come from search-index.js (built by tools/search-index.mjs). */
(() => {
  const H = window.HUB || { name: "Design", mark: "◆", languages: ["en"], labels: {}, pages: [], facts: {} };
  const base = new URL(".", document.currentScript.src);
  const root = document.documentElement;
  const LANGS = H.languages && H.languages.length ? H.languages : ["en"];
  const store = { get() { try { return localStorage.getItem("hub-lang"); } catch (e) { return null; } }, set(v) { try { localStorage.setItem("hub-lang", v); } catch (e) {} } };
  root.dataset.lang = LANGS.includes(store.get()) ? store.get() : LANGS[0];
  root.lang = root.dataset.lang;
  const L = () => root.dataset.lang;
  const tr = (v) => (v && typeof v === "object" ? v[L()] || v[LANGS[0]] : v); // per-language value or plain value
  const multi = (v) => (v && typeof v === "object" ? LANGS.map((l) => `<span class="${l}">${v[l] || v[LANGS[0]]}</span>`).join("") : v);
  const C = (name, fb) => `var(--color-${name},${fb})`;

  const st = document.createElement("style");
  st.textContent = `
    ${[...new Set([...LANGS, ...Object.keys(H.labels || {}), "en", "ko"])].map((l) => `html:not([data-lang="${l}"]) .${l}{display:none !important}`).join("")}
    .hub-nav{box-sizing:border-box;position:sticky;top:env(safe-area-inset-top,0px);z-index:50;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:1rem;
      padding:.5rem clamp(1rem,3vw,2rem);background:${C("surface", "Canvas")};border-bottom:1px solid ${C("border", "rgba(127,127,127,.25)")};font:500 .9375rem/1.2 var(--font-ui,system-ui,sans-serif)}
    .hub-nav a{text-decoration:none;color:inherit}
    .hub-brand{justify-self:start;display:inline-flex;align-items:center;gap:.5rem;font-weight:700;white-space:nowrap;color:${C("text", "CanvasText")}}
    .hub-brand i{font-style:normal;display:inline-grid;place-items:center;width:28px;height:28px;border-radius:8px;background:${C("primary", "#2D6A4F")};color:${C("primary-text", "#fff")};font-size:.875rem}
    .hub-tabs{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:${C("track", "rgba(127,127,127,.15)")};max-width:100%;overflow-x:auto;scrollbar-width:none}
    .hub-tabs a{display:inline-flex;align-items:center;min-height:40px;padding:0 1rem;border-radius:999px;color:${C("text-muted", "GrayText")};font-weight:600;white-space:nowrap}
    .hub-tabs a:hover{color:${C("text", "CanvasText")}}
    .hub-tabs a[aria-current="page"]{background:${C("surface", "Canvas")};color:${C("text", "CanvasText")};box-shadow:0 0 0 1px ${C("border", "rgba(127,127,127,.25)")}}
    .hub-end{justify-self:end;display:inline-flex;align-items:center;gap:.5rem}
    .hub-btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;height:40px;min-width:40px;padding:0 .75rem;border-radius:999px;border:1px solid ${C("border-strong", "rgba(127,127,127,.5)")};background:none;color:${C("text", "CanvasText")};font:inherit;font-size:.875rem;font-weight:600;cursor:pointer}
    .hub-btn svg{width:18px;height:18px}
    .hub-btn[aria-expanded="true"]{background:${C("primary", "#2D6A4F")};color:${C("primary-text", "#fff")};border-color:transparent}
    .hub-lang{display:inline-flex;gap:2px;padding:3px;border-radius:999px;border:1px solid ${C("border-strong", "rgba(127,127,127,.5)")}}
    .hub-lang button{border:0;background:none;min-height:34px;min-width:44px;padding:0 .625rem;border-radius:999px;font:inherit;font-weight:600;font-size:.8125rem;color:${C("text", "CanvasText")};cursor:pointer}
    .hub-lang button[aria-pressed="true"]{background:${C("primary", "#2D6A4F")};color:${C("primary-text", "#fff")}}
    .hub-nav :focus-visible,.hub-panel :focus-visible{outline:2px solid ${C("primary", "#2D6A4F")};outline-offset:2px}
    .hub-panel{position:fixed;z-index:60;top:calc(env(safe-area-inset-top,0px) + var(--hub-nav-h,60px) + 8px);right:clamp(.75rem,3vw,2rem);width:min(24rem,calc(100vw - 1.5rem));max-height:calc(100dvh - var(--hub-nav-h,60px) - 24px);overflow:auto;
      background:${C("surface", "Canvas")};color:${C("text", "CanvasText")};border:1px solid ${C("border", "rgba(127,127,127,.3)")};border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.18);padding:1rem 1.125rem;font:400 .875rem/1.5 var(--font-ui,system-ui,sans-serif);display:flex;flex-direction:column;gap:.75rem}
    .hub-panel[hidden],.hub-search[hidden]{display:none}
    .hub-panel h2{margin:0;font:600 1.125rem/1.2 var(--font-display,inherit)}
    .hub-panel ul{margin:0;padding-left:1.125rem;display:flex;flex-direction:column;gap:.375rem}
    .hub-panel .pages{list-style:none;padding:0}
    .hub-panel .pages a{display:flex;flex-direction:column;padding:.375rem .5rem;border-radius:10px;text-decoration:none;color:inherit}
    .hub-panel .pages a:hover{background:${C("track", "rgba(127,127,127,.12)")}}
    .hub-panel .pages small{color:${C("text-muted", "GrayText")}}
    .hub-tip{position:fixed;z-index:70;max-width:16rem;padding:.4rem .6rem;border-radius:8px;background:${C("text", "#1A1A1A")};color:${C("surface", "#fff")};font:500 .8125rem/1.35 var(--font-ui,system-ui,sans-serif);pointer-events:none}
    .hub-search{position:fixed;inset:0;z-index:80;background:rgba(10,12,10,.45);display:flex;justify-content:center;align-items:flex-start;padding:8vh 1rem 1rem}
    .hub-search .box{width:min(40rem,100%);max-height:78vh;display:flex;flex-direction:column;background:${C("surface", "Canvas")};color:${C("text", "CanvasText")};border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.3);overflow:hidden;font:400 .9375rem/1.45 var(--font-ui,system-ui,sans-serif)}
    .hub-search .field{display:flex;align-items:center;gap:.625rem;padding:.875rem 1rem;border-bottom:1px solid ${C("border", "rgba(127,127,127,.3)")}}
    .hub-search .field svg{width:20px;height:20px;flex:0 0 auto;color:${C("text-muted", "GrayText")}}
    .hub-search input{flex:1;min-width:0;border:0;outline:0;background:none;color:inherit;font:inherit;font-size:1.0625rem}
    .hub-search ul{list-style:none;margin:0;padding:.375rem;overflow:auto}
    .hub-search li a{display:flex;flex-direction:column;gap:.125rem;padding:.625rem .75rem;border-radius:12px;text-decoration:none;color:inherit}
    .hub-search li[aria-selected="true"] a{background:${C("track", "rgba(127,127,127,.14)")}}
    .hub-search li small{font-size:.75rem;font-weight:600;color:${C("text-muted", "GrayText")}}
    .hub-search li span{font-size:.8125rem;color:${C("text-muted", "GrayText")};display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
    .hub-search mark{background:${C("warning-surface", "#FFF3C4")};color:inherit;border-radius:3px}
    .hub-search .empty,.hub-search .hint{padding:.75rem 1.125rem;color:${C("text-muted", "GrayText")};font-size:.8125rem}
    .hub-search .hint{border-top:1px solid ${C("border", "rgba(127,127,127,.3)")}}
    @media (max-width:900px){.hub-brand b,.hub-btn .lbl{display:none}}
    @media (max-width:720px){.hub-nav{grid-template-columns:auto 1fr;row-gap:.5rem}.hub-end{grid-column:2;grid-row:1}.hub-tabs{grid-column:1/-1;grid-row:2;justify-self:stretch}}`;
  document.head.appendChild(st);

  // Facts
  const fact = (path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), H.facts);
  const fillFacts = () => document.querySelectorAll("[data-fact]").forEach((n) => { const v = tr(fact(n.dataset.fact)); if (v != null) n.textContent = v; });

  // Tooltips
  let tip = null, owner = null;
  const hideTip = () => { if (tip) tip.remove(); tip = null; if (owner) owner.removeAttribute("aria-describedby"); owner = null; };
  const showTip = (el) => {
    const text = el.dataset[`tip${L()[0].toUpperCase()}${L().slice(1)}`] || el.dataset.tip; if (!text) return;
    hideTip(); owner = el; tip = document.createElement("div"); tip.className = "hub-tip"; tip.id = "hub-tip"; tip.setAttribute("role", "tooltip"); tip.textContent = text;
    document.body.appendChild(tip); el.setAttribute("aria-describedby", "hub-tip");
    const r = el.getBoundingClientRect(), t = tip.getBoundingClientRect();
    tip.style.top = `${r.top - t.height - 8 > 8 ? r.top - t.height - 8 : r.bottom + 8}px`;
    tip.style.left = `${Math.max(8, Math.min(innerWidth - t.width - 8, r.left + r.width / 2 - t.width / 2))}px`;
  };
  document.addEventListener("pointerover", (e) => { const el = e.target.closest && e.target.closest("[data-tip]"); if (el && el !== owner) showTip(el); else if (!el && owner) hideTip(); });
  document.addEventListener("focusin", (e) => { const el = e.target.closest && e.target.closest("[data-tip]"); if (el) showTip(el); });
  document.addEventListener("focusout", hideTip);
  addEventListener("scroll", hideTip, true);

  // The bar (not inside our own frames)
  let framed = false; try { framed = window.parent !== window && !!window.parent.document.querySelector('script[src*="nav.js"]'); } catch (e) {}
  fillFacts();
  if (framed) return;
  const here = location.pathname.replace(/\/$/, "/index.html");
  const pages = H.pages.map((p) => ({ ...p, url: new URL(p.file, base) }));
  const page = pages.find((p) => p.url.pathname === here) || pages[0] || { title: H.name, tips: {} };
  const ICON = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">${d}</svg>`;
  const nav = document.createElement("nav");
  nav.className = "hub-nav"; nav.setAttribute("aria-label", "Site");
  nav.innerHTML = `<a class="hub-brand" href="${pages[0] ? pages[0].url.pathname : "#"}" aria-label="${H.name}, home"><i aria-hidden="true">${H.mark || "◆"}</i><b>${H.name}</b></a>
    <span class="hub-tabs">${pages.map((p) => `<a href="${p.url.pathname}"${p.url.pathname === here ? ' aria-current="page"' : ""}>${multi(p.title)}</a>`).join("")}</span>
    <span class="hub-end"><button type="button" class="hub-btn" data-act="search" aria-haspopup="dialog" aria-label="Search">${ICON('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>')}<span class="lbl">${multi({ en: "Search", ko: "검색" })}</span><kbd>/</kbd></button>
      <button type="button" class="hub-btn" data-act="guide" aria-expanded="false" aria-controls="hub-guide" aria-label="Guide">?</button>
      ${LANGS.length > 1 ? `<span class="hub-lang" role="group" aria-label="Language">${LANGS.map((l) => `<button type="button" data-l="${l}">${(H.labels || {})[l] || l.toUpperCase()}</button>`).join("")}</span>` : ""}</span>`;
  document.body.prepend(nav);
  const syncLang = () => nav.querySelectorAll(".hub-lang button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.l === L())));
  syncLang();
  nav.addEventListener("click", (e) => { const b = e.target.closest(".hub-lang button"); if (!b) return;
    root.dataset.lang = root.lang = b.dataset.l; store.set(b.dataset.l); syncLang(); fillFacts(); dispatchEvent(new CustomEvent("hub-lang", { detail: b.dataset.l })); });

  // Guide (?)
  const guide = document.createElement("div");
  guide.className = "hub-panel"; guide.id = "hub-guide"; guide.hidden = true; guide.setAttribute("role", "dialog"); guide.setAttribute("aria-label", "Guide");
  const renderGuide = () => { guide.innerHTML = `<h2>${tr(page.title)}</h2><ul>${(tr(page.tips) || []).map((t) => `<li>${t}</li>`).join("")}<li>${tr({ en: "Search anything with <kbd>/</kbd> or ⌘K.", ko: "<kbd>/</kbd> 또는 ⌘K로 무엇이든 검색." })}</li></ul>
    <ul class="pages">${pages.map((p) => `<li><a href="${p.url.pathname}"><b>${tr(p.title)}</b><small>${tr(p.desc) || ""}</small></a></li>`).join("")}</ul>`; };
  document.body.appendChild(guide);
  const gbtn = nav.querySelector('[data-act="guide"]');
  const setGuide = (open) => { renderGuide(); guide.hidden = !open; gbtn.setAttribute("aria-expanded", String(open)); hideTip(); if (open) (guide.querySelector("a") || guide).focus(); };
  gbtn.addEventListener("click", () => setGuide(guide.hidden));
  document.addEventListener("click", (e) => { if (!guide.hidden && !guide.contains(e.target) && !gbtn.contains(e.target)) setGuide(false); });

  // Search
  const sd = document.createElement("div");
  sd.className = "hub-search"; sd.hidden = true; sd.setAttribute("role", "dialog"); sd.setAttribute("aria-modal", "true"); sd.setAttribute("aria-label", "Search");
  sd.innerHTML = `<div class="box"><div class="field">${ICON('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>')}<input type="search" role="combobox" aria-expanded="true" aria-controls="hub-results" autocomplete="off" spellcheck="false"></div>
    <ul id="hub-results" role="listbox"></ul><div class="hint">↑ ↓ · Enter · Esc</div></div>`;
  document.body.appendChild(sd);
  const sin = sd.querySelector("input"), sul = sd.querySelector("ul");
  let INDEX = null, hits = [], sel = 0, back = null;
  const load = () => INDEX ? Promise.resolve() : new Promise((res) => { const s = document.createElement("script"); s.src = new URL("search-index.js", base).href;
    s.onload = () => { INDEX = window.HUB_SEARCH || []; res(); }; s.onerror = () => { INDEX = []; res(); }; document.head.appendChild(s); });
  const norm = (s) => (s || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const mark = (s, terms) => terms.reduce((h, q) => h.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"), "<mark>$1</mark>"), esc(s));
  const run = () => {
    const terms = norm(sin.value).split(/\s+/).filter(Boolean);
    if (!terms.length) { sul.innerHTML = `<li class="empty">${tr({ en: "Type to search every page.", ko: "모든 페이지를 검색해요." })}</li>`; hits = []; return; }
    hits = INDEX.map((it) => { const t = norm(Object.values(it.t).join(" ")), x = norm(Object.values(it.x).join(" ") + " " + Object.values(it.p).join(" "));
      let s = 0; for (const w of terms) { if (t.includes(w)) s += t.startsWith(w) ? 14 : 10; else if (x.includes(w)) s += 3; else return null; } return { it, s }; })
      .filter(Boolean).sort((a, b) => b.s - a.s).slice(0, 40);
    sel = 0;
    sul.innerHTML = hits.length ? hits.map(({ it }, i) => { const body = tr(it.x) || "", at = Math.max(0, norm(body).indexOf(terms.find((w) => norm(body).includes(w)) || "") - 50);
      return `<li role="option" id="hr-${i}" aria-selected="${i === sel}"><a href="${/^https?:/.test(it.h) ? it.h : new URL(it.h, base).href}" tabindex="-1"><small>${esc(tr(it.p) || "")}</small><b>${mark(tr(it.t) || "", terms)}</b><span>${mark((at ? "…" : "") + body.slice(at, at + 180), terms)}</span></a></li>`; }).join("")
      : `<li class="empty">${tr({ en: "Nothing found.", ko: "찾은 게 없어요." })}</li>`;
  };
  const move = (d) => { if (!hits.length) return; sel = (sel + d + hits.length) % hits.length; sul.querySelectorAll("li[role=option]").forEach((li, i) => li.setAttribute("aria-selected", String(i === sel))); sul.querySelector(`#hr-${sel}`).scrollIntoView({ block: "nearest" }); };
  const open = async () => { back = document.activeElement; hideTip(); setGuide(false); sd.hidden = false; sin.focus(); sin.select(); await load(); run(); };
  const close = () => { sd.hidden = true; if (back && back.focus) back.focus(); };
  nav.querySelector('[data-act="search"]').addEventListener("click", open);
  sd.addEventListener("click", (e) => { if (e.target === sd) close(); if (e.target.closest("a")) close(); });
  sin.addEventListener("input", run);
  sin.addEventListener("keydown", (e) => { if (e.key === "ArrowDown") { e.preventDefault(); move(1); } else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (e.key === "Enter") { const a = sul.querySelector(`#hr-${sel} a`); if (a) { e.preventDefault(); close(); a.click(); } } else if (e.key === "Escape") { e.preventDefault(); close(); } });
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") { hideTip(); if (!guide.hidden) setGuide(false); }
    if (!sd.hidden) return;
    const typing = e.target.closest && e.target.closest("input, textarea, select, [contenteditable]");
    if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) { e.preventDefault(); open(); }
    else if (e.key === "/" && !typing) { e.preventDefault(); open(); }
  });

  // Run edge to edge even when the page pads its body.
  const cs = getComputedStyle(document.body), [t, l, r] = [cs.paddingTop, cs.paddingLeft, cs.paddingRight].map(parseFloat);
  nav.style.margin = `${-t}px ${-r}px ${t ? 24 : 0}px ${-l}px`;
  const measure = () => root.style.setProperty("--hub-nav-h", `${nav.offsetHeight}px`); measure(); addEventListener("resize", measure);
})();
