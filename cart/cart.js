const deliveryFee = 1500; // in RWF (aligned with checkout.js)
const minimumOrder = 5000; // in RWF
let discount = 0;

const cartItemsEl = document.getElementById("cartItems");
const emptyCart = document.getElementById("emptyCart");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");
const checkoutBtn = document.getElementById("checkoutBtn");
const promoBtn = document.getElementById("applyPromo");
const promoInput = document.getElementById("promoInput");
const toast = document.getElementById("toast");

function showMinToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function renderCart() {
  const cart = window.getCart();

  if (cart.length === 0) {
    cartItemsEl.innerHTML = "";
    cartItemsEl.style.display = "none";
    emptyCart.style.display = "block";
    subtotalEl.innerText = "RWF 0";
    totalEl.innerText = "RWF 0";
    window.updateCartBadges();
    return;
  }

  cartItemsEl.style.display = "block";
  emptyCart.style.display = "none";

  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}" data-price="${item.price}">
      <img src="${item.img}" onerror="this.onerror=null;this.src='../images/tomatoes.jpg';" alt="${item.name}">
      <div class="item-details">
        <h4>${item.name}</h4>
        <p>RWF ${(item.price || 0).toLocaleString()} / unit</p>
      </div>
      <div class="quantity">
        <button class="minus" aria-label="Decrease quantity">-</button>
        <span class="qty">${item.qty}</span>
        <button class="plus" aria-label="Increase quantity">+</button>
      </div>
      <div class="price">RWF ${((item.price || 0) * item.qty).toLocaleString()}</div>
      <button class="remove" aria-label="Remove item"><i class="fa fa-trash"></i></button>
    </div>
  `).join("");

  updateTotals();
  window.updateCartBadges();
}

function updateTotals() {
  const cart = window.getCart();
  let subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0);
  subtotal -= discount;
  if (subtotal < 0) subtotal = 0;

  subtotalEl.innerText = "RWF " + subtotal.toLocaleString();
  totalEl.innerText = "RWF " + (subtotal + deliveryFee).toLocaleString();
}

cartItemsEl.addEventListener("click", e => {
  const row = e.target.closest(".cart-item");
  if (!row) return;

  const id = row.dataset.id;
  let cart = window.getCart();
  const item = cart.find(i => String(i.id) === String(id));
  if (!item) return;

  if (e.target.classList.contains("plus")) {
    item.qty += 1;
  } else if (e.target.classList.contains("minus")) {
    if (item.qty > 1) item.qty -= 1;
  } else if (e.target.closest(".remove")) {
    cart = cart.filter(i => String(i.id) !== String(id));
  } else {
    return;
  }

  window.saveCart(cart);
  renderCart();
});

promoBtn.onclick = () => {
  const code = promoInput.value.trim().toUpperCase();
  discount = code === "FRESH10" ? 2000 : 0;
  if (code && code !== "FRESH10") showMinToast("Invalid promo code");
  else if (code === "FRESH10") showMinToast("Promo applied! 2,000 RWF off");
  updateTotals();
};

checkoutBtn.onclick = () => {
  const cart = window.getCart();
  if (cart.length === 0) return;

  // Requirement 2: Require login or registration if not authenticated
  if (typeof window.isCustomerLoggedIn === "function" && !window.isCustomerLoggedIn()) {
    window.location.href = "../login/login.html?tab=login&redirect=../checkout/checkout.html";
    return;
  }

  window.location.href = "../checkout/checkout.html";
};

document.addEventListener("DOMContentLoaded", renderCart);
