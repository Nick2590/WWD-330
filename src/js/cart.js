import { getLocalStorage, setLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  let cartItems = getLocalStorage("so-cart");

  // Ensure cartItems is always an array
  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  const btns = document.querySelectorAll(".remove-btn");
  btns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      removeCartItem(e.target.id);
      console.log("Button clicked!");
    })
  })

  calculateCartTotal(cartItems);
}

function cartItemTemplate(item) {
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
  <button id="${item.Id}" class="remove-btn">X</button>
</li>`;

  return newItem;
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
  }
}

function removeCartItem(item) {
  let cartItems = getLocalStorage("so-cart");
  const index = cartItems.findIndex(id => id.Id === item);
  cartItems.splice(index, 1);
  setLocalStorage("so-cart", cartItems);
  console.log(index);
  renderCartContents();
}

renderCartContents();
