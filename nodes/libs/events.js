/** Shared events handler - singleton class */
'use strict'

const EventEmitter2 = require('eventemitter2')

var emitter = new EventEmitter2({
    // set this to `true` to use wildcards
    wildcard: true,
    // the delimiter used to segment namespaces
    delimiter: '/',
})


module.exports = emitter

//EOF
