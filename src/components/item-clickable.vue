<template>
    <div
        :is="has_modal && ready ? 'div' : ( currentItemAttributes.linkInternal ? 'g-link' : 'a' )"
        :to="currentItemAttributes.linkInternal ? link : false"
        :href="link"
        :target="link_target"
        :rel="link_rel"
        class="item-clickable" @click="modal_active = true"
    >
        <portal v-if="has_modal && modal_active" to="modal-target">
            <Modal @close="modal_active = false">
                <ItemDescription class="item-description_modal" :item="item" @close="modal_active = false"/>
            </Modal>
        </portal>
        <Item :item="currentItemAttributes" />
    </div>
</template>

<script>
import Item from '@/components/item.vue'
import ItemDescription from '@/components/item-description.vue'
import Modal from '@/components/modal.vue'
import Porta from 'portal-vue'
import { omitEmptyFields } from '@/assets/util.js'

export default {
    components: {
        Item,
        ItemDescription,
        Modal
    },
    data() {
        return {
            modal_active: false,
            timer: undefined,
            counter: 0,
            ready: false
        }
    },
    props: {
        item: Object,
        interval: {
            type: [ Number, String ],
            default: 5000
        }
    },
    computed: {
        has_modal: function() {
            return ( this.item.content || '' ).trim().length > 0
        },
        link: function() {
            if ( this.has_modal && this.ready ) {
                return false
            }

            return this.currentItemAttributes.link || `/items/${this.item.fileInfo.name}/`
        },
        link_target: function() {
            if ( !this.link || this.item.linkInternal ) {
                return false
            }

            return this.link.startsWith( 'http' ) ? '_blank' : false
        },
        link_rel: function() {
            if ( !this.link ) {
                return false
            }

            return this.link.startsWith( 'http' ) ? 'noopener' : false
        },
        showcaseElement: function() {
            return omitEmptyFields( ( this.item.showcase || [] )[this.counter] || {} )
        },
        currentItemAttributes: function() {
            return {
                ...this.item,
                ...this.showcaseElement
            }
        }
    },

    mounted() {
        if ( this.item.showcase ) {
            this.timer = setInterval( () => {
                this.counter++

                if ( this.counter >= this.item.showcase.length ) {
                    this.counter = 0
                }
            }, this.interval )
        }

        // HACK: Absolutely atrocious, not doing this propagates to nested
        // lazy loading image <div> that will attempt to fetch weird null and fire 404
        // This also doesn't happen if there's no tampering with 'is' property on root node here.
        setTimeout( () => {
            this.ready = true
        }, 1 )
    },

    beforeDestroy() {
        clearInterval( this.interval )
    }
}
</script>

<style lang="scss">
@import '@/assets/util.scss';

.item-clickable {
    display: flex;
    cursor: pointer;

    text-decoration: none;

    .item {
        flex: 1;
        min-width: 0;
    }

    &:hover .item__header {
        background-color: $color-primary;
    }

    &:hover .item {
        animation: emphasize 0.1s 1;
        animation-fill-mode: forwards;
        box-shadow: 0px 0px 5px 1px black;
    }
}

.item-description_modal {
    height: 95vh;
    width: 95vw;

    @include sm {
        height: 85vh;
        width: 85vw;
    }

    @include lg {
        height: 70vh;
        width: 60vw;
    }
}
</style>