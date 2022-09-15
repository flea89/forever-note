import { hydrateAuth } from "./auth";

import { createClient } from "w3up-client";
import {
  ACCESS_DID,
  ACCESS_URL,
  SERVICE_URL,
  W3_STORE_DID,
} from "./w3up-settings";

const client = createClient({
  serviceDID: W3_STORE_DID,
  serviceURL: SERVICE_URL,
  accessDID: ACCESS_DID,
  accessURL: ACCESS_URL,
  settings: new Map(),
});

const SELECTOR = {
  authView: "#auth",
};

console.log("Hello world");

const authView$ = document.querySelector(SELECTOR.authView);

if (!authView$) {
  throw Error();
}

const showLogin = () => {
  authView$.hidden = false;
  dashboardView$.hidden = true;
};

const showDashboard = () => {
  authView$.hidden = true;
  dashboardView$.hidden = false;
};

const loginStatusChangeHandler = (loggedIn, usermetadata) => {
  if (loggedIn) {
    showDashboard();
  } else {
    showLogin();
  }
};

hydrateAuth(authView$, client, loginStatusChangeHandler);
