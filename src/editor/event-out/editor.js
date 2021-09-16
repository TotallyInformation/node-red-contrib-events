/* eslint-disable strict */

// Isolate this code
(function () {
    'use strict'

    const nodeLabel = 'event-out'

    /** Prep for edit
     * @param {*} node -
     */
    function onEditPrepare(node) {
        // initial checkbox states
        if (!node.passthrough) node.passthrough = false
        $('#node-input-passthrough')
            // Initial setting
            .prop('checked', node.passthrough)
            // If the setting changes, change the number of output ports
            .on('change', function passthroughChange() {
                node.outputs = this.checked ? 1 : 0
            })
    }

    RED.nodes.registerType(nodeLabel, {
        category: 'Events',
        color: '#E6E0F8',
        defaults: {
            name: { value: '' },
            topic: { value: '' },
            passthrough: { value: false },
            outputs: { value: 0 },
        },
        align:'right',
        inputs: 1,
        inputLabels: 'Msg with topic property',
        outputs: 0,
        outputLabels: ['Input msg with node ID added'],
        icon: 'link-out.svg',
        paletteLabel: nodeLabel,
        label: function () { return this.name || this.topic || nodeLabel },

        oneditprepare: function() { onEditPrepare(this) },
        
    }) // ---- End of registerType() ---- //

}())
