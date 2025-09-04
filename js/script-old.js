document.addEventListener("DOMContentLoaded", () => {
  const miembros = {
    delacruz: "pages/delacruz.html",
    altamirano: "pages/altamirano.html",
    lopezpuma: "pages/lopezpuma.html",
    molleda: "pages/molleda.html",
    cordova: "pages/cordova.html"
  };

  Object.entries(miembros).forEach(([id, file]) => {
    const container = document.getElementById(id);
    if (!container) return;

    const shadow = container.attachShadow({ mode: "open" });

    // 🔹 Inyectar Bootstrap en cada Shadow DOM
    const bootstrapLink = document.createElement("link");
    bootstrapLink.rel = "stylesheet";
    bootstrapLink.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css";
    shadow.appendChild(bootstrapLink);

    fetch(file)
      .then(res => res.text())
      .then(html => {
        const doc = new DOMParser().parseFromString(html, "text/html");

        const fragment = document.createDocumentFragment();

        // 🔹 Aplicar fondo del body externo al :host del Shadow DOM
        let bodyBg = "";
        if (doc.body) {
          const bgStyle = doc.body.getAttribute("style") || "";
          bodyBg = bgStyle.includes("background") ? bgStyle : "";
        }
        const hostStyle = document.createElement("style");
        hostStyle.textContent = `
          :host {
            display: block;
            ${bodyBg};
          }
        `;
        fragment.appendChild(hostStyle);

        // 🔹 Copiar estilos <style> y <link> del HTML externo
        doc.querySelectorAll("style, link[rel='stylesheet']").forEach(el => {
          fragment.appendChild(el.cloneNode(true));
        });

        // 🔹 Copiar contenido del <body>
        if (doc.body) {
          Array.from(doc.body.childNodes).forEach(node => {
            fragment.appendChild(node.cloneNode(true));
          });
        }

        // 🔹 Reinyectar scripts (externos o inline)
        doc.querySelectorAll("script").forEach(oldScript => {
          const newScript = document.createElement("script");
          if (oldScript.src) {
            newScript.src = oldScript.src;
          } else {
            newScript.textContent = oldScript.textContent;
          }
          fragment.appendChild(newScript);
        });

        shadow.appendChild(fragment);
      })
      .catch(err => {
        shadow.innerHTML = `<p style="color:red">Error cargando ${file}</p>`;
        console.error(err);
      });
  });
});
