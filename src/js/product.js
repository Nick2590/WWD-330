import { getParam, loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const dataSource = new ExternalServices("tents");
const productID = getParam("product");
const searchQuery = getParam("search");

if (searchQuery) {
  // Search mode: show search results
  const main = document.querySelector("main");
  main.innerHTML = `
    <section class="products">
      <h2>Search Results for "${searchQuery}"</h2>
      <ul class="product-list" id="search-results"></ul>
    </section>`;
  document.title = `Sleep Outside | Search: ${searchQuery}`;

  const listElement = document.getElementById("search-results");
  const searchService = new ExternalServices();

  searchService.searchProducts(searchQuery).then((results) => {
    if (results && results.length > 0) {
      const productList = new ProductList(searchQuery, dataSource, listElement);
      productList.renderList(results);
    } else {
      listElement.innerHTML = "<p>No products found. Try a different search term.</p>";
    }
  }).catch(() => {
    listElement.innerHTML = "<p>No products found. Try a different search term.</p>";
  });
} else if (productID) {
  const product = new ProductDetails(productID, dataSource);
  product.init();
}
