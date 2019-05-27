<template>
    <div class="item-description">
        <div class="item-description__header">
            <HeaderText
                class="item-description__header-text"
                :header="firstItemAttributes.title"
                :header-secondary="firstItemAttributes.subtitle"
                :icon="firstItemAttributes.icon"
                :iconStyle="firstItemAttributes.iconStyle"
            />
            <div class="item-description__close-button" @click="$emit( 'close' )">
                <font-awesome-icon icon="times"/>
            </div>
        </div>
        <div class="item-description__content">
            <div v-if="firstItemAttributes.image" class="item-description__image" :style="imageStyle"></div>
            <div class="item-description__description" v-html="item.content"></div>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        showcaseElement: function() {
            return ( this.item.showcase || [] )[this.counter] || {}
        },
        firstItemAttributes: function() {
            return {
                ...this.item,
                ...this.showcaseElement
            }
        },
        imageStyle: function() {
            const { imagePos = '', image = '' } = this.firstItemAttributes
            let style = ''
            if ( image ) {
                style += `background-image: url( '${image}' );`
            }
            if ( imagePos ) {
                style += `background-position: ${imagePos};`
            }

            return style
        }
    },
    props: {
        item: Object
    }
}
</script>


<style lang="scss">
@import '@/assets/util.scss';
.item-description {
    display: flex;
    flex-direction: column;

    &__header {
        display: flex;
    }

    &__header-text {
        flex: 1;
        min-width: 0;
        padding: 0.5rem 0.75rem;

        color: $color-light;
        background-color: $color-secondary;
    }

    &__close-button {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2em;
        padding: 0 0.5em;
        background-color: $color-primary;
    }

    &__content {
        flex: 1;
        min-height: 0;

        display: flex;
        position: relative;

        background-color: $color-light;
    }

    &__image {
        background-size: cover;
        background-position: center;

        @include sm {
            flex: 1;
            display: initial;
        }
    }

    &__description {
        flex: 2;
        padding: 0 0.75rem;

        overflow-y: auto;
    }
}
</style>
