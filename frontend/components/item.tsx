import { h } from 'nano-jsx'
import classNames from 'classnames'

import HeaderText from './header-text'
import { ItemData, processItemShowcase } from 'common'
import Icon from './icon'

export interface ItemProps {
  item: ItemData

  style?: string
}

function ItemModalContent({ item }: { item: ItemData }) {
  const { subtitle, icon, status, uppercase, html } = item

  const { title, imageStyle } = processItemShowcase(item)

  return (
    <div class="item-modal-holder">
      <div class="item-description item-description_modal">
        <div class="item-description__header">
          <HeaderText
            className="item-description__header-text"
            header={title}
            headerSecondary={subtitle}
            icon={icon}
            uppercase={uppercase}
          />
          {status && (
            <HeaderText hasStatus={true} className="item-description__status" header={status} />
          )}
          <Icon className="item-description__close-button" icon="solid/times" />
        </div>
        <div class="item-description__content">
          {imageStyle && <div class="item-description__image" style={imageStyle}></div>}
          <div class="item-description__description">{html}</div>
        </div>
      </div>
    </div>
  )
}

export default function Item({ item, style }: ItemProps) {
  const { icon, status, statusIcon, uppercase, showcase, html } = item
  const { title, subtitle, link, imageStyle } = processItemShowcase(item)

  const clickable = Boolean(link || html)
  const isClickableModal = Boolean(html)

  const linkIsExternal = item.linkIsExternal || item.link?.startsWith('http')

  return (
    <a
      class={classNames('item', { 'item-clickable': clickable })}
      style={style}
      href={link || `/items/${item.id}`}
      data-clickable-modal={isClickableModal ? true : undefined}
      data-showcase={showcase ? item.id : undefined}
      target={linkIsExternal ? '_blank' : undefined}
      rel={linkIsExternal ? 'noopener' : undefined}
    >
      <div class="item__image" style={imageStyle}>
        {status && (
          <HeaderText className="item__status" header={status} icon={statusIcon} hasStatus={true} />
        )}
      </div>
      <div class="item__header">
        <HeaderText header={title} headerSecondary={subtitle} icon={icon} uppercase={uppercase} />
      </div>
      {isClickableModal && <ItemModalContent item={item} />}
    </a>
  )
}
