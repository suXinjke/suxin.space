import * as fs from 'fs'
import * as path from 'path'

import { createContext, h, renderSSR, useContext } from 'nano-jsx'

import cssnano from 'cssnano'
import postcss, { AcceptedPlugin } from 'postcss'
import postcssNested from 'postcss-nested'
import postcssCustomMedia from 'postcss-custom-media'

import { marked } from 'marked'
import fm from 'front-matter'

import glob from 'glob'

import layout from './frontend/layout'
import homePage from './frontend/homePage'
import itemPage from './frontend/items/itemPage'
import allNotesPage from './frontend/notes/allNotes'
import notePage from './frontend/notes/note'
import notFoundPage from './frontend/404'

import Image from '@components/image'

import Prism from 'prismjs'
import addPrismLanguages from 'prismjs/components/index'
import ImageTabs from '@components/image-tabs'
addPrismLanguages()

function naiveDecodeHTMLEntities(str: string) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
}

marked.use({
  renderer: {
    code(code, lang) {
      if (lang && Prism.languages[lang]) {
        code = Prism.highlight(code, Prism.languages[lang], lang)
      }

      return `<pre class="language-${lang}"><code class="language-${lang}">${code}</code></pre>`
    },
    image(href, _, title) {
      return renderSSR(
        h(Image, {
          href,
          title: naiveDecodeHTMLEntities(title),
        }),
      )
    },
    heading(text, level, raw, slugger) {
      const id = slugger.slug(raw)
      const link = `<a href="#${id}" class="anchor-link"><span>¶</span></a>`
      return `<h${level} id="${id}">${text}${link}</h${level}>`
    },
  },

  walkTokens(token) {
    // HACK: typescript casting + prettier does weird stuff otherwise
    const tokenAny = token

    // Wrap $tabs with ImageTabs component
    if (
      token.type === 'paragraph' &&
      token.raw.startsWith('$tabs') &&
      token.tokens.some(t => t.type === 'image')
    ) {
      const id = token.tokens[0].raw.match(/\$tabs\s+(\w+)/)[1]
      const images = token.tokens.reduce((prev, i) => {
        if (i.type === 'image') {
          prev.push({
            href: i.href,
            title: naiveDecodeHTMLEntities(i.text),
          })
        }

        return prev
      }, [])

      const html = renderSSR(h(ImageTabs, { id, images }))
      tokenAny.type = 'html'
      token.raw = html
      token.text = html
    }
  },
})

interface Script {
  src?: string
  content?: string
  type?: string
  id?: string
  async?: boolean
}
interface Style {
  href?: string
  content?: string
}
interface Meta {
  title?: string
  description: string
  image?: string
}

function makeMetaContext(currentRoute: string) {
  let title = ''
  let styles = null as Style[]
  let headScripts = null as Script[]
  let bottomScripts = null as Script[]

  let meta = null as Meta

  return {
    get title() {
      return title
    },

    set title(val: string) {
      if (title) {
        throw new Error('title is already set')
      }

      title = val
    },

    get styles() {
      return styles ?? []
    },

    set styles(val: Style[]) {
      if (styles) {
        throw new Error('styles are already set')
      }

      styles = val
    },

    get headScripts() {
      return headScripts ?? []
    },

    set headScripts(val: Script[]) {
      if (headScripts) {
        throw new Error('headScripts are already set')
      }

      headScripts = val
    },

    get bottomScripts() {
      return bottomScripts ?? []
    },

    set bottomScripts(val: Script[]) {
      if (bottomScripts) {
        throw new Error('bottomScripts are already set')
      }

      bottomScripts = val
    },

    get metaTags() {
      if (!meta) {
        throw new Error('you forgot to set meta')
      }

      const url = `https://suxin.space${currentRoute}`
      const image = meta.image && `https://suxin.space${meta.image}`

      let metaTitle = 'suXin space'
      const metaSubtitle = meta.title !== undefined ? meta.title : title
      if (metaSubtitle) {
        metaTitle = `${metaSubtitle} - ${metaTitle}`
      }

      const tags = [
        ['og:title', metaTitle],
        ['og:description', meta.description],
        ['og:url', url],
        ['og:image', image],

        ['twitter:card', 'summary'],
        ['twitter:title', metaTitle],
        ['twitter:description', meta.description],
        ['twitter:site', '@suxinjke'],
        ['twitter:image', image],
      ] as Array<[name: string, content: string]>

      return tags.filter(t => Boolean(t[1]))
    },

    set meta(val: Meta) {
      if (meta) {
        throw new Error('metaTags are already set')
      }

      meta = val
    },
  }
}

const MetaCtx = createContext(null)
export type MetaContext = ReturnType<typeof makeMetaContext>
export function useMetaContext() {
  return useContext(MetaCtx) as MetaContext
}

export const render = {
  home() {
    return generatePage({
      component: homePage,
      currentRoute: '/',
    })
  },
  items(item: ItemData) {
    return generatePage({
      component: itemPage,
      props: { item },
      currentRoute: `/items/${item.id}`,
    })
  },
  allNotes() {
    return generatePage({
      component: allNotesPage,
      currentRoute: `/notes/`,
    })
  },
  note(note: NoteData) {
    return generatePage({
      noteSubtitle: note.title,
      component: notePage,
      props: { note },
      currentRoute: `/notes/${note.id}`,
    })
  },
  notFound() {
    return generatePage({
      component: notFoundPage,
      currentRoute: '/',
    })
  },
  rss() {
    const notes: NoteData[] = Object.entries(noteDirs)
      .sort((a, b) => b[1].localeCompare(a[1]))
      .slice(0, 25)
      .map(n => getNoteData(n[0]))

    return `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <atom:link href="https://suxin.space/feed.xml" rel="self" type="application/rss+xml" />
    <title>suXin space</title>
    <link>https://suxin.space/notes/</link>
    <description>Getting things done and sharing how</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>suXin space</generator>
    <language>en</language>
    ${notes
      .map(note => {
        const link = `https://suxin.space/notes/${note.id}/`

        return `<item>
      <title><![CDATA[${note.title}]]></title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${new Date(note.date).toUTCString()}</pubDate>
      <description><![CDATA[${note.description}]]></description>
    </item>`
      })
      .join('\n    ')}
  </channel>
</rss>`
  },
}

export function readAndProcessCSS({ filePath, minify = false }) {
  const plugins = [postcssCustomMedia, postcssNested] as AcceptedPlugin[]
  if (minify) {
    plugins.push(cssnano)
  }

  return fs.promises
    .readFile(filePath)
    .then(css => postcss(plugins).process(css, { from: undefined, map: false }))
    .then(res => res.css)
}

const autorefreshJS = `
function _ws_connect() {
    _ws = new WebSocket('ws://localhost:3000')

    _ws.addEventListener('close', (e) => {
        if (e.code === 1006) {
            location.reload()
        }
    });
}

_ws_connect()
`

function generatePage({
  noteSubtitle,
  component,
  props,
  currentRoute,
}: {
  noteSubtitle?: string
  component: any
  props?: any
  currentRoute: string
  metaScripts?: Array<Script>
}) {
  const timestamp = Date.now()
  const ctx = makeMetaContext(currentRoute)

  const renderedBody = renderSSR(
    h(
      MetaCtx.Provider,
      { value: ctx },
      h(layout, {
        body: h(component, props),
        currentRoute,
        noteSubtitle,
      }),
    ),
  )

  const staticStyles: Style[] = [{ href: '/normalize.min.css' }, { href: '/fonts/fonts.css' }]
  const timestampedStyles: Style[] = [{ href: '/main.css' }, ...ctx.styles].map(x => ({
    ...x,
    href: x.href && `${x.href}?t=${timestamp}`,
  }))

  const headScripts = [{ src: '/main.js' }, ...ctx.headScripts]
  const bottomScripts = [
    ...ctx.bottomScripts,
    ...(global._devServer ? [{ content: autorefreshJS }] : []),
  ]

  function scriptMapping(s: Script, defer: boolean) {
    const attributes = [
      {
        name: 'id',
        value: s.id,
      },
      {
        name: 'type',
        value: s.type,
      },
    ].filter(s => Boolean(s.value))

    if (s.async) {
      attributes.push({
        name: 'async',
        value: '',
      })
    } else if (defer) {
      attributes.push({
        name: 'defer',
        value: '',
      })
    }

    const mappedAttributes = attributes.map(a => `${a.name}="${a.value}"`).join(' ')

    if (s.content) {
      return `<script ${mappedAttributes}>${s.content}</script>`
    } else if (s.src) {
      return `<script src="${s.src}?t=${timestamp}" ${mappedAttributes}></script>`
    } else {
      throw new Error('script must have src or content defined')
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>${ctx.title} - suXin space</title>
    ${ctx.metaTags
      .map(([name, content]) => `<meta name="${name}" content="${content}"/>`)
      .join('\n    ')}
    ${[...staticStyles, ...timestampedStyles]
      .map(s => {
        if (s.content) {
          return `<style>${s.content}</style>`
        } else if (s.href) {
          return `<link rel="stylesheet" href="${s.href}">`
        } else {
          throw new Error('style must have src or content defined')
        }
      })
      .join('\n    ')}
    ${headScripts.map(s => scriptMapping(s, true)).join('\n    ')}
  </head>
  <body>
    ${renderedBody}
    ${bottomScripts.map(s => scriptMapping(s, false)).join('\n    ')}
  </body>
</html>`
}

export interface ItemData {
  id: string

  title: string
  subtitle?: string
  icon?: string
  image?: string
  imagePos?: string
  status?: string
  statusIcon?: string
  link?: string
  linkIsExternal?: boolean
  showcase?: Array<{
    image: string
    imagePos?: string
    title?: string
    link?: string
  }>

  uppercase?: boolean
  html?: string
}
const items: Record<string, ItemData> = {}

function makeImageStyle(image?: string, imagePos?: string) {
  let imageStyle = ''

  if (image) {
    imageStyle += `background-image: url('${image}');`

    if (imagePos) {
      imageStyle += `background-position: ${imagePos}`
    }
  }

  return imageStyle
}

export function processItemShowcase(item: ItemData) {
  const firstItem = {
    title: item.title,
    image: item.image,
    imagePos: item.imagePos,
    subtitle: item.subtitle,
    link: item.link,
  }

  if (item.showcase) {
    Object.assign(firstItem, item.showcase[0])
  }

  const imageStyle = makeImageStyle(firstItem.image, firstItem.imagePos)

  return {
    ...firstItem,
    imageStyle,
  }
}

export function getItemData(itemName: string): ItemData {
  if (items[itemName]) {
    return items[itemName]
  }

  const filePath = `./frontend/items/${itemName}.md`
  if (fs.existsSync(filePath) === false) {
    return null
  }

  const file = fs.readFileSync(filePath).toString()

  const itemFrontMatter = fm<ItemData>(file)

  items[itemName] = {
    ...itemFrontMatter.attributes,
    id: itemName.toLowerCase(),
    html: marked(itemFrontMatter.body),
  }

  return items[itemName]
}

export interface NoteData {
  title: string
  date: string
  description: string
  image: string
  showcase?: ItemData['showcase']

  id: string
  html: string
  dateReadable: string

  headScripts?: string | string[]

  seeAlso?: string[]
}
const notes: Record<string, NoteData> = {}
export const noteDirs = glob.sync(`./frontend/notes/*/`).reduce((prev, cur) => {
  const { name } = path.parse(cur)
  const nameWithoutDate = name.replace(/^(.+_)/, '')

  prev[nameWithoutDate] = name

  return prev
}, {}) as Record<string, string>

function getNoteFile(noteName: string) {
  if (!noteDirs[noteName]) {
    return null
  }

  const filePaths = glob.sync(`./frontend/notes/${noteDirs[noteName]}/*.md`)
  if (filePaths.length > 1) {
    throw new Error(`Note ${noteName} has more than one markdown file - that should never happen`)
  }

  const filePath = filePaths[0]
  if (fs.existsSync(filePath) === false) {
    return null
  }
  return fs.readFileSync(filePath).toString()
}

export function getNoteData(noteName: string): NoteData {
  if (notes[noteName]) {
    return notes[noteName]
  }

  const file = getNoteFile(noteName)
  if (!file) {
    return null
  }
  const noteFrontMatter = fm<NoteData>(file)

  notes[noteName] = {
    ...noteFrontMatter.attributes,
    dateReadable: new Date(noteFrontMatter.attributes.date).toDateString().replace(/^[^\s]+\s/, ''),
    id: noteName.toLowerCase(),
    html: marked(noteFrontMatter.body),
  }

  return notes[noteName]
}
