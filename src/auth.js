const SELECTORS = {
  authForm: ".auth__form",
  inputEmail: ".auth__form id",
};

/**
 *
 * @param {Element} authElement
 * @param {*} client
 * @param {function} loginStatusChangeHandler
 */
export const hydrateAuth = (authElement, client, loginStatusChangeHandler) => {
  const form$ = authElement.querySelector(SELECTORS.authForm);

  if (!form$) {
    throw Error("Login Form expected");
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    // log in a user by their email
    const email = fd.get("email");

    if (email) {
      try {
        const successMessage = await client.register(email);
        console.log("Success: ", successMessage);
      } catch (err) {
        console.error("Registraton failed:", err);
      }

      console.log(await client.list());
    }
  };

  form$.addEventListener("submit", submitHandler);
};
