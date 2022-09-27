const ITEMS_ATTRIBUTE = "items";

const classes = {
  itemSelected: "item-selected",
};

export const EVENTS = {
  noteSelected: "list:selected",
};

// TODO state management should be done in a parent controller.
export class NoteList extends HTMLElement {
  static get observedAttributes() {
    return [ITEMS_ATTRIBUTE];
  }

  constructor() {
    super();
    this.list$ = this.querySelector("ul");
  }

  renderNotes(notes) {
    this.list$.innerHTML = "";
    notes.forEach((note) => {
      const { cid, title } = note;
      const item$ = new NoteListItem(cid, title)
      this.list$.appendChild(item$);
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if ((name = ITEMS_ATTRIBUTE)) {
      const notes = newValue ? JSON.parse(newValue) : [];
      this.renderNotes(notes);
    }
  }
}

export class NoteListItem extends HTMLElement {
  constructor(cid="", title="") {
    super();
    this.cid = cid
    this.title = title
  }

  connectedCallback() {
    const template = document.getElementById('note-list-item');
    const templateContent = template.content;
    const node = templateContent.cloneNode(true);
    const titleSlot = node.querySelector("slot[name=note-list-item-title]");

    titleSlot.innerHTML = this.title

    this.addEventListener("click", (e) => {
      e.preventDefault();
      const event = new CustomEvent(EVENTS.noteSelected, {
        detail: {note: {cid: this.cid, title: this.title}},
        bubbles: true
      });
      this.dispatchEvent(event);
    });

    this.appendChild(node);
  }
}
