import {
  loadDefaultIdentity,
  registerIdentity,
  storeIdentity,
} from "@w3ui/wallet-core";

const ROUTE_ATTRIBUTE = "current-route";

export class App extends HTMLElement {
  constructor() {
    super();
    let currentRoute;
    /**
     * @type {import("@w3ui/wallet-core").Identity | undefined}
     */
    this.identity;
    this.registration$ = this.querySelector("register-form");
    this.router$ = this.querySelector("app-router");

    if (!this.registration$ || !this.router$) {
      throw new Error("Missing components!");
    }

    loadDefaultIdentity().then((identity) => {
      this.identity = identity;
      currentRoute = this.identity ? "dashboard" : "registration";
      this.router$.setAttribute("current-route", currentRoute);
    });

    this.registration$.addEventListener("registered", (event) => {
      const identity = /** @type {CustomEvent} */ event.detail.identity;
      const route = identity ? "dashboard" : "error";
      if (identity) {
        storeIdentity(identity);
      }
    });
  }

  connectedCallback() {}
}
