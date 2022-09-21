const ITEMS_ATTRIBUTE = "items";

// TODO state management should be done in a parent controller.
export class NoteList extends HTMLElement {
  static get observedAttributes() {
    return [ITEMS_ATTRIBUTE];
  }

  constructor() {
    super();
  }
  renderNotes(notes) {
    this.innerHTML = "";
    notes.forEach(({ cid, title }) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.target = "_blank";
      link.href = `https://w3s.link/ipfs/${cid}`;
      link.textContent = title;
      item.appendChild(link);
      this.appendChild(item);
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if ((name = ITEMS_ATTRIBUTE)) {
      const notes = newValue ? JSON.parse(newValue) : [];
      this.renderNotes(notes);
    }
  }
}
