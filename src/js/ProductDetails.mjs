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
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
    updateCartCount();
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  document.querySelector('h2').textContent = product.Brand.Name;
  document.querySelector('h3').textContent = product.NameWithoutBrand;

  const productImage = document.getElementById('productImage');
  productImage.src = product.Image;
  productImage.alt = product.NameWithoutBrand;

  document.getElementById('productPrice').textContent = `$${product.FinalPrice}`;

  const originalPriceEl = document.getElementById('productOriginalPrice');
  const discountBadgeEl = document.getElementById('productDiscount');
  if (product.SuggestedRetailPrice > product.FinalPrice) {
    const discountPercent = Math.round(
      ((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100
    );
    originalPriceEl.textContent = `$${product.SuggestedRetailPrice}`;
    discountBadgeEl.textContent = `Save ${discountPercent}%`;
  }

  document.getElementById('productColor').textContent = product.Colors[0].ColorName;
  document.getElementById('productDesc').innerHTML = product.DescriptionHtmlSimple;

  document.getElementById('addToCart').dataset.id = product.Id;
}