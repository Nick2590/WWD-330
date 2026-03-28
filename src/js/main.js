import { loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import Alert from "./Alert.js";

loadHeaderFooter();

const mainElement = document.querySelector("main");
const alertList = new Alert("/json/alert.json", mainElement);
alertList.init();

const dataSource = new ProductData("tents");
const element = document.querySelector(".product-list");
const productList = new ProductList("Tents", dataSource, element);

productList.init();