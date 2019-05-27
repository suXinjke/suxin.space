export const generateMeta = ( { title = '', description = 'Getting things done and sharing how', image, url = process.env.GRIDSOME_BASE_URL } = {} ) => {

    if ( title ) {
        title += ' - '
    }
    title += 'suxin.space'

    if ( image && !image.startsWith( 'http' ) ) {
        image = process.env.GRIDSOME_BASE_URL + image
    }

    const result = [
        { key: 'description', name: 'description', content: description },

        { key: 'og:title', name: 'og:title', content: title },
        { key: 'og:description', name: 'og:description', content: description },
        { key: 'og:image', name: 'og:image', content: image || `${process.env.GRIDSOME_BASE_URL}/img/robin_1.jpg` },
        { key: 'og:url', name: 'og:url', content: url },
        { key: 'twitter:card', name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' },
        { key: 'twitter:title', name: 'twitter:title', content: title },
        { key: 'twitter:description', name: 'twitter:description', content: description },
        { key: 'twitter:image', name: 'twitter:image', content: image || `${process.env.GRIDSOME_BASE_URL}/robin_icon.png` },
        { key: 'twitter:site', name: 'twitter:site', content: '@suxinjke' },
    ]

    return result
}

export const omitEmptyFields = ( obj ) => {
    const result = {
        ...obj
    }

    for ( const key in result ) {
        const value = result[key]
        if ( value === null || ( typeof value === 'string' && value.trim().length === 0 ) ) {
            delete result[key]
        }
    }

    return result
}