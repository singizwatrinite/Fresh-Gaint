// Wishlist page script (wishlist.js)
// Connected with global cart, responsive badges, and smooth in-place DOM removal

function initWishlistPage() {
  const grid = document.getElementById("wishlistGrid");
  const empty = document.getElementById("emptyState");
  const count = document.getElementById("wishCount");
  if (!grid || !empty || !count) return;

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  count.innerText = wishlist.length;

  grid.innerHTML = "";

  if (wishlist.length === 0) {
    empty.style.display = "block";
    return;
  } else {
    empty.style.display = "none";
  }

  wishlist.forEach(item => {
    const card = document.createElement("div");
    card.className = "wish-card";
    card.setAttribute("data-id", item.id);

    const priceFormatted = (Number(item.price) || 0).toLocaleString();

    card.innerHTML = `
      <img src="${item.img}" onerror="this.onerror=null;this.src='../images/tomatoes.jpg';" alt="${item.name}">
      <div class="wish-content">
        <h4>${item.name}</h4>
        <span class="wish-price">RWF ${priceFormatted}</span>
        <div class="wish-actions">
          <button class="add-cart" aria-label="Add ${item.name} to Cart">
            <i class="fas fa-shopping-cart mr-1"></i> Add to Cart
          </button>
          <button class="remove" aria-label="Remove ${item.name} from Wishlist">
            <i class="fas fa-trash-can mr-1"></i> Remove
          </button>
        </div>
      </div>
    `;

    // Add to cart with feedback
    const addBtn = card.querySelector(".add-cart");
    addBtn.onclick = () => {
      // Add product via products.js
      window.addToCart(item.id, 1);
      
      const originalText = addBtn.innerHTML;
      addBtn.innerHTML = '<i class="fas fa-check mr-1"></i> Added!';
      addBtn.style.background = "#16a34a";
      addBtn.style.color = "#ffffff";
      
      setTimeout(() => {
        addBtn.innerHTML = originalText;
        addBtn.style.background = "";
        addBtn.style.color = "";
      }, 1500);
    };

    // Remove directly from DOM without page reload
    const removeBtn = card.querySelector(".remove");
    removeBtn.onclick = () => {
      // Animate card removal
      card.style.transition = "all 0.25s ease-out";
      card.style.opacity = "0";
      card.style.transform = "scale(0.95)";
      
      setTimeout(() => {
        card.remove();
        let currentWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        currentWishlist = currentWishlist.filter(p => String(p.id) !== String(item.id));
        localStorage.setItem("wishlist", JSON.stringify(currentWishlist));
        
        count.innerText = currentWishlist.length;
        if (window.updateWishlistBadges) window.updateWishlistBadges();
        
        if (currentWishlist.length === 0) {
          empty.style.display = "block";
        }
      }, 250);
    };

    grid.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initWishlistPage();
});
