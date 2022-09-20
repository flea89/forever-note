export class NoteList extends HTMLElement {
  constructor() {
    super();
    this.innerHTML =
      `<ul>
        <li>Un</li>
        <li>Deux</li>
       </ul>`;
  }

  connectedCallback() {
    console.log('toto');
  }

  disconnectedCallback() {
  }
}

