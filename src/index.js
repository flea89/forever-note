import { App } from "./components/app";
import { Dashboard } from "./components/dashboard";
import { NoteEditor } from "./components/note-editor";
import { NoteList, NoteListItem } from "./components/note-list";
import { NoteViewer } from "./components/note-viewer";
import { RegisterForm } from "./components/registration";
import { Router } from "./router";

customElements.define("register-form", RegisterForm);
customElements.define("view-router", Router);
customElements.define("notes-app", App);
customElements.define("notes-dashboard", Dashboard);
customElements.define("note-editor", NoteEditor);
customElements.define("note-list-item", NoteListItem);
customElements.define("note-list", NoteList);
customElements.define("note-viewer", NoteViewer);

