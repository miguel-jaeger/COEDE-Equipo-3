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
    if (container) {
      const shadow = container.attachShadow({ mode: "open" });

      // 🔹 Inyectar Bootstrap automáticamente en cada Shadow DOM
      const bootstrapLink = document.createElement("link");
      bootstrapLink.rel = "stylesheet";
      bootstrapLink.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css";
      shadow.appendChild(bootstrapLink);

      fetch(file)
        .then(res => res.text())
        .then(html => {
          const doc = new DOMParser().parseFromString(html, "text/html");

          // 🔹 Crear un fragmento para mantener orden
          const fragment = document.createDocumentFragment();

          // 1) Agregar estilos <style> y <link>
          doc.querySelectorAll("link[rel='stylesheet'], style").forEach(el => {
            if (el.tagName.toLowerCase() === "style") {
              // Cambiar body -> :host para que los estilos funcionen dentro del Shadow DOM
              el.textContent = el.textContent.replace(/\bbody\b/g, ":host");
            }
            fragment.appendChild(el.cloneNode(true));
          });

          // 2) Agregar el contenido del <body>
          if (doc.body) {
            fragment.appendChild(doc.body.cloneNode(true));
          }

          // 3) Agregar los scripts (internos o externos)
          doc.querySelectorAll("script").forEach(oldScript => {
            const newScript = document.createElement("script");
            if (oldScript.src) {
              newScript.src = oldScript.src; // scripts externos
            } else {
              newScript.textContent = oldScript.textContent; // scripts inline
            }
            fragment.appendChild(newScript);
          });

          // 4) Insertar todo en el Shadow DOM
          shadow.appendChild(fragment);
        })
        .catch(err => {
          shadow.innerHTML = `<p style="color:red">Error cargando ${file}</p>`;
          console.error(err);
        });
    }
  });
});
