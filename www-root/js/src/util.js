Sams.Util = function() {};

/**
 * [transitionEndEventName to detect browser]
 */
Sams.Util.transitionEndEventName = function() {
  var i,
    el = document.createElement('div'),
    transitions = {
      'transition':'transitionend',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
  };

  for (i in transitions) {
    if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
      return transitions[i];
    }
  }
};