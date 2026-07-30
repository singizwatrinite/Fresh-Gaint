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

// Subscription page logic
let billing = "weekly";

document.addEventListener("DOMContentLoaded", () => {
  recalcAll();
  window.updateCartBadges();

  const subscribeForm = document.getElementById("subscribeForm");
  if (subscribeForm) {
    subscribeForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const confirmBtn = subscribeForm.querySelector(".confirm-btn");
      if (confirmBtn) { confirmBtn.disabled = true; confirmBtn.textContent = "Processing..."; }

      // Build chosen items list from in-page quantity rows
      const items = [];
      const extras = [];
      let totalItems = 0;
      document.querySelectorAll(".category").forEach(cat => {
        const catName = (cat.querySelector(".cat-header")?.textContent || "").trim();
        cat.querySelectorAll(".row").forEach(row => {
          const qty = parseInt(row.querySelector(".amount").innerText, 10);
          if (qty > 0) {
            const item = row.querySelector(".info strong").innerText;
            const price = row.querySelector(".price").innerText;
            items.push(`${catName} → ${item} x${qty} (${price})`);
            totalItems += qty;
          }
        });
        const extra = cat.querySelector(".extra-request-box textarea")?.value.trim();
        if (extra) extras.push(`${catName}: ${extra}`);
      });

      const startDate = document.querySelector("#calendarBox input[type='date']")?.value || "";

      const fd = new FormData(subscribeForm);
      const payload = {
        name: fd.get("fullName") || "",
        phone: fd.get("phone") || "",
        address: fd.get("address") || "",
        plan: billing,
        startDate: startDate,
        items: items.join("\n") || "(No products selected)",
        itemsCount: totalItems,
        extras: extras.join("\n") || "(none)",
        total: document.getElementById("grandTotal")?.innerText || "0 RWF"
      };

      await sendToSheets("subscription", payload);

      submitSubscription();
      subscribeForm.reset();
      if (confirmBtn) { confirmBtn.disabled = false; confirmBtn.textContent = "Confirm Subscription"; }
    });
  }
});

function selectPlan(type, card) {
  billing = type;
  document.querySelectorAll(".plan-card").forEach(c => c.classList.remove("active"));
  card.classList.add("active");
  document.getElementById("calendarBox").style.display = "block";
  recalcAll();
}

function updateQty(btn, change) {
  const row = btn.closest(".row");
  const amountSpan = row.querySelector(".amount");
  let val = Math.max(0, parseInt(amountSpan.innerText, 10) + change);
  amountSpan.innerText = val;
  recalcAll();
}

function recalcAll() {
  let grand = 0;
  document.querySelectorAll(".category").forEach(cat => {
    let catTotal = 0;
    cat.querySelectorAll(".row").forEach(row => {
      const qty = parseInt(row.querySelector(".amount").innerText, 10);
      const unitPrice = parseInt(row.dataset.price, 10);
      let sum = qty * unitPrice;
      if (billing === "monthly") sum *= 4;
      row.querySelector(".price").innerText = sum.toLocaleString() + " RWF";
      catTotal += sum;
    });
    cat.querySelector(".category-total span").innerText = catTotal.toLocaleString();
    grand += catTotal;
  });
  document.getElementById("grandTotal").innerText = grand.toLocaleString() + " RWF";
}

function toggleExtra(el) {
  const txt = el.nextElementSibling;
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
