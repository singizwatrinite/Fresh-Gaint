const grid = document.getElementById("wishlistGrid");
const empty = document.getElementById("emptyState");
const count = document.getElementById("wishCount");

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

count.innerText = wishlist.length;

if (wishlist.length === 0) {
  empty.style.display = "block";
}

wishlist.forEach(item => {
  const card = document.createElement("div");
  card.className = "wish-card";

  card.innerHTML = `
    <img src="${item.img}">
    <div class="wish-content">
      <h4>${item.name}</h4>
      <span class="wish-price">${item.price}</span>
      <div class="wish-actions">
        <button class="add-cart">Add to Cart</button>
        <button class="remove">Remove</button>
      </div>
    </div>
  `;

  card.querySelector(".remove").onclick = () => {
    wishlist = wishlist.filter(p => p.id !== item.id);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    location.reload();
  };

  grid.appendChild(card);
});
