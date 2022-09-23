import {
  encodeFile,
  encodeDirectory,
  uploadCarBytes,
} from "@w3ui/uploader-core";
import { loadDefaultIdentity } from "@w3ui/wallet-core";
import { Authority } from "@ucanto/authority";
import { SUBMIT_NOTE_EVENT } from "./note-editor";
import { EVENTS } from "./note-list";

const STORE_API_URL = new URL(
  "https://8609r1772a.execute-api.us-east-1.amazonaws.com"
);
const STORE_DID = Authority.parse(
  "did:key:z6MkrZ1r5XBFZjBU34qyD8fueMbMRkKw17BZaq2ivKFjnz2z"
);

const EDITOR_SELECTOR = "note-editor";
const LIST_SELECTOR = "note-list";
const ROUTER_SELECTOR = "view-router";
const VIEWER_SELECTOR = "note-viewer";
const NEWNOTE_SELECTOR = ".add-new-note";

export class Dashboard extends HTMLElement {
  constructor() {
    super();
    this.setEditor = this.setEditor.bind(this);
    this.setViewer = this.setViewer.bind(this);
    this.noteSubmittedHandler = this.noteSubmittedHandler.bind(this);

    this.editor = this.querySelector(EDITOR_SELECTOR);
    this.list = this.querySelector(LIST_SELECTOR);
    this.router = this.querySelector(ROUTER_SELECTOR);
    this.viewer = this.querySelector(VIEWER_SELECTOR);
    this.newNote = this.querySelector(NEWNOTE_SELECTOR);
    const savedNotes = localStorage.getItem("notesCids");
    this.notes = [];

    try {
      this.notes = savedNotes ? JSON.parse(savedNotes) : [];
    } catch (e) {
      console.error("Notes state is broken");
    }
  }

  async saveNote(cid, title) {
    this.notes.push({ cid: cid.toString(), title });
    localStorage.setItem("notesCids", JSON.stringify(this.notes));
  }

  async uploadFile(bytes) {
    const identity = await loadDefaultIdentity();
    await uploadCarBytes(identity.signingPrincipal, bytes);
  }

  async updateList() {
    this.list?.setAttribute("items", JSON.stringify(this.notes));
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
    this.viewer?.setAttribute("note", JSON.stringify(note));
    this.router?.setAttribute("current-route", "viewer");
  }

  setEditor(note) {
    this.router?.setAttribute("current-route", "editor");
  }

  async noteSubmittedHandler(e) {
    const { bytes, cid, title } = e.detail;
    try {
      this.showSpinner();
      await this.uploadFile(bytes);
      await this.saveNote(cid, title);
      this.updateList();
      this.hideSpinner();
    } catch (e) {
      alert("Ops something go wrong");
      console.error(e);
    }
  }

  async connectedCallback() {
    this.updateList();

    this.editor?.addEventListener(SUBMIT_NOTE_EVENT, this.noteSubmittedHandler);
    this.list?.addEventListener(EVENTS.noteSelected, this.setViewer);
    this.newNote?.addEventListener("click", this.setEditor);
  }

  disconnectedCallback() {
    this.newNote?.removeEventListener("click", this.setEditor);
  }
}
