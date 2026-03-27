import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart", ".order-summary");
checkout.init();

const form = document.getElementById("checkout-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await checkout.checkout(form);
});