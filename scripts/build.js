const path = require('path')
const esbuild = require('esbuild')
const { externalGlobalPlugin } = require("esbuild-plugin-external-global")



const clientFiles = [
    'common-client-plugin.js',
    'style.css'
]

const configs = clientFiles.map(f => ({
    entryPoints: [path.resolve(__dirname, '..', 'client', f)],
    bundle: true,
    minify: true,
    format: 'esm',
    target: 'safari11',
    plugins: [
        externalGlobalPlugin({
            'video.js': 'window.videojs'
        })
    ],
    outfile: path.resolve(__dirname, '..', 'dist', f),
}))

const promises = configs.map(c => esbuild.build(c))

Promise.all(promises)
    .catch(() => process.exit(1))