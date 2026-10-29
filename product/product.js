const products = [
  {
    id: 1,
    name: "Fresh Apple",
    price: 3.5,
    oldPrice: 4.5,
    discount: 20,
    stock: 3,
    status: "in",
    img: "images/apple.jpg",
    sku: "APL-001",
    category: "Fruits",
    description: "Fresh, juicy apples packed with nutrients."
  },
  {
    id: 2,
    name: "Organic Banana",
    price: 2.0,
    oldPrice: null,
    discount: null,
    stock: 0,
    status: "out",
    img: "images/banana.jpg",
    sku: "BAN-002",
    category: "Fruits",
    description: "Naturally sweet organic bananas."
  },
  {
    id: 3,
    name: "Avocado Premium",
    price: 6.0,
    oldPrice: 7.5,
    discount: 20,
    stock: 5,
    status: "in",
    img: "images/avocado.jpg",
    sku: "AVO-003",
    category: "Recommended",
    description: "Creamy premium avocados perfect for salads."
  },
  {
    id: 4,
    name: "Amanyarwanda Eggs",
    price: 3.0,
    oldPrice: null,
    discount: null,
    stock: 10,
    status: "in",
    img: "amanyarwanda-eggs.jpg",
    sku: "EGG-004",
    category: "Eggs",
    description: "Traditional Rwandan eggs, fresh from free-range hens."
  },
  {
    id: 5,
    name: "Amapondezi Eggs",
    price: 3.2,
    oldPrice: null,
    discount: null,
    stock: 10,
    status: "in",
    img: "amapondezi.jpg",
    sku: "EGG-005",
    category: "Eggs",
    description: "Farm-fresh eggs, carefully selected for size and quality."
  }
];

/* =============================
   GET PRODUCT ID FROM URL
============================= */
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"));

/* =============================
   FIND PRODUCT
============================= */
const product = products.find(p => p.id === productId);

/* =============================
   SAFETY CHECK
============================= */
if (!product) {
  document.body.innerHTML = `
    <div style="padding:60px;text-align:center">
      <h2>Product not found</h2>
      <a href="shop.html">← Back to shop</a>
    </div>
  `;
  throw new Error("Product not found");
}

/* =============================
   RENDER PRODUCT PAGE
============================= */
document.getElementById("productPage").innerHTML = `
  <div class="product-wrapper">

    <!-- LEFT: IMAGE -->
    <div class="product-gallery">
      <img src="${product.img}" alt="${product.name}">
    </div>

    <!-- RIGHT: INFO -->
    <div class="product-details">
      <h1>${product.name}</h1>

      <div class="price">
        ${product.oldPrice ? `<span class="old">RWF ${product.oldPrice}</span>` : ""}
        <span class="new">RWF ${product.price}</span>
      </div>

      <p class="stock ${product.status}">
        ${product.status === "in" ? `In stock: ${product.stock}kg` : "Out of stock"}
      </p>

      <p><strong>SKU:</strong> ${product.sku}</p>
      <p><strong>Category:</strong> ${product.category}</p>

      <button class="add-cart" ${product.status==="out"?"disabled":""}>
        Add to Cart
      </button>

      <hr>

      <h3>Quick Overview</h3>
      <p>${product.description}</p>

      <div class="badges">
        <span>🚚 Free Delivery</span>
        <span>✅ 100% Guarantee</span>
      </div>
    </div>

  </div>
`;