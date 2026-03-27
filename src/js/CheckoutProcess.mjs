import { formDataToJSON, getCartItems } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: 1
  }));
}

export default class CheckoutProcess {
  constructor(cartKey, summarySelector) {
    this.cartKey = cartKey;
    this.summaryElement = document.querySelector(summarySelector);
    this.cartItems = getCartItems();
    this.externalServices = new ExternalServices();
    this.subtotal = 0;
    this.tax = 0;
    this.shipping = 0;
    this.orderTotal = 0;
  }

  init() {
    this.calculateSubtotal();
    this.calculateOrderTotal();

    const zipInput = document.querySelector("#zip");
    if (zipInput) {
      zipInput.addEventListener("blur", () => {
        this.calculateOrderTotal();
      });
    }
  }

  calculateSubtotal() {
    this.subtotal = this.cartItems.reduce((total, item) => {
      return total + Number(item.FinalPrice);
    }, 0);

    const subtotalElement = document.querySelector("#subtotal");
    if (subtotalElement) {
      subtotalElement.textContent = this.subtotal.toFixed(2);
    }
  }

  calculateOrderTotal() {
    const itemCount = this.cartItems.length;

    this.tax = this.subtotal * 0.06;
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
    this.orderTotal = this.subtotal + this.tax + this.shipping;

    const taxElement = document.querySelector("#tax");
    const shippingElement = document.querySelector("#shipping");
    const totalElement = document.querySelector("#orderTotal");

    if (taxElement) {
      taxElement.textContent = this.tax.toFixed(2);
    }

    if (shippingElement) {
      shippingElement.textContent = this.shipping.toFixed(2);
    }

    if (totalElement) {
      totalElement.textContent = this.orderTotal.toFixed(2);
    }
  }

  async checkout(form) {
    const formData = new FormData(form);
    const orderData = formDataToJSON(formData);

    orderData.orderDate = new Date().toISOString();
    orderData.items = packageItems(this.cartItems);
    orderData.orderTotal = this.orderTotal.toFixed(2);
    orderData.shipping = this.shipping;
    orderData.tax = this.tax.toFixed(2);

    try {
      const result = await this.externalServices.checkout(orderData);
      console.log("Order submitted:", result);
      return result;
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  }
}