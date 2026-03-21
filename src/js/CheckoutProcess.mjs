import ExternalServices from "./ExternalServices.mjs";
import { getLocalStorage, setLocalStorage, alertMessage } from "./utils.mjs";

const services = new ExternalServices();

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    this.itemTotal = this.list.reduce((sum, item) => sum + item.FinalPrice, 0);
    this.shipping = this.list.length > 0 ? 10 + (this.list.length - 1) * 2 : 0;
    this.tax = this.itemTotal * 0.06;
    this.orderTotal = this.itemTotal + this.shipping + this.tax;
    this.displayOrderSummary();
  }

  displayOrderSummary() {
    const output = document.querySelector(this.outputSelector);
    output.querySelector("#subtotal").textContent = `$${this.itemTotal.toFixed(2)}`;
    output.querySelector("#shipping").textContent = `$${this.shipping.toFixed(2)}`;
    output.querySelector("#tax").textContent = `$${this.tax.toFixed(2)}`;
    output.querySelector("#order-total").textContent = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    const formData = Object.fromEntries(new FormData(form));
    const payload = {
      orderDate: new Date().toISOString(),
      fname: formData.fname,
      lname: formData.lname,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      cardNumber: formData.cardNumber,
      expiration: formData.expiration,
      code: formData.code,
      items: this.list.map((item) => ({
        id: item.Id,
        name: item.Name,
        price: item.FinalPrice,
        quantity: 1,
      })),
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping.toFixed(2),
      tax: this.tax.toFixed(2),
    };

    try {
      await services.checkout(payload);
      setLocalStorage(this.key, []);
      window.location.assign("/checkout/success.html");
    } catch (err) {
      alertMessage(err.message?.message || err.message || "An error occurred.");
    }
  }
}
