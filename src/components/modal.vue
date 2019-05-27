<template>
    <transition name="modal">
        <div :class="{ modal: true }" @click.self="$emit( 'close' )">
            <div class="modal__content" >
                <slot></slot>
            </div>
        </div>
    </transition>
</template>

<style lang="scss">
$animation-time: 0.1s;

@keyframes modal__appear {
    from {
        background-color: rgba( 30, 30, 30, 0 );
    }
    to {
        background-color: rgba( 30, 30, 30, 0.9 );
    }
}
@keyframes modal__content-appear {
    from {
        opacity: 0;
        transform: scale( 1.5 );
    }
    to {
        opacity: 1;
        transform: scale( 1 );
    }
}
.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background-color: rgba( 30, 30, 30, 0.9 );
    z-index: 22;

    &-enter, &-leave-to {
        background-color: rgba( 30, 30, 30, 0 );

        .modal__content {
            opacity: 0;
            transform: scale( 0.5 );
        }
    }

    &-enter-active,
    &-leave-active {
        transition: all $animation-time;
        .modal__content {
            transition: all $animation-time;
        }
    }

    animation: modal__appear $animation-time;
    &__content {
        animation: modal__content-appear $animation-time;
    }
}
</style>