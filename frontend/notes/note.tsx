import { h, Fragment } from 'nano-jsx'

import { useMetaContext, NoteData, processItemShowcase, getNoteData } from 'common'

import Item from '@components/item'

interface NotesPageProps {
  note: NoteData
}

export default function NotePage({ note }: NotesPageProps) {
  const ctx = useMetaContext()
  ctx.title = note.title

  const hasTweets = note.html.includes('<blockquote class="twitter-tweet"')
  const hasPrism = note.html.includes('<code class="')

  const noteHeadScripts = note.headScripts || []

  const seeAlsoItems = (note.seeAlso || []).map(noteName => {
    const note = getNoteData(noteName)
    return {
      ...note,
      html: undefined, // so you don't consider item a clickable modal
      link: `/notes/${note.id}/`,
      subtitle: '',
      image: note.image && note.image.replace(/^\.\//, `/notes/${note.id}/`),
      icon: undefined,
      uppercase: false,
      showcase:
        note.showcase &&
        note.showcase.map(x => ({
          ...x,
          image: x.image.replace(/^\.\//, `/notes/${note.id}/`),
        })),
    }
  })

  const seeAlsoShowcases = seeAlsoItems.reduce((prev, cur) => {
    if (cur.showcase) {
      const { imageStyle, ...firstItem } = processItemShowcase(cur)
      Object.assign(firstItem, cur.showcase[0])

      prev[cur.id] = [firstItem, ...cur.showcase.slice(1)]
    }
    return prev
  }, {})

  ctx.headScripts = [
    ...(hasTweets ? [{ src: 'https://platform.twitter.com/widgets.js', async: true }] : []),
    ...(Array.isArray(noteHeadScripts) ? noteHeadScripts : []).map(src => ({ src })),
  ]
  ctx.bottomScripts =
    seeAlsoItems.length > 0
      ? [
          { id: 'showcases', type: 'application/json', content: JSON.stringify(seeAlsoShowcases) },
          { content: `addEventListener('DOMContentLoaded', function () { initItems() })` },
        ]
      : []

  ctx.styles = [{ href: '/notes/note.css' }, ...(hasPrism ? [{ href: '/prism-github.css' }] : [])]

  ctx.meta = {
    description: note.description,
    image: processItemShowcase(note).image.replace(/^\.\//, `/notes/${note.id}/`),
  }

  return (
    <main class="readable note">
      <h1>
        <strong>{note.title}</strong>
      </h1>
      <h3 class="uppercase">{note.dateReadable}</h3>

      <div class="note__content" innerHTML={{ __dangerousHtml: note.html }}></div>
      {seeAlsoItems.length > 0 && (
        <>
          <h2>
            <strong>See also</strong>
          </h2>
          {seeAlsoItems.map(item => (
            <Item style="height: 24rem; margin: 0.5rem 0;" item={item} />
          ))}
        </>
      )}
    </main>
  )
}
