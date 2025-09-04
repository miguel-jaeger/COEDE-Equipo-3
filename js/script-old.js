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
      shadow.appendChild(bootstrap);

      fetch(file)
        .then(res => res.text())
        .then(html => {
          const doc = new DOMParser().parseFromString(html, "text/html");

          // Inyectar estilos <style> y <link>
          doc.querySelectorAll("style, link[rel='stylesheet']").forEach(el => {
            shadow.appendChild(el.cloneNode(true));
          });

          // Inyectar contenido del <body>
          if (doc.body) {
            shadow.appendChild(doc.body.cloneNode(true));
          }

          // Reinyectar <script> (si tu CV tenía JS interno)
          doc.querySelectorAll("script").forEach(oldScript => {
            const newScript = document.createElement("script");
            if (oldScript.src) {
              newScript.src = oldScript.src; // scripts externos
            } else {
              newScript.textContent = oldScript.textContent; // scripts inline
            }
            shadow.appendChild(newScript);
          });
        })
        .catch(err => {
          shadow.innerHTML = `<p style="color:red">Error cargando ${file}</p>`;
          console.error(err);
        });
    }
  });
});
