<template><Layout :titlePage="true">
    <div class="home">
        <section class="home__section">
            <HeaderText class="section-header" icon="user" header="ABOUT" />
            <div class="collection">
                <ItemClickable class="collection__item collection__item_expanded" :item="items['suxin']"/>
                <div class="collection__item collection collection_sub">
                    <ItemClickable class="collection__item" :item="items['suxin-twitter']"/>
                    <ItemClickable class="collection__item" :item="items['suxin-email']"/>
                </div>
                <div class="collection__item collection collection_sub">
                    <ItemClickable class="collection__item" :item="items['suxin-github']" />
                    <ItemClickable class="collection__item" :item="items['suxin-youtube']"/>
                </div>
            </div>
        </section>

        <section class="home__section">
            <HeaderText class="section-header" icon="hourglass" icon-style="far" header="HALF-PAYNE" />
            <div class="collection">

                <ItemClickable class="collection__item collection__item_expanded" :item="items['half-payne']"/>
                <div class="collection__item collection collection_sub">
                    <ItemClickable class="collection__item" :item="items['half-payne-reward']"/>
                    <ItemClickable class="collection__item" :item="items['half-payne-download']"/>
                </div>
                <div class="collection__item collection collection_sub">
                    <ItemClickable class="collection__item" :item="items['half-payne-review']" interval="10000"/>
                    <ItemClickable class="collection__item" :item="items['half-payne-trailer']"/>
                </div>
                <ItemClickable class="collection__item" :item="items['half-payne-interview']"/>
            </div>
        </section>

        <section class="home__section">
            <HeaderText class="section-header" icon="rocket" header="COLONY WARS" />
            <div class="collection">
                <ItemClickable class="collection__item collection__item_bigger" :item="items['cw3-menu']"/>
                <div class="collection__item collection__item_bigger collection collection_sub">
                    <ItemClickable class="collection__item" :item="items['cw3-ripper']"/>
                    <ItemClickable class="collection__item" :item="items['cw2-ripper']"/>
                </div>
                <div class="collection__item collection__item_bigger  collection collection_sub">
                    <ItemClickable class="collection__item" :item="items['cw3-oddities']"/>
                    <ItemClickable class="collection__item" :item="items['cw2-oddities']"/>
                </div>
            </div>
        </section>

        <section class="home__section">
            <HeaderText class="section-header" icon="asterisk" header="OTHER" />
            <div class="collection">
                <ItemClickable class="collection__item" :item="items['about-this-website']"/>
                <ItemClickable class="collection__item" :item="items['rss']"/>
                <ItemClickable class="collection__item" :item="items['secretary-bird']"/>
            </div>
            <div class="collection">
                <ItemClickable class="collection__item" :item="items['blender-goldsource']"/>
                <ItemClickable class="collection__item" :item="items['barasite-eve']"/>
            </div>
            <div class="collection">
                <ItemClickable class="collection__item" :item="items['rbr-cz-tourney-creator']"/>
                <ItemClickable class="collection__item" :item="items['rbr-cz-analysis']"/>
            </div>
        </section>

        <section class="home__section">
            <HeaderText class="section-header" icon="bullseye" header="GOALS" />
            <div class="collection">
                <ItemClickable class="collection__item" :item="items['goal-move-out']"/>
                <ItemClickable class="collection__item" :item="items['goal-gamedev']"/>
                <ItemClickable class="collection__item" :item="items['goal-travel-abroad']"/>
            </div>
        </section>
    </div>
    <portal-target name="modal-target">
    </portal-target>
</Layout></template>

<page-query>
query Home {
    allItems {
        edges {
            node {
                fileInfo {
                    name
                }
                title
                subtitle
                icon
                iconStyle
                image
                imagePos
                link
                linkInternal
                showcase {
                    title
                    subtitle
                    image
                    imagePos
                    link
                }

                content
            }
        }
    }
}
</page-query>

<script>
import ItemClickable from '@/components/item-clickable.vue'
import { generateMeta } from '@/assets/util'

export default {
    components: {
        ItemClickable
    },

    computed: {
        items: function() {
            const edges = this.$page.allItems.edges
            const items = {}
            for ( const edge of edges ) {
                const item = edge.node
                items[item.fileInfo.name] = item
            }

            return items
        }
    },

    metaInfo() {
        return {
            title: 'Home',
            meta: generateMeta()
        }
    }
}
</script>

<style lang="scss">
@import '@/assets/collection.scss';

.section-header {
    margin-bottom: 0.5rem;
}

.home {
    &__section {
        margin-bottom: 4rem;
    }
}
</style>
