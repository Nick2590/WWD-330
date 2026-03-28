export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function getCartItems() {
  const storedCart = getLocalStorage("so-cart");

  if (Array.isArray(storedCart)) {
    return storedCart;
  }

  if (storedCart && typeof storedCart === "object") {
    return [storedCart];
  }

  return [];
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback(event);
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(
  template,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  const htmlStrings = list.map(template);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export function formDataToJSON(formData) {
  const data = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  return data;
}

async function loadTemplate(path) {
  const res = await fetch(path);
  return await res.text();
}

export async function loadHeaderFooter() {
  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  if (headerElement) {
    const headerTemplate = await loadTemplate("/public/partials/header.html");
    renderWithTemplate(headerTemplate, headerElement);
  }

  if (footerElement) {
    const footerTemplate = await loadTemplate("/public/partials/footer.html");
    renderWithTemplate(footerTemplate, footerElement);
  }
}

export function updateCartCount() {
  const cartItems = getCartItems();
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    cartCount.textContent = cartItems.length;
  }
}

export function alertMessage(message, duration = 3000) {
  alert(message);
}