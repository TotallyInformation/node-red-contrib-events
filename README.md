# node-red-contrib-events
Event broadcast and receive nodes for Node-RED.

This is an alternative take on Node-RED's `link-in` and `link-out` core nodes. Those nodes also use JavaScript events thanks to the `RED.events` object.
However, they attach/consume events named after a node ID and those links have to be manually configured.

Instead, this set of nodes name events after the input `msg.topic` and allow for wildcard links. Configuration is simply specifying the topic in the settings of the `event-in` node.

So, throw any `msg` you like to an `event-out` node. Then add `event-in` nodes set to the topic string that you want to listen for.

Then for a msg sent to any of the `event-out` nodes that has the matching `msg.topic` string, all of the `event-in` nodes will receive and output the same `msg`.

THe `event-out` node supports topic wildcards using `*`, `/` is recognised as a namespace separator as with MQTT.

## Notes

* The event handler is shared between the nodes. Event names are the `msg.topic` prefixed with `Contrib-Events:`.
* A separate event handler is needed because the Node-RED core devs want to make sure that Node-RED's own event handlers are not used by contributed nodes.
* The `/` char in the topic is used as a level (namespace) separator in the same way as with MQTT.
* Can use either glob-style (`*`, `**`) or MQTT-style (`+`, `#`) wildcards.
* The package contains an example flow. Access using the Import examples library in Node-RED.
* The `event-out` node:
  * Allows a default topic to be defined in case the incoming `msg` does not contain one.
  * Adds a `msg._eventOriginator` property that records the `event-out` node ID that is originating the msg. This helps with debugging and tracing of data flows.
  * The input topic is sanity checked: it must be a string and no more than 255 chars. It should not contain `*`, `#` or `+`
* THe `event-in` node:
  * Must have a topic specified in the settings.
  * Allows `*` or `+` as single-level wildcards.
  * Allows `**` or `#` as multi-level wildcards.
  * Uses `/` as the level (namespace) separator in MQTT-like fashion.

Contact the author if you want to make use of this package's event system in other nodes.

## Installation

To install from the standard npmjs registry: `npm install @totallyinformation/node-red-contrib-events`

To install from GitHub: `npm install TotallyInformation/node-red-contrib-events`

## Dependencies

* [EventEmitter2](https://github.com/EventEmitter2/EventEmitter2) - allows wildcards for event handlers

## Similar Nodes

* `link-in`/`link-out` are core nodes, they use Node.js's event system but are linked by source/destination node ID rather than by topic.
* **[node-red-contrib-topic-link](https://flows.nodered.org/node/node-red-contrib-topic-link)** - uses `set`s and a map and may need a deep object copy. Does not use events. Supports MQTT-style wildcards. This is the node most similar to what I'm doing. The usage is very similar, it is mostly the execution that is different.
* [node-red-contrib-sub-link](https://flows.nodered.org/node/node-red-contrib-sub-link) - does not use Node.js's native event system and requires configuration. Supports MQTT-style wildcards.
* [](https://flows.nodered.org/node/node-red-contrib-pubsub) - source code not published. They manually do what the native event system does for you. They manually convert msg objects to a string and back. The stringify process isn't wrapped in a try/catch which may be a little fragile. And finally, they don't support wildcard subscriptions.
