<template><Layout>
    <div class="item-page">
        <div v-if="itemData.image" class="item-page__image" :style="imageStyle"></div>
        <div class="item-page__content">
            <div class="item-page__content-header">
                <HeaderText
                    :header="itemData.title"
                    :header-secondary="itemData.subtitle"
                    :icon="itemData.icon"
                    :iconStyle="itemData.iconStyle"
                />
                <HeaderText
                    v-if="itemData.status"
                    status
                    :header="itemData.status"
                />
            </div>
            <div v-html="itemData.content"></div>
        </div>
    </div>
</Layout></template>

<page-query>
query Item ($path: String!) {
    items (path: $path) {
        title
        subtitle
        image
        icon
        iconStyle
        status
        statusIcon
        showcase {
            image
            imagePos
        }
        content
    }
}
</page-query>

<script>
import { generateMeta, omitEmptyFields } from '@/assets/util'
export default {
    computed: {
        showcaseElement: function() {
            return ( this.$page.items.showcase || [] )[0] || {}
        },
        itemData: function() {
            return {
                ...this.$page.items,
                ...omitEmptyFields( this.showcaseElement )
            }
        },
        imageStyle: function() {
            const { imagePos = '', image = '' } = this.itemData
            let style = `background-image: url( '${image}' );`
            if ( imagePos ) {
                style += ` background-position: ${imagePos};`
            }

            return style
        }
    },

    metaInfo() {
        return {
            title: this.itemData.title,
            meta: generateMeta( this.itemData )
        }
    }
}
</script>

<style lang="scss">
@import '@/assets/util.scss';

.item-page {
    max-width: 48rem;
    margin: 0 auto;

    display: flex;
    flex-direction: column;
    @include md {
        flex-direction: row;
    }

    &__image {
        flex: 1;

        background-size: cover;
        background-position: center;

        min-height: 24rem;

        margin: 0 0 1rem 0;
        @include md {
            margin: 0 1rem 0 0;
        }
    }

    &__content {
        flex: 3;
    }

    &__content-header {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
}
</style>