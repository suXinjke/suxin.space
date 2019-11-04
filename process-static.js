const fs = require( 'fs' )
const path = require( 'path' )

const imagemin = require( 'imagemin' )
const imageminMozJpeg = require( 'imagemin-mozjpeg' )
const imageminPngquant = require( 'imagemin-pngquant' )

const root = 'static/img'
const paths = [
    root,
    ...fs.readdirSync( root )
        .filter( entry => fs.statSync( path.join( root, entry ) ).isDirectory() )
        .map( subdirectory => path.join( root, subdirectory ) )
]

paths.forEach( path => {
    const input = path + '/*.{jpg,png}'
    const output = path.replace( /^static/, 'dist' )

    imagemin( [ input ], {
        destination: output,
        plugins: [
            imageminMozJpeg(),
            imageminPngquant()
        ]
    } ).then( files => {
        return files
    } ).then( files => Promise.all(
        files.map( file => fs.writeFile( file.destinationPath, file.data, () => {} ) )
    ) )
} )