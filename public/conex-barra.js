// Portal Rede Conex: quem chega pelo portal (?conex=1) ganha o menu Conex dentro do app, para voltar ao painel e
// trocar de app sem sair do lugar. Mesmo arquivo nos 7 apps (como o conex-erros.js). Só nesta aba: some quando a aba fecha.
// 26/11/2026: o atalho "‹ Rede Conex" virou menu (Painel + os 7 apps). Fechado, é uma aba fina na borda esquerda; abre ao
// passar o mouse (computador) ou ao tocar (celular). Fica por cima da tela do app, sem empurrar nada.
// Só estilo pelo CSSOM (el.style): a política de segurança dos apps não aceita <style> nem style="" no HTML.
(() => {
  try {
    const u = new URL(location.href);
    if (u.searchParams.get("conex") === "1") {
      sessionStorage.setItem("conex_portal", "1");
      u.searchParams.delete("conex");
      history.replaceState(history.state, "", u.pathname + (u.searchParams.toString() ? `?${u.searchParams}` : "") + u.hash);
    }
    // cookie "conex_portal" (gravado pela rota de entrada dos apps em Next): vale também depois de um redirecionamento
    // do próprio app (ex.: o motorista vai de /painel para /motorista e o "?conex=1" se perde no caminho)
    if (/(?:^|;\s*)conex_portal=1(?:;|$)/.test(document.cookie)) sessionStorage.setItem("conex_portal", "1");
    if (sessionStorage.getItem("conex_portal") !== "1") return;
  } catch {
    return;
  }

  const PORTAL = "https://redeconex.com.br/conex/";
  const NAVY = "#132549";
  const FONTE = "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
  const fundo = (cor) => `<rect width="1024" height="1024" rx="216" fill="${cor || NAVY}"/>`;
  const ICONES = {
    rede: `<svg viewBox="0 0 519 519" width="26" height="26" aria-hidden="true"><rect x="164.5" y="164.5" width="339" height="339" rx="77" fill="none" stroke="#3080DF" stroke-width="29"/><rect width="339" height="339" rx="77" fill="#fff"/><path d="M165 241A76 76 0 0 1 241 165H339V263A76 76 0 0 1 263 339H165Z" fill="#3080DF"/><g fill="none" stroke="${NAVY}" stroke-width="22"><path d="M74 90V208"/><path d="M63 101H113A30 30 0 0 1 113 161H63"/><path d="M106 161L148 208"/></g><path d="M438.6 359.7A52 52 0 1 0 438.6 419.3" fill="none" stroke="#3080DF" stroke-width="22"/></svg>`,
    painel: `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
    chat: `<path d="M340 255H685A100 100 0 0 1 785 355V560A100 100 0 0 1 685 660H425L322 775L300 650A100 100 0 0 1 240 560V355A100 100 0 0 1 340 255Z" fill="#F5F6F1"/><circle cx="440" cy="440" r="24" fill="#7A96CD"/><circle cx="572" cy="440" r="24" fill="#7A96CD"/>`,
    agenda: [195, 428, 661].flatMap((y) => [195, 428, 661].map((x) => `<rect x="${x}" y="${y}" width="168" height="168" rx="34" fill="${x === 428 && y === 428 ? "#3080DF" : "#F5F6F1"}"/>`)).join(""),
    vendas: `<g transform="translate(530 494) rotate(-45) scale(1.22)"><path d="M-250 0L-120 -150H230A40 40 0 0 1 270 -110V110A40 40 0 0 1 230 150H-120Z" fill="#F5F6F1"/><circle cx="-90" cy="0" r="44" fill="#3080DF"/></g>`,
    cobranca: `<circle cx="512" cy="500" r="288" fill="#F5F6F1"/><path d="M385 508L465 575L640 423" fill="none" stroke="#3080DF" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>`,
    gestor: `<rect x="215" y="535" width="150" height="210" rx="18" fill="#F5F6F1"/><rect x="435" y="385" width="150" height="360" rx="18" fill="#F5F6F1"/><rect x="655" y="235" width="150" height="510" rx="18" fill="#3080DF"/>`,
    entrega: `<g transform="translate(512 520)"><rect x="-330" y="-190" width="400" height="290" rx="36" fill="#F5F6F1"/><path d="M96 -110H215A36 36 0 0 1 244 -95L318 6A36 36 0 0 1 325 27V64A36 36 0 0 1 289 100H96Z" fill="#F5F6F1"/><circle cx="-200" cy="120" r="72" fill="#3080DF" stroke="${NAVY}" stroke-width="28"/><circle cx="210" cy="120" r="72" fill="#3080DF" stroke="${NAVY}" stroke-width="28"/></g>`,
    campo: `<path d="M398 356H626A58 58 0 0 1 684 416L648 664A102 102 0 0 1 547 752H477A102 102 0 0 1 376 664L340 416A58 58 0 0 1 398 356Z" fill="#F5F6F1"/><path d="M370 440C300 424 236 450 210 496C276 532 340 520 386 482Z" fill="#F5F6F1"/><path d="M654 440C724 424 788 450 814 496C748 532 684 520 638 482Z" fill="#F5F6F1"/><circle cx="452" cy="508" r="26" fill="${NAVY}"/><circle cx="572" cy="508" r="26" fill="${NAVY}"/>`,
  };
  const APPS = [["chat", "Chat"], ["agenda", "Agenda"], ["vendas", "Vendas"], ["cobranca", "Cobrança"], ["gestor", "Gestor"], ["entrega", "Entrega"], ["campo", "Campo"]];
  const icone = (id, ativo) => `<svg viewBox="0 0 1024 1024" width="22" height="22" aria-hidden="true">${fundo(ativo ? "#286dc4" : "#22386a")}${ICONES[id]}</svg>`;
  // app desta página, pelo endereço (chatconex.com.br, api.campoconex.com.br...)
  const aqui = (APPS.find(([id]) => new RegExp(`${id}conex\\.`).test(location.hostname)) || [])[0] || "";

  const estilo = (el, s) => Object.assign(el.style, s);

  const montar = () => {
    if (document.getElementById("conex-menu")) return;
    const raiz = document.createElement("div");
    raiz.id = "conex-menu";

    // aba fechada: fina, na borda esquerda, no meio da tela (as barras de cima e de baixo dos apps ficam livres)
    const aba = document.createElement("button");
    aba.type = "button";
    aba.setAttribute("aria-label", "Abrir o menu Rede Conex: painel e apps");
    aba.setAttribute("aria-expanded", "false");
    aba.setAttribute("aria-controls", "conex-menu-painel");
    aba.innerHTML = ICONES.rede;
    estilo(aba, {
      position: "fixed", left: "env(safe-area-inset-left, 0px)", top: "50%", transform: "translateY(-50%)", zIndex: "2147483000",
      width: "34px", height: "56px", padding: "0 0 0 2px", border: "0", borderRadius: "0 12px 12px 0", background: NAVY, cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(19,37,73,.28)", opacity: "0.94",
    });
    const svgAba = aba.querySelector("svg");
    estilo(svgAba, { width: "22px", height: "22px" });

    // painel aberto
    const painel = document.createElement("nav");
    painel.id = "conex-menu-painel";
    painel.setAttribute("aria-label", "Rede Conex: painel e apps");
    estilo(painel, {
      position: "fixed", left: "0", top: "0", bottom: "0", width: "232px", maxWidth: "86vw", zIndex: "2147483001", background: NAVY, color: "#dfe6f3",
      font: `500 14.5px/1.3 ${FONTE}`, boxShadow: "8px 0 28px rgba(10,20,40,.35)", transform: "translateX(-105%)", transition: "transform .18s ease",
      padding: "calc(env(safe-area-inset-top, 0px) + 16px) 12px calc(env(safe-area-inset-bottom, 0px) + 14px) calc(env(safe-area-inset-left, 0px) + 12px)",
      boxSizing: "border-box", overflowY: "auto", display: "flex", flexDirection: "column", gap: "2px", visibility: "hidden",
    });
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) painel.style.transition = "none";

    const topo = document.createElement("div");
    estilo(topo, { display: "flex", alignItems: "center", gap: "10px", padding: "0 6px 14px", color: "#fff", font: `800 17px/1 ${FONTE}` });
    topo.innerHTML = `${ICONES.rede}<span>Rede <b>Conex</b></span>`;
    estilo(topo.querySelector("b"), { color: "#7fb3f5", fontWeight: "800" });
    const fechar = document.createElement("button");
    fechar.type = "button";
    fechar.textContent = "✕";
    fechar.setAttribute("aria-label", "Fechar o menu");
    estilo(fechar, { marginLeft: "auto", border: "0", background: "none", color: "#c9d4e8", fontSize: "17px", cursor: "pointer", padding: "4px 6px" });
    topo.appendChild(fechar);
    painel.appendChild(topo);

    const item = (href, html, ativo, rotulo) => {
      const a = document.createElement("a");
      a.href = href;
      a.innerHTML = html;
      if (rotulo) a.setAttribute("aria-label", rotulo);
      if (ativo) a.setAttribute("aria-current", "page");
      estilo(a, {
        display: "flex", alignItems: "center", gap: "11px", padding: "9px 10px", borderRadius: "10px", textDecoration: "none",
        color: ativo ? "#fff" : "#dfe6f3", fontWeight: ativo ? "700" : "500", background: ativo ? "rgba(255,255,255,.12)" : "transparent",
      });
      a.addEventListener("mouseenter", () => { if (!ativo) a.style.background = "rgba(255,255,255,.07)"; });
      a.addEventListener("mouseleave", () => { if (!ativo) a.style.background = "transparent"; });
      a.addEventListener("focus", () => { a.style.outline = "2px solid #7fb3f5"; });
      a.addEventListener("blur", () => { a.style.outline = "none"; });
      return a;
    };
    const titulo = (t) => {
      const p = document.createElement("p");
      p.textContent = t;
      estilo(p, { margin: "14px 10px 6px", font: `700 11px/1 ${FONTE}`, letterSpacing: ".08em", textTransform: "uppercase", color: "#7f8fb0" });
      return p;
    };
    painel.appendChild(item(PORTAL, `${ICONES.painel}<span>Painel</span>`, false, "Voltar ao painel da Rede Conex"));
    painel.appendChild(titulo("Apps"));
    for (const [id, nome] of APPS) {
      const ativo = id === aqui;
      // trocar de app passa pelo portal, que gera a entrada já conectada no outro app
      painel.appendChild(item(ativo ? location.href : `${PORTAL}?abrir=${id}`, `${icone(id, ativo)}<span>${nome}</span>${ativo ? `<small>aqui</small>` : ""}`, ativo, ativo ? `${nome} (você está aqui)` : `Abrir o ${nome}`));
    }
    const aquiTag = painel.querySelector("small");
    if (aquiTag) estilo(aquiTag, { marginLeft: "auto", font: `600 11px/1 ${FONTE}`, color: "#aab7d1" });
    const pe = document.createElement("p");
    pe.textContent = "Apps que você não assina abrem o painel com a opção Conhecer.";
    estilo(pe, { margin: "auto 6px 0", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,.12)", font: `400 12px/1.4 ${FONTE}`, color: "#8e9bb8" });
    painel.appendChild(pe);

    let aberto = false;
    let timer = 0;
    const abrir = (v) => {
      clearTimeout(timer);
      aberto = v;
      aba.setAttribute("aria-expanded", String(v));
      if (v) painel.style.visibility = "visible";
      painel.style.transform = v ? "translateX(0)" : "translateX(-105%)";
      if (!v) timer = setTimeout(() => { if (!aberto) painel.style.visibility = "hidden"; }, 200);
    };
    const temMouse = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;
    aba.addEventListener("click", () => abrir(!aberto));
    if (temMouse) {
      aba.addEventListener("mouseenter", () => abrir(true));
      aba.addEventListener("mouseleave", () => { timer = setTimeout(() => abrir(false), 250); });
      painel.addEventListener("mouseleave", () => { timer = setTimeout(() => abrir(false), 250); });
      painel.addEventListener("mouseenter", () => clearTimeout(timer));
    }
    fechar.addEventListener("click", () => { abrir(false); aba.focus(); });
    document.addEventListener("keydown", (ev) => { if (ev.key === "Escape" && aberto) { abrir(false); aba.focus(); } });
    // toque fora fecha
    document.addEventListener("pointerdown", (ev) => { if (aberto && !raiz.contains(ev.target)) abrir(false); }, true);

    raiz.appendChild(aba);
    raiz.appendChild(painel);
    document.body.appendChild(raiz);
  };
  if (document.body) montar();
  else document.addEventListener("DOMContentLoaded", montar);
})();
