document.addEventListener("DOMContentLoaded", () => {
  const rows = document.querySelectorAll(".tabela_link");

  rows.forEach(row => {
    row.addEventListener("click", event => {
      if (event.target.closest("a")) return; // nie przerywaj działania linków

      const url = row.getAttribute("data-href");
      if (url) {
        window.location.href = url;
      }
    });
  });
});
