/** Converts an input msg to an event, passes the msg via the event.
 *  Destructured to make for easier and more consistent logic.
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

/** --- Type Defs ---
 * @typedef {import('../typedefs.js').runtimeRED} runtimeRED
 * @typedef {import('../typedefs.js').runtimeNodeConfig} runtimeNodeConfig
 * @typedef {import('../typedefs.js').runtimeNode} runtimeNode
 * typedef {import('../typedefs.js').myNode} myNode
 */

//#region ----- Module level variables ---- //

const emitter = require('./libs/events.js')

/** Main (module) variables - acts as a configuration object
 *  that can easily be passed around.
 */
const mod = {
    /** @type {runtimeRED} Reference to the master RED instance */
    RED: undefined,
    /** @type {string} Custom Node Name - has to match with html file and package.json `red` section */
    nodeName: 'event-out',
}

//#endregion ----- Module level variables ---- //

//#region ----- Module-level support functions ----- //

/** 3) Run whenever a node instance receives a new input msg
 * NOTE: `this` context is still the parent (nodeInstance).
 * See https://nodered.org/blog/2019/09/20/node-done 
 * @param {object} msg The msg object received.
 * @param {Function} send Per msg send function, node-red v1+
 * @param {Function} done Per msg finish function, node-red v1+
 */
function inputMsgHandler(msg, send, done) { // eslint-disable-line no-unused-vars
    // As a module-level named function, it will inherit `mod` and other module-level variables

    // If you need it - or just use mod.RED if you prefer:
    //const RED = mod.RED

    let topic = msg.topic

    // Default topic from the settings if the msg doesn't define one
    if ( (! topic) && this.topic ) topic = this.topic
    if ( ! topic ) topic = ''

    // Sanitise the topic & report errors - it must be a string and no more than 255 chars. It should not contain `*`, `#` or `+`
    let topicErrors = []
    if ( topic.length < 1 ) topicErrors.push('Topic is empty')
    if ( topic.length > 255 ) topicErrors.push('Topic is >255 characters long')
    if ( topic.includes('#') ) topicErrors.push('Topic contains a `#` wildcard character')
    if ( topic.includes('+') ) topicErrors.push('Topic contains a `+` wildcard character')
    if ( topic.includes('*') ) topicErrors.push('Topic contains a `*` wildcard character')
    if ( topicErrors.length !== 0 ) {
        done(`Input topic is invalid: ${topicErrors.join(', ')}`)
        return
    }

    // Ensure that the event name is unique for these nodes (since the event handler may be reused in other nodes)
    const eventName = `Contrib-Events:${topic}`
    // Add the originating node id to make tracing easier
    msg._eventOriginator = this.id
    // Emit the event
    emitter.emit(eventName, msg)
    // If passthrough is enabled, send the msg
    if ( this.passthrough === true ) send(msg)
    // We are done
    done()

} // ----- end of inputMsgHandler ----- //

/** 2) This is run when an actual instance of our node is committed to a flow
 * @param {runtimeNodeConfig} config The Node-RED node instance config object
 */
function nodeInstance(config) {
    // As a module-level named function, it will inherit `mod` and other module-level variables

    // If you need it - which you will here - or just use mod.RED if you prefer:
    const RED = mod.RED

    // Create the node instance - `this` can only be referenced AFTER here
    RED.nodes.createNode(this, config) 

    // Transfer config items from the Editor panel to the runtime
    this.name = config.name
    this.topic = config.topic || ''
    this.passthrough = config.passthrough

    /** Handle incoming msg's - note that the handler fn inherits `this`
     *  The inputMsgHandler function is executed every time this instance
     *  of the node receives a msg in a flow.
     */
    this.on('input', inputMsgHandler)

    /** Put things here if you need to do anything when a node instance is removed
     * Or if Node-RED is shutting down.
     * Note the use of an arrow function, ensures that the function keeps the
     * same `this` context and so has access to all of the node instance properties.
     */
    // this.on('close', (removed, done) => { 
    //     console.log('>>>=[IN 4]=>>> [nodeInstance:close] Closing. Removed?: ', removed)

    //     done()
    // })

    /** Properties of `this`
     * Methods: updateWires(wires), context(), on(event,callback), emit(event,...args), removeListener(name,listener), removeAllListeners(name), close(removed)
     *          send(msg), receive(msg), log(msg), warn(msg), error(logMessage,msg), debug(msg), trace(msg), metric(eventname, msg, metricValue), status(status)
     * Other: credentials, id, type, z, wires, x, y
     * + any props added manually from config, typically at least name and topic
     */
    //console.log('>>>> TI GLOBAL <<<<', global.totallyInformationShared)
}

//#endregion ----- Module-level support functions ----- //

/** 1) Complete module definition for our Node. This is where things actually start.
 * @param {runtimeRED} RED The Node-RED runtime object
 */
function EventOut(RED) {
    // As a module-level named function, it will inherit `mod` and other module-level variables

    // Save a reference to the RED runtime for convenience
    mod.RED = RED

    // Register a new instance of the specified node type (2)
    RED.nodes.registerType(mod.nodeName, nodeInstance)
}

// Export the module definition (1), this is consumed by Node-RED on startup.
module.exports = EventOut

//EOF
