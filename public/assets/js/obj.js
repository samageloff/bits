bit.obj = function() {};


/**
 *
 * @return {Boolean} [description]
 */
bit.obj.has = function(obj, key) {
  return hasOwnProperty.call(obj, key);
};


/**
 * Extends an object with another object
 * This operates 'in-place'; it does not create a new Object.
 */
bit.obj.extend = function(target, var_args) {
  var key, source;
  for (var i = 1; i < arguments.length; i++) {
    source = arguments[i];
    for (key in source) {
      target[key] = source[key];
    }
  }
};


