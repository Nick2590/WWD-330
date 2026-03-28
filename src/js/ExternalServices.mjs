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