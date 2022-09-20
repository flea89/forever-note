import { encodeFile, encodeDirectory, uploadCarBytes } from '@w3ui/uploader-core';
import { loadDefaultIdentity } from "@w3ui/wallet-core";
import _fetch from '@web-std/fetch';
import { storeList } from '@web3-storage/access/capabilities'
import { connection } from '@web3-storage/access/connection'
import { Authority } from '@ucanto/authority'



const PUBLISH_BUTTON_SELECTOR = "button";
const NOTE_TEXTAREA_SELECTOR = "textarea";

export class NoteEditor extends HTMLElement {
  constructor() {
    super();
    this.innerHTML =
      `<textarea rows="10" cols="80">Hello</textarea>
      <button type="button">Publish</button>`;
  }

  async connectedCallback() {
    console.log('toto editor');
    const publishButtonEl = this.querySelector(PUBLISH_BUTTON_SELECTOR);
    const noteTextEl = this.querySelector(NOTE_TEXTAREA_SELECTOR);
    publishButtonEl.addEventListener('click', async () => {
      console.log('click')
      const noteContent = noteTextEl.value;
      const blob = new Blob([noteContent], {
        type: "text/plain;charset=utf-8"
      })
      const file = new File([blob], 'doc.txt')
      const { cid, car } = await encodeFile(file);
      console.log(cid.toString(), car);

      const chunks = []
      for await (const chunk of car) {
        chunks.push(chunk)
      }
      const bytes = new Uint8Array(await new Blob(chunks).arrayBuffer())

      globalThis.fetch = _fetch;
      const identity = await loadDefaultIdentity();
      await uploadCarBytes(identity.signingAuthority, bytes);


      const authority = identity.signingAuthority
      const storeApiUrl = new URL('https://8609r1772a.execute-api.us-east-1.amazonaws.com')
      const storeDid = Authority.parse('did:key:z6MkrZ1r5XBFZjBU34qyD8fueMbMRkKw17BZaq2ivKFjnz2z')
      const conn = connection({
        id: storeDid,
        url: storeApiUrl
      })
      const result = await storeList.invoke({
          issuer: authority,
          audience: storeDid,
          with: authority.did(),
        }).execute(conn)


      console.log("List", result)
    })
  }

  disconnectedCallback() {
  }
}

