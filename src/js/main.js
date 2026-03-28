const sortSelect = document.getElementById("sort-select");
const productList = document.querySelector(".product-list");

function getProductCards() {
  return Array.from(productList.querySelectorAll(".product-card"));
}

function getName(card) {
  return card.querySelector(".card__name").textContent.trim();
}

function getPrice(card) {
  const priceText = card.querySelector(".product-card__price").textContent;
  return parseFloat(priceText.replace("$", ""));
}

// Store the original order on first load
const originalOrder = getProductCards().map((card) => card.cloneNode(true));

function sortProducts(sortBy) {
  let cards;
  if (sortBy === "default") {
    cards = originalOrder.map((card) => card.cloneNode(true));
  } else {
    cards = getProductCards();
    if (sortBy === "name") {
      cards.sort((a, b) => getName(a).localeCompare(getName(b)));
    } else if (sortBy === "price") {
      cards.sort((a, b) => getPrice(a) - getPrice(b));
    }
  }
  productList.innerHTML = "";
  cards.forEach((card) => productList.appendChild(card));
}

sortSelect.addEventListener("change", (e) => {
  sortProducts(e.target.value);
});