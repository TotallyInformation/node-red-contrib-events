# node-red-contrib-events
Event broadcast and receive nodes for Node-RED.

**WARNING**: This Node package is _EXPERIMENTAL_

This is an alternative take on Node-RED's `link-in` and `link-out` core nodes. Those nodes also use JavaScript events thanks to the `RED.events` object.
However, they attach/consume events named after a node ID.

Instead, this set of nodes name events after the input `msg.topic`.

So, throw any `msg` you like into an `event-in` node. Then add `event-out` nodes set to the topic string that you want to listen for.

Then any msg sent to any of the `event-in` nodes that has the matching `msg.topic` string, all of the `event-out` nodes will receive and output the same `msg`.
