export default class Alert {
  constructor(jsonPath, parentElement) {
    this.jsonPath = jsonPath;
    this.parentElement = parentElement;
  }

  async init() {
    const alerts = await this.getAlerts();

    if (!Array.isArray(alerts) || alerts.length === 0) {
      return;
    }

    const alertSection = this.buildAlertList(alerts);
    this.parentElement.prepend(alertSection);
  }

  async getAlerts() {
    try {
      const response = await fetch(this.jsonPath);

      if (!response.ok) {
        throw new Error("Failed to load alerts.json");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error loading alerts:", error);
      return [];
    }
  }

  buildAlertList(alerts) {
    const section = document.createElement("section");
    section.className = "alert-list";

    alerts.forEach((alert) => {
      const p = document.createElement("p");
      p.textContent = alert.message;
      p.style.backgroundColor = alert.background;
      p.style.color = alert.color;
      section.appendChild(p);
    });

    return section;
  }
}