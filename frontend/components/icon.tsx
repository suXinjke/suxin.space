import { Fragment, h } from 'nano-jsx'
import * as fs from 'fs'

const iconCache = {}

interface IconProps {
  icon: string
  className?: string
}

export default function Icon({ icon, className }: IconProps) {
  const iconFilePath = `./frontend/icons/${icon}.svg`

  if (!iconCache[icon]) {
    try {
      iconCache[icon] = fs
        .readFileSync(iconFilePath)
        .toString()
        .replace('<path', '<path fill="currentColor"')
    } catch (err) {
      console.log(err)
      return `unexisting icon ${icon}`
    }
  }

  return <div class={className} innerHTML={{ __dangerousHtml: iconCache[icon] }}></div>
}
