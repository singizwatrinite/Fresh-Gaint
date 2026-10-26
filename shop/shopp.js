// Shop Page Script (shopp.js)
// Connected to live backend and global database loaded from products.js

const banners = {
  "Roots & Tubers": { title: "Fresh Roots & Tubers", icon: "fa-seedling", img: "../images/roots&tubers.jpg" },
  Vegetables: { title: "Fresh Organic Vegetables", icon: "fa-carrot", img: "../images/veg.jpg" },
  Fruits: { title: "Sweet Seasonal Fruits", icon: "fa-apple-whole", img: "../images/fruit banner.jpg" },
  Eggs: { title: "Farm Fresh Eggs", icon: "fa-egg", img: "../images/fineeggs.jpg" },
  "Recommended": { title: "Recommended For You", icon: "fa-thumbs-up", img: "../images/hero of vegetables.jpg" },
  "Special Offer": { title: "Special Offer Deals", icon: "fa-tag", img: "../images/fruit banner.jpg" }
};

let currentCategory = "All";

function renderProducts(items) {
  const grid = document.getElementById("shop-grid");
  const countEl = document.getElementById("products-count");
  if (!grid) return;

  if (countEl) {
    countEl.innerText = `Showing ${items.length} product${items.length === 1 ? '' : 's'}`;
  }

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 px-4 text-center">
        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl shadow-sm">
          <i class="fa-solid fa-leaf"></i>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">No matching fresh products found</h3>
        <p class="text-gray-500 max-w-md mx-auto mb-6 text-sm">We couldn't find any products matching your selected filters or search query. Try clearing your filters or searching for something else.</p>
        <button onclick="resetShopFilters()" class="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-6 py-3 rounded-2xl transition shadow-lg shadow-emerald-600/20 text-sm">
          <i class="fa-solid fa-rotate-left"></i> View All Products
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = items.map(p => `
    <div class="product-card bg-white p-6 rounded-3xl flex flex-col justify-between h-full shadow-sm hover:shadow-md transition">
      <div>
        <a href="product1.html?id=${p.id}" class="block group relative h-48 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden mb-4">
          <img src="${p.img}" onerror="this.onerror=null;this.src='../images/tomatoes.jpg';" class="h-32 object-contain group-hover:scale-110 transition duration-300" alt="${p.name}">
          <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
            <span class="bg-white text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold shadow-md">View Details</span>
          </div>
        </a>
        <a href="product1.html?id=${p.id}" class="hover:text-emerald-600 transition-colors">
          <h3 class="font-bold text-xl text-gray-900">${p.name}</h3>
        </a>
        <p class="text-sm text-gray-500 mt-1 line-clamp-2">${p.desc || ''}</p>
      </div>
      <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span class="text-lg font-black text-gray-900">${(Number(p.price) || 0).toLocaleString()} RWF</span>
        ${p.isAvailable !== false ? `
          <button onclick="window.addToCart('${p.id}')" class="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 active:scale-95 transition flex items-center gap-1.5 shadow-sm shadow-emerald-600/20">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
        ` : `
          <button disabled class="bg-gray-200 text-gray-500 cursor-not-allowed px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5">
            Unavailable
          </button>
        `}
      </div>
    </div>
  `).join("");
}

function updateUrlParams(category, query, sortBy) {
  const params = new URLSearchParams();
  if (category && category !== "All") {
    params.set("filter", category);
  }
  if (query) {
    params.set("search", query);
  }
  if (sortBy && sortBy !== "newest") {
    params.set("sortBy", sortBy);
  }
  const queryStr = params.toString();
  const newUrl = window.location.pathname + (queryStr ? "?" + queryStr : "");
  window.history.replaceState({ category, query, sortBy }, "", newUrl);
}

function applyFilterAndSearch(syncUrl = true) {
  if (window.isProductsLoading) {
    const grid = document.getElementById("shop-grid");
    if (grid && window.getSkeletonCardsHtml) {
      grid.innerHTML = window.getSkeletonCardsHtml(6);
    }
    return;
  }

  const searchInput = document.querySelector(".search-bar input");
  const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
  const sortSelect = document.getElementById("shop-sort");
  const sortValue = sortSelect ? sortSelect.value : "newest";
  const list = window.products || [];

  let filtered = list;
  if (currentCategory !== "All") {
    if (currentCategory === "Recommended" || currentCategory === "Special Offer") {
      filtered = filtered.filter(p => p.tags && p.tags.includes(currentCategory));
    } else {
      filtered = filtered.filter(p => p.cat === currentCategory);
    }
  }

  if (query) {
    filtered = filtered.filter(p => {
      const name = (p.name || "").toLowerCase();
      const cat = (p.cat || "").toLowerCase();
      const desc = (p.desc || "").toLowerCase();
      return name.includes(query) || cat.includes(query) || desc.includes(query);
    });
  }

  // Apply sort
  filtered = [...filtered];
  switch (sortValue) {
    case "price-asc":
      filtered.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
      break;
    case "price-desc":
      filtered.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
      break;
    case "name-asc":
      filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      break;
    case "name-desc":
      filtered.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
      break;
    case "newest":
    default:
      filtered.sort((a, b) => {
        const dateA = a.rawCreatedAt ? new Date(a.rawCreatedAt).getTime() : 0;
        const dateB = b.rawCreatedAt ? new Date(b.rawCreatedAt).getTime() : 0;
        return dateB - dateA;
      });
      break;
  }

  if (syncUrl) {
    updateUrlParams(currentCategory, query, sortValue);
  }

  renderProducts(filtered);
}

function filterCat(category, syncUrl = true) {
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
        const bannerImg = document.getElementById("banner-img");
        const bannerTitle = document.getElementById("banner-title");
        const bannerIcon = document.getElementById("banner-icon");
        if (bannerImg) bannerImg.src = banners[category].img;
        if (bannerTitle) bannerTitle.innerText = banners[category].title;
        if (bannerIcon) bannerIcon.className = `fas ${banners[category].icon} text-white text-3xl mr-4`;
        banner.classList.remove("opacity-0", "translate-y-4");
      }, 150);
    } else {
      banner.classList.add("hidden");
    }
  }

  applyFilterAndSearch(syncUrl);
}

function resetShopFilters() {
  const searchInput = document.querySelector(".search-bar input");
  if (searchInput) searchInput.value = "";
  const sortSelect = document.getElementById("shop-sort");
  if (sortSelect) sortSelect.value = "newest";
  filterCat("All", true);
}

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("shop-grid");
  // Show skeletons immediately if data is loading
  if (window.isProductsLoading && grid && window.getSkeletonCardsHtml) {
    grid.innerHTML = window.getSkeletonCardsHtml(6);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const requestedFilter = urlParams.get("filter") || urlParams.get("category");
  const searchQuery = urlParams.get("search");
  const sortBy = urlParams.get("sortBy");

  const searchInput = document.querySelector(".search-bar input");
  if (searchInput) {
    if (searchQuery) searchInput.value = searchQuery;
    searchInput.addEventListener("input", () => {
      applyFilterAndSearch(true);
    });
  }

  // Wire up sort dropdown
  const sortSelect = document.getElementById("shop-sort");
  if (sortSelect) {
    if (sortBy) sortSelect.value = sortBy;
    sortSelect.addEventListener("change", () => {
      applyFilterAndSearch(true);
    });
  }

  if (requestedFilter === "recommended") {
    filterCat("Recommended", false);
  } else if (requestedFilter === "special") {
    filterCat("Special Offer", false);
  } else if (requestedFilter && ["Roots & Tubers", "Vegetables", "Fruits", "Eggs"].includes(requestedFilter)) {
    filterCat(requestedFilter, false);
  } else {
    filterCat("All", false);
  }
});

// Re-render when live backend data arrives
document.addEventListener("productsLoaded", () => {
  const errContainer = document.getElementById("shop-error-container");
  if (errContainer) errContainer.classList.add("hidden");
  applyFilterAndSearch(false);
});

// Show retry banner if API failed
document.addEventListener("productsLoadError", (e) => {
  const errContainer = document.getElementById("shop-error-container");
  if (errContainer) {
    errContainer.classList.remove("hidden");
    errContainer.innerHTML = `
      <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 shadow-sm">
        <div class="flex items-center gap-3">
          <i class="fas fa-triangle-exclamation text-amber-600 text-xl"></i>
          <div>
            <p class="font-bold text-sm">Unable to connect to live catalog server</p>
            <p class="text-xs text-amber-700">Displaying offline grocery catalog. Click retry to reconnect.</p>
          </div>
        </div>
        <button onclick="window.fetchFreshProducts()" class="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition">
          <i class="fas fa-rotate"></i> Retry Connection
        </button>
      </div>
    `;
  }
  applyFilterAndSearch(false);
});
