import express from 'express'

import expressWs from 'express-ws'
import { readAndProcessCSS, getItemData, render, getNoteData, noteDirs } from './common'

global._devServer = true

const app = express()
const port = 3000
expressWs(app)

// GET /notes/whatever/name.ext -> /notes/YYYY-MM-DD_whatever/name.ext
app.use((req, res, next) => {
  const match = req.url.match(/\/notes\/(.+)\/(?!$|\?)/)
  if (match) {
    const noteName = match[1]
    if (!noteDirs[noteName]) {
      return res.sendStatus(404)
    }

    req.url = req.url.replace(noteName, noteDirs[noteName])
  }

  next()
})

app.use(express.static('./static'))
app.use((req, res, next) => {
  if (req.path.endsWith('.css')) {
    return readAndProcessCSS({ filePath: `./frontend${req.path}` }).then(css =>
      res.contentType('css').send(css),
    )
  }

  next()
}, express.static('./frontend'))

app['ws']('/', () => {})

app.get('/items/:item', (req, res) => {
  const item = getItemData(req.params.item)

  if (!item || !item.html) {
    return res.status(404).send(render.notFound())
  }

  res.send(render.items(item))
})

app.get('/notes/:note', (req, res) => {
  const note = getNoteData(req.params.note)
  if (!note) {
    return res.status(404).send(render.notFound())
  }

  res.send(render.note(note))
})

app.get('/notes', (req, res) => {
  res.send(render.allNotes())
})

app.get('/', (req, res) => {
  res.send(render.home())
})

app.get('/feed.xml', (req, res) => {
  res.type('xml').send(render.rss())
})

app.use((req, res) => {
  res.status(404).send(render.notFound())
})

app.listen(port, () => {
  console.log(`dev server listening on port ${port}`)
})
