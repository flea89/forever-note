import { uploadCarBytes } from "@w3ui/uploader-core";
import { listUploads } from "@w3ui/uploads-list-core";
import { loadDefaultIdentity } from "@w3ui/wallet-core";
import { SUBMIT_NOTE_EVENT } from "./note-editor";
import { EVENTS } from "./note-list";

const SELECTORS = {
  editor: "note-editor",
  list: "note-list",
  router: "view-router",
  viewer: "note-viewer",
  newNote: ".add-new-note",
  publish: ".note-editor__form button[type=submit]",
};

const LOCAL_STORAGE_KEY = "__notes_cids";

/**
 * This a container that is in charge of orchestratign the state for the dashboard.
 * It also deals with routing the notes editor and viewer.
 */
export class Dashboard extends HTMLElement {
  constructor() {
    super();
    this.setEditor = this.setEditor.bind(this);
    this.setViewer = this.setViewer.bind(this);
    this.noteSubmittedHandler = this.noteSubmittedHandler.bind(this);

    this.editor$ = this.querySelector(SELECTORS.editor);
    this.list$ = this.querySelector(SELECTORS.list);
    this.router$ = this.querySelector(SELECTORS.router);
    this.viewer$ = this.querySelector(SELECTORS.viewer);
    this.newNote$ = this.querySelector(SELECTORS.newNote);
    this.publishBtn$ = this.querySelector(SELECTORS.publish);

    this.notes = []; // null => not loaded yet
  }

  /**
   * It uploads the provided content to web3.storage.
   * @param {Uint8Array} bytes
   */
  async uploadFile(bytes) {
    await uploadCarBytes(this.identity.signingPrincipal, bytes);
  }

  async updateList() {
    await this.updateNotes();
    if (this.notes) {
      this.list$?.setAttribute("items", JSON.stringify(this.notes));
    }
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

  setViewer(e) {
    const { note } = e.detail;
    this.viewer$?.setAttribute("note", JSON.stringify(note));
    this.router$?.setAttribute("current-route", "viewer");
  }

  setEditor(note) {
    this.router$?.setAttribute("current-route", "editor");
  }

  async noteSubmittedHandler(e) {
    const { bytes, cid, title } = e.detail;
    try {
      this.showSpinner();
      this.publishBtn$?.setAttribute("disabled", "");
      await this.uploadFile(bytes);
      // calling store/list straight after an upload doesn't always return the updated list….
      // It seems an eventual consistency type of issue.
      // This isn't obviously a nice solution, but a quick workaround for now
      await new Promise((resolve) => setTimeout(resolve, 300));

      // We shouldn't really by hitting the endpoint everytime, we should keep the state locally.
      // Why are we doing it than:
      // - We use the creation date as note title, given no metadata can be uploaded at the time of writing.
      await this.updateList();
      this.hideSpinner();
      this.publishBtn$?.removeAttribute("disabled");
      this.setViewer({
        detail: { note: { cid: cid.toString(), title } },
      });
    } catch (e) {
      alert("Ops something went wrong");
      console.error(e);
    }
  }

  async connectedCallback() {
    this.editor$?.addEventListener(
      SUBMIT_NOTE_EVENT,
      this.noteSubmittedHandler
    );
    this.list$?.addEventListener(EVENTS.noteSelected, this.setViewer);
    this.newNote$?.addEventListener("click", this.setEditor);

    this.identity = await loadDefaultIdentity();
    if (!this.identity) {
      throw Error("Trying to upload but identity is missing");
    }
    this.updateList();
  }

  async updateNotes() {
    this.notes = (
      await listUploads(this.identity.signingPrincipal)
    ).results.map((u) => ({
      cid: u.dataCid,
      title: new Date(u.uploadedAt).toLocaleString(),
    }));
  }

  disconnectedCallback() {
    this.newNote$?.removeEventListener("click", this.setEditor);
  }
}
