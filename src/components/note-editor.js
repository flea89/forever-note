import { encodeFile, uploadCarBytes } from "@w3ui/uploader-core";

export const SUBMIT_NOTE_EVENT = "note:submit";

const FORM = ".note-editor__form";
const NOTE_TEXTAREA_SELECTOR = "textarea";

export class NoteEditor extends HTMLElement {
  constructor() {
    super();
    this.form$ = this.querySelector(FORM);
    this.noteText$ = this.querySelector(NOTE_TEXTAREA_SELECTOR);
    this.onSubmit = this.onSubmit.bind(this);

    if (!this.form$ || !this.noteText$) {
      throw Error();
    }
  }

  /**
   * It creates a text file from the content of the text area.
   * @param {string} content
   * @param {string} title
   */
  async createFile(content, title = "note.txt") {
    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });
    const file = new File([blob], title);
    const { cid, car } = await encodeFile(file);

    const chunks = [];
    for await (const chunk of car) {
      chunks.push(chunk);
    }
    const bytes = new Uint8Array(await new Blob(chunks).arrayBuffer());
    return {
      cid,
      car,
      bytes,
    };
  }

  async onSubmit(e) {
    e.preventDefault();
    const title = new Date().toLocaleString();
    const noteContent = this.noteText$.value;

    const { cid, bytes } = await this.createFile(noteContent, title);

    const event = new CustomEvent(SUBMIT_NOTE_EVENT, {
      detail: { cid, title, bytes },
    });

    this.dispatchEvent(event);
  }

  async connectedCallback() {
    this.form$.addEventListener("submit", this.onSubmit);
  }

  disconnectedCallback() {
    this.form$.removeEventListener("submit", this.onSubmit);
  }
}
