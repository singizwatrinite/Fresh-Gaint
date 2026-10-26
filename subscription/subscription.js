// Storefront Subscription Script (subscription.js)
// Connected directly to PostgreSQL backend via Express API (http://localhost:4000/api/subscriptions)
// Replaces hardcoded products with real catalog data from backend
// Google Sheets dependency removed per specification

const BACKEND_SUBSCRIPTION_URL = "http://localhost:4000/api/subscriptions";

let billing = "weekly";

const categoryIcons = {
  "Vegetables": "🥕",
  "Fruits": "🍓",
  "Roots & Tubers": "🥔",
  "Eggs": "🥚",
  "Dairy": "🥛",
  "Bakery": "🍞"
};

function renderSubscriptionProducts() {
  const container = document.getElementById("subscription-categories");
  if (!container) return;

  const products = window.products || [];
  if (products.length === 0) {
    if (window.isProductsLoading) {
      container.innerHTML = `
        <div style="padding: 40px; text-align: center; color: #64748b;">
          <i class="fas fa-spinner fa-spin text-2xl text-emerald-600 mb-2"></i>
          <p>Loading real grocery catalog...</p>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div style="padding: 40px; text-align: center; color: #64748b;">
          <p>No products available for subscription at this time.</p>
        </div>
      `;
    }
    return;
  }

  // Group by category
  const grouped = {};
  products.forEach(p => {
    if (p.isAvailable === false) return; // Only show available products
    const cat = p.cat || "Other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(p);
  });

  const categoriesOrder = ["Roots & Tubers", "Vegetables", "Fruits", "Eggs", "Dairy", "Bakery"];
  const sortedCats = Object.keys(grouped).sort((a, b) => {
    const idxA = categoriesOrder.indexOf(a);
    const idxB = categoriesOrder.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  let html = "";
  sortedCats.forEach(cat => {
    const items = grouped[cat];
    const icon = categoryIcons[cat] || "🌱";

    html += `
      <div class="category" data-cat="${cat}">
        <h2 class="cat-header">${icon} ${cat}</h2>
        ${items.map(p => `
          <div class="row" data-product-id="${p.id}" data-price="${p.price}">
            <img src="${p.img}" onerror="this.onerror=null;this.src='../images/tomatoes.jpg';" alt="${p.name}">
            <div class="info">
              <strong>${p.name}</strong>
              <small>${(Number(p.price) || 0).toLocaleString()} RWF / ${p.unit || 'unit'}</small>
            </div>
            <div class="qty">
              <button type="button" onclick="updateSubQty(this, -1)">−</button>
              <span class="amount">0</span> ${p.unit || 'unit'}
              <button type="button" onclick="updateSubQty(this, 1)">+</button>
            </div>
            <span class="price">0 RWF</span>
          </div>
        `).join("")}
        <div class="extra-request-box">
          <span onclick="toggleExtra(this)" class="yellow-request">➕ Anything else you need in ${cat}?</span>
          <textarea placeholder="e.g. Special ripeness or packaging notes" aria-label="Extra notes for ${cat}"></textarea>
        </div>
        <div class="category-total">Subtotal: <strong><span>0</span> RWF</strong></div>
      </div>
    `;
  });

  container.innerHTML = html;
  recalcAll();
}

function showSubAlert(msg, type = "error") {
  const alertBox = document.getElementById("sub-alert");
  if (!alertBox) {
    alert(msg);
    return;
  }
  alertBox.style.display = "block";
  const isSuccess = type === "success";
  const isWarning = type === "warning";

  if (isSuccess) {
    alertBox.style.backgroundColor = "#ecfdf5";
    alertBox.style.color = "#065f46";
    alertBox.style.border = "1px solid #a7f3d0";
  } else if (isWarning) {
    alertBox.style.backgroundColor = "#fffbeb";
    alertBox.style.color = "#92400e";
    alertBox.style.border = "1px solid #fde68a";
  } else {
    alertBox.style.backgroundColor = "#fef2f2";
    alertBox.style.color = "#991b1b";
    alertBox.style.border = "1px solid #fecaca";
  }

  alertBox.innerHTML = `
    <div style="display:flex; align-items:center; gap:8px;">
      <i class="fas ${isSuccess ? 'fa-circle-check' : isWarning ? 'fa-triangle-exclamation' : 'fa-circle-exclamation'}"></i>
      <div>${msg}</div>
    </div>
  `;
  alertBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function selectPlan(type, card) {
  billing = type;
  document.querySelectorAll(".plan-card").forEach(c => c.classList.remove("active"));
  if (card) card.classList.add("active");
  const calBox = document.getElementById("calendarBox");
  if (calBox) calBox.style.display = "block";
  recalcAll();
}

function updateSubQty(btn, change) {
  const row = btn.closest(".row");
  if (!row) return;
  const amountSpan = row.querySelector(".amount");
  let val = Math.max(0, (parseInt(amountSpan.innerText, 10) || 0) + change);
  amountSpan.innerText = val;
  recalcAll();
}

function recalcAll() {
  let grand = 0;
  // Multipliers: weekly = 1, monthly = 4, custom = 2
  const multiplier = billing === "monthly" ? 4 : (billing === "custom" ? 2 : 1);

  document.querySelectorAll(".category").forEach(cat => {
    let catTotal = 0;
    cat.querySelectorAll(".row").forEach(row => {
      const qty = parseInt(row.querySelector(".amount")?.innerText, 10) || 0;
      const unitPrice = parseFloat(row.dataset.price) || 0;
      const sum = qty * unitPrice * multiplier;
      const priceSpan = row.querySelector(".price");
      if (priceSpan) priceSpan.innerText = sum.toLocaleString() + " RWF";
      catTotal += sum;
    });
    const subtotalSpan = cat.querySelector(".category-total span");
    if (subtotalSpan) subtotalSpan.innerText = catTotal.toLocaleString();
    grand += catTotal;
  });

  const grandTotalEl = document.getElementById("grandTotal");
  if (grandTotalEl) grandTotalEl.innerText = grand.toLocaleString() + " RWF";
}

function toggleExtra(el) {
  const txt = el.nextElementSibling;
  if (!txt) return;
  txt.style.display = txt.style.display === "block" ? "none" : "block";
}

function submitSubscription() {
  const modal = document.getElementById("thankyou-modal");
  if (modal) modal.classList.remove("hidden");
}

function closeThankYouModal() {
  const modal = document.getElementById("thankyou-modal");
  if (modal) modal.classList.add("hidden");
  window.location.href = "home.html";
}

document.addEventListener("DOMContentLoaded", () => {
  renderSubscriptionProducts();
  if (window.updateCartBadges) window.updateCartBadges();

  // Pre-fill user data if available
  try {
    const userJson = localStorage.getItem("user") || localStorage.getItem("fresh_user");
    if (userJson) {
      const user = JSON.parse(userJson);
      const nameInput = document.querySelector("#subscribeForm input[name='fullName']");
      const phoneInput = document.querySelector("#subscribeForm input[name='phone']");
      if (nameInput && !nameInput.value && (user.name || user.fullName)) {
        nameInput.value = user.name || user.fullName;
      }
      if (phoneInput && !phoneInput.value && user.phone) {
        phoneInput.value = user.phone;
      }
    }
  } catch (e) {
    console.debug("Prefill error", e);
  }

  const subscribeForm = document.getElementById("subscribeForm");
  if (subscribeForm) {
    subscribeForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const confirmBtn = subscribeForm.querySelector(".confirm-btn");
      const originalText = confirmBtn ? confirmBtn.innerText : "Confirm Subscription";

      // 1. Gather selected items with real product IDs
      const items = [];
      document.querySelectorAll(".row").forEach(row => {
        const qty = parseInt(row.querySelector(".amount")?.innerText, 10) || 0;
        const productId = row.dataset.productId;
        if (qty > 0 && productId) {
          items.push({ productId, quantity: qty });
        }
      });

      if (items.length === 0) {
        showSubAlert("Please select at least one grocery item for your subscription by clicking (+).", "warning");
        return;
      }

      // 2. Check customer authentication
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken") || localStorage.getItem("fresh_token");
      if (!token) {
        showSubAlert(
          `Please <a href="login.html?tab=login&redirect=subscription.html" style="text-decoration:underline; font-weight:bold;">log in to your account</a> or <a href="login.html?tab=register&redirect=subscription.html" style="text-decoration:underline; font-weight:bold;">create an account</a> to activate and manage your grocery subscription.`,
          "warning"
        );
        return;
      }

      if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Saving Subscription...';
      }

      const startDate = document.querySelector("#calendarBox input[type='date']")?.value || "";

      const payload = {
        plan: billing.toUpperCase(),
        frequency: billing === "monthly" ? "MONTHLY" : (billing === "custom" ? "BIWEEKLY" : "WEEKLY"),
        startDate: startDate || undefined,
        items: items
      };

      try {
        const res = await fetch(BACKEND_SUBSCRIPTION_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok) {
          submitSubscription();
          subscribeForm.reset();
          // Reset quantities
          document.querySelectorAll(".row .amount").forEach(span => span.innerText = "0");
          recalcAll();
        } else {
          showSubAlert(data.message || data.error || "Unable to save subscription. Please try again.", "error");
        }
      } catch (err) {
        console.error("Subscription submission error:", err);
        showSubAlert("Network error while connecting to server. Please try again.", "error");
      } finally {
        if (confirmBtn) {
          confirmBtn.disabled = false;
          confirmBtn.innerText = originalText;
        }
      }
    });
  }
});

// Re-render when live backend catalog arrives
document.addEventListener("productsLoaded", () => {
  renderSubscriptionProducts();
});
