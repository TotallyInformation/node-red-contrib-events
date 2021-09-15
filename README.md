# node-red-contrib-events
Event broadcast and receive nodes for Node-RED.

**WARNING**: This Node package is _EXPERIMENTAL_

This is an alternative take on Node-RED's `link-in` and `link-out` core nodes. Those nodes also use JavaScript events thanks to the `RED.events` object.
However, they attach/consume events named after a node ID.

Instead, this set of nodes name events after the input `msg.topic`.

So, throw any `msg` you like to an `event-out` node. Then add `event-in` nodes set to the topic string that you want to listen for.

Then for a msg sent to any of the `event-out` nodes that has the matching `msg.topic` string, all of the `event-in` nodes will receive and output the same `msg`.

THe `event-out` node supports topic wildcards using `*`, `/` is recognised as a namespace separator as with MQTT.

## Similar Nodes

* `link-in`/`link-out` are core nodes, they use Node.js's event system but are linked by source/destination node ID rather than by topic.
* [node-red-contrib-topic-link](https://flows.nodered.org/node/node-red-contrib-topic-link) - uses `set`s and a map and may need a deep object copy. Does not use events. Supports MQTT-style wildcards.
* [node-red-contrib-sub-link](https://flows.nodered.org/node/node-red-contrib-sub-link) - does not use Node.js's native event system and requires configuration. Supports MQTT-style wildcards.

## To Do

* Add option to out node to allow passthrough of input msg.
* Add topic validation for in node (255 char string).
  