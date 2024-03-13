import * as fs from 'fs'
import * as path from 'path'

import sharp from 'sharp'

import { glob } from 'glob'

import { getItemData, getNoteData, noteDirs, readAndProcessCSS, render } from './common'

const currentDir = __dirname
process.chdir(currentDir)

const outputDir = './dist'

function mkdirCustom(filePaths: string[]) {
  const fileDirs = new Set<string>()

  for (const filePath of filePaths) {
    fileDirs.add(path.parse(filePath).dir.replace(/^(frontend|static)/, outputDir))
  }

  for (const dir of fileDirs) {
    if (fs.existsSync(dir) === false) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }
}

async function build() {
  const [itemNames, noteDirsAndSubdirs, assetFilePaths, staticFilePaths] = await Promise.all([
    glob('./frontend/items/**/*.md', { posix: true }).then(itemFilePaths =>
      itemFilePaths.map(f => path.parse(f).name),
    ),
    glob('./frontend/notes/**/', { posix: true }).then(noteDirPaths =>
      noteDirPaths.map(f => f.replace(/(notes[\\/])(.+?_)/, '$1')),
    ),
    glob('./frontend/**/*.@(js|css|jpg|jpeg|png|gif|wav|mp4)', { posix: true }),
    glob('./static/**/?(*.*|CNAME)', { dot: true, posix: true }),
  ])

  const itemsToRender = itemNames.filter(f => getItemData(f).html)
  const noteNames = Object.keys(noteDirs)

  mkdirCustom([
    ...itemsToRender.map(i => `${outputDir}/items/${i}/index.html`),
    ...noteDirsAndSubdirs.map(n => n + '/.'),
    ...staticFilePaths,
  ])

  await Promise.all([
    fs.promises.writeFile(`${outputDir}/index.html`, render.home()),
    fs.promises.writeFile(`${outputDir}/404.html`, render.notFound()),
    fs.promises.writeFile(`${outputDir}/feed.xml`, render.rss()),
    fs.promises.writeFile(`${outputDir}/sitemap.xml`, render.sitemap()),
    fs.promises.writeFile(`${outputDir}/notes/index.html`, render.allNotes()),
    ...itemsToRender.map(i =>
      fs.promises.writeFile(`${outputDir}/items/${i}/index.html`, render.items(getItemData(i))),
    ),
    ...noteNames.map(n =>
      fs.promises.writeFile(`${outputDir}/notes/${n}/index.html`, render.note(getNoteData(n))),
    ),
  ])

  assetFilePaths.forEach(filePath => {
    const relativePath = path.relative(currentDir, filePath)
    const { ext } = path.parse(filePath)

    // replace removes date from note dir
    const outputFilePath = path
      .join(outputDir, path.relative('frontend', relativePath))
      .replace(/(notes[\\/])(.+?_)/, '$1')

    if (ext === '.css') {
      readAndProcessCSS({ filePath }).then(css => fs.promises.writeFile(outputFilePath, css))
    } else if (ext === '.png') {
      sharp(filePath).png({ quality: 80 }).toFile(outputFilePath)
    } else if (ext === '.jpg' || ext === '.jpeg') {
      sharp(filePath).jpeg({ mozjpeg: true }).toFile(outputFilePath)
    } else {
      fs.promises.copyFile(filePath, outputFilePath)
    }
  })

  for (const staticFilePath of staticFilePaths) {
    const relativePath = path.relative(currentDir, staticFilePath)
    const outputFilePath = path.join(outputDir, path.relative('static', relativePath))
    fs.promises.copyFile(relativePath, outputFilePath)
  }
}

build()
