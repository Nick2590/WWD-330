import { getCartItems, loadHeaderFooter, updateCartCount, setLocalStorage } from "./utils.mjs";

loadHeaderFooter().then(() => {
  updateCartCount();
});

function renderCartContents() {
  const cartItems = getCartItems();

  const htmlItems = cartItems.map((item, index) => cartItemTemplate(item, index));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  calculateCartTotal(cartItems);
  
  // Add delete button listeners
  addDeleteListeners();
}

function cartItemTemplate(item, index) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <button class="delete-btn" data-index="${index}">Remove</button>
</li>`;

  return newItem;
}

function addDeleteListeners() {
  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      deleteItemFromCart(index);
    });
  });
}

function deleteItemFromCart(index) {
  const cartItems = getCartItems();
  cartItems.splice(index, 1);
  setLocalStorage("so-cart", cartItems);
  updateCartCount();
  renderCartContents();
}

function calculateCartTotal(cartItems) {
  const cartFooter = document.querySelector(".cart-footer");
  const cartTotal = document.querySelector(".cart-total");

  if (cartItems.length > 0) {
    cartFooter.classList.remove("hide");

    const total = cartItems.reduce((sum, item) => {
      return sum + item.FinalPrice;
    }, 0);

    cartTotal.innerHTML = `Total: $${total.toFixed(2)}`;
  } else {
    cartFooter.classList.add("hide");
    document.querySelector(".product-list").innerHTML = "<p>Your cart is empty</p>";
  }
}

renderCartContents();

// Add checkout button handler
const checkoutButton = document.querySelector(".btn-primary");
if (checkoutButton) {
  checkoutButton.addEventListener("click", () => {
    window.location.href = "/checkout/";
  });
}
