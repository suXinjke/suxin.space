const unistMap = require( 'unist-util-map' )

const addLinksToImages = () => tree => unistMap( tree, node => {
    if ( node.type === 'html' && node.value.startsWith( '<img class="g-image' ) ) {
        const noScriptTag = /<noscript>(.+)<\/noscript>/g.exec( node.value )[0]
        const imageSrc = /src="([^"]+)"/g.exec( noScriptTag )[1]

        return {
            ...node,
            value: `<div class="image">
                <a href="${imageSrc}" title="${node.alt}" target="_blank" rel="noopener">${node.value}</a>
                <h4 class="image__title"><em>${node.alt}</em></h4>
            </div>`
        }
    } else if ( node.type === 'image' ) {
        return {
            type: 'html',
            value: `<div class="image">
                <a href="${node.url}" target="_blank" rel="noopener">
                    <img title="${node.alt}" alt="${node.alt}" src="${node.url}"/>
                </a>
                <h4 class="image__title"><em>${node.alt}</em></h4>
            </div>`
        }
    } else {
        return node
    }
} )

let globalTabId = 0;
let tabSections = []
let populatingTabs = false
const processTabs = () => tree => unistMap( tree, node => {
    if ( node.type === 'html' && node.value.startsWith( '<div class="tabs">' ) ) {
        populatingTabs = true;
        return node;
    } else if ( tabSections.length > 0 && node.type === 'html' && node.value.startsWith( '</div>' ) ) {
        populatingTabs = false
        globalTabId++
        const tabContentsHTML = tabSections.map( elem => {
            return `
                <section class="tabs__content">
                    ${elem.children[0].value}
                </section>
            `
        } ).join( '\n' )
        tabSections = []

        return {
            type: 'html',
            value: `
                    <div class="tabs__content-container">
                        ${tabContentsHTML}
                    </div>
                </div>
            `
        }
    } else if ( populatingTabs ) {
        if ( node.type === 'paragraph' ) {
            const tabId = `tab${globalTabId}_${tabSections.length}`
            const tabName = node.children[0].alt
            tabSections.push( node )

            return {
                type: 'html',
                value: `
                    <input type="radio" name="tabs_${globalTabId}" id="${tabId}"${tabSections.length === 1 ? 'checked' : ''}>
                    <label for="${tabId}">${tabName}</label>
                `
            }
        }
    }

    return node
} )

const siteUrl = 'https://suxin.space'

module.exports = {
    siteName: 'suXin space',
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
                path: 'notes/**/*.md',
                typeName: 'Notes'
            }
        },

        {
            use: 'gridsome-plugin-feed',
            options: {
                contentTypes: [ 'Notes' ],

                feedOptions: {
                    title: 'suXin space',
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

                rss: {
                    enabled: true,
                    output: '/feed.xml'
                },
                maxItems: 25,
                htmlFields: [ 'description', 'content' ],

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
            imageQuality: 85,
            plugins: [
                'gridsome-plugin-remark-youtube',
                '@gridsome/remark-prismjs',
                addLinksToImages,
                [ 'remark-autolink-headings', {
                    behavior: 'append',
                    linkProperties: {
                        classname: 'anchor-link'
                    },
                    content: {
                        type: 'element',
                        tagName: 'span',
                        children: [
                            { type: 'text', value: '¶' }
                        ]
                    }
                } ],
                processTabs
            ]
        }
    },

    templates: {
        Notes: (node) => `/notes/${node.fileInfo.name.replace( /^_+/g, '' )}`
    }
}
