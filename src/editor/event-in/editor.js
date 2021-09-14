/* eslint-disable strict */

// Isolate this code
(function () {
    'use strict'

    const nodeLabel = 'event-in'

    RED.nodes.registerType(nodeLabel, {
        category: 'EXPERIMENTAL',
        color: '#E6E0F8',
        defaults: {
            name: { value: '' },
            topic: { value: '' },
        },
        inputs: 1,
        inputLabels: 'Msg with topic property',
        outputs: 0,
        //outputLabels: ['Data from front-end'],
        icon: 'ui_template.png',
        paletteLabel: nodeLabel,
        label: function () { return this.name || this.topic || nodeLabel },
        
    }) // ---- End of registerType() ---- //

})()
