import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;
  const discountPercent = isDiscounted
    ? Math.round(
        ((product.SuggestedRetailPrice - product.FinalPrice) /
          product.SuggestedRetailPrice) *
          100
      )
    : 0;
  const imgSrc = product.Image || product.Images?.PrimaryMedium || "";

  return `<li class="product-card">
    <a href="/product_pages/?product=${product.Id}">
      <img src="${imgSrc}" alt="${product.NameWithoutBrand}" />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <div class="product-price">
        <p class="product-card__price">$${product.FinalPrice}</p>
        ${
          isDiscounted
            ? `<p class="product__original-price">$${product.SuggestedRetailPrice}</p>
        <span class="product__discount-badge">Save ${discountPercent}%</span>`
            : ""
        }
      </div>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
  }
  async init() {
    this.products = await this.dataSource.getData();
    this.renderList(this.products);
  }
  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);
  }
  sort(sortBy) {
    let sorted;
    if (sortBy === "name") {
      sorted = [...this.products].sort((a, b) =>
        a.NameWithoutBrand.localeCompare(b.NameWithoutBrand)
      );
    } else if (sortBy === "price") {
      sorted = [...this.products].sort((a, b) => a.FinalPrice - b.FinalPrice);
    } else {
      sorted = [...this.products];
    }
    this.renderList(sorted);
  }
}
