/* eslint-disable strict */

// Isolate this code
(function () {
    'use strict'

    const nodeLabel = 'event-in'

    RED.nodes.registerType(nodeLabel, {
        category: 'Events',
        color: '#E6E0F8',
        defaults: {
            name: { value: '' },
            topic: { value: '', required: true },
        },
        inputs: 0,
        //inputLabels: 'Msg with topic property',
        outputs: 1,
        outputLabels: ['Data from input event'],
        icon: 'ui_template.png',
        paletteLabel: nodeLabel,
        label: function () { return this.name || this.topic || nodeLabel },
        
    }) // ---- End of registerType() ---- //

}())
