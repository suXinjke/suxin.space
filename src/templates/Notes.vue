<template><Layout :noteTitle="$page.notes.title">
    <div class="readable note">
        <h1><strong>{{ pageTitle }}</strong></h1>
        <h3>{{ pageDate }}</h3>
        <div class="note__content" v-html="$page.notes.content"></div>

        <h2 v-if="seeAlsoNotes.length > 0"><strong>See also</strong></h2>
        <div class="collection collection_stack" v-if="seeAlsoNotes.length > 0">
            <ItemClickable class="collection__item" v-for="( item, index ) in seeAlsoNotes" :key="index" :item="item"/>
        </div>
    </div>
</Layout></template>

<page-query>
query Note ($path: String!) {
    notes (path: $path) {
        title
        titleHeader
        description
        image
        date
        content
        showcase {
            image
        }
        seeAlso
    }

    allNotes {
        edges {
            node {
                path
                title
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
import 'prism-github'
import ItemClickable from '@/components/item-clickable.vue'
import { generateMeta, omitEmptyFields } from '@/assets/util'

export default {
    components: {
        ItemClickable
    },

    computed: {
        pageTitle: function() {
            const { titleHeader, title } = this.$page.notes
            return titleHeader || title
        },
        pageDate: function() {
            const date = new Date( this.$page.notes.date )

            return date.toDateString().replace( /^[^\s]+\s/, '' ).toUpperCase()
        },
        hasTweets: function() {
            return this.$page.notes.content.includes( '<blockquote class="twitter-tweet"' )
        },
        hasCodepen: function() {
            return this.$page.notes.content.includes( '<p class="codepen"' )
        },

        seeAlsoNotes: function() {
            const { notes } = this.$page;
            const allNotes = this.$page.allNotes.edges;

            const result = notes.seeAlso.map( seeAlsoNote => {
                const note = allNotes.find( ( { node: note } ) => note.path.includes( seeAlsoNote ) )
                if ( !note ) {
                    throw new Error( `No seeAlsoNote called ${seeAlsoNote}` )
                }
                const item = note.node

                return {
                    ...item,
                    link: item.path,
                    linkInternal: true
                }
            } )
            return result
        }
    },
    metaInfo() {
        const data = {
            ...this.$page.notes,
            ...omitEmptyFields( ( this.$page.notes.showcase || [] )[0] || {} )
        }

        return {
            title: this.$page.notes.title,
            meta: generateMeta( data ),
            script: [
                this.hasTweets && { src: "https://platform.twitter.com/widgets.js", async: true },
                this.hasCodepen && { src: "https://static.codepen.io/assets/embed/ei.js", async: true },
            ]
        }
    }
}
</script>

<style lang="scss">
@import '@/assets/collection.scss';

.note {
    max-width: 48rem;
    margin: 0 auto;

    &__content {
        display: flex;
        flex-direction: column;
    }
}
.tweet-embed {
    min-height: 460px;
    .twitter-tweet {
        margin: 0 auto;
    }
}

.image {
    text-align: center;
    align-self: center;

    img {
        max-width: 100%;
    }

    &__title {
        text-align: right;
        margin: 0;
        font-weight: initial;
    }
}
.video {
    text-align: center;
}
.audio audio {
    width: 100%;
}
table {
    tr {
        line-height: initial;
    }
    td {
        vertical-align: top;
    }
}

.language-break-space {
    white-space: pre-line !important;
}

.tabs {
    & > input[type="radio"] {
        display: none;
    }

    & > label {
        position: relative;
        display: inline-block;
        padding: 1rem;
        cursor: pointer;

        font-weight: 900;
        font-size: 1.3em;
    }

    & > input:checked + label {
        background-color: $color-primary;
    }

    &__content {
        padding: 0.5rem 1rem;
    }

    &__content {
        display: none;
    }

    & > input:first-child:checked ~   &__content-container > &__content:first-child,
    & > input:nth-child(3):checked ~  &__content-container > &__content:nth-child(2),
    & > input:nth-child(5):checked ~  &__content-container > &__content:nth-child(3),
    & > input:nth-child(7):checked ~  &__content-container > &__content:nth-child(4),
    & > input:nth-child(9):checked ~  &__content-container > &__content:nth-child(5),
    & > input:nth-child(11):checked ~ &__content-container > &__content:nth-child(6) {
        display: block;
    }

    & .image__title {
        display: none;
    }
}

// @keyframes item__appear {
//     0% { height: 16px }
//     0% { height: 16px }
//     0% { height: 16px }
//     to { opacity: 1; }
// }

* {
    &:hover > .tiny-frog  {
        width: 16px;
        transition: width 1s ease-in-out;
    }
}

.tiny-frog {
    content: url('/frog.svg');
    width: 0;
    margin: -2px 0;
    transition: width 1s ease-in-out;
}

</style>