import { h } from 'nano-jsx'

export interface ImageProps {
  href: string
  title?: string
}

export default function Image({ href, title }: ImageProps) {
  return (
    <div class="image">
      <a href={href} target="_blank" rel="noopener">
        <img src={href} title={title} />
      </a>
      {title && <h4 class="image__title">{title}</h4>}
    </div>
  )
}
