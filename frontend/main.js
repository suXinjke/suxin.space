function initItems() {
  function makeImageStyle(image, imagePos) {
    let imageStyle = ''

    if (image) {
      imageStyle += `background-image: url('${image}');`

      if (imagePos) {
        imageStyle += `background-position: ${imagePos}`
      }
    }

    return imageStyle
  }

  function attemptItemMarquee(headerText, headerTextPrimary) {
    const { clientWidth, scrollWidth } = headerTextPrimary
    let offset = scrollWidth - clientWidth
    if (offset === 0) {
      return
    }

    offset += 10
    const time = offset / 90

    headerTextPrimary.setAttribute(
      'style',
      [
        `margin-left: -${offset}px`,
        `opacity: 0`,
        `transition: margin-left ${time}s linear 0.6s, opacity 0.2s linear ${time + 1.5}s`,
      ].join(';'),
    )

    headerText._marquee_done = false
    headerTextPrimary.addEventListener('transitionend', onItemTransitionEnd)
  }

  function onItemTransitionEnd(e) {
    if (e.propertyName === 'opacity') {
      e.currentTarget.setAttribute('style', '')

      const headerText = e.currentTarget.closest('.header-text')

      if (headerText._marquee) {
        if (headerText._marquee_done) {
          attemptItemMarquee(headerText, e.currentTarget)
        } else {
          headerText._marquee_done = true
        }
      }
    }
  }

  function onItemEnter(e) {
    e.currentTarget._hovering = true

    const headerText = e.currentTarget.querySelector('.header-text')
    const headerTextPrimary = headerText.querySelector('.header-text__primary')

    if (!headerText._marquee) {
      headerText._marquee = true
      headerText.classList.add('header-text_marquee')
      attemptItemMarquee(headerText, headerTextPrimary)
    }
  }

  function onItemLeave(e) {
    if (e.type.startsWith('touch') === false && e.currentTarget !== e.target) {
      return
    }

    e.currentTarget._hovering = false

    const headerText = e.currentTarget.querySelector('.header-text')
    const headerTextPrimary = headerText.querySelector('.header-text__primary')

    headerText._marquee = false
    headerText.classList.remove('header-text_marquee')
    headerTextPrimary.setAttribute('style', '')
  }

  const showcasesElement = document.getElementById('showcases')
  const showcases = showcasesElement ? JSON.parse(showcasesElement.text) : null

  // transform all a-tag items that have content in them into divs
  // so they properly lead into modals, otherwise original link works without JS
  document.querySelectorAll('.item-clickable').forEach(e => {
    if (e.dataset.clickableModal) {
      const copy = document.createElement('div')
      copy.innerHTML = e.innerHTML
      copy.className = e.className
      copy.setAttribute('style', e.getAttribute('style'))
      if (e.dataset.showcase) {
        copy.setAttribute('data-showcase', e.getAttribute('data-showcase'))
      }

      e.after(copy)
      e.remove()

      // the markdown content held by item may contain links, so it must
      // be stored as plain text, that's why it's copied here from text
      // into div's innerHTML
      const description = copy.querySelector('.item-description__description')
      description.innerHTML = description.textContent

      e = copy
    }

    const itemId = e.dataset.showcase

    if (showcases && showcases[itemId]) {
      let index = 0
      const showcase = showcases[itemId]

      setInterval(() => {
        if (e._hovering) {
          return
        }

        index++
        if (index >= showcase.length) {
          index = 0
        }

        // force prefetch of next image
        const nextImage = new Image()
        nextImage.src = showcase[index].image

        const item = Object.assign({}, showcase[0], showcase[index])

        const image = e.querySelector('.item__image')
        image.setAttribute('style', makeImageStyle(item.image, item.imagePos))
        image.classList.remove('item_appear')
        void image.offsetWidth
        image.classList.add('item_appear')

        if (item.link) {
          e.setAttribute('href', item.link)
        }

        e.querySelector('.header-text__secondary').innerText = item.subtitle
        e.querySelector('.header-text__primary').innerText = item.title
      }, showcase[0].interval || 5000)
    }

    e.removeAttribute('data-showcase')

    e.addEventListener('mouseover', onItemEnter)
    e.addEventListener('mouseleave', onItemLeave)
    e.addEventListener('touchstart', onItemEnter)
    e.addEventListener('touchend', onItemLeave)
  })
}
