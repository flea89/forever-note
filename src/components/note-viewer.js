import { encodeFile, uploadCarBytes } from "@w3ui/uploader-core";

const NOTE_IFRAME_SELECTOR = "iframe";
const LINK_SELECTOR = "a";
const TITLE_SELECTOR = "h2";
const NOTE_ATTRIBUTE = "note";

export class NoteViewer extends HTMLElement {
  static get observedAttributes() {
    return [NOTE_ATTRIBUTE];
  }

  constructor() {
    super();
    this.iframe$ = this.querySelector(NOTE_IFRAME_SELECTOR);
    this.link$ = this.querySelector(LINK_SELECTOR);
    this.title$ = this.querySelector(TITLE_SELECTOR);

    if (!this.iframe$) {
      throw Error();
    }
  }

  setNote(note) {
    this.iframe$.srcdoc = "<!DOCTYPE html><p>Waiting for Gateaway....</p>";
    const src = `https://w3s.link/ipfs/${note.cid}`;
    this.iframe$.src = src;
    this.iframe$.addEventListener(
      "load",
      () => {
        this.iframe$.removeAttribute("srcdoc");
      },
      { once: true }
    );

    this.link$?.setAttribute("href", src);
    this.title$.textContent = note.title;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if ((name = NOTE_ATTRIBUTE) && newValue) {
      this.setNote(JSON.parse(newValue));
    }
  }
}
