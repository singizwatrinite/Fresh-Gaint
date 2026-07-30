const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw4_qcu4_fPYqjCGKFDNEMHN7-LvvZtCFO1nq8klTSgNpmGm6gE5L1iX4WKGicJUGqaKQ/exec";

async function sendToSheets(type, payload) {
  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, ...payload })
    });
    return { ok: true };
  } catch (err) {
    console.error("Sheets send error:", err);
    return { ok: false, error: err };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const submitBtn = form.querySelector("button[type='submit']");
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending..."; }

    const fd = new FormData(form);
    const payload = {
      name: fd.get("fullName") || "",
      email: fd.get("email") || "",
      subject: fd.get("subject") || "",
      message: fd.get("message") || ""
    };

    const result = await sendToSheets("contact", payload);
    if (result.ok) {
      alert("Thank you for reaching out! We will contact you shortly.");
      form.reset();
    } else {
      alert("There was a network issue. Please try again later.");
    }

    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Send Message"; }
  });
});
