import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'

import { minify as terser } from 'terser'

import imagemin from 'imagemin'
import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminPngquant from 'imagemin-pngquant'

import _glob from 'glob'
const glob = util.promisify(_glob)

import { getItemData, getNoteData, noteDirs, readAndProcessCSS, render } from './common'

const currentDir = __dirname
process.chdir(currentDir)

const outputDir = './dist'

function mkdirCustom(filePaths: string[]) {
  const fileDirs = new Set<string>()

  for (const filePath of filePaths) {
    fileDirs.add(path.parse(filePath).dir.replace(/^.\/(frontend|static)/, outputDir))
  }

  for (const dir of fileDirs) {
    if (fs.existsSync(dir) === false) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }
}

async function build() {
  const [itemNames, noteDirsAndSubdirs, assetFilePaths, staticFilePaths] = await Promise.all([
    glob('./frontend/items/**/*.md').then(itemFilePaths =>
      itemFilePaths.map(f => path.parse(f).name),
    ),
    glob('./frontend/notes/**/').then(noteDirPaths =>
      noteDirPaths.map(f => f.replace(/(notes[\\/])(.+?_)/, '$1')),
    ),
    glob('./frontend/**/*.@(js|css|jpg|jpeg|png|gif|wav|mp4)'),
    glob('./static/**/?(*.*|CNAME)', { dot: true }),
  ])

  const itemsToRender = itemNames.filter(f => getItemData(f).html)
  const noteNames = Object.keys(noteDirs)

  mkdirCustom([
    ...itemsToRender.map(i => `${outputDir}/items/${i}/index.html))`),
    ...noteDirsAndSubdirs.map(n => n + '.'),
    ...staticFilePaths,
  ])

  await Promise.all([
    fs.promises.writeFile(`${outputDir}/index.html`, render.home()),
    fs.promises.writeFile(`${outputDir}/404.html`, render.notFound()),
    fs.promises.writeFile(`${outputDir}/feed.xml`, render.rss()),
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
      readAndProcessCSS({ filePath, minify: true }).then(css =>
        fs.promises.writeFile(outputFilePath, css),
      )
    } else if (['.png', '.jpg', '.jpeg'].includes(ext)) {
      imagemin([filePath], {
        plugins: [
          imageminMozjpeg(),
          imageminPngquant({
            quality: [0.6, 0.8],
          }),
        ],
      }).then(files => fs.promises.writeFile(outputFilePath, files[0].data))
    } else if (ext === '.js') {
      fs.promises
        .readFile(filePath)
        .then(f => terser(f.toString()))
        .then(result => fs.promises.writeFile(outputFilePath, result.code))
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
