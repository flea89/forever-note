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
      const item = document.createElement("li");
      const link = document.createElement("a");

      item.className = "lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30";

      link.href = `#`;
      link.textContent = title;
      item.appendChild(link);

      item.addEventListener("click", (e) => {
        e.preventDefault();
        const event = new CustomEvent(EVENTS.noteSelected, {
          detail: { note },
        });
        this.dispatchEvent(event);
      });

      this.list$.appendChild(item);
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if ((name = ITEMS_ATTRIBUTE)) {
      const notes = newValue ? JSON.parse(newValue) : [];
      this.renderNotes(notes);
    }
  }
}
