import { registerIdentity } from "@w3ui/wallet-core";

const SELECTORS = {
  authForm: ".auth__form",
  confirmation: ".auth__confirmation",
};

export const EVENTS = {
  registrationStart: "registration:start",
  registrationSuccess: "registration:success",
};

export class RegisterForm extends HTMLElement {
  constructor() {
    super();
    this.form$ = this.querySelector(SELECTORS.authForm);
    this.confirmation$ = this.querySelector(SELECTORS.confirmation);
    this.submitHandler = this.submitHandler.bind(this);
  }

  toggleConfirmation(show) {
    this.form$.hidden = show;
    this.confirmation$.hidden = !show;
  }

  connectedCallback() {
    if (!this.form$) {
      throw Error("Login Form expected");
    }
    this.form$.addEventListener("submit", this.submitHandler);
  }

  disconnectedCallback() {
    this.form$?.removeEventListener("submit", this.submitHandler);
  }

  submitHandler = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    // log in a user by their email
    const email = fd.get("email");
    let status;
    let error;
    let identity;

    if (email) {
      const event = new CustomEvent(EVENTS.registrationStart, {
        detail: {},
      });
      this.dispatchEvent(event);

      try {
        this.toggleConfirmation(true);
        identity = await registerIdentity(email);
        status = "success";
      } catch (err) {
        status = "error";
        console.error("Registraton failed:", err);
      } finally {
        this.toggleConfirmation(false);
        const event = new CustomEvent(EVENTS.registrationSuccess, {
          detail: { identity, error },
        });
        this.dispatchEvent(event);
      }
    }
  };
}
