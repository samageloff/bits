sams.util = function() {};

/**
 * [transitionEndEventName to detect browser]
 */
sams.util.transitionEndEventName = function() {
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

/**
 * Removes a class if an element has it, and adds it the element doesn't have
 * it.  Won't affect other classes on the node.  This method may throw a DOM
 * exception if the class name is empty or invalid.
 * @param {Element} element DOM node to toggle class on.
 * @param {string} className Class to toggle.
 * @return {boolean} True if class was added, false if it was removed
 *     (in other words, whether element has the class after this function has
 *     been called).
 */
sams.util.toggle = function(element, className) {
  var add = !element.classlist.contains(element, className);
  element.classlist.enable(element, className, add);
  return add;
};

/**
 * Adds or removes a class depending on the enabled argument.  This method
 * may throw a DOM exception for an invalid or empty class name if DOMTokenList
 * is used.
 * @param {Element} element DOM node to add or remove the class on.
 * @param {string} className Class name to add or remove.
 * @param {boolean} enabled Whether to add or remove the class (true adds,
 *     false removes).
 */
sams.util.enable = function(element, className, enabled) {
  if (enabled) {
    element.classlist.add(element, className);
  } else {
    element.classlist.remove(element, className);
  }
};
