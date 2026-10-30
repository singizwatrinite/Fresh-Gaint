const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw4_qcu4_fPYqjCGKFDNEMHN7-LvvZtCFO1nq8klTSgNpmGm6gE5L1iX4WKGicJUGqaKQ/exec";

async function sendToSheets(type, payload) {
  try {
    await fetch(APPS_SCRIPT_URL, {
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

const deliveryFee = 1500; // in RWF

function renderCheckoutSummary() {
  const cart = window.getCart();
  const itemsEl = document.getElementById("checkout-items");
  const subtotalEl = document.getElementById("checkout-subtotal");
  const deliveryEl = document.getElementById("checkout-delivery");
  const totalEl = document.getElementById("checkout-total");

  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="empty-checkout">Your cart is empty. <a href="../shop/shopp.html">Continue shopping</a></p>';
    if (subtotalEl) subtotalEl.innerText = "RWF 0";
    if (deliveryEl) deliveryEl.innerText = "RWF 0";
    if (totalEl) totalEl.innerText = "RWF 0";
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="checkout-item">
      <img src="${item.img}" onerror="this.onerror=null;this.src='../images/tomatoes.jpg';" alt="${item.name}">
      <div>
        <strong>${item.name}</strong>
        <span>${item.qty} × RWF ${(item.price || 0).toLocaleString()}</span>
      </div>
      <span class="checkout-item-price">RWF ${((item.qty || 1) * (item.price || 0)).toLocaleString()}</span>
    </div>
  `).join("");

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  if (subtotalEl) subtotalEl.innerText = "RWF " + subtotal.toLocaleString();
  if (deliveryEl) deliveryEl.innerText = "RWF " + deliveryFee.toLocaleString();
  if (totalEl) totalEl.innerText = "RWF " + (subtotal + deliveryFee).toLocaleString();
}

function showThankYouModal(orderData) {
  const modal = document.getElementById("thankyou-modal");
  if (!modal) return;

  const orderId = orderData?.data?.displayId || (orderData?.data?.id ? `#ORD-${orderData.data.id.slice(0, 5).toUpperCase()}` : "");
  const p = modal.querySelector("p");
  if (p && orderId) {
    p.innerHTML = `Order Reference: <strong style="color: #1f7a5a; font-size: 1.1em;">${orderId}</strong><br>Your fresh groceries are on their way. We appreciate your trust in Fresh Link.`;
  }
  const homeBtn = document.getElementById("thankyou-home-btn");
  if (homeBtn) {
    const isAuth = typeof window.isCustomerLoggedIn === "function" && window.isCustomerLoggedIn();
    homeBtn.textContent = isAuth ? "View My Orders" : "Continue Shopping";
  }
  modal.classList.remove("hidden");
}

function closeThankYouAndRedirect() {
  localStorage.removeItem("fruitiva_cart");
  const user = typeof window.getCustomerUser === "function" ? window.getCustomerUser() : null;
  if (user && user.id) {
    localStorage.removeItem("fruitiva_user_cart_" + user.id);
  }
  window.updateCartBadges();

  const isAuth = typeof window.isCustomerLoggedIn === "function" && window.isCustomerLoggedIn();
  if (isAuth) {
    window.location.href = "../orders/myorders.html";
  } else {
    window.location.href = "../home/home.html";
  }
}

function showCheckoutAlert(message, type = "error") {
  let alertBox = document.getElementById("checkout-alert");
  if (!alertBox) {
    alertBox = document.createElement("div");
    alertBox.id = "checkout-alert";
    const container = document.querySelector(".checkout-container");
    if (container && container.parentElement) {
      container.parentElement.insertBefore(alertBox, container);
    }
  }
  const isErr = type === "error";
  alertBox.style.cssText = `max-width: 1120px; margin: 0 auto 24px auto; padding: 14px 20px; border-radius: 14px; font-size: 15px; font-weight: 500; display: flex; align-items: center; gap: 12px; transition: all 0.3s ease; ${
    isErr
      ? "background: #fef2f2; color: #991b1b; border: 1px solid #f87171;"
      : "background: #f0fdf4; color: #166534; border: 1px solid #86efac;"
  }`;
  alertBox.innerHTML = `<i class="fa-solid ${isErr ? "fa-circle-exclamation" : "fa-circle-check"}" style="font-size: 18px;"></i> <span>${message}</span>`;
  alertBox.scrollIntoView({ behavior: "smooth", block: "center" });
}

function clearCheckoutAlert() {
  const alertBox = document.getElementById("checkout-alert");
  if (alertBox) {
    alertBox.remove();
  }
}

function populateOrderHiddenFields(form) {
  const cart = window.getCart();
  const summary = cart.map(item => `${item.name} x${item.qty} - ${(item.qty * item.price).toLocaleString()} RWF`).join("\n");
  const payment = document.querySelector('input[name="payment"]:checked');
  const totalEl = document.getElementById("checkout-total");

  let summaryField = form.querySelector('input[name="orderSummary"]');
  let totalField = form.querySelector('input[name="orderTotal"]');
  let paymentField = form.querySelector('input[name="paymentMethod"]');

  if (!summaryField) {
    summaryField = document.createElement("input");
    summaryField.type = "hidden";
    summaryField.name = "orderSummary";
    form.appendChild(summaryField);
  }
  if (!totalField) {
    totalField = document.createElement("input");
    totalField.type = "hidden";
    totalField.name = "orderTotal";
    form.appendChild(totalField);
  }
  if (!paymentField) {
    paymentField = document.createElement("input");
    paymentField.type = "hidden";
    paymentField.name = "paymentMethod";
    form.appendChild(paymentField);
  }

  summaryField.value = summary || "Cart is empty";
  totalField.value = totalEl ? totalEl.innerText : "";
  paymentField.value = "MTN MoMo";
}

document.addEventListener("DOMContentLoaded", () => {
  // Allow both guest and authenticated customers to access checkout
  renderCheckoutSummary();
  window.updateCartBadges();

  const email = document.getElementById("email");
  const emailError = document.getElementById("emailError");
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const phone = document.getElementById("phone");
  const addNote = document.getElementById("addNote");
  const noteField = document.getElementById("noteField");
  const form = document.getElementById("checkoutForm");
  const thankYouBtn = document.getElementById("thankyou-home-btn");

  // Prefill authenticated customer details if logged in
  const isAuth = typeof window.isCustomerLoggedIn === "function" && window.isCustomerLoggedIn();
  if (isAuth && typeof window.getCustomerUser === "function") {
    const user = window.getCustomerUser();
    if (user) {
      if (email && user.email) email.value = user.email;
      if (phone && user.phone) phone.value = user.phone;
      if (user.name) {
        const parts = user.name.trim().split(" ");
        if (firstName) firstName.value = parts[0] || "";
        if (lastName) lastName.value = parts.slice(1).join(" ") || parts[0] || "";
      }
    }
  }

  if (email && emailError) {
    email.addEventListener("input", () => {
      emailError.textContent = email.value.includes("@") ? "" : "Please enter a valid email address";
    });
  }

  if (addNote && noteField) {
    addNote.addEventListener("change", () => {
      noteField.style.display = addNote.checked ? "block" : "none";
    });
  }

  if (form) {
    form.addEventListener("submit", async e => {
      e.preventDefault();
      clearCheckoutAlert();

      const cart = window.getCart();
      if (cart.length === 0) {
        showCheckoutAlert("Your cart is empty. Please add items to checkout.");
        return;
      }

      const payment = document.querySelector('input[name="payment"]:checked');
      if (!payment) {
        showCheckoutAlert("Please select a payment method.");
        return;
      }

      const placeBtn = document.getElementById("placeOrderBtn");
      if (placeBtn) {
        placeBtn.disabled = true;
        placeBtn.textContent = "Placing Order...";
      }

      const fd = new FormData(form);
      const district = (fd.get("district") || "").toString().trim();
      const sector = (fd.get("sector") || "").toString().trim();
      const cell = (fd.get("cell") || "").toString().trim();
      const village = (fd.get("village") || "").toString().trim();
      const gate = (fd.get("gate") || "").toString().trim();
      const fullAddress = [district, sector, cell, village, gate].filter(Boolean).join(", ");
      const customerPhone = (fd.get("phone") || "").toString().trim();
      const customerEmail = (fd.get("email") || "").toString().trim();
      const firstNameVal = (fd.get("firstName") || "").toString().trim();
      const lastNameVal = (fd.get("lastName") || "").toString().trim();
      const fullNameVal = `${firstNameVal} ${lastNameVal}`.trim();

      if (!fullAddress) {
        showCheckoutAlert("Please provide your delivery location (District, Sector, Cell, and Village).");
        if (placeBtn) { placeBtn.disabled = false; placeBtn.textContent = "Place Order"; }
        return;
      }

      if (!customerPhone || customerPhone.length < 6) {
        showCheckoutAlert("Please provide a valid phone number for delivery updates.");
        if (placeBtn) { placeBtn.disabled = false; placeBtn.textContent = "Place Order"; }
        return;
      }

      if (!customerEmail || !customerEmail.includes("@")) {
        showCheckoutAlert("Please enter a valid email address.");
        if (placeBtn) { placeBtn.disabled = false; placeBtn.textContent = "Place Order"; }
        return;
      }

      if (!fullNameVal) {
        showCheckoutAlert("Please enter your name.");
        if (placeBtn) { placeBtn.disabled = false; placeBtn.textContent = "Place Order"; }
        return;
      }

      populateOrderHiddenFields(form);

      // ── Send to FreshLink Backend Database ──
      try {
        const token = typeof window.getCustomerToken === "function" ? window.getCustomerToken() : null;
        const customerLoggedIn = typeof window.isCustomerLoggedIn === "function" && window.isCustomerLoggedIn();
        const hasValidAuth = Boolean(customerLoggedIn && token && token !== "null" && token !== "undefined");
        const backendBase = typeof BACKEND_URL !== "undefined" ? BACKEND_URL : "http://localhost:4000";

        // Map payment option to backend format (MTN MoMo)
        let paymentFormatted = "MTN MoMo";
        if (payment && payment.value === "momo") paymentFormatted = "MTN MoMo";

        const headers = {
          "Content-Type": "application/json"
        };
        // ONLY include Authorization header if customer has a verified active token; NEVER send Bearer null
        if (hasValidAuth) {
          headers["Authorization"] = "Bearer " + token;
        }

        const orderPayload = {
          deliveryAddress: fullAddress,
          phone: customerPhone,
          paymentMethod: paymentFormatted,
          currency: "RWF",
          items: cart.map(item => ({
            productId: item._uuid || item.id,
            quantity: item.qty || 1,
            name: item.name
          }))
        };

        // For guest checkouts, supply guest contact fields
        if (!hasValidAuth) {
          orderPayload.guestName = fullNameVal;
          orderPayload.guestEmail = customerEmail;
        }

        const orderRes = await fetch(backendBase + "/api/orders", {
          method: "POST",
          headers,
          body: JSON.stringify(orderPayload)
        });

        const orderData = await orderRes.json();

        if (!orderRes.ok) {
          throw new Error(orderData.error || orderData.message || "Failed to create order on server");
        }

        // Also sync to Google Sheets for redundancy if configured
        const itemsList = cart.map(i => `${i.name} x${i.qty} — ${(i.qty * i.price).toLocaleString()} RWF`).join("\n");
        const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
        sendToSheets("order", {
          orderId: orderData.data?.id || "",
          name: fullNameVal,
          email: customerEmail,
          phone: customerPhone,
          address: fullAddress,
          note: fd.get("note") || "",
          items: itemsList,
          itemsCount: cart.reduce((s, i) => s + i.qty, 0),
          subtotal: subtotal.toLocaleString() + " RWF",
          delivery: deliveryFee.toLocaleString() + " RWF",
          total: (subtotal + deliveryFee).toLocaleString() + " RWF",
          payment: paymentFormatted
        }).catch(() => {});

        // Clear active cart & user cart
        localStorage.removeItem("fruitiva_cart");
        const user = typeof window.getCustomerUser === "function" ? window.getCustomerUser() : null;
        if (user && user.id) {
          localStorage.removeItem("fruitiva_user_cart_" + user.id);
        }
        window.updateCartBadges();

        clearCheckoutAlert();
        showThankYouModal(orderData);
        form.reset();
      } catch (err) {
        showCheckoutAlert("Order Error: " + err.message);
      } finally {
        if (placeBtn) {
          placeBtn.disabled = false;
          placeBtn.textContent = "Place Order";
        }
      }
    });
  }

  if (thankYouBtn) {
    thankYouBtn.addEventListener("click", closeThankYouAndRedirect);
  }
});
