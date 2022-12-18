import { h } from 'nano-jsx'
import { ItemData, useMetaContext } from '../../common'

import HeaderText from '@components/header-text'

interface ItemPageProps {
  item: ItemData
}

export default function ItemPage({ item }: ItemPageProps) {
  const ctx = useMetaContext()
  ctx.title = item.title
  ctx.styles = [{ href: '/items/itemPage.css' }]

  const { title, subtitle, icon, image, imagePos, status, html } = item

  let imageStyle = `background-image: url( '${image}' );`
  if (imagePos) {
    imageStyle += ` background-position: ${imagePos};`
  }

  ctx.meta = {
    image,
    description: '',
  }

  return (
    <main class="item-page">
      {image && <div class="item-page__image" style={imageStyle}></div>}
      <div class="item-page__content">
        <div class="item-page__content-header">
          <HeaderText header={title} headerSecondary={subtitle} icon={icon} />
          {status && <HeaderText hasStatus={true} header={status} />}
        </div>
        <div innerHTML={{ __dangerousHtml: html }}></div>
      </div>
    </main>
  )
}
