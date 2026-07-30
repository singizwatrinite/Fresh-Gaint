window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");

    if (tab === "login") {
        showLogin();
    } else if (tab === "register") {
        showRegister();
    }
});

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const tabs = document.querySelectorAll(".tab");

function showLogin() {
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
    tabs[1].classList.add("active");
    tabs[0].classList.remove("active");
}

function showRegister() {
    registerForm.classList.add("active");
    loginForm.classList.remove("active");
    tabs[0].classList.add("active");
    tabs[1].classList.remove("active");
}

function openForgot() {
    document.getElementById("forgotModal").style.display = "flex";
}

function closeForgot() {
    document.getElementById("forgotModal").style.display = "none";
}

function sendReset() {
    alert("Password reset link sent to your email 📧");
    closeForgot();
}
















