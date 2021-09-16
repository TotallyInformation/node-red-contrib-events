/** Shared events handler module - singleton
 * https://github.com/EventEmitter2/EventEmitter2
 * 
 * Copyright (c) 2021 Julian Knight (Totally Information)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict'

const EventEmitter2 = require('eventemitter2')

var emitter = new EventEmitter2({
    // set this to `true` to use wildcards
    wildcard: true,
    // the delimiter used to segment namespaces
    delimiter: '/',
})

module.exports = emitter

// Make this globally available so that it can be shared with other common nodes from TotallyInformation
if ( ! global.totallyInformationShared ) global.totallyInformationShared = {}
global.totallyInformationShared.events = emitter

//console.log('>>>> TI GLOBAL <<<<', global.totallyInformationShared) 

//EOF
