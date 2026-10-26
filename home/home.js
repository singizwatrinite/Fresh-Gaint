const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let index = 0;

function showSlide(i) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[i].classList.add('active');
    dots[i].classList.add('active');
}

document.querySelector('.next').onclick = () => {
    index = (index + 1) % slides.length;
    showSlide(index);
};

document.querySelector('.prev').onclick = () => {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
};

dots.forEach((dot, i) => {
    dot.onclick = () => {
        index = i;
        showSlide(index);
    };
});

/* Auto Slide */
setInterval(() => {
    index = (index + 1) % slides.length;
    showSlide(index);
}, 6000);











const veggieData = [
    {
        title: "Veggies",
        text: "<strong>100%</strong> Organic Products",
        img: "https://pngimg.com/uploads/carrot/carrot_PNG4985.png",
        bg: "linear-gradient(135deg, #fde2e2, #fff)",
        circle: "#fbbbbb"
    },
    {
        title: "Leafy Greens",
        text: "<strong>Fresh</strong> From Local Farms",
        img: "https://pngimg.com/uploads/broccoli/broccoli_PNG72963.png",
        bg: "linear-gradient(135deg, #e0f7e9, #fff)",
        circle: "#9be7c4"
    }
];

const fruitData = [
    {
        title: "Fruits",
        text: "<strong>100%</strong> Fresh Products",
        img: "https://pngimg.com/uploads/orange/orange_PNG800.png",
        bg: "linear-gradient(135deg, #fff3a3, #fff)",
        circle: "#ffe066"
    },
    {
        title: "Seasonal Fruits",
        text: "<strong>Sweet</strong> & Juicy Picks",
        img: "https://pngimg.com/uploads/apple/apple_PNG124.png",
        bg: "linear-gradient(135deg, #ffe5e5, #fff)",
        circle: "#ffb3b3"
    }
];

var promoIndex = 0;


setInterval(() => {
    
    promoIndex = (promoIndex + 1) % veggieData.length;


    updatePromo(
        "promoVeggies",
        "veggieImg",
        "veggieTitle",
        "veggieText",
        veggieData[promoIndex]
    );

    updatePromo(
        "promoFruits",
        "fruitImg",
        "fruitTitle",
        "fruitText",
        
        
fruitData[promoIndex]

    );

}, 6000);

function updatePromo(cardId, imgId, titleId, textId, data) {
    const card = document.getElementById(cardId);
    const img = document.getElementById(imgId);
    const title = document.getElementById(titleId);
    const text = document.getElementById(textId);
    const circle = card.querySelector(".semi-circle");

    img.classList.add("fade-out");
    title.classList.add("fade-out");
    text.classList.add("fade-out");

    setTimeout(() => {
        img.src = data.img;
        title.innerHTML = data.title;
        text.innerHTML = data.text;
        card.style.background = data.bg;
        circle.style.background = data.circle;

        img.classList.remove("fade-out");
        title.classList.remove("fade-out");
        text.classList.remove("fade-out");
        img.classList.add("fade-in");
        title.classList.add("fade-in");
        text.classList.add("fade-in");
    }, 500);
}






document.querySelectorAll(".like-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const product = {
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: btn.dataset.price,
      img: btn.dataset.img
    };

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (!wishlist.find(item => item.id === product.id)) {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
      btn.style.color = "#e11d48";
    }
  });
});

function renderRecommendedProducts() {
  const grid = document.getElementById("recommended-grid");
  if (!grid) return;

  if (window.isProductsLoading && window.getSkeletonCardsHtml) {
    grid.innerHTML = window.getSkeletonCardsHtml(4);
    return;
  }

  if (!window.products || window.products.length === 0) return;

  const recommended = window.products.filter(p => p.tags && p.tags.includes("Recommended")).slice(0, 4);

  grid.innerHTML = recommended.map(p => `
    <div class="shop-style-card">
      <div class="card-image-wrap">
        <a href="../shop/product1.html?id=${p.id}" class="img-link">
          <img src="${p.img}" onerror="this.onerror=null;this.src='../images/tomatoes.jpg';" alt="${p.name}" class="product-img">
          <div class="hover-overlay">
            <span class="view-btn">View Details</span>
          </div>
        </a>
      </div>
      <div class="card-body">
        <a href="../shop/product1.html?id=${p.id}" class="title-link">
          <h3>${p.name}</h3>
        </a>
        <p class="desc">${p.desc || ""}</p>
        <div class="card-footer">
          <span class="price">RWF ${(Number(p.price) || 0).toLocaleString()}</span>
          ${p.isAvailable !== false ? `
            <button class="cart-btn" data-product-id="${p.id}">
              <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
          ` : `
            <button disabled class="cart-btn" style="background:#e5e7eb;color:#9ca3af;cursor:not-allowed;">
              Unavailable
            </button>
          `}
        </div>
      </div>
    </div>
  `).join("");

  grid.querySelectorAll(".cart-btn:not([disabled])").forEach(btn => {
    btn.addEventListener("click", () => {
      window.addToCart(btn.dataset.productId);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderRecommendedProducts();
  if (window.updateCartBadges) window.updateCartBadges();
});

// Re-render when live backend data arrives (API loads after DOM)
document.addEventListener("productsLoaded", () => {
  renderRecommendedProducts();
});















