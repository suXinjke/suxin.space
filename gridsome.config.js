const unistMap = require( 'unist-util-map' )
const visit = require( 'unist-util-visit' )

const addLinksToImages = () => tree => unistMap( tree, node => {
    if ( node.type !== 'image' ) {
        return node
    }

    return {
        type: 'html',
        value: `<a href="${node.url}" target="_blank" rel="noopener">
            <img title="${node.alt}" alt="${node.alt}" src="${node.url}"/>
        </a>`
    }
} )

const siteUrl = 'https://suxin.space'

module.exports = {
    siteName: 'suxin.space',
    siteUrl,

    plugins: [
        {
            use: '@gridsome/source-filesystem',
            options: {
                path: 'items/*.md',
                typeName: 'Items'
            }
        },
        {
            use: '@gridsome/source-filesystem',
            options: {
                path: 'notes/*.md',
                typeName: 'Notes'
            }
        },

        {
            use: 'gridsome-plugin-feed',
            options: {
                // Required: array of `GraphQL` type names you wish to include
                contentTypes: [ 'Notes' ],
                // Optional: any properties you wish to set for `Feed()` constructor
                // See https://www.npmjs.com/package/feed#example for available properties
                feedOptions: {
                    title: 'suxin.space',
                    link: `${siteUrl}/notes/`,
                    description: 'Getting things done and sharing how',
                    language: 'en',
                    favicon: `${siteUrl}/favicon.ico`,
                    author: {
                        name: 'suXin',
                        email: 'suxinjke@gmail.com',
                        link: `${siteUrl}/`
                    }
                },
                // === All options after this point show their default values ===
                // Optional; opt into which feeds you wish to generate, and set their output path
                rss: {
                    enabled: true,
                    output: '/feed.xml'
                },
                // Optional: the maximum number of items to include in your feed
                maxItems: 25,
                // Optional: an array of properties passed to `Feed.addItem()` that will be parsed for
                // URLs in HTML (ensures that URLs are full `http` URLs rather than site-relative).
                // To disable this functionality, set to `null`.
                htmlFields: [ 'description', 'content' ],

                // Optional: a method that accepts a node and returns an object for `Feed.addItem()`
                // See https://www.npmjs.com/package/feed#example for available properties
                // NOTE: `date` field MUST be a Javascript `Date` object
                nodeToFeedItem: ( node ) => ( {
                    title: node.title,
                    date: new Date( node.date ),
                    description: node.description
                } )
            }
        },

        {
            use: '@gridsome/plugin-sitemap',
            options: {
                cacheTime: 600000,
                exclude: [ '/items/*' ],
                config: {
                    '/': {
                        changefreq: 'monthly',
                        priority: 0.6
                    },
                    '/notes/*': {
                        changefreq: 'weekly',
                        priority: 0.8
                    },
                }
            }
        }
    ],

    transformers: {
        remark: {
            externalLinksRel: [ 'noopener' ],
            plugins: [
                '@gridsome/remark-prismjs',
                addLinksToImages
            ]
        }
    }
}