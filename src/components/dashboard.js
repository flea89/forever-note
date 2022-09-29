import { uploadCarBytes } from "@w3ui/uploader-core";
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

    const savedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
    this.notes = [];

    try {
      this.notes = savedNotes ? JSON.parse(savedNotes) : [];
    } catch (e) {
      console.error("Notes state is broken");
    }
  }

  /**
   * It saves a note in the application state.
   *
   * @param {string} cid
   * @param {string} title
   */
  async saveNote(cid, title) {
    this.notes.push({ cid: cid.toString(), title });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.notes));
  }

  /**
   * It uploads the provided content to web3.storage.
   * @param {Uint8Array} bytes
   */
  async uploadFile(bytes) {
    const identity = await loadDefaultIdentity();
    if (!identity) {
      throw Error("Trying to upload but identity is missing");
    }
    await uploadCarBytes(identity.signingPrincipal, bytes);
  }

  async updateList() {
    this.list$?.setAttribute("items", JSON.stringify(this.notes.reverse()));
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
    debugger;
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
      await this.saveNote(cid, title);
      this.updateList();
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
    this.updateList();

    this.editor$?.addEventListener(
      SUBMIT_NOTE_EVENT,
      this.noteSubmittedHandler
    );
    this.list$?.addEventListener(EVENTS.noteSelected, this.setViewer);
    this.newNote$?.addEventListener("click", this.setEditor);
  }

  disconnectedCallback() {
    this.newNote$?.removeEventListener("click", this.setEditor);
  }
}
