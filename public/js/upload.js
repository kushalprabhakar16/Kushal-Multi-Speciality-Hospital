/**
 * Kushal Multi Speciality Hospital - Image/file upload + preview
 * In Demo Mode the file is read as a Data URL and stored in LocalStorage.
 * When the backend is online, files are POSTed to /api/upload as multipart/form-data.
 */
window.Upload = (function () {
  "use strict";

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];

  function validate(file) {
    if (!file) return "No file selected.";
    if (file.size > MAX_SIZE) return "File is too large (max 5MB).";
    if (!ALLOWED.includes(file.type)) return "Unsupported file type.";
    return null;
  }

  async function upload(file) {
    const err = validate(file);
    if (err) throw new Error(err);
    if (!API.isDemoMode()) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(window.API_CONFIG.API_BASE_URL + "/upload", {
        method: "POST",
        headers: { Authorization: "Bearer " + localStorage.getItem(window.API_CONFIG.TOKEN_KEY) },
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      return data.url;
    }
    return await Utils.readFileAsDataURL(file);
  }

  function bind(inputId, previewId, onReady) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    if (!input || !preview) return;
    input.addEventListener("change", async () => {
      const file = input.files && input.files[0];
      if (!file) { preview.innerHTML = ""; if (onReady) onReady(null); return; }
      const err = validate(file);
      if (err) { Validation.toast(err, "error"); preview.innerHTML = ""; if (onReady) onReady(null); return; }
      try {
        const url = await Utils.readFileAsDataURL(file);
        const isImg = file.type.startsWith("image/");
        preview.innerHTML = isImg
          ? '<img src="' + url + '" alt="preview" /><button type="button" class="preview-remove" aria-label="Remove"><i class="fa-solid fa-xmark"></i></button>'
          : '<div class="file-preview"><i class="fa-solid fa-file-lines"></i><span>' + Utils.escapeHtml(file.name) + '</span></div>';
        const rm = preview.querySelector(".preview-remove");
        if (rm) rm.addEventListener("click", () => { input.value = ""; preview.innerHTML = ""; if (onReady) onReady(null); });
        if (onReady) onReady(url);
      } catch (e) {
        Validation.toast("Could not read file", "error");
      }
    });
  }

  return { validate, upload, bind };
})();
