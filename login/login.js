// Client Storefront Login & Password Recovery Script (login.js)
// Connected with Express Auth API & PostgreSQL database

window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    const redirectUrl = params.get("redirect");
    const token = params.get("token");

    // If already logged in, redirect right away
    if (window.isCustomerLoggedIn && window.isCustomerLoggedIn()) {
        window.location.href = redirectUrl || "../home/home.html";
        return;
    }

    if (redirectUrl) {
        const notice = document.getElementById("checkoutNotice");
        if (notice) notice.style.display = "block";
    }

    if (tab === "reset" || token) {
        showResetTab(token);
    } else if (tab === "login") {
        showLogin();
    } else if (tab === "register") {
        showRegister();
    }
});

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const resetForm = document.getElementById("resetPasswordForm");
const tabsContainer = document.querySelector(".auth-tabs");
const tabs = document.querySelectorAll(".tab");

function showLogin() {
    if (loginForm) loginForm.style.display = "block";
    if (registerForm) registerForm.style.display = "none";
    if (resetForm) resetForm.style.display = "none";
    if (tabsContainer) tabsContainer.style.display = "flex";

    if (loginForm) loginForm.classList.add("active");
    if (registerForm) registerForm.classList.remove("active");
    if (tabs.length >= 2) {
        tabs[1].classList.add("active");
        tabs[0].classList.remove("active");
    }
    clearErrors();
}

function showRegister() {
    if (loginForm) loginForm.style.display = "none";
    if (registerForm) registerForm.style.display = "block";
    if (resetForm) resetForm.style.display = "none";
    if (tabsContainer) tabsContainer.style.display = "flex";

    if (registerForm) registerForm.classList.add("active");
    if (loginForm) loginForm.classList.remove("active");
    if (tabs.length >= 2) {
        tabs[0].classList.add("active");
        tabs[1].classList.remove("active");
    }
    clearErrors();
}

function showResetTab(token) {
    if (loginForm) loginForm.style.display = "none";
    if (registerForm) registerForm.style.display = "none";
    if (resetForm) resetForm.style.display = "block";
    if (tabsContainer) tabsContainer.style.display = "none";

    const tokenInput = document.getElementById("resetTokenInput");
    if (tokenInput && token) {
        tokenInput.value = token;
    }
    clearErrors();
}

function clearErrors() {
    const regError = document.getElementById("regError");
    const loginError = document.getElementById("loginError");
    const resetError = document.getElementById("resetError");
    const resetSuccess = document.getElementById("resetSuccess");
    if (regError) { regError.style.display = "none"; regError.textContent = ""; }
    if (loginError) { loginError.style.display = "none"; loginError.textContent = ""; }
    if (resetError) { resetError.style.display = "none"; resetError.textContent = ""; }
    if (resetSuccess) { resetSuccess.style.display = "none"; resetSuccess.textContent = ""; }
}

function openForgot() {
    const modal = document.getElementById("forgotModal");
    const notice = document.getElementById("forgotNotice");
    if (notice) notice.style.display = "none";
    if (modal) modal.style.display = "flex";
}

function closeForgot() {
    const modal = document.getElementById("forgotModal");
    if (modal) modal.style.display = "none";
}

// Genuine Password Reset Request
async function sendReset() {
    const emailInput = document.getElementById("forgotEmail");
    const notice = document.getElementById("forgotNotice");
    const btn = document.getElementById("forgotSubmitBtn");
    const email = emailInput ? emailInput.value.trim() : "";

    if (!email || !email.includes("@")) {
        if (notice) {
            notice.style.display = "block";
            notice.style.background = "#fee2e2";
            notice.style.color = "#dc2626";
            notice.textContent = "Please enter a valid email address.";
        }
        return;
    }

    if (btn) {
        btn.disabled = true;
        btn.textContent = "Processing...";
    }

    try {
        const result = await window.requestPasswordReset(email);
        if (notice) {
            notice.style.display = "block";
            notice.style.background = "#ecfdf5";
            notice.style.color = "#065f46";
            notice.innerHTML = `
                <i class="fas fa-check-circle mr-1"></i>
                ${result.message || "If an account with that email exists, password reset instructions have been generated."}
            `;
        }
        if (emailInput) emailInput.value = "";
    } catch (err) {
        if (notice) {
            notice.style.display = "block";
            notice.style.background = "#fee2e2";
            notice.style.color = "#dc2626";
            notice.textContent = "Network error. Please try again later.";
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = "Send Recovery Instructions";
        }
    }
}

// ── Submit Handlers ──────────────────────────────────────────

// Register
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearErrors();

        const name = document.getElementById("regName").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const phone = document.getElementById("regPhone").value.trim();
        const password = document.getElementById("regPassword").value;
        const regBtn = document.getElementById("regBtn");
        const regError = document.getElementById("regError");

        if (password.length < 6) {
            regError.textContent = "Password must be at least 6 characters";
            regError.style.display = "block";
            return;
        }

        regBtn.disabled = true;
        const originalText = regBtn.textContent;
        regBtn.textContent = "Creating Account...";

        const result = await window.customerRegister({ name, email, password, phone });

        if (result.success) {
            const params = new URLSearchParams(window.location.search);
            const redirectUrl = params.get("redirect") || "../home/home.html";
            window.location.href = redirectUrl;
        } else {
            regError.textContent = result.error || "Registration failed. Please try again.";
            regError.style.display = "block";
            regBtn.disabled = false;
            regBtn.textContent = originalText;
        }
    });
}

// Login
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearErrors();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        const loginBtn = document.getElementById("loginBtn");
        const loginError = document.getElementById("loginError");

        loginBtn.disabled = true;
        const originalText = loginBtn.textContent;
        loginBtn.textContent = "Logging In...";

        const result = await window.customerLogin(email, password);

        if (result.success) {
            const params = new URLSearchParams(window.location.search);
            const redirectUrl = params.get("redirect") || "../home/home.html";
            window.location.href = redirectUrl;
        } else {
            loginError.textContent = result.error || "Invalid email or password.";
            loginError.style.display = "block";
            loginBtn.disabled = false;
            loginBtn.textContent = originalText;
        }
    });
}

// Reset Password Form submission
if (resetForm) {
    resetForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearErrors();

        const token = document.getElementById("resetTokenInput")?.value || "";
        const newPassword = document.getElementById("resetNewPassword")?.value || "";
        const confirmPassword = document.getElementById("resetConfirmPassword")?.value || "";
        const btn = document.getElementById("resetSubmitBtn");
        const errEl = document.getElementById("resetError");
        const successEl = document.getElementById("resetSuccess");

        if (!token) {
            if (errEl) {
                errEl.textContent = "Missing or invalid password reset token. Please request a new link.";
                errEl.style.display = "block";
            }
            return;
        }

        if (newPassword.length < 6) {
            if (errEl) {
                errEl.textContent = "New password must be at least 6 characters long.";
                errEl.style.display = "block";
            }
            return;
        }

        if (newPassword !== confirmPassword) {
            if (errEl) {
                errEl.textContent = "Passwords do not match. Please re-enter.";
                errEl.style.display = "block";
            }
            return;
        }

        if (btn) {
            btn.disabled = true;
            btn.textContent = "Resetting Password...";
        }

        const res = await window.resetPassword(token, newPassword);

        if (res.success) {
            if (successEl) {
                successEl.textContent = res.message || "Password successfully updated! Redirecting to login...";
                successEl.style.display = "block";
            }
            setTimeout(() => {
                showLogin();
            }, 1800);
        } else {
            if (errEl) {
                errEl.textContent = res.error || "Failed to reset password. The link may have expired.";
                errEl.style.display = "block";
            }
            if (btn) {
                btn.disabled = false;
                btn.textContent = "Update Password";
            }
        }
    });
}
