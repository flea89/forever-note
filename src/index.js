import { App } from "./app";
import { RegisterForm } from "./registration";
import { Router } from "./router";
import { NoteEditor } from "./note-editor";
import { NoteList } from "./note-list";
import { Dashboard } from "./dashboard";

customElements.define("register-form", RegisterForm);
customElements.define("app-router", Router);
customElements.define("notes-app", App);
customElements.define("notes-dashboard", Dashboard);
customElements.define("note-editor", NoteEditor);
customElements.define("note-list", NoteList);
