const baseURL = "https://wdd330-backend.onrender.com";

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
    const data = await response.json();
    return data;
  }
}