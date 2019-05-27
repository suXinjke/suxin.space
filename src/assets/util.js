export const generateMeta = ( { title = '', description = 'Getting things done and sharing how', image, url = process.env.GRIDSOME_BASE_URL } = {} ) => {

    if ( title ) {
        title += ' - '
    }
    title += 'suxin.space'

    if ( image && !image.startsWith( 'http' ) ) {
        image = process.env.GRIDSOME_BASE_URL + image
    }

    const result = [
        { name: 'description', content: description },

        { name: 'og:title', content: title },
        { name: 'og:description', content: description },
        { name: 'og:image', content: image || `${process.env.GRIDSOME_BASE_URL}/img/robin_1.jpg` },
        { name: 'og:url', content: url },

        { name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image || `${process.env.GRIDSOME_BASE_URL}/robin_icon.png` },
        { name: 'twitter:site', content: '@suxinjke' },
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