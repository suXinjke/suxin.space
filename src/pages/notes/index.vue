<template><Layout :titlePage="true">
    <div class="notes collection collection_notes">
        <ItemClickable class="collection__item" v-for="( item, index ) in items" :key="index" :item="item"/>
    </div>
</Layout></template>

<page-query>
query Home {
    allNotes {
        edges {
            node {
                path
                title
                date
                image
                showcase {
                    image
                    imagePos
                }
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
            return this.$page.allNotes.edges.map( edge => {
                const item = edge.node
                const date = new Date( item.date )

                return {
                    ...item,
                    link: item.path,
                    linkInternal: true,
                    subtitle: date.toDateString().replace( /^[^\s]+\s/, '' ).toUpperCase(),
                    icon: item.icon || 'file'
                }
            } )
        }
    },

    metaInfo() {
        const title = 'Notes'
        return {
            title,
            meta: generateMeta( {
                title,
                description: 'List of available notes to read'
            } )
        }
    }
}
</script>

<style lang="scss">
@import '@/assets/collection.scss';

.notes {
    margin-bottom: 4rem;
}
</style>
