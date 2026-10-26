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

function showThankYouModal() {
  const modal = document.getElementById("thankyou-modal");
  if (modal) modal.classList.remove("hidden");
}

function closeThankYouAndRedirect() {
  localStorage.removeItem("fruitiva_cart");
  const user = typeof window.getCustomerUser === "function" ? window.getCustomerUser() : null;
  if (user && user.id) {
    localStorage.removeItem("fruitiva_user_cart_" + user.id);
  }
  window.updateCartBadges();
  window.location.href = "../orders/myorders.html";
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
  paymentField.value = payment ? payment.value : "Not selected";
}

document.addEventListener("DOMContentLoaded", () => {
  // Requirement 2: Check authentication on checkout page
  if (typeof window.isCustomerLoggedIn === "function" && !window.isCustomerLoggedIn()) {
    window.location.href = "../login/login.html?tab=login&redirect=../checkout/checkout.html";
    return;
  }

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

  // Prefill authenticated customer details
  if (typeof window.getCustomerUser === "function") {
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

      const cart = window.getCart();
      if (cart.length === 0) {
        alert("Your cart is empty. Please add items to checkout.");
        return;
      }

      const terms = document.getElementById("termsAgree");
      if (terms && !terms.checked) {
        alert("Please agree to the Terms and Privacy Policy.");
        return;
      }

      const payment = document.querySelector('input[name="payment"]:checked');
      if (!payment) {
        alert("Please select a payment method.");
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

      if (!fullAddress) {
        alert("Please provide your delivery location.");
        if (placeBtn) { placeBtn.disabled = false; placeBtn.textContent = "Place Order"; }
        return;
      }

      populateOrderHiddenFields(form);

      // ── Send to FreshLink Backend Database ──
      try {
        const token = window.getCustomerToken();
        const backendBase = typeof BACKEND_URL !== "undefined" ? BACKEND_URL : "http://localhost:4000";

        // Map payment option to backend format
        let paymentFormatted = "Cash";
        if (payment.value === "momo") paymentFormatted = "MTN MoMo";
        else if (payment.value === "airtel") paymentFormatted = "Card";
        else if (payment.value === "bank") paymentFormatted = "Card";

        const orderRes = await fetch(backendBase + "/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({
            deliveryAddress: fullAddress,
            phone: customerPhone,
            paymentMethod: paymentFormatted,
            currency: "RWF",
            items: cart.map(item => ({
              productId: item._uuid || item.id,
              quantity: item.qty || 1,
              price: item.price,
              name: item.name
            }))
          })
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
          name: `${fd.get("firstName") || ""} ${fd.get("lastName") || ""}`.trim(),
          email: fd.get("email") || "",
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
        const user = window.getCustomerUser();
        if (user && user.id) {
          localStorage.removeItem("fruitiva_user_cart_" + user.id);
        }
        window.updateCartBadges();

        showThankYouModal();
        form.reset();
      } catch (err) {
        alert("Order Error: " + err.message);
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
