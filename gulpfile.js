/* eslint-disable sonarjs/no-duplicate-string, jsdoc/newline-after-description, jsdoc/require-param */

/** References ...
 * https://semaphoreci.com/community/tutorials/getting-started-with-gulp-js
 * https://gulpjs.com/plugins/
 * https://gulpjs.com/docs/en/api/concepts/
 * Plugins
 *  https://www.npmjs.com/package/gulp-include - source file inline replacements
 *  https://www.npmjs.com/package/gulp-uglify  - Minify
 *  https://www.npmjs.com/package/gulp-rename  - Rename source filename on output
 *  https://www.npmjs.com/package/gulp-once    - Only do things if files have changed
 *  https://www.npmjs.com/package/gulp-replace - String replacer
 *  https://www.npmjs.com/package/gulp-debug
 * 
 *  https://www.npmjs.com/package/gulp-concat
 *  https://www.npmjs.com/package/gulp-sourcemaps
 *  https://www.npmjs.com/package/gulp-prompt  - get input from user
 *  https://www.npmjs.com/package/gulp-if-else
 *  https://www.npmjs.com/package/gulp-minify-inline
 *  https://www.npmjs.com/package/gulp-tap - Easily tap into a pipeline. Could replace gulp-replace
 *  https://www.npmjs.com/package/webpack-stream - Use WebPack with gulp
 *  https://www.npmjs.com/package/tinyify - runs various optimizations
 * 
 *  ❌https://www.npmjs.com/package/gulp-changed - Does not work as expected
 */

'use strict'

//#region ---- Require dependent modules ---- //

const { src, dest, /*series,*/ watch, parallel, } = require('gulp')
// const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const include = require('gulp-include')
const once = require('gulp-once')
//const prompt = require('gulp-prompt')
// const replace = require('gulp-replace')
// const debug = require('gulp-debug')
const execa = require('execa')
const fs = require('fs')
//const { promisify } = require('util')
//const dotenv = require('dotenv')

//#endregion ---- ---- ---- ---- //

//#region >>>> Vars - change as needed <<<< //

// What release/version do we want to end up with?
const release = '1.1.1'

// Locations
const nodeDest = 'nodes'

//#endregion ------------------------------ //

/** 
 * TODO
 *  - Add text replace to ensure 2021 in (c) blocks is current year
 *  - Add improvements to build so that we can have a generic name in the src code as a template
 */

// print output of commands into the terminal
const stdio = 'inherit'

const { version } = JSON.parse(fs.readFileSync('package.json'))

console.log(`Current Version: ${version}. Requested Version: ${release}`)

//#region >>>> Build/Watch - add a function for each node <<<<

/** Combine the parts of event-in.html file */
function buildPanelSrcIn(cb) {
    src('src/editor/event-in/main.html')
        .pipe(include())
        .pipe(once())
        .pipe(rename('event-in.html'))
        .pipe(dest(nodeDest))

    cb()
}
/** Combine the parts of event-out.html file */
function buildPanelSrcOut(cb) {
    src('src/editor/event-out/main.html')
        .pipe(include())
        .pipe(once())
        .pipe(rename('event-out.html'))
        .pipe(dest(nodeDest))

    cb()
}
/** Combine the parts of event-return.html file */
function buildPanelSrcReturn(cb) {
    src('src/editor/event-return/main.html')
        .pipe(include())
        .pipe(once())
        .pipe(rename('event-return.html'))
        .pipe(dest(nodeDest))

    cb()
}

/** Watch for changes during development of uibuilderfe & editor */
function watchme(cb) {
    // Re-combine uibuilder.html if the source changes
    watch('src/editor/event-in/*', buildPanelSrcIn)
    watch('src/editor/event-out/*', buildPanelSrcOut)
    watch('src/editor/event-return/*', buildPanelSrcReturn)

    cb()
}

//#endregion ---- ---- ---- ---- //

/** Update module version in package.json */
async function setPackageVersion() {
    if (version !== release) {
        // bump version without committing and tagging: npm version 4.2.1 --no-git-tag-version --allow-same-version
        await execa('npm', ['version', release, '--no-git-tag-version'], {stdio})
    } else {
        console.log('Requested version is same as current version - nothing will change')
    }
}

/** Create a new GitHub tag for a release (only if release ver # different to last committed tag) */
async function createTag(cb) {
    //Get the last committed tag: git describe --tags --abbrev=0
    let lastTag
    try {
        lastTag = (await execa('git', ['describe', '--tags', '--abbrev=0'])).stdout
    } catch (e) {
        lastTag = ''
    }

    console.log(`Last committed tag: ${lastTag}`)

    // If the last committed tag is different to the required release ...
    if ( lastTag.replace('v','') !== release ) {
        //const commitMsg = `chore: release ${release}`
        //await execa('git', ['add', '.'], { stdio })
        //await execa('git', ['commit', '--message', commitMsg], { stdio })
        await execa('git', ['tag', `v${release}`], { stdio })
        await execa('git', ['push', '--follow-tags'], { stdio })
        await execa('git', ['push', 'origin', '--tags'], { stdio })
    } else {
        console.log('Requested release version is same as the latest tag - not creating tag')
    }
    cb()
}

/** Publish to npmjs.org registry as a public package */
async function publish(cb) {
    await execa('npm', ['publish', '--access', 'public'], { stdio })

    cb()
}

//exports.default     = series( packfe, combineHtml ) // series(runLinter,parallel(generateCSS,generateHTML),runTests)
exports.buildPanelSrcIn  = buildPanelSrcIn
exports.buildPanelSrcOut = buildPanelSrcOut
exports.buildPanelSrcReturn = buildPanelSrcReturn
exports.watch       = watchme
exports.build       = parallel( buildPanelSrcIn, buildPanelSrcOut)
exports.createTag   = createTag
exports.publish     = publish
exports.setVersion  = setPackageVersion //series( setPackageVersion, setFeVersion, setFeVersionMin )
