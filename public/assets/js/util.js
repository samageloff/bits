/*

______________   ________________  _______________   _____________
_____    ______  ________________  _______________  _______________
_____     _____        ____             _____       _______
_____    ______        ____             _____       ______
______________         ____             _____        _____________
_____    ______        ____             _____              ________
_____     _____        ____             _____               _______
_____    ______  ________________       _____       _______________
______________   ________________       _____        _____________

*/

var bit = {};

bit.util = function() {};


/**
 * [toArray description]
 * @return {[type]} [description]
 */
bit.util.toArray = function(list) {
  return Array.prototype.slice.call(list);
};


/**
 * [transitionEndEventName to detect browser]
 */
bit.util.transitionEndEventName = function() {
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
bit.util.toggle = function(element, className) {
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
bit.util.enable = function(element, className, enabled) {
  if (enabled) {
    element.classlist.add(element, className);
  } else {
    element.classlist.remove(element, className);
  }
};


/**
 * Returns an object with vendor prefix references
 */
bit.util.vendorPrefix = function() {
  var styles = window.getComputedStyle(document.documentElement, ''),
    pre = (Array.prototype.slice
      .call(styles)
      .join('')
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1],
    dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
  return {
    dom: dom,
    lowercase: pre,
    css: '-' + pre + '-',
    js: pre[0].toUpperCase() + pre.substr(1)
  };
};


/**
 * Converts a string from camelCase to selector-case (e.g. from
 * "multiPartString" to "multi-part-string"), useful for converting JS
 * style and dataset properties to equivalent CSS selectors and HTML keys.
 * @param {string} str The string in camelCase form.
 * @return {string} The string in selector-case form.
 */
bit.util.toSelectorCase = function(str) {
  return String(str).replace(/([A-Z])/g, '-$1').toLowerCase();
};


/**
 * Converts a string from selector-case to camelCase (e.g. from
 * "multi-part-string" to "multiPartString"), useful for converting
 * CSS selectors and HTML dataset keys to their equivalent JS properties.
 * @param {string} str The string in selector-case form.
 * @return {string} The string in camelCase form.
 */
bit.util.toCamelCase = function(str) {
  return String(str).replace(/\-([a-z])/g, function(all, match) {
    return match.toUpperCase();
  });
};


/**
 * Converts a lowercase string to a capitalized string
 * @return {string}
 */
bit.util.toCapitalised = function() {
  return this.charAt(0).toUpperCase() + this.split(1);
};


/**
 * Concatenates string expressions. This is useful
 * since some browsers are very inefficient when it comes to using plus to
 * concat strings. Be careful when using null and undefined here since
 * these will not be included in the result. If you need to represent these
 * be sure to cast the argument to a String first.
 * For example:
 * <pre>buildString('a', 'b', 'c', 'd') -> 'abcd'
 * buildString(null, undefined) -> ''
 * </pre>
 * @param {...*} var_args A list of strings to concatenate. If not a string,
 *     it will be casted to one.
 * @return {string} The concatenation of {@code var_args}.
 */
bit.util.buildString = function(var_args) {
  return Array.prototype.join.call(arguments, '');
};


/**
 * Returns true if the specified value is a function.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a function.
 */
bit.util.isFunction = function(val) {
  var getType = {};
  return val && getType.toString.call(val) === '[object Function]';
};


/**
 * Gets all custom data attributes as a string map.  The attribute names will be
 * camel cased (e.g., data-foo-bar -> dataset['fooBar']).  This operation is not
 * safe for attributes having camel-cased names clashing with already existing
 * properties (e.g., data-to-string -> dataset['toString']).
 * @param {!Element} element DOM node to get the data attributes from.
 * @return {!Object} The string map containing data attributes and their
 *     respective values.
 */
bit.util.getAllDataSets = function(element) {
  if (element.dataset) {
    return element.dataset;
  } else {
    var dataset = {};
    var attributes = element.attributes;
    for (var i = 0; i < attributes.length; ++i) {
      var attribute = attributes[i];
      if (bit.util.startsWith(attribute.name,
                                 bit.modConf.PREFIX_)) {
        // We use substr(5), since it's faster than replacing 'data-' with ''.
        var key = bit.util.toCamelCase(attribute.name.substr(5));
        dataset[key] = attribute.value;
      }
    }
    return dataset;
  }
};


/**
 * Fast prefix-checker.
 * @param {string} str The string to check.
 * @param {string} prefix A string to look for at the start of {@code str}.
 * @return {boolean} True if {@code str} begins with {@code prefix}.
 */
bit.util.startsWith = function(str, prefix) {
  return str.lastIndexOf(prefix, 0) === 0;
};
