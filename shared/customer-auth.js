// ============================================================
// FreshLink Customer Authentication & Cart Session Utility
// Integrates Normal User Storefront with FreshLink Backend API
// ============================================================

(function() {
  const API_BASE = typeof BACKEND_URL !== "undefined" ? BACKEND_URL : "http://localhost:4000";

  // ─── Token & User Storage ─────────────────────────────────
  window.getCustomerToken = function() {
    return localStorage.getItem("fruitiva_customer_token") || null;
  };

  window.getCustomerUser = function() {
    try {
      const raw = localStorage.getItem("fruitiva_customer_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  window.isCustomerLoggedIn = function() {
    return Boolean(window.getCustomerToken() && window.getCustomerUser());
  };

  window.setCustomerSession = function(token, user) {
    localStorage.setItem("fruitiva_customer_token", token);
    localStorage.setItem("fruitiva_customer_user", JSON.stringify(user));
    // Also save standard keys for cross-component compatibility
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    if (user && user.id) {
      window.mergeGuestCartWithUserCart(user.id);
    }
    window.updateNavbarAuthUI();
  };

  window.clearCustomerSession = function() {
    localStorage.removeItem("fruitiva_customer_token");
    localStorage.removeItem("fruitiva_customer_user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.updateNavbarAuthUI();
  };

  window.customerLogout = function() {
    window.clearCustomerSession();
    window.location.href = "../home/home.html";
  };

  // ─── Cart Merging Logic ────────────────────────────────────
  /**
   * Preserves guest items added before logging in and merges them
   * with any previously saved items under this user's account.
   */
  window.mergeGuestCartWithUserCart = function(userId) {
    if (!userId) return;
    const userCartKey = "fruitiva_user_cart_" + userId;
    const guestCart = window.getCart ? window.getCart() : [];
    let savedUserCart = [];

    try {
      const rawSaved = localStorage.getItem(userCartKey);
      if (rawSaved) savedUserCart = JSON.parse(rawSaved);
    } catch {
      savedUserCart = [];
    }

    const merged = Array.isArray(savedUserCart) ? [...savedUserCart] : [];

    guestCart.forEach(function(guestItem) {
      const gId = String(guestItem.id);
      const existing = merged.find(function(item) { return String(item.id) === gId; });
      if (existing) {
        existing.qty = Number(existing.qty || 1) + Number(guestItem.qty || 1);
      } else {
        merged.push(guestItem);
      }
    });

    if (window.saveCart) {
      window.saveCart(merged);
    } else {
      localStorage.setItem("fruitiva_cart", JSON.stringify(merged));
    }
    localStorage.setItem(userCartKey, JSON.stringify(merged));

    if (window.updateCartBadges) {
      window.updateCartBadges();
    }
  };

  // ─── API Auth Calls ────────────────────────────────────────
  window.customerLogin = async function(email, password) {
    try {
      const res = await fetch(API_BASE + "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || data.message || "Invalid email or password" };
      }
      const token = data?.data?.token || data?.token;
      const user = data?.data?.user || data?.user;
      if (!token || !user) {
        return { success: false, error: "Authentication response incomplete" };
      }
      window.setCustomerSession(token, user);
      return { success: true, user, token };
    } catch (err) {
      return { success: false, error: "Network error. Please make sure the backend is running." };
    }
  };

  window.customerRegister = async function(payload) {
    try {
      const res = await fetch(API_BASE + "/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          password: payload.password,
          phone: payload.phone || null,
          role: "USER"
        })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || data.message || "Registration failed" };
      }
      const token = data?.data?.token || data?.token;
      const user = data?.data?.user || data?.user;
      if (!token || !user) {
        return { success: false, error: "Registration response incomplete" };
      }
      window.setCustomerSession(token, user);
      return { success: true, user, token };
    } catch (err) {
      return { success: false, error: "Network error. Please make sure the backend is running." };
    }
  };

  // ─── Password Recovery API Calls ───────────────────────────
  window.requestPasswordReset = async function(email) {
    try {
      const res = await fetch(API_BASE + "/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: (email || "").trim().toLowerCase() })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { success: false, error: data.message || data.error || "Unable to process password reset request" };
      }
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: "Network error connecting to authentication server." };
    }
  };

  window.resetPassword = async function(token, newPassword) {
    try {
      const res = await fetch(API_BASE + "/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { success: false, error: data.message || data.error || "Unable to reset password" };
      }
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: "Network error connecting to authentication server." };
    }
  };

  // ─── Navbar UI Updater ─────────────────────────────────────
  window.updateNavbarAuthUI = function() {
    const topRightEl = document.querySelector(".top-bar .top-right");
    if (!topRightEl) return;

    const user = window.getCustomerUser();
    const existingNavUser = topRightEl.querySelector(".customer-nav-user");
    const loginLinks = topRightEl.querySelectorAll('a[href*="login.html"]');

    if (user && window.isCustomerLoggedIn()) {
      // Hide standard login / register links
      loginLinks.forEach(function(l) { l.style.display = "none"; });

      if (!existingNavUser) {
        const userDiv = document.createElement("span");
        userDiv.className = "customer-nav-user";
        userDiv.style.display = "inline-flex";
        userDiv.style.alignItems = "center";
        userDiv.style.gap = "8px";
        userDiv.innerHTML = [
          '<a href="../orders/myorders.html" style="color:#16a34a;font-weight:600;"><i class="fa-solid fa-user-check"></i> ' + (user.name || "My Account") + '</a>',
          '<span style="opacity:0.4;">|</span>',
          '<a href="../orders/myorders.html"><i class="fa-solid fa-box"></i> My Orders</a>',
          '<span style="opacity:0.4;">|</span>',
          '<a href="#" id="customerLogoutNavBtn" style="color:#ef4444;"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>'
        ].join("");

        // Insert at the beginning of top-right
        topRightEl.insertBefore(userDiv, topRightEl.firstChild);
      } else {
        existingNavUser.style.display = "inline-flex";
      }

      const logoutBtn = document.getElementById("customerLogoutNavBtn");
      if (logoutBtn) {
        logoutBtn.onclick = function(e) {
          e.preventDefault();
          window.customerLogout();
        };
      }
    } else {
      // Show standard login links
      loginLinks.forEach(function(l) { l.style.display = ""; });
      if (existingNavUser) {
        existingNavUser.remove();
      }
    }
  };

  document.addEventListener("DOMContentLoaded", function() {
    window.updateNavbarAuthUI();
  });
})();
