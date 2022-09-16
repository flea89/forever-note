const ROUTE_ATTRIBUTE = "current-route";

// naive implementation of a router, that show and hide routes base on an attribute
export class Router extends HTMLElement {
  static get observedAttributes() {
    return [ROUTE_ATTRIBUTE];
  }

  constructor() {
    super();
    this.routes = {};

    [...this.querySelectorAll("route")].forEach((e) => {
      if (e.id === undefined) {
        throw new Error("Route should have an id");
      }
      this.routes[e.id] = e;
      e.hidden = true;
    });
  }

  connectedCallback() {}

  attributeChangedCallback(name, oldValue, newValue) {
    if ((name = ROUTE_ATTRIBUTE)) {
      this.setRoute(newValue);
    }
  }

  setRoute(route) {
    if (!Object.keys(this.routes).includes(route)) {
      throw new Error("Route does not exists");
    }
    Object.entries(this.routes).forEach(([key, e]) => {
      e.hidden = key !== route;
    });
  }
}
