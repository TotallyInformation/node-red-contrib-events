# node-red-contrib-events
Event broadcast and receive nodes for Node-RED.

**WARNING**: This Node package is _EXPERIMENTAL_

This is an alternative take on Node-RED's `link-in` and `link-out` core nodes. Those nodes also use JavaScript events thanks to the `RED.events` object.
However, they attach/consume events named after a node ID.

Instead, this set of nodes name events after the input `msg.topic`.

So, throw any `msg` you like to an `event-out` node. Then add `event-in` nodes set to the topic string that you want to listen for.

Then for a msg sent to any of the `event-out` nodes that has the matching `msg.topic` string, all of the `event-in` nodes will receive and output the same `msg`.

## Similar Nodes

* `link-in`/`link-out` are core nodes, they use Node.js's event system but are linked by source/destination node ID rather than by topic.
* [node-red-contrib-topic-link](https://flows.nodered.org/node/node-red-contrib-topic-link)
* [node-red-contrib-sub-link](https://flows.nodered.org/node/node-red-contrib-sub-link)

Neither of the two contrib nodes use Node.js's native event system and both require configuration. Both support some elements of MQTT-style wild-cards.

## To Do

* Use [EventEmitter2](https://github.com/EventEmitter2/EventEmitter2) to get wildcard support
* Add option to out node to allow passthrough of input msg.
* Add topic validation for in node (255 char string).
* Change from using RED.events as Nick doesn't want it used for contrib nodes. (wouldn't work anyway for wildcards)
* Either need to consolidate both nodes into 1 module file or need a shared module to maintain state for the event handers