import { h } from 'nano-jsx'
import * as path from 'path'
import { globSync } from 'glob'

import HeaderText from '@components/header-text'
import Item from '@components/item'

import { getItemData, processItemShowcase, useMetaContext } from '../common'

interface ItemTitleProps {
  row?: string
  col?: string
  item: string
}

function ItemTitle({ row, col, item }: ItemTitleProps) {
  const styleArray = []
  if (col) {
    styleArray.push(`grid-column: ${col}`)
  }

  if (row) {
    styleArray.push(`grid-row: ${row}`)
  }

  const itemData = getItemData(item)

  return <Item item={itemData} style={styleArray.join('; ')} />
}

function makeGridStyles(s: { height: string; columns: string; rows: string }) {
  return [
    `--grid-height: ${s.height}`,
    `grid-template-columns: ${s.columns}`,
    `grid-template-rows: ${s.rows}`,
  ].join('; ')
}

export default function HomePage() {
  const showcases = globSync('./frontend/items/**/*.md')
    .map(f => path.parse(f).name)
    .reduce((prev, itemName) => {
      const itemData = getItemData(itemName)
      if (itemData.showcase) {
        const { imageStyle, ...firstItem } = processItemShowcase(itemData)
        Object.assign(firstItem, itemData.showcase[0])

        prev[itemName] = [firstItem, ...itemData.showcase.slice(1)]
      }
      return prev
    }, {})

  showcases['half-payne-review'][0].interval = 10000

  const ctx = useMetaContext()
  ctx.title = 'Home'
  ctx.styles = [{ href: '/home.css' }]
  ctx.bottomScripts = [
    { id: 'showcases', type: 'application/json', content: JSON.stringify(showcases) },
    { src: '/home.js' },
  ]

  ctx.meta = {
    title: '',
    description: 'Getting things done and sharing how',
    image: '/images/robin_1.jpg',
  }

  return (
    <main>
      <section>
        <HeaderText className="section-header" icon="solid/user" header="About" />
        <div
          class="grid"
          style={makeGridStyles({
            height: '22rem',
            columns: '2fr 1fr 1.5fr',
            rows: '1fr 1fr',
          })}
        >
          <ItemTitle row="1 / span 2" item="suxin" />
          <ItemTitle col="2" row="1" item="suxin-email" />
          <ItemTitle col="2" row="2" item="suxin-github" />
          <ItemTitle row="1 / span 2" col="3" item="suxin-youtube" />
        </div>
      </section>

      <section>
        <HeaderText className="section-header" icon="regular/hourglass" header="Half-Payne" />
        <div
          class="grid"
          style={makeGridStyles({
            height: '24rem',
            columns: '2fr 1fr 1fr 1fr',
            rows: '1fr 1fr',
          })}
        >
          <ItemTitle row="1 / span 2" item="half-payne" />
          <ItemTitle col="2" row="1" item="half-payne-reward" />
          <ItemTitle col="2" row="2" item="half-payne-download" />
          <ItemTitle col="3" row="1" item="half-payne-review" />
          <ItemTitle col="3" row="2" item="half-payne-trailer" />
          <ItemTitle col="4" row="1 / span 2" item="half-payne-interview" />
        </div>
      </section>

      <section>
        <HeaderText className="section-header" icon="solid/trophy" header="RetroAchievements" />
        <div
          class="grid"
          style={makeGridStyles({
            height: '32rem',
            columns: '1fr 1fr 1fr 1fr',
            rows: '1fr 1fr',
          })}
        >
          <ItemTitle col="1" row="1" item="ra" />
          <ItemTitle col="1" row="2" item="ra-cw" />
          <ItemTitle col="2" row="1 / span 2" item="ra-gt4" />
          <ItemTitle col="3" row="1" item="ra-gt3" />
          <ItemTitle col="3" row="2" item="ra-driver" />
          <ItemTitle col="4" row="1 / span 2" item="ra-ace" />
        </div>
      </section>

      <section>
        <HeaderText className="section-header" icon="solid/rocket" header="Colony Wars" />
        <div
          class="grid"
          style={makeGridStyles({
            height: '36rem',
            columns: '1fr 1fr 1fr',
            rows: '1fr 1fr',
          })}
        >
          <ItemTitle row="1 / span 2" item="cw3-menu" />
          <ItemTitle col="2" row="1" item="cw3-ripper" />
          <ItemTitle col="2" row="2" item="cw2-ripper" />
          <ItemTitle col="3" row="1" item="cw3-oddities" />
          <ItemTitle col="3" row="2" item="cw2-oddities" />
        </div>
      </section>

      <section>
        <HeaderText className="section-header" icon="solid/asterisk" header="Other" />
        <div
          class="grid"
          style={makeGridStyles({
            height: '72rem',
            columns: 'repeat(6, 1fr)',
            rows: '1fr 0.5fr 0.5fr 1fr',
          })}
        >
          <ItemTitle col="1 / span 2" row="1" item="about-this-website" />
          <ItemTitle col="3 / span 2" row="1" item="rss" />
          <ItemTitle col="1 / span 2" row="2 / span 2" item="blender-goldsource" />
          <ItemTitle col="3 / span 2" row="2 / span 2" item="secretary-bird" />
          <ItemTitle col="5 / span 2" row="1" item="chirpinator" />
          <ItemTitle col="5 / span 2" row="2 / span 2" item="barasite-eve" />
          <ItemTitle col="1 / span 3" row="4" item="rbr-cz-tourney-creator" />
          <ItemTitle col="4 / span 3" row="4" item="rbr-cz-analysis" />
        </div>
      </section>
    </main>
  )
}
