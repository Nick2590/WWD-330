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

  return `<li class="product-card">
    <a href="/product_pages/?product=${product.Id}">
      <img src="${product.Image}" alt="${product.NameWithoutBrand}" />
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
  }
  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
    
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}
