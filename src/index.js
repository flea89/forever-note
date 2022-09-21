import { App } from "./app";
import { RegisterForm } from "./registration";
import { Router } from "./router";
import { NoteEditor } from "./note-editor";
import { NoteList } from "./note-list";
import { Dashboard } from "./dashboard";

const SELECTOR = {
  authView: "#auth",
};

console.log("Hello world");

// const authView$ = document.querySelector(SELECTOR.authView);

// if (!authView$) {
//   throw Error();
// }

// const showLogin = () => {
//   authView$.hidden = false;
//   dashboardView$.hidden = true;
// };

// const showDashboard = () => {
//   authView$.hidden = true;
//   dashboardView$.hidden = false;
// };

// const loginStatusChangeHandler = (loggedIn, usermetadata) => {
//   if (loggedIn) {
//     showDashboard();
//   } else {
//     showLogin();
//   }
// };

// hydrateAuth(authView$, client, loginStatusChangeHandler);

customElements.define("register-form", RegisterForm);
customElements.define("app-router", Router);
customElements.define("notes-app", App);
customElements.define("notes-dashboard", Dashboard);
customElements.define("note-editor", NoteEditor);
customElements.define("note-list", NoteList);

// document
//   .querySelector("register-form")
//   ?.addEventListener("registered", (event) => {
//     console.log(event);
//   });
