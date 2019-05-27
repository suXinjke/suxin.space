<template><Layout :noteTitle="$page.notes.title">
    <div class="readable note">
        <h1><strong>{{ pageTitle }}</strong></h1>
        <h3>{{ pageDate }}</h3>
        <div v-html="$page.notes.content"></div>
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
    }
}
</page-query>

<script>
import 'prism-github'
import { generateMeta, omitEmptyFields } from '@/assets/util'

export default {
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
.note {
    max-width: 48rem;
    margin: 0 auto;
}
.tweet-embed {
    .twitter-tweet {
        margin: 0 auto;
    }
}

img {
    display: block;
    margin: 0 auto 1rem auto;
    max-width: 100%;
}
</style>