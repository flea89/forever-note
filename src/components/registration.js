import {
  createIdentity,
  registerIdentity,
  sendVerificationEmail,
  waitIdentityVerification,
} from "@w3ui/wallet-core";

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
    console.log("hi", this.form$);
    if (!this.form$) {
      throw Error("Login Form expected");
    }
    this.form$.addEventListener("submit", this.submitHandler);
  }

  disconnectedCallback() {
    this.form$?.removeEventListener("submit", this.submitHandler);
  }

  async showSpinner() {
    const spinner = document.createElement("div");
    const loader = document.createElement("span");
    spinner.className = "spinner";
    loader.className = "loader";
    spinner.appendChild(loader);
    document.body.appendChild(spinner);
  }

  async hideSpinner() {
    const spinner = document.querySelector("div.spinner");
    if (spinner) {
      spinner.remove();
    }
  }

  submitHandler = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    // log in a user by their email
    const email = fd.get("email");
    let status;
    let error;
    let identity;
    let proof;

    if (email) {
      const event = new CustomEvent(EVENTS.registrationStart, {
        detail: {},
      });
      this.dispatchEvent(event);

      const unverifiedIdentity = await createIdentity({ email });
      console.log(`DID: ${unverifiedIdentity.signingPrincipal.did()}`);
      await sendVerificationEmail(unverifiedIdentity);
      const controller = new AbortController();

      try {
        this.toggleConfirmation(true);
        this.showSpinner();
        ({ identity, proof } = await waitIdentityVerification(
          unverifiedIdentity,
          {
            signal: controller.signal,
          }
        ));
        await registerIdentity(identity, proof);
        status = "success";
      } catch (err) {
        status = "error";
        console.error("Registraton failed:", err);
      } finally {
        this.toggleConfirmation(false);
        this.hideSpinner();
        const event = new CustomEvent(EVENTS.registrationSuccess, {
          detail: { identity, error },
        });
        this.dispatchEvent(event);
      }
    }
  };
}

