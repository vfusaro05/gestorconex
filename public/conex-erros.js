/*
 * Padrão Conex — alerta de erros do navegador (18/11/2026). O MESMO arquivo nos 7 apps.
 *   <script src="/js/conex-erros.js" data-app="rede" defer></script>
 * Erros de JavaScript e promessas rejeitadas sem tratamento vão para a central de erros da Rede Conex
 * (https://redeconex.com.br/api/erros → painel da Rede, aba Erros, com e-mail quando aparece um erro novo).
 * Manda no máximo 10 por página, sem repetir, e nunca atrapalha a tela (falha em silêncio).
 */
(function () {
  var s = document.currentScript;
  var APP = (s && s.getAttribute("data-app")) || "";
  var DESTINO = (s && s.getAttribute("data-url")) || "https://redeconex.com.br/api/erros";
  if (!APP) return;
  var enviados = 0;
  var vistos = {};
  // barulho que não é erro do app: extensões do navegador, scripts de outro domínio sem detalhe, avisos do ResizeObserver
  var IGNORAR = /^(Script error\.?|ResizeObserver loop|Non-Error promise rejection captured)|chrome-extension:|moz-extension:|safari-extension:/i;
  function enviar(mensagem, pilha) {
    try {
      mensagem = String(mensagem || "erro sem mensagem");
      pilha = String(pilha || "");
      if (IGNORAR.test(mensagem) || IGNORAR.test(pilha) || enviados >= 10) return;
      var chave = mensagem + "|" + pilha.slice(0, 200);
      if (vistos[chave]) return;
      vistos[chave] = 1;
      enviados++;
      var corpo = JSON.stringify({
        app: APP,
        origem: "navegador",
        mensagem: mensagem.slice(0, 1000),
        pilha: pilha.slice(0, 4000),
        url: String(location.href).split("#")[0].slice(0, 500),
        versao: String(window.CONEX_VERSAO || ""),
      });
      if (navigator.sendBeacon && navigator.sendBeacon(DESTINO, new Blob([corpo], { type: "text/plain" }))) return;
      fetch(DESTINO, { method: "POST", body: corpo, mode: "cors", keepalive: true, credentials: "omit", headers: { "Content-Type": "text/plain" } }).catch(function () {});
    } catch (e) {
      /* nunca atrapalha a tela */
    }
  }
  window.addEventListener("error", function (e) {
    if (!e || (!e.error && !e.message)) return; // imagem/arquivo que não carregou não é erro de código
    enviar(e.message || (e.error && e.error.message), (e.error && e.error.stack) || (e.filename ? e.filename + ":" + e.lineno + ":" + e.colno : ""));
  });
  window.addEventListener("unhandledrejection", function (e) {
    var r = e && e.reason;
    enviar((r && r.message) || String(r), r && r.stack);
  });
  window.conexReportarErro = function (erro) {
    enviar(erro && erro.message ? erro.message : String(erro), erro && erro.stack);
  };
})();
