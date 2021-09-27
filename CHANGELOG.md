## 1.1.3 - Bug Fix (2021-09-27)

### Changed

* Change return node so that topic setting doesn't override the msg.topic. The topic setting in the node will now only be used if the inbound msg has no topic.

### Fixed

* [A nested loops issue](https://discourse.nodered.org/t/new-node-node-red-contrib-events-alternative-to-link-nodes/51028/35).
  
  `msg._eventOriginator` and `msg._eventReturner` are now both arrays with the latest entries at the top. This enables multi-level out and return. 
  
  Infinite loops should no longer be possible unless you deliberately mess with these properties (hint: don't!).

## 1.1.2 - Improvements & new event-return node (2021-09-26)

### New

* `event-return` node. Allows event-based sub-flows or loops. 
  
  Change an `event-out` node to allow output from an `event-return` node.

  Then create a flow starting with an `event-in` node, do some processing and end with an `event-return` node.

  The `event-return` node does not need any configuration, it uses the `msg._eventOriginator` property from the input msg
  to route data back to the originating `event-out` using an internal event sender/listener based on the node ID of the `event-out` node.

  You can, however, allow the node to pass messages through to an output if you want to.

  You can also override the msg.topic for the output if you wish.

* New example added that shows (and tests) the use of the `event-return` node.

### Changed

* Removed global variable.
* Moved the event handler to an external module [ti-common-event-handler](https://github.com/TotallyInformation/ti-common-event-handler)
  
  This module will be used by other packages including node-red-contrib-uibuilder to provide a common event handler.

## 1.0.0 - First published version (2021-09-16)

## 0.1.0 - Initial code drop
