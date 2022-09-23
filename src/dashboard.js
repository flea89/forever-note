import {
  encodeFile,
  encodeDirectory,
  uploadCarBytes,
} from "@w3ui/uploader-core";
import { loadDefaultIdentity } from "@w3ui/wallet-core";
import { Authority } from "@ucanto/authority";
import { SUBMIT_NOTE_EVENT } from "./note-editor";

const STORE_API_URL = new URL(
  "https://8609r1772a.execute-api.us-east-1.amazonaws.com"
);
const STORE_DID = Authority.parse(
  "did:key:z6MkrZ1r5XBFZjBU34qyD8fueMbMRkKw17BZaq2ivKFjnz2z"
);

const EDITOR_SELECTOR = "note-editor";
const LIST_SELECTOR = "note-list";

export class Dashboard extends HTMLElement {
  constructor() {
    super();
    this.editor = document.querySelector(EDITOR_SELECTOR);
    this.list = document.querySelector(LIST_SELECTOR);
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

  async connectedCallback() {
    this.updateList();
    this.editor?.addEventListener(SUBMIT_NOTE_EVENT, async (e) => {
      const { bytes, cid, title } = e.detail;
      try {
        await this.uploadFile(bytes);
        await this.saveNote(cid, title);
        this.updateList();
      } catch (e) {
        alert("Ops something go wrong");
        console.error(e);
      }
    });
  }

  disconnectedCallback() {}
}
