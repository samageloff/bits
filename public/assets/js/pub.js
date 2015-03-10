/*!
* Pub/Sub implementation
* http://addyosmani.com/
* Licensed under the GPL
* http://jsfiddle.net/LxPrq/
*/


;(function ( window, doc, undef ) {

  var topics = {},
      subUid = -1,
      pubsub = {};

  pubsub.publish = function ( topic, args ) {

    if (!topics[topic]) {
      return false;
    }

    setTimeout(function () {
      var subscribers = topics[topic],
          len = subscribers ? subscribers.length : 0;

      while (len--) {
        subscribers[len].func(topic, args);
      }
    }, 0);

    return true;

  };

  pubsub.subscribe = function ( topic, func ) {

    if (!topics[topic]) {
      topics[topic] = [];
    }

    var token = (++subUid).toString();
    topics[topic].push({
      token: token,
      func: func
    });
    return token;

  };

  pubsub.unsubscribe = function ( token ) {
    for (var m in topics) {
      if (topics[m]) {
        for (var i = 0, j = topics[m].length; i < j; i++) {
          if (topics[m][i].token === token) {
            topics[m].splice(i, 1);
              return token;
            }
          }
        }
      }
    return false;
  };

  getPubSub = function(){
    return pubsub;
  };

  window.pubsub = getPubSub();

}( this, this.document ));