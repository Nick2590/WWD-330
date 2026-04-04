import { loadHeaderFooter, updateCartCount } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import Alert from "./Alert.js";

loadHeaderFooter();

const mainElement = document.querySelector("main");
const alertList = new Alert("/json/alert.json", mainElement);
alertList.init();

const dataSource = new ExternalServices("tents");
const element = document.querySelector(".product-list");
const productList = new ProductList("Tents", dataSource, element);

productList.init();

document.getElementById("sort-select").addEventListener("change", (e) => {
  productList.sort(e.target.value);
});

loadHeaderFooter().then(() => {
  updateCartCount();
});
