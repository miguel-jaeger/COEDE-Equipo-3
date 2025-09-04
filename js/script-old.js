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

    // 🔹 Inyectar Bootstrap
    const bootstrapLink = document.createElement("link");
    bootstrapLink.rel = "stylesheet";
    bootstrapLink.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css";
    shadow.appendChild(bootstrapLink);

    fetch(file)
      .then(res => res.text())
      .then(html => {
        const doc = new DOMParser().parseFromString(html, "text/html");

        const fragment = document.createDocumentFragment();

        // 1) Estilos: cambiar body -> :host
        doc.querySelectorAll("style, link[rel='stylesheet']").forEach(el => {
          let cloned = el.cloneNode(true);
          if (el.tagName.toLowerCase() === "style") {
            cloned.textContent = cloned.textContent.replace(/\bbody\b/g, ":host");
          }
          fragment.appendChild(cloned);
        });

        // 2) Fondo personalizado: toma el background del body del archivo
        const bodyStyle = window.getComputedStyle(doc.body);
        const bg = bodyStyle.background || bodyStyle.backgroundColor;
        const hostStyle = document.createElement("style");
        hostStyle.textContent = `
          :host {
            display: block;
            background: ${bg};
          }
        `;
        fragment.appendChild(hostStyle);

        // 3) Contenido del <body>
        if (doc.body) {
          fragment.appendChild(doc.body.cloneNode(true));
        }

        // 4) Scripts
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
