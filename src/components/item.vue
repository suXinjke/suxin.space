<template>
    <div class="item" @mouseover="onMouseEnter" @mouseleave="onMouseLeave" @touchstart="onMouseEnter" @touchend="onMouseLeave">
        <div :key="item.image" class="js-only item__image" v-lazy:background-image="item.image" :style="imageStyle">
            <font-awesome-icon class="item__image-icon" icon="stopwatch"/>
            <font-awesome-icon class="item__error-icon" icon="times"/>
        </div>
        <noscript class="item__noscript" inline-template>
            <div class="item__image" :style="imageStyle + `background-image: url('${item.image}')`">
            </div>
        </noscript>
        <div class="item__header">
            <HeaderText
                :header="item.title"
                :header-secondary="item.subtitle"
                :icon="item.icon"
                :iconStyle="item.iconStyle"
                :marquee="hovered"
            />
        </div>
    </div>
</template>

<script>
export default {
    data: () => ( {
        hovered: false
    } ),
    computed: {
        imageStyle: function() {
            const { imagePos = '' } = this.item
            return imagePos ? `background-position: ${imagePos};` : ''
        }
    },
    props: {
        item: Object,
    },
    methods: {
        onMouseEnter: function() {
            this.hovered = true
        },
        onMouseLeave: function() {
            this.hovered = false
        }
    }
}
</script>


<style lang="scss">
@import '@/assets/util.scss';

@keyframes item__appear {
    from { opacity: 0 }
    to { opacity: 1; }
}

.item {
    display: flex;
    flex-direction: column;
    background-color: $color-dark;
    content: 'FFFFFF';

    &__header {
        color: $color-dark;
        background-color: $color-gray;
        padding: 0.5em 0.25em 0.5em 0.75em;

        overflow: hidden;
    }

    &__noscript {
        display: flex;
        flex: 1;
    }

    &__image-container {
        flex: 1;
        position: relative;
    }

    &__image {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        background-size: cover;
        background-position: center center;

        &[lazy=loaded] {
            animation: item__appear 0.25s;
        }

        & &-icon {
            animation: item__appear 0.25s;
            animation-delay: 1s;
            animation-fill-mode: backwards;
        }

        &[lazy=loaded] &-icon,
        &[lazy=error] &-icon {
            display: none;
        }

        &[lazy=error] .item__error-icon {
            display: initial;
        }
    }

    &__image-icon,
    &__error-icon {
        width: 2em !important;
        height: 2em !important;

        padding: 2em;
        color: $color-light;
    }

    &__error-icon {
        display: none;
    }
}
</style>
