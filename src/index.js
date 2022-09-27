import { App } from "./app";
import { RegisterForm } from "./registration";
import { Router } from "./router";
import { NoteEditor } from "./note-editor";
import { NoteList, NoteListItem } from "./note-list";
import { Dashboard } from "./dashboard";
import { NoteViewer } from "./note-viewer";

customElements.define("register-form", RegisterForm);
customElements.define("view-router", Router);
customElements.define("notes-app", App);
customElements.define("notes-dashboard", Dashboard);
customElements.define("note-editor", NoteEditor);
customElements.define("note-list-item", NoteListItem);
customElements.define("note-list", NoteList);
customElements.define("note-viewer", NoteViewer);

