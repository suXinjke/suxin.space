import { h } from 'nano-jsx'
import { useMetaContext } from 'common'

export default function NotFoundPage() {
  const ctx = useMetaContext()
  ctx.title = 'Not found'
  ctx.styles = [{ href: '/404.css' }]

  ctx.meta = {
    description: 'This page does not exist',
    image: '/frog.png',
  }

  return (
    <div class="frog">
      <img class="frog__image" src="/frog.png" />
      <div class="frog__message">
        <h2 class="frog__404">
          <strong>404</strong>
        </h2>
        <h3 class="frog__not-found">Not found</h3>
      </div>
    </div>
  )
}
