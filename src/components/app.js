import {
  loadDefaultIdentity,
  registerIdentity,
  storeIdentity,
} from "@w3ui/wallet-core";
import { EVENTS } from "./registration";

const ROUTE_ATTRIBUTE = "current-route";
const SELECTORS = {
  registrationForm: "register-form",
  router: "view-router",
};

export class App extends HTMLElement {
  constructor() {
    super();
    /**
     * @type {import("@w3ui/wallet-core").Identity | undefined}
     */
    this.identity;

    this.registration$ = this.querySelector(SELECTORS.registrationForm);
    this.router$ = this.querySelector(SELECTORS.router);

    this.registrationHandler = this.registrationHandler.bind(this);

    if (!this.registration$ || !this.router$) {
      throw new Error("Missing components!");
    }
  }

  setRoute(route) {
    this.router$.setAttribute(ROUTE_ATTRIBUTE, route);
  }

  async registrationHandler(event) {
    const identity = /** @type {CustomEvent} */ event.detail.identity;
    const route = identity ? "dashboard" : "error";
    if (identity) {
      storeIdentity(identity);
    }
    this.setRoute(route);
  }

  async connectedCallback() {
    let currentRoute;

    this.registration$.addEventListener(
      EVENTS.registrationSuccess,
      this.registrationHandler
    );

    const identity = await loadDefaultIdentity();
    this.identity = identity;
    currentRoute = this.identity ? "dashboard" : "registration";
    this.setRoute(currentRoute);
  }

  disconnectedCallback() {
    this.registration$.removeEventListener(
      EVENTS.registrationSuccess,
      this.registrationHandler
    );
  }
}
