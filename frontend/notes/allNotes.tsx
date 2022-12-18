import { h } from 'nano-jsx'

import { getNoteData, processItemShowcase, useMetaContext, noteDirs } from 'common'
import Item from '@components/item'

export default function AllNotesPage() {
  const notes = Object.entries(noteDirs)
    .sort((a, b) => b[1].localeCompare(a[1]))
    .map(x => x[0])
    .map(noteName => {
      const note = getNoteData(noteName)
      return {
        ...note,
        html: undefined, // so you don't consider item a clickable modal
        link: `/notes/${note.id}/`,
        subtitle: note.dateReadable,
        image: note.image && note.image.replace(/^\.\//, `./${note.id}/`),
        icon: 'solid/file',
        uppercase: false,
        showcase:
          note.showcase &&
          note.showcase.map(x => ({
            ...x,
            image: x.image.replace(/^\.\//, `./${note.id}/`),
          })),
      }
    })

  const showcases = notes.reduce((prev, cur) => {
    if (cur.showcase) {
      const { imageStyle, ...firstItem } = processItemShowcase(cur)
      Object.assign(firstItem, cur.showcase[0])

      prev[cur.id] = [firstItem, ...cur.showcase.slice(1)]
    }
    return prev
  }, {})

  const ctx = useMetaContext()
  ctx.title = 'Notes'
  ctx.styles = [
    {
      href: '/notes/allNotes.css',
    },
  ]
  ctx.bottomScripts = [
    { id: 'showcases', type: 'application/json', content: JSON.stringify(showcases) },
    { content: `addEventListener('DOMContentLoaded', function () { initItems() })` },
  ]

  ctx.meta = {
    description: 'List of available notes to read',
    image: '/images/robin_1.jpg',
  }

  return (
    <main class="notes grid" style="grid-template-columns: 1fr 1fr;">
      {notes.map(x => (
        <Item item={x} />
      ))}
    </main>
  )
}
