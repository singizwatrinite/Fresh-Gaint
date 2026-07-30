// Shop Page Script (shopp.js)
// Relies on global database loaded from products.js

const banners = {
  "Roots & Tubers": { title:"Fresh Roots & Tubers", icon:"fa-seedling", img:"roots&tubers.jpg"},
  Vegetables: { title:"Fresh Organic Vegetables", icon:"fa-carrot", img:"veg.jpg"},
  Fruits: { title:"Sweet Seasonal Fruits", icon:"fa-apple-whole", img:"fruit banner.jpg"},
  Eggs: { title:"Farm Fresh Eggs", icon:"fa-egg", img:"fineeggs.jpg"},
  "Recommended": { title:"Recommended For You", icon:"fa-thumbs-up", img:"vegetables.jpg"},
  "Special Offer": { title:"Special Offer Deals", icon:"fa-tag", img:"fruit banner.jpg"}
};

let currentCategory = "All";

function renderProducts(items) {
  const grid = document.getElementById("shop-grid");
  if (!grid) return;

  if (items.length === 0) {
    grid.innerHTML = '<p class="text-gray-500 col-span-3 text-center py-12">No products found in this category.</p>';
    return;
  }

  grid.innerHTML = items.map(p => `
    <div class="product-card bg-white p-6 rounded-3xl flex flex-col justify-between h-full">
      <div>
        <a href="product1.html?id=${p.id}" class="block group relative h-48 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden mb-4">
          <img src="${p.img}" class="h-32 object-contain group-hover:scale-110 transition duration-300" alt="${p.name}">
          <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
            <span class="bg-white text-green-700 px-4 py-2 rounded-xl text-sm font-bold shadow-md">View Details</span>
          </div>
        </a>
        <a href="product1.html?id=${p.id}" class="hover:text-green-600 transition-colors">
          <h3 class="font-bold text-xl">${p.name}</h3>
        </a>
        <p class="text-sm text-gray-500 mt-1 line-clamp-2">${p.desc || ''}</p>
      </div>
      <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span class="text-lg font-black text-gray-900">${p.price.toLocaleString()} RWF</span>
        <button onclick="window.addToCart(${p.id})" class="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-700 active:scale-95 transition flex items-center gap-1.5">
          <i class="fas fa-shopping-cart"></i> Add to Cart
        </button>
      </div>
    </div>
  `).join("");
}

function filterCat(category) {
  currentCategory = category;

  document.querySelectorAll("aside .cat-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.innerText.trim() === category || (category === "All" && btn.innerText.includes("All"))) {
      btn.classList.add("active");
    }
  });

  document.querySelectorAll(".lg\\:hidden .cat-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.innerText.trim() === category || (category === "All" && btn.innerText.trim() === "All")) {
      btn.classList.add("active");
    }
  });

  const activeCategoryTitle = document.getElementById("active-category");
  if (activeCategoryTitle) {
    activeCategoryTitle.innerText = category === "All" ? "All Products" : category;
  }

  const banner = document.getElementById("category-banner");
  if (banner) {
    if (category !== "All" && banners[category]) {
      banner.classList.remove("hidden");
      banner.classList.add("opacity-0", "translate-y-4");

      setTimeout(() => {
        document.getElementById("banner-img").src = banners[category].img;
        document.getElementById("banner-title").innerText = banners[category].title;
        document.getElementById("banner-icon").className = `fas ${banners[category].icon} text-white text-3xl mr-4`;
        banner.classList.remove("opacity-0", "translate-y-4");
      }, 200);
    } else {
      banner.classList.add("hidden");
    }
  }

  let filtered;
  const list = window.products || [];
  if (category === "All") {
    filtered = list;
  } else if (category === "Recommended" || category === "Special Offer") {
    filtered = list.filter(p => p.tags && p.tags.includes(category));
  } else {
    filtered = list.filter(p => p.cat === category);
  }
  renderProducts(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const requestedFilter = urlParams.get("filter");

  if (requestedFilter === "recommended") {
    filterCat("Recommended");
  } else if (requestedFilter === "special") {
    filterCat("Special Offer");
  } else if (requestedFilter && ["Roots & Tubers", "Vegetables", "Fruits", "Eggs"].includes(requestedFilter)) {
    filterCat(requestedFilter);
  } else {
    filterCat("All");
  }
});
