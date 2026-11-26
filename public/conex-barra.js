// Portal Rede Conex (25/11/2026): quem chega pelo portal (?conex=1) vê um atalho "‹ Rede Conex" para voltar e
// trocar de app. Mesmo arquivo nos 7 apps (como o conex-erros.js). Só nesta aba: some quando a aba fecha.
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
  const montar = () => {
    if (document.getElementById("conex-portal-voltar")) return;
    const a = document.createElement("a");
    a.id = "conex-portal-voltar";
    a.href = "https://redeconex.com.br/conex/";
    a.textContent = "‹ Rede Conex";
    a.title = "Voltar ao Rede Conex e trocar de app";
    a.setAttribute("aria-label", "Voltar ao Rede Conex e trocar de app");
    // aba na borda esquerda, no meio da tela: as barras de baixo e os cabeçalhos dos apps ficam livres
    Object.assign(a.style, {
      position: "fixed", left: "env(safe-area-inset-left, 0px)", top: "50%", transform: "translateY(-50%)",
      zIndex: "2147483000", background: "#132549", color: "#fff", font: "600 12px/1.2 Inter, system-ui, sans-serif",
      padding: "10px 10px 10px 8px", borderRadius: "0 12px 12px 0", textDecoration: "none", boxShadow: "0 6px 18px rgba(19,37,73,.28)",
      opacity: "0.92",
    });
    document.body.appendChild(a);
  };
  if (document.body) montar();
  else document.addEventListener("DOMContentLoaded", montar);
})();
