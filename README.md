# node-red-contrib-events
Event broadcast and receive nodes for Node-RED.

This is an alternative take on Node-RED's `link-in` and `link-out` core nodes. Those nodes also use JavaScript events thanks to the `RED.events` object.
However, they attach/consume events named after a node ID and those links have to be manually configured.

Instead, this set of nodes name events after the input `msg.topic` and allow for wildcard links. Configuration is simply specifying the topic in the settings of the `event-in` node.

So, throw any `msg` you like to an `event-out` node. Then add `event-in` nodes set to the topic string that you want to listen for.

Then for a msg sent to any of the `event-out` nodes that has the matching `msg.topic` string, all of the `event-in` nodes will receive and output the same `msg`.

THe `event-out` node supports topic wildcards using `*`, `/` is recognised as a namespace separator as with MQTT.

For more complex requirements, there is also an `event-return` node that lets you return to the originating `event-out` that an `event-in` listened for.
This allows you to create sub-flows (sub-routines) and loops very easily.

## Notes

* For the most part, nodes like this should be avoided because then can make the tracing of your logic hard if you aren't careful.
  However, used with care, these are very powerful but simple to use nodes that can greatly simplify certain types of logic.
* The event handler is shared between the nodes. Event names are the `msg.topic` prefixed with `Contrib-Events:`.
* A separate event handler is needed because the Node-RED core devs want to make sure that Node-RED's own event handlers are not used by contributed nodes.
  These nodes use a separate event handler module that is shared with other nodes from me including node-red-contrib-uibuilder.
  That means that these nodes will (in the future) interact with uibuilder where needed but are not dependent.
* The `/` char in the topic is used as a level (namespace) separator in the same way as with MQTT.
* Can use either glob-style (`*`, `**`) or MQTT-style (`+`, `#`) wildcards.
* The package contains some example flows. Access using the Import examples library in Node-RED.

Contact the author if you want to make use of this package's event system in other nodes.

## Installation

To install from the standard npmjs registry: `npm install @totallyinformation/node-red-contrib-events`

To install from GitHub: `npm install TotallyInformation/node-red-contrib-events`

## The nodes

### `event-out`

As the output of a flow, emits an event who's name is based on the received `msg.topic`.

There is no need for any configuration.

However, if you wish, you can:

* Provide a default topic (in case the received msg does not contain one).
* Allow the received msg to be passed through to the output.
* Allow the use of an `event-return` node so that sub-subflows (sub-routines) or loops can be created.

The node adds a `msg._eventOriginator` property that records the `event-out` node ID that is originating the msg. This helps with debugging and tracing of data flows.

The input topic is sanity checked: it must be a string and no more than 255 chars. It should not contain `*`, `#` or `+`


### `event-in`

As the trigger of a flow, listens for events from `event-out` nodes and passes on the msg received from them.

Needs to have a topic pattern specified in the settings. This can contain wildcards and so listen for multiple topics.

Wildcards can be glob or MQTT style and the `/` character denotes namespace delimiters (in the same way that MQTT does).

`*` or `+` can be used as single-level wildcards, `**` or `#` as multi-level wildcards.

### `event-return`

Allows event-based sub-flows or loops. 

Change an `event-out` node to allow output from an `event-return` node.

Then create a flow starting with an `event-in` node, do some processing and end with an `event-return` node.

The `event-return` node does not need any configuration, it uses the `msg._eventOriginator` property from the input msg
to route data back to the originating `event-out` using an internal event sender/listener based on the node ID of the `event-out` node.

You can, however, allow the node to pass messages through to an output if you want to.

You can also override the msg.topic for the output if you wish.

## Dependencies

* [@TotallyInformation/ti-common-event-handler](https://github.com/TotallyInformation/ti-common-event-handler) - Shared event handler for TotallyInformation apps. Allows wildcards for event handlers.

## Similar Nodes

* `link-in`/`link-out` are core nodes, they use Node.js's event system but are linked by source/destination node ID rather than by topic.
* **[node-red-contrib-topic-link](https://flows.nodered.org/node/node-red-contrib-topic-link)** - uses `set`s and a map and may need a deep object copy. Does not use events. Supports MQTT-style wildcards. This is the node most similar to what I'm doing. The usage is very similar, it is mostly the execution that is different.
* [node-red-contrib-sub-link](https://flows.nodered.org/node/node-red-contrib-sub-link) - does not use Node.js's native event system and requires configuration. Supports MQTT-style wildcards.
* [node-red-contrib-pubsub](https://flows.nodered.org/node/node-red-contrib-pubsub) - source code not published. They manually do what the native event system does for you. They manually convert msg objects to a string and back. The stringify process isn't wrapped in a try/catch which may be a little fragile. And finally, they don't support wildcard subscriptions.

## Change Log

See the [CHANGELOG](./CHANGELOG.md) file for details.