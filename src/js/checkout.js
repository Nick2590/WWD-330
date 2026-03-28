import { loadHeaderFooter, updateCartCount } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

console.log("=== checkout.js loaded ===");

loadHeaderFooter().then(() => {
  updateCartCount();
});

const checkout = new CheckoutProcess("so-cart", ".order-summary");
checkout.init();

const form = document.getElementById("checkout-form");
console.log("Form found:", !!form, form);

if (form) {
  console.log("Attaching submit listener to form");
  form.addEventListener("submit", async (e) => {
    console.log("Form submitted!");
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    await checkout.checkout(form);
  });
} else {
  console.error("Checkout form not found!");
}