/* eslint-disable strict */

// Isolate this code
(function () {
    'use strict'

    const nodeLabel = 'event-out'

    /** Prep for edit
     * @param {*} node -
     */
    function onEditPrepare(node) {

        // Handle v1.0 legacy
        if (node.passthrough === true) $('#node-input-passthrough').val('input') //node.passthrough = 'input'
        else if (node.passthrough === false) $('#node-input-passthrough').val('none') //node.passthrough = 'none'

        // Initial state
        $(`#passthrough-${node.passthrough}`).attr('checked', true)

        // Handle change on radio inputs
        $('[name="passthrough"]')
            // If the setting changes, change the number of output ports
            .on('change', function passthroughChange(event) {
                let passthrough = event.target.id.replace('passthrough-', '')

                $('#node-input-passthrough').val(passthrough)

                if ( passthrough === 'none') node.outputs = 0
                else node.outputs = 1

            })
    }

    RED.nodes.registerType(nodeLabel, {
        category: 'Events',
        color: '#E6E0F8',
        defaults: {
            name: { value: '' },
            topic: { value: '' },
            passthrough: { value: 'none', required:true },
            outputs: { value: 0 },
        },
        align:'right',
        inputs: 1,
        inputLabels: 'Msg with topic property',
        outputs: 0,
        outputLabels: function (i) { return this.passthrough === 'return' ? 'msg returned from event-return node' : 'Input msg with node ID added' }, // eslint-disable-line no-unused-vars
        icon: 'link-out.svg',
        paletteLabel: nodeLabel,
        label: function () { return this.name || this.topic || nodeLabel },

        /** Available methods: 
         * oneditprepare: (function) called when the edit dialog is being built.
         * oneditsave:   (function) called when the edit dialog is okayed.
         * oneditcancel: (function) called when the edit dialog is canceled.
         * oneditdelete: (function) called when the delete button in a configuration node’s edit dialog is pressed.
         * oneditresize: (function) called when the edit dialog is resized.
         * onpaletteadd: (function) called when the node type is added to the palette.
         * onpaletteremove: (function) called when the node type is removed from the palette.
         */

        oneditprepare: function() { onEditPrepare(this) },
        
    }) // ---- End of registerType() ---- //

}())
