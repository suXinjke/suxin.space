import { h, Fragment } from 'nano-jsx'
import classNames from 'classnames'

import HeaderText from '@components/header-text'
import { MetaContext } from 'common'

interface NavBarProps {
  currentRoute: string
  noteSubtitle?: string
}

function NavBar({ currentRoute, noteSubtitle }: NavBarProps) {
  const isOnNotesPage = currentRoute.startsWith('/notes')
  const headerTag = isOnNotesPage ? 'h2' : 'h1'

  return (
    <header class="header">
      <nav class="nav header__nav">
        <a
          href="/"
          class={classNames('nav__link', {
            active: currentRoute === '/',
          })}
        >
          <HeaderText icon="solid/home" header="Home" />
        </a>
        <a
          href="/notes/"
          class={classNames('nav__link', {
            active: isOnNotesPage,
            expand: true,
          })}
        >
          <HeaderText
            icon="solid/file"
            header="Notes"
            headerSecondary={noteSubtitle}
            subtitleUppercase={false}
          />
        </a>
      </nav>
      {h(headerTag, { class: 'header__logo' }, 'suXin space')}
    </header>
  )
}

export default function Layout({
  body,
  currentRoute,
  noteSubtitle,
}: { body: any; ctx: MetaContext } & NavBarProps) {
  return (
    <>
      <NavBar currentRoute={currentRoute} noteSubtitle={noteSubtitle} />
      {body}
    </>
  )
}
