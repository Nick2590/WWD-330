const baseURL = "https://wdd330-backend.onrender.com";

async function convertToJson(res) {
  const jsonResponse = await res.json();

  if (res.ok) {
    return jsonResponse;
  } else {
    throw {
      name: "servicesError",
      message: jsonResponse
    };
  }
}

export default class ExternalServices {
  constructor(category) {
    this.category = category;
    this.path = `/json/${this.category}.json`;
  }

  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data);
  }

  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }

  async searchProducts(query) {
    const categories = ["tents", "backpacks", "sleeping-bags"];
    const allProducts = [];
    for (const cat of categories) {
      try {
        const response = await fetch(`${baseURL}/products/search/${cat}`);
        const data = await convertToJson(response);
        if (data.Result) {
          allProducts.push(...data.Result);
        }
      } catch (e) {
        // skip failed category
      }
    }
    const searchTerm = query.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.Name.toLowerCase().includes(searchTerm) ||
        p.NameWithoutBrand.toLowerCase().includes(searchTerm) ||
        p.Brand.Name.toLowerCase().includes(searchTerm)
    );
  }

  async checkout(payload) {
    const url = `${baseURL}/checkout`;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    };

    const response = await fetch(url, options);
    return convertToJson(response);
  }
}