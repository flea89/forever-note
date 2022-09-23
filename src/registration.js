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
        const event = new CustomEvent(EVENTS.registrationSuccess, {
          detail: { identity, error },
        });
        this.dispatchEvent(event);
      }
    }
  };
}

// /**
//  *
//  * @param {Element} authElement
//  * @param {*} client
//  * @param {function} loginStatusChangeHandler
//  */
// export const hydrateAuth = (authElement, client, loginStatusChangeHandler) => {
//   const form$ = authElement.querySelector(SELECTORS.authForm);

//   if (!form$) {
//     throw Error("Login Form expected");
//   }

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     const fd = new FormData(e.target);
//     // log in a user by their email
//     const email = /** @type {string} */ fd.get("email");

//     if (email) {
//       try {
//         const successMessage = await registerIdentity(email);
//         console.log("Success: ", successMessage);
//       } catch (err) {
//         console.error("Registraton failed:", err);
//       }

//       console.log(await client.list());
//     }
//   };

//   form$.addEventListener("submit", submitHandler);
// };
