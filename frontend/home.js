addEventListener('DOMContentLoaded', function () {
  function onClickOutsideOfModal(e) {
    if (e.target.closest('.modal__content') === null) {
      closeModal()
    }
  }

  function onModalCloseAnimationFinish(e) {
    if (e.animationName === 'modal__content-leave') {
      const modalPortal = document.querySelector('.modal')
      modalPortal.classList.remove('modal_active', 'modal_leaving')
      window.removeEventListener('click', onClickOutsideOfModal, { capture: true })
    }
  }

  function closeModal() {
    const modalPortal = document.querySelector('.modal')
    modalPortal.classList.add('modal_leaving')
  }

  function openModal(e) {
    const modalPortal = document.querySelector('.modal')
    const modalContent = modalPortal.querySelector('.modal__content')

    modalContent.innerHTML = e.currentTarget.querySelector('.item-modal-holder').innerHTML
    modalContent
      .querySelector('.item-description__close-button')
      .addEventListener('click', closeModal)

    modalPortal.classList.add('modal_active')

    window.addEventListener('click', onClickOutsideOfModal, { capture: true })
  }

  function main() {
    const modalDiv = document.createElement('div')
    modalDiv.className = 'modal'
    modalDiv.innerHTML = `<div class="modal__content"></div>`
    modalDiv.addEventListener('animationend', onModalCloseAnimationFinish)
    document.body.appendChild(modalDiv)

    initItems()

    document
      .querySelectorAll('.item-clickable')
      .forEach(e => e.addEventListener('click', openModal))
  }

  main()
})
