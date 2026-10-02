/* Vendor Integrity Check, "classic" static theme: the same pages as the live FastAPI form
   (vic/web/templates), served as files.
   - The check form opens the recorded case for the typed vendor, or the demo case, after a
     short pause; nothing is searched. Vendor matching is window.VIC.pickCase from site.js.
   - Manual-step upload forms say that uploads are saved only by the full tool. */
(function () {
  "use strict";

  const RUN_DELAY_MS = 2500;
  const timers = [];

  function wireCheckForm(root) {
    const form = document.getElementById("classic-check-form");
    if (!form) return;
    const button = form.querySelector("button[type=submit]");
    const status = document.getElementById("classic-run-status");
    const idleText = status ? status.textContent : "";

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const manifest = window.VIC_MANIFEST;
      const target = manifest && window.VIC
        ? window.VIC.pickCase(manifest, form.elements.name.value)
        : form.dataset.demoCase;
      if (!target) { form.elements.name.focus(); return; }
      button.disabled = true;
      if (status) status.textContent = "Running check... (this copy opens the recorded run)";
      timers.push(setTimeout(() => {
        window.location.href = root + "cases/" + target + "/index.html";
      }, RUN_DELAY_MS));
    });

    // Coming back with the browser's back button restores this page from cache mid-"run".
    window.addEventListener("pageshow", (event) => {
      if (!event.persisted) return;
      while (timers.length) clearTimeout(timers.pop());
      button.disabled = false;
      if (status) status.textContent = idleText;
    });
  }

  function wireUploadForms() {
    document.querySelectorAll("form.classic-upload").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        let note = form.querySelector(".upload-note");
        if (!note) {
          note = document.createElement("span");
          note.className = "upload-note";
          form.appendChild(note);
        }
        note.textContent = "Uploads are saved only in the full tool; this page is a recorded copy.";
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireCheckForm(document.body.dataset.root || "");
    wireUploadForms();
  });
})();
