import { getCartItems, getLocalStorage, loadHeaderFooter, updateCartCount, setLocalStorage } from "./utils.mjs";

loadHeaderFooter().then(() => {
  updateCartCount();
});

function renderCartContents() {
  const cartItems = getCartItems();

  const htmlItems = cartItems.map((item, index) => cartItemTemplate(item, index));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  const btns = document.querySelectorAll(".remove-btn");
  btns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      removeCartItem(e.target.id);
      console.log("Button clicked!");
    });
  });

  calculateCartTotal(cartItems);
  
  // Add delete button listeners
  addDeleteListeners();
  addQuantityListeners();
}

function cartItemTemplate(item, index) {
  const quantity = Number(item.quantity || 1);
  const lineTotal = Number(item.FinalPrice) * quantity;

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
  <label class="cart-card__quantity" for="qty-${index}">qty: </label>
  <input class="quantity-input" id="qty-${index}" type="number" min="1" value="${quantity}" data-index="${index}" />
  <p class="cart-card__price">$${lineTotal.toFixed(2)}</p>
  <button class="delete-btn" data-index="${index}">Remove</button>
</li>`;

  return newItem;
}

function addQuantityListeners() {
  const quantityInputs = document.querySelectorAll(".quantity-input");

  quantityInputs.forEach((input) => {
    input.addEventListener("change", (e) => {
      const index = Number(e.target.dataset.index);
      const quantity = Number(e.target.value);
      updateItemQuantity(index, quantity);
    });
  });
}

function updateItemQuantity(index, quantity) {
  const cartItems = getCartItems();

  if (!cartItems[index]) {
    return;
  }

  const safeQuantity = Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
  cartItems[index].quantity = safeQuantity;

  setLocalStorage("so-cart", cartItems);
  updateCartCount();
  renderCartContents();
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
      const quantity = Number(item.quantity || 1);
      return sum + Number(item.FinalPrice) * quantity;
    }, 0);

    cartTotal.innerHTML = `Total: $${total.toFixed(2)}`;
  } else {
    cartFooter.classList.add("hide");
    document.querySelector(".product-list").innerHTML = "<p>Your cart is empty</p>";
  }
}

function removeCartItem(item) {
  let cartItems = getLocalStorage("so-cart");
  const index = cartItems.findIndex((id) => id.Id === item);
  cartItems.splice(index, 1);
  setLocalStorage("so-cart", cartItems);
  console.log(index);
  renderCartContents();
}

renderCartContents();

// Add checkout button handler
const checkoutButton = document.querySelector(".btn-primary");
if (checkoutButton) {
  checkoutButton.addEventListener("click", () => {
    window.location.href = "/checkout/";
  });
}
