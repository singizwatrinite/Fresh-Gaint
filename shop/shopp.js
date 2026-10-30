// Shop Page Script (shopp.js)
// Connected to live backend with server-side numbered pagination, search, sorting, and categories

const banners = {
  "Roots & Tubers": { title: "Fresh Roots & Tubers", icon: "fa-seedling", img: "../images/roots&tubers.jpg" },
  Vegetables: { title: "Fresh Organic Vegetables", icon: "fa-carrot", img: "../images/veg.jpg" },
  Fruits: { title: "Sweet Seasonal Fruits", icon: "fa-apple-whole", img: "../images/fruit banner.jpg" },
  Eggs: { title: "Farm Fresh Eggs", icon: "fa-egg", img: "../images/fineeggs.jpg" },
  "Recommended": { title: "Recommended For You", icon: "fa-thumbs-up", img: "../images/hero of vegetables.jpg" },
  "Special Offer": { title: "Special Offer Deals", icon: "fa-tag", img: "../images/fruit banner.jpg" }
};

// Pagination and Catalog State
let currentCategory = "All";
let currentPage = 1;
let itemsPerPage = 12;
let totalProducts = 0;
let totalPages = 1;
let isLoading = false;
let activeAbortController = null;
let requestSequence = 0;
let searchDebounceTimer = null;

// Renders the product cards in #shop-grid
function renderProducts(items, pagination) {
  const grid = document.getElementById("shop-grid");
  const countEl = document.getElementById("products-count");
  if (!grid) return;

  const total = pagination ? pagination.total : items.length;
  const start = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, total);

  if (countEl) {
    if (total === 0) {
      countEl.innerText = "0 products found";
    } else {
      countEl.innerHTML = `Showing <strong class="text-gray-900">${start}</strong> to <strong class="text-gray-900">${end}</strong> of <strong class="text-gray-900">${total}</strong> fresh product${total === 1 ? '' : 's'}`;
    }
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
    renderPagination(pagination);
    return;
  }

  grid.innerHTML = items.map(p => `
    <div class="product-card bg-white p-6 rounded-3xl flex flex-col justify-between h-full shadow-sm hover:shadow-md transition">
      <div>
        <a href="product1.html?id=${p.id}" onclick="try{sessionStorage.setItem('freshlink_view_product_id','${p.id}');localStorage.setItem('freshlink_view_product_id','${p.id}')}catch(e){}" class="block group relative h-48 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden mb-4">
          <img src="${p.img}" onerror="this.onerror=null;this.src='../images/logo-removebg-preview.png';" class="h-32 object-contain group-hover:scale-110 transition duration-300" alt="${p.name}">
          <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
            <span class="bg-white text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold shadow-md">View Details</span>
          </div>
        </a>
        <a href="product1.html?id=${p.id}" onclick="try{sessionStorage.setItem('freshlink_view_product_id','${p.id}');localStorage.setItem('freshlink_view_product_id','${p.id}')}catch(e){}" class="hover:text-emerald-600 transition-colors">
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

  renderPagination(pagination);
}

// Generates page number list with ellipsis for large catalogs
function getPageList(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = [];
  const delta = 1;
  const left = current - delta;
  const right = current + delta;

  pages.push(1);
  if (left > 2) pages.push("...");
  else if (left === 2) pages.push(2);

  const start = Math.max(2, left);
  const end = Math.min(total - 1, right);
  for (let i = start; i <= end; i++) {
    if (!pages.includes(i)) pages.push(i);
  }

  if (right < total - 1) pages.push("...");
  else if (right === total - 1) pages.push(total - 1);

  if (!pages.includes(total)) pages.push(total);
  return pages;
}

// Renders numbered pagination controls into #shop-pagination
function renderPagination(pagination) {
  const container = document.getElementById("shop-pagination");
  if (!container) return;

  if (!pagination || pagination.total === 0 || pagination.totalPages <= 1) {
    container.innerHTML = "";
    return;
  }

  const current = pagination.page;
  const total = pagination.totalPages;
  const pages = getPageList(current, total);

  let html = '<div class="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-gray-100 text-sm text-gray-600">';

  // Left side: summary
  const startItem = (current - 1) * itemsPerPage + 1;
  const endItem = Math.min(current * itemsPerPage, pagination.total);
  html += `<div>Showing <span class="font-bold text-gray-900">${startItem}</span> to <span class="font-bold text-gray-900">${endItem}</span> of <span class="font-bold text-gray-900">${pagination.total}</span> products</div>`;

  // Right side: numbered buttons
  html += '<div class="flex items-center gap-1.5">';

  // Prev Button
  const prevDisabled = current <= 1;
  html += `
    <button type="button" onclick="goToPage(${current - 1})" ${prevDisabled ? 'disabled' : ''} class="px-3.5 py-2 rounded-xl font-bold text-sm border transition flex items-center gap-1 ${
      prevDisabled
        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
        : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border-gray-200 shadow-sm active:scale-95'
    }" title="Previous page">
      <i class="fas fa-chevron-left text-xs"></i> Prev
    </button>
  `;

  // Numbered buttons
  pages.forEach(p => {
    if (p === "...") {
      html += '<span class="px-2 py-1 text-gray-400 font-bold">…</span>';
    } else {
      const isActive = p === current;
      html += `
        <button type="button" onclick="goToPage(${p})" ${isActive ? 'aria-current="page"' : ''} class="w-10 h-10 rounded-xl font-bold text-sm transition flex items-center justify-center ${
          isActive
            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 pointer-events-none'
            : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200 shadow-sm active:scale-95'
        }" title="Page ${p}">
          ${p}
        </button>
      `;
    }
  });

  // Next Button
  const nextDisabled = current >= total;
  html += `
    <button type="button" onclick="goToPage(${current + 1})" ${nextDisabled ? 'disabled' : ''} class="px-3.5 py-2 rounded-xl font-bold text-sm border transition flex items-center gap-1 ${
      nextDisabled
        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
        : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border-gray-200 shadow-sm active:scale-95'
    }" title="Next page">
      Next <i class="fas fa-chevron-right text-xs"></i>
    </button>
  `;

  html += '</div></div>';
  container.innerHTML = html;
}

// Navigates to a specific page
function goToPage(page) {
  if (page < 1 || page > totalPages || page === currentPage || isLoading) return;
  currentPage = page;
  fetchCatalogPage();

  const anchor = document.getElementById("active-category");
  if (anchor) {
    anchor.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Updates browser URL search params without page reload
function updateUrlParams(category, query, sortBy, page, limit) {
  const params = new URLSearchParams();
  if (category && category !== "All") params.set("filter", category);
  if (query) params.set("search", query);
  if (sortBy && sortBy !== "newest") params.set("sortBy", sortBy);
  if (page && page > 1) params.set("page", String(page));
  if (limit && limit !== 12) params.set("limit", String(limit));

  const queryStr = params.toString();
  const newUrl = window.location.pathname + (queryStr ? "?" + queryStr : "");
  window.history.replaceState({ category, query, sortBy, page, limit }, "", newUrl);
}

// Core server-side catalog fetcher with AbortController and sequence protection
async function fetchCatalogPage(syncUrl = true) {
  const grid = document.getElementById("shop-grid");
  const countEl = document.getElementById("products-count");
  const errContainer = document.getElementById("shop-error-container");

  // Abort previous in-flight request
  if (activeAbortController) {
    activeAbortController.abort();
  }
  activeAbortController = new AbortController();
  const seq = ++requestSequence;
  isLoading = true;

  const searchInput = document.querySelector(".search-bar input");
  const query = (searchInput ? searchInput.value : "").trim();
  const sortSelect = document.getElementById("shop-sort");
  const sortValue = sortSelect ? sortSelect.value : "newest";
  const pageSizeSelect = document.getElementById("shop-page-size");
  if (pageSizeSelect) {
    itemsPerPage = Number(pageSizeSelect.value) || 12;
  }

  // Show skeletons immediately
  if (grid && window.getSkeletonCardsHtml) {
    grid.innerHTML = window.getSkeletonCardsHtml(Math.min(itemsPerPage, 6));
  }
  if (countEl) {
    countEl.innerText = "Loading fresh produce...";
  }

  // Build API Query
  const backendBase = window.BACKEND_URL || (typeof BACKEND_URL !== "undefined" ? BACKEND_URL : "http://localhost:4000");
  const q = new URLSearchParams();
  q.set("page", String(currentPage));
  q.set("limit", String(itemsPerPage));

  if (currentCategory !== "All") {
    if (currentCategory === "Recommended") {
      q.set("recommended", "true");
    } else if (currentCategory === "Special Offer") {
      q.set("specialOffer", "true");
    } else {
      q.set("category", currentCategory);
    }
  }

  if (query) {
    q.set("search", query);
  }

  switch (sortValue) {
    case "price-asc":
      q.set("sortBy", "price");
      q.set("sortOrder", "asc");
      break;
    case "price-desc":
      q.set("sortBy", "price");
      q.set("sortOrder", "desc");
      break;
    case "name-asc":
      q.set("sortBy", "name");
      q.set("sortOrder", "asc");
      break;
    case "name-desc":
      q.set("sortBy", "name");
      q.set("sortOrder", "desc");
      break;
    case "newest":
    default:
      q.set("sortBy", "createdAt");
      q.set("sortOrder", "desc");
      break;
  }

  if (syncUrl) {
    updateUrlParams(currentCategory, query, sortValue, currentPage, itemsPerPage);
  }

  try {
    const res = await fetch(`${backendBase}/api/products?${q.toString()}`, {
      signal: activeAbortController.signal,
    });

    if (seq !== requestSequence) return; // Stale response discarded

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();
    if (seq !== requestSequence) return;

    if (errContainer) errContainer.classList.add("hidden");

    const rawList = Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? json : []);
    const mapper = window.mapApiProduct || (p => p);
    const items = rawList.map(mapper);

    const pagination = json?.pagination || {
      page: currentPage,
      limit: itemsPerPage,
      total: items.length,
      totalPages: Math.max(1, Math.ceil(items.length / itemsPerPage)),
      hasNextPage: false,
      hasPrevPage: false,
    };

    totalProducts = pagination.total;
    totalPages = pagination.totalPages;
    currentPage = pagination.page;

    renderProducts(items, pagination);
  } catch (err) {
    if (err.name === "AbortError") return; // Ignored deliberate abort
    if (seq !== requestSequence) return;

    console.warn("[FreshLink] Catalog fetch failed, falling back to cached products:", err);

    if (errContainer) {
      errContainer.classList.remove("hidden");
      errContainer.innerHTML = `
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 shadow-sm">
          <div class="flex items-center gap-3">
            <i class="fas fa-triangle-exclamation text-amber-600 text-xl"></i>
            <div>
              <p class="font-bold text-sm">Unable to reach live catalog server</p>
              <p class="text-xs text-amber-700">Displaying offline catalog fallback. Click retry to reconnect.</p>
            </div>
          </div>
          <button onclick="fetchCatalogPage()" class="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition">
            <i class="fas fa-rotate"></i> Retry
          </button>
        </div>
      `;
    }

    // Offline fallback using static products
    const staticList = window.products || [];
    let filtered = staticList;
    if (currentCategory !== "All") {
      if (currentCategory === "Recommended" || currentCategory === "Special Offer") {
        filtered = filtered.filter(p => p.tags && p.tags.includes(currentCategory));
      } else {
        filtered = filtered.filter(p => p.cat === currentCategory);
      }
    }
    if (query) {
      const qLower = query.toLowerCase();
      filtered = filtered.filter(p => (p.name || '').toLowerCase().includes(qLower));
    }
    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / itemsPerPage));
    const start = (currentPage - 1) * itemsPerPage;
    const slice = filtered.slice(start, start + itemsPerPage);

    renderProducts(slice, {
      page: currentPage,
      limit: itemsPerPage,
      total,
      totalPages: pages,
      hasNextPage: currentPage < pages,
      hasPrevPage: currentPage > 1,
    });
  } finally {
    if (seq === requestSequence) {
      isLoading = false;
    }
  }
}

// Category filter handler: resets page to 1
function filterCat(category, syncUrl = true) {
  currentCategory = category;
  currentPage = 1; // Always reset to page 1 on category change

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

  fetchCatalogPage(syncUrl);
}

// Resets all filters back to defaults
function resetShopFilters() {
  const searchInput = document.querySelector(".search-bar input");
  if (searchInput) searchInput.value = "";
  const sortSelect = document.getElementById("shop-sort");
  if (sortSelect) sortSelect.value = "newest";
  const pageSizeSelect = document.getElementById("shop-page-size");
  if (pageSizeSelect) pageSizeSelect.value = "12";
  itemsPerPage = 12;
  currentPage = 1;
  filterCat("All", true);
}

// Global search integration helper
window.applyFilterAndSearch = function () {
  currentPage = 1;
  fetchCatalogPage(true);
};

// Initial DOM Load
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const requestedFilter = urlParams.get("filter") || urlParams.get("category");
  const searchQuery = urlParams.get("search");
  const sortBy = urlParams.get("sortBy");
  const pageParam = parseInt(urlParams.get("page") || "1", 10);
  const limitParam = parseInt(urlParams.get("limit") || "12", 10);

  if (pageParam && pageParam > 1) currentPage = pageParam;
  if (limitParam === 12 || limitParam === 24) itemsPerPage = limitParam;

  const pageSizeSelect = document.getElementById("shop-page-size");
  if (pageSizeSelect) {
    pageSizeSelect.value = String(itemsPerPage);
    pageSizeSelect.addEventListener("change", (e) => {
      itemsPerPage = Number(e.target.value) || 12;
      currentPage = 1; // Reset to page 1 on page size change
      fetchCatalogPage(true);
    });
  }

  const searchInput = document.querySelector(".search-bar input");
  if (searchInput) {
    if (searchQuery) searchInput.value = searchQuery;
    searchInput.addEventListener("input", () => {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        currentPage = 1; // Reset to page 1 on search change
        fetchCatalogPage(true);
      }, 300);
    });
  }

  const sortSelect = document.getElementById("shop-sort");
  if (sortSelect) {
    if (sortBy) sortSelect.value = sortBy;
    sortSelect.addEventListener("change", () => {
      currentPage = 1; // Reset to page 1 on sort change
      fetchCatalogPage(true);
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
