import { getCartItems, setLocalStorage, updateCartCount } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);

    if (!this.product) {
      return;
    }

    this.renderProductDetails();

    const addToCartBtn = document.getElementById("addToCart");
    addToCartBtn.addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getCartItems();
    const existingItem = cartItems.find((item) => item.Id === this.product.Id);

    if (existingItem) {
      existingItem.quantity = Number(existingItem.quantity || 1) + 1;
    } else {
      cartItems.push({ ...this.product, quantity: 1 });
    }

    setLocalStorage("so-cart", cartItems);
    updateCartCount();
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function renderBreadcrumbs(product) {
  const categoryEl = document.getElementById("breadcrumbCategory");
  const productEl = document.getElementById("breadcrumbProduct");

  if (categoryEl) {
    categoryEl.textContent = "Tents";
  }

  if (productEl) {
    productEl.textContent = product.NameWithoutBrand;
  }

  document.title = `Sleep Outside | ${product.Brand.Name} ${product.NameWithoutBrand}`;
}

function productDetailsTemplate(product) {
  renderBreadcrumbs(product);

  document.querySelector("h2").textContent = product.Brand.Name;
  document.querySelector("h3").textContent = product.NameWithoutBrand;

  const productImage = document.getElementById("productImage");
  productImage.src = product.Image;
  productImage.alt = product.NameWithoutBrand;

  document.getElementById("productPrice").textContent = `$${product.FinalPrice}`;

  const originalPriceEl = document.getElementById("productOriginalPrice");
  const discountBadgeEl = document.getElementById("productDiscount");

  if (product.SuggestedRetailPrice > product.FinalPrice) {
    const discountPercent = Math.round(
      ((product.SuggestedRetailPrice - product.FinalPrice) /
        product.SuggestedRetailPrice) *
      100
    );
    originalPriceEl.textContent = `$${product.SuggestedRetailPrice}`;
    discountBadgeEl.textContent = `Save ${discountPercent}%`;
  } else {
    originalPriceEl.textContent = "";
    discountBadgeEl.textContent = "";
  }

  document.getElementById("productColor").textContent =
    product.Colors[0].ColorName;

  document.getElementById("productDesc").innerHTML =
    product.DescriptionHtmlSimple;

  document.getElementById("addToCart").dataset.id = product.Id;
}