import { h, Fragment } from 'nano-jsx'
import Image, { ImageProps } from './image'

interface ImageTabsProps {
  id: string
  images: ImageProps[]
}

export default function ImageTabs({ id, images }: ImageTabsProps) {
  return (
    <div class="tabs">
      {images.map((image, index) => () => {
        const tabId = `tab_${id}_${index}`
        return (
          <>
            <input
              id={tabId}
              type="radio"
              name={`tabs_${id}`}
              checked={index === 0 ? '' : undefined}
            />
            <label for={tabId}>{image.title}</label>{' '}
          </>
        )
      })}

      <div class="tabs__content-container">
        {images.map(image => (
          <section class="tabs__content">
            <Image {...image} />
          </section>
        ))}
      </div>
    </div>
  )
}
