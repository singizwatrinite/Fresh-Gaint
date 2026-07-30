const deliveryFee = 1.5;
const minimumOrder = 10;
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
    subtotalEl.innerText = "$0.00";
    totalEl.innerText = "$0.00";
    window.updateCartBadges();
    return;
  }

  cartItemsEl.style.display = "block";
  emptyCart.style.display = "none";

  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}" data-price="${item.price}">
      <img src="${item.img}" alt="${item.name}">
      <div class="item-details">
        <h4>${item.name}</h4>
        <p>$${item.price.toFixed(2)} / unit</p>
      </div>
      <div class="quantity">
        <button class="minus" aria-label="Decrease quantity">-</button>
        <span class="qty">${item.qty}</span>
        <button class="plus" aria-label="Increase quantity">+</button>
      </div>
      <div class="price">$${(item.price * item.qty).toFixed(2)}</div>
      <button class="remove" aria-label="Remove item"><i class="fa fa-trash"></i></button>
    </div>
  `).join("");

  updateTotals();
  window.updateCartBadges();
}

function updateTotals() {
  const cart = window.getCart();
  let subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  subtotal -= discount;
  if (subtotal < 0) subtotal = 0;

  subtotalEl.innerText = "$" + subtotal.toFixed(2);
  totalEl.innerText = "$" + (subtotal + deliveryFee).toFixed(2);
}

cartItemsEl.addEventListener("click", e => {
  const row = e.target.closest(".cart-item");
  if (!row) return;

  const id = parseInt(row.dataset.id);
  let cart = window.getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;

  if (e.target.classList.contains("plus")) {
    item.qty += 1;
  } else if (e.target.classList.contains("minus")) {
    if (item.qty > 1) item.qty -= 1;
  } else if (e.target.closest(".remove")) {
    cart = cart.filter(i => i.id !== id);
  } else {
    return;
  }

  window.saveCart(cart);
  renderCart();
});

promoBtn.onclick = () => {
  const code = promoInput.value.trim().toUpperCase();
  discount = code === "FRESH10" ? 2 : 0;
  if (code && code !== "FRESH10") showMinToast("Invalid promo code");
  else if (code === "FRESH10") showMinToast("Promo applied! $2 off");
  updateTotals();
};

checkoutBtn.onclick = () => {
  const cart = window.getCart();
  if (cart.length === 0) return;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0) - discount;
  if (subtotal < minimumOrder) {
    showMinToast("Minimum order is $10 to make a delivery 🚚");
    document.getElementById("minMessage").style.display = "block";
    return;
  }

  window.location.href = "checkout.html";
};

document.addEventListener("DOMContentLoaded", renderCart);
