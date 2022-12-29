import { h } from 'nano-jsx'
import * as url from 'url'
import * as querystring from 'querystring'

export interface ImageProps {
  href: string
  title?: string
}

export default function Image({ href, title }: ImageProps) {
  const { pathname, query } = url.parse(href)
  const parsedQuery = querystring.parse(query)

  return (
    <div class="image" style={Object.keys(parsedQuery).length > 0 ? parsedQuery : undefined}>
      <div class="image__container">
        <a href={href} target="_blank" rel="noopener">
          <img src={href} title={title} />
        </a>
        {title && <h4 class="image__title">{title}</h4>}
      </div>
    </div>
  )
}
