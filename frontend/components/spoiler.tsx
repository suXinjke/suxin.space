import { h, Fragment } from 'nano-jsx'
import Icon from './icon'

interface SpoilerProps {
  type: 'question' | 'warning'
  header: string
  slug: string
  content: string
}

export default function Spoiler({ type, header, slug, content }: SpoilerProps) {
  return (
    <details class={`spoiler spoiler_${type}`}>
      <summary class="spoiler__header" id={slug}>
        <a href={'#' + slug}>
          <Icon className="spoiler__icon" icon={`solid/${type}`} />
        </a>
        <strong>{type === 'question' ? 'Question' : 'Warning'}:</strong> {header}
      </summary>
      <section>
        <p innerHTML={{ __dangerousHtml: content }}></p>
      </section>
    </details>
  )
}
