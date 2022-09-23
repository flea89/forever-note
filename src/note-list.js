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
      const list = document.createElement("ul");
      const item = document.createElement("li");
      const link = document.createElement("a");
      list.className = "list pl0 measure";
      item.className = "lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30";
      link.target = "_blank";
      link.href = `https://w3s.link/ipfs/${cid}`;
      link.textContent = title;
      item.appendChild(link);
      list.appendChild(item);
      this.appendChild(list);
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if ((name = ITEMS_ATTRIBUTE)) {
      const notes = newValue ? JSON.parse(newValue) : [];
      this.renderNotes(notes);
    }
  }
}
