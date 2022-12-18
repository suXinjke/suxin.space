import { h } from 'nano-jsx'
import classNames from 'classnames'

import Icon from './icon'

interface HeaderTextProps {
  header?: string
  headerSecondary?: string
  icon?: string
  className?: string

  hasStatus?: boolean
  uppercase?: boolean
  subtitleUppercase?: boolean
}

export default function HeaderText({
  header,
  headerSecondary,
  icon,
  className,
  hasStatus = false,
  uppercase = true,
  subtitleUppercase = true,
}: HeaderTextProps) {
  let tooltipTitle = header
  if (headerSecondary) {
    tooltipTitle += ` - ${headerSecondary}`
  }
  tooltipTitle = tooltipTitle.trim()

  return (
    <div
      class={classNames('header-text', className, {
        'header-text_status': hasStatus,
      })}
    >
      {icon && <Icon icon={icon} className="header-text__icon-container" />}
      <div class="header-text__content" title={tooltipTitle}>
        {headerSecondary && (
          <h3
            class={classNames('header-text__secondary', {
              uppercase: subtitleUppercase,
            })}
          >
            {headerSecondary}
          </h3>
        )}
        {header && (
          <h2
            class={classNames('header-text__primary', {
              uppercase: hasStatus === false && uppercase,
            })}
          >
            {header}
          </h2>
        )}
      </div>
    </div>
  )
}
