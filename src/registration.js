import { registerIdentity } from "@w3ui/wallet-core";

const SELECTORS = {
  authForm: ".auth__form",
};

export class RegisterForm extends HTMLElement {
  constructor() {
    super();
    this.submitHandler = this.submitHandler.bind(this);
    console.log("constructor");
  }

  connectedCallback() {
    this.form$ = this.querySelector(SELECTORS.authForm);
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

    if (email) {
      try {
        identity = await registerIdentity(email);
        status = "success";
      } catch (err) {
        status = "error";
        console.error("Registraton failed:", err);
      } finally {
        const event = new CustomEvent("registered", {
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
