// Storefront Contact Form Script (contact.js)
// Connected directly to PostgreSQL backend via Express API (http://localhost:4000/api/contact)
// Google Sheets dependency removed per specification

const BACKEND_CONTACT_URL = "http://localhost:4000/api/contact";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm") || document.querySelector("form");
  const alertBox = document.getElementById("contact-alert");
  if (!form) return;

  function showAlert(msg, isSuccess) {
    if (!alertBox) {
      alert(msg);
      return;
    }
    alertBox.style.display = "block";
    alertBox.style.backgroundColor = isSuccess ? "#ecfdf5" : "#fef2f2";
    alertBox.style.color = isSuccess ? "#065f46" : "#991b1b";
    alertBox.style.border = `1px solid ${isSuccess ? "#a7f3d0" : "#fecaca"}`;
    alertBox.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <i class="fas ${isSuccess ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
        <span>${msg}</span>
      </div>
    `;
    alertBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // Pre-fill user data if authenticated
  try {
    const userJson = localStorage.getItem("user") || localStorage.getItem("fresh_user");
    if (userJson) {
      const user = JSON.parse(userJson);
      const nameInput = form.querySelector("input[name='fullName']") || form.querySelector("input[name='name']");
      const emailInput = form.querySelector("input[name='email']");
      if (nameInput && !nameInput.value && (user.name || user.fullName)) {
        nameInput.value = user.name || user.fullName;
      }
      if (emailInput && !emailInput.value && user.email) {
        emailInput.value = user.email;
      }
    }
  } catch (err) {
    console.debug("User prefill skipped", err);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector("button[type='submit']");
    const originalBtnText = submitBtn ? submitBtn.innerText : "Send Message";

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
    }

    if (alertBox) alertBox.style.display = "none";

    const fd = new FormData(form);
    const payload = {
      name: (fd.get("fullName") || fd.get("name") || "").toString().trim(),
      email: (fd.get("email") || "").toString().trim().toLowerCase(),
      subject: (fd.get("subject") || "General Inquiry").toString().trim(),
      message: (fd.get("message") || "").toString().trim()
    };

    if (!payload.name || !payload.email || !payload.message) {
      showAlert("Please fill in your name, email address, and message.", false);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
      }
      return;
    }

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken") || localStorage.getItem("fresh_token");
      const headers = {
        "Content-Type": "application/json"
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(BACKEND_CONTACT_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        showAlert(data.message || "Thank you for reaching out! Your message has been sent to Fresh Link support.", true);
        form.reset();
      } else {
        const errMsg = data.message || data.error || "Unable to send message. Please verify your details and try again.";
        showAlert(errMsg, false);
      }
    } catch (err) {
      console.error("Contact submission error:", err);
      showAlert("Connection error. Please check your internet connection or try again later.", false);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
      }
    }
  });
});
