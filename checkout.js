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

const deliveryFee = 1.5;

function renderCheckoutSummary() {
  const cart = window.getCart();
  const itemsEl = document.getElementById("checkout-items");
  const subtotalEl = document.getElementById("checkout-subtotal");
  const totalEl = document.getElementById("checkout-total");

  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="empty-checkout">Your cart is empty. <a href="shopp.html">Continue shopping</a></p>';
    subtotalEl.innerText = "$0.00";
    totalEl.innerText = "$0.00";
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="checkout-item">
      <img src="${item.img}" alt="${item.name}">
      <div>
        <strong>${item.name}</strong>
        <span>${item.qty} × $${item.price.toFixed(2)}</span>
      </div>
      <span class="checkout-item-price">$${(item.qty * item.price).toFixed(2)}</span>
    </div>
  `).join("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  subtotalEl.innerText = "$" + subtotal.toFixed(2);
  totalEl.innerText = "$" + (subtotal + deliveryFee).toFixed(2);
}

function showThankYouModal() {
  const modal = document.getElementById("thankyou-modal");
  if (modal) modal.classList.remove("hidden");
}

function closeThankYouAndRedirect() {
  localStorage.removeItem("fruitiva_cart");
  window.updateCartBadges();
  window.location.href = "home.html";
}

function populateOrderHiddenFields(form) {
  const cart = window.getCart();
  const summary = cart.map(item => `${item.name} x${item.qty} - $${(item.qty * item.price).toFixed(2)}`).join("\n");
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
  renderCheckoutSummary();
  window.updateCartBadges();

  const email = document.getElementById("email");
  const emailError = document.getElementById("emailError");
  const addNote = document.getElementById("addNote");
  const noteField = document.getElementById("noteField");
  const form = document.getElementById("checkoutForm");
  const thankYouBtn = document.getElementById("thankyou-home-btn");

  if (email) {
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
        alert("Your cart is empty.");
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

      populateOrderHiddenFields(form);

      const placeBtn = document.getElementById("placeOrderBtn");
      if (placeBtn) { placeBtn.disabled = true; placeBtn.textContent = "Placing..."; }

      const fd = new FormData(form);
      const itemsList = cart.map(i => `${i.name} x${i.qty} — $${(i.qty*i.price).toFixed(2)}`).join("\n");
      const subtotal = cart.reduce((s,i) => s + i.price*i.qty, 0);
      const payload = {
        name: `${fd.get("firstName")||""} ${fd.get("lastName")||""}`.trim(),
        email: fd.get("email") || "",
        phone: fd.get("phone") || "",
        address: [fd.get("district"),fd.get("sector"),fd.get("cell"),fd.get("village"),fd.get("gate")].filter(Boolean).join(", "),
        note: fd.get("note") || "",
        items: itemsList,
        itemsCount: cart.reduce((s,i)=>s+i.qty,0),
        subtotal: "$" + subtotal.toFixed(2),
        delivery: "$" + deliveryFee.toFixed(2),
        total: "$" + (subtotal + deliveryFee).toFixed(2),
        payment: payment.value
      };

      await sendToSheets("order", payload);

      showThankYouModal();
      form.reset();
      if (placeBtn) { placeBtn.disabled = false; placeBtn.textContent = "Place Order"; }
    });
  }

  if (thankYouBtn) {
    thankYouBtn.addEventListener("click", closeThankYouAndRedirect);
  }
});
