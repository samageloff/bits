var bit = {};

bit.util = function() {};

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



/**
 * Name of data attribute containing module list
 * @enum {string}
 */
bit.modConf = {
  ATTRIBUTE: 'data-mod',
  DATA: 'mod',
  CONFIG_PREFIX: 'conf',
  PREFIX_: 'data-'
};


/**
 * Application core for locating and instantiating page modules
 * @constructor
 */
bit.core = function() {
  this.executeModules();
};


bit.core.prototype.knownMods = function(mod) {
  return bit[mod];
};


/**
 * Search the DOM to locate all elements with associated modules.
 * @param {Element} rootElem Root element used to locate modules.
 * @return {Array} Array of elements containing modules.
 * @private
 */
bit.core.prototype.locateModules = function(rootElem) {
  var query = document.querySelectorAll('[' + bit.modConf.ATTRIBUTE + ']',
      rootElem),
    modules = Array.prototype.slice.call(query);
  return modules;
};


/**
 *
 * Identify all modules associated with the supplied element and instantiates
 * each. If there is an available config object that is passed to the module
 * constructor otherwise an empty object is supplied.
 * @param {Element} elem Module root element.
 * @param {number} index Numerical index in the array.
 * @param {Array} arr Original array to iterate over.
 * @private
 */
bit.core.prototype.instantiateModules = function(elem, index, arr) {
  var data = bit.util.getAllDataSets(elem);
  var mods = data[bit.modConf.DATA].split(' ');
  var numberOfMods = mods.length;
  var modConfig = {};
  var modName, modPath, configAttrName;

  if (!elem.id) {
    elem.id = bit.util.buildString(
        bit.util.toSelectorCase(bit.modConf.DATA), '-', index);
  }

  for (var i = 0; i < numberOfMods; i += 1) {
    modName = mods[i];
    modPath = this.knownMods(modName);
    configAttrName = bit.util.toCamelCase(bit.util.buildString(
        bit.modConf.CONFIG_PREFIX, '-', modName.toLowerCase()));

    if (configAttrName in data) {
      modConfig = JSON.parse(data[configAttrName].replace(/'/g, '"'));
    }

    if (bit.util.isFunction(modPath)) {
      new modPath(elem, modConfig);
    }
  }
};


bit.core.prototype.getDataSet = function(elem, key) {
  if (elem.dataset) {
    return elem.dataset[key];
  } else {
    return elem.getAttribute(bit.modConf.PREFIX_ +
        bit.util.toSelectorCase(key));
  }
};


/**
 * Locate all modules in the DOM or within the supplied root element and
 * instantiate the associated modules.
 * @param {Element=} opt_rootElem Optional root element used to locate modules.
 */
bit.core.prototype.executeModules = function(opt_rootElem) {
  var modContainers = this.locateModules(opt_rootElem);

  modContainers.forEach(function(currentValue, index, array) {
    this.instantiateModules(currentValue, index, array);
  }.bind(this));
};
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
bit.accordion = function (elem, config) {

  "use strict";

  this.elem = elem;

  this.config = {
    'panel': '.panel',
    'toggle': false,
    'collapse': true
  };

  bit.obj.extend(this.config, config);

  this.panelGroup = this.elem.querySelectorAll(this.config.panel);
  this.panel = Array.prototype.slice.call(this.panelGroup);

  this.init();

};


bit.accordion.prototype.init = function () {

  this.panel.forEach(function (currentValue) {
    var header = currentValue.children[0];

    header.addEventListener('click', function (event) {
      this.handleClick(header, event);
    }.bind(this));

  }.bind(this));

};


bit.accordion.prototype.handleClick = function (header, event) {

  var currentPanel = event.target.parentElement;

  if (this.config.toggle) {
    currentPanel.classList.toggle(bit.accordion.cssClass.ACTIVE);
  } else {
    if (currentPanel.classList.contains(bit.accordion.cssClass.ACTIVE)) {
      return;
    }
    this.tearDown(this.panel);
    currentPanel.classList.add(bit.accordion.cssClass.ACTIVE);
    header.classList.add(bit.accordion.cssClass.DISABLED);
  }

};


bit.accordion.prototype.tearDown = function (panel) {

  panel.forEach(function (currentValue) {
    var header = currentValue.children[0];

    if (currentValue.classList.contains(bit.accordion.cssClass.ACTIVE)) {
      currentValue.classList.remove(bit.accordion.cssClass.ACTIVE);
    }

    header.classList.remove(bit.accordion.cssClass.DISABLED);
  });

};


/**
 * CSS Class collection
 * @type {Object}
 */
bit.accordion.cssClass = {
  'ACTIVE': 'is-active',
  'DISABLED': 'is-disabled'
};

 // TODOS:
 //       option: set starting value
 //       option: circular

/**
 * Represents a slideshow
 * @constructor
 * @param {object} elem  The element to which the slideshow is attached.
 * @param {object} config Optional configuration object
 */
bit.slideshow = function (elem, config) {

  "use strict";

  this.elem = elem;

  this.config = {
    'panel': '.panel',
    'wrapper': '.slideshow-wrapper',
    'wrapperInner': '.slideshow-wrapper-inner',
    'current': '.is-current',
    'circular': false,
    'animate': false,
    'navigation': true,
    'counter': true
  };

  // Extend the config object with custom attributes
  bit.obj.extend(this.config, config);

  // Store reference to vendor prefix
  this.vendorPrefix = bit.util.vendorPrefix();

  this.panelGroup = this.elem.querySelectorAll(this.config.panel);
  this.panels = Array.prototype.slice.call(this.panelGroup);

  this.wrapper = this.elem.querySelector(this.config.wrapper);
  this.wrapperInner = this.elem.querySelector(this.config.wrapperInner);

  this.list = this.wrapperInner.children[0];

  // Set up transition end
  this.transitionEnd = bit.util.transitionEndEventName();

  this.collection = [];

  this.currentIndex = 0;

  this.init();
};


/**
 * Initialize the slideshow
 */
bit.slideshow.prototype.init = function () {
  this.calculateDimensions();
  this.generateControls();
  this.bindEvents();
};


/**
 * Generate slideshow controls
 */
bit.slideshow.prototype.generateControls = function () {
  if (this.config.navigation) {
    this.createPrevNext();
    this.handleDisabledState();
  }
  if (this.config.counter) {
    this.generateCounter();
  }
};


/**
 * Bind event handlers
 */
bit.slideshow.prototype.bindEvents = function () {
  var body = document.getElementsByTagName('body')[0];

  if (this.config.navigation) {
    this.prevBtn.addEventListener('click', function () {
      this.getPreviousItem();
    }.bind(this));

    this.nextBtn.addEventListener('click', function () {
      this.getNextItem();
    }.bind(this));
  }

  // Bind prev/next to arrow keys
  body.onkeydown = function(event) {
    var key = event || window.event;
    var keyCode = key.keyCode;

    // next button
    if (keyCode === 39) {
      this.getNextItem();
    }
    // previous button
    else if (keyCode === 37) {
      this.getPreviousItem();
    }
  }.bind(this);

};


/**
 * Calculate slideshow dimensions
 */
bit.slideshow.prototype.calculateDimensions = function () {
  var slideshow_width = 0;

  this.panels.forEach(function (currentValue, index, array) {

    var id = this.generateId(),
      position = 100 * index + '%',
      obj = {};

    currentValue.setAttribute('id', id);

    obj.id = id;
    obj.position = position;

    this.collection.push(obj);
    slideshow_width += currentValue.offsetWidth;

  }.bind(this));

  return slideshow_width + 'px';
};


/**
 * Create previous and next buttons
 */
bit.slideshow.prototype.createPrevNext = function() {
  function createButton(id, text, klass) {
    var button = document.createElement('button');
    button.setAttribute('id', id);
    button.setAttribute('class', klass);
    button.textContent = text;
    return button;
  }

  this.prevBtn = createButton('previous', '‹', bit.slideshow.cssClass.BUTTON);
  this.nextBtn = createButton('next', '›', bit.slideshow.cssClass.BUTTON);

  this.wrapperInner.parentNode.appendChild(this.prevBtn);
  this.wrapperInner.parentNode.appendChild(this.nextBtn);
};


/**
 * Generate DOM for the counter
 */
bit.slideshow.prototype.generateCounter = function() {
  this.countWrap = document.createElement('div');
  this.countWrap.setAttribute('class', 'count');

  this.elem.appendChild(this.countWrap);
  this.updateCount();
};


/**
 * Update the counter
 */
bit.slideshow.prototype.updateCount = function() {
  this.countWrap.innerHTML =
      (this.currentIndex + 1) + ' / ' + this.collection.length;
};


/**
 * Iterate over slideshow items, and get current index
 * TODO: rewrite to optimize. shouldn't need to loop each time
 */
bit.slideshow.prototype.getCurrentIndex = function () {
  var obj = {};

  obj.first = 0;
  obj.last = this.panels.length;

  this.panels.forEach(function (currentValue, index) {
    if (currentValue.classList.contains(bit.slideshow.cssClass.CURRENT)) {
      obj.current = index;
      obj.previous = index - 1;
      obj.next = index + 1;
    }

  }.bind(this));

  return obj;

};


/**
 * Go to previous item in slideshow
 */
bit.slideshow.prototype.getPreviousItem = function () {
  this.currentIndex = this.getCurrentIndex().previous;

  if (this.currentIndex !== -1) {
    var position = this.collection[this.currentIndex].position;

    if (this.config.animate) {
      this.list.style[this.vendorPrefix.lowercase + 'Transform'] =
          'translateX(-' + position + ')';
    }
    else {
      this.list.style.left = '-' + position;
    }

    this.list.addEventListener(this.transitionEnd,
        this.updateCurrentClass(this.currentIndex));
  }
};


/**
 * Go to next item in slideshow
 */
bit.slideshow.prototype.getNextItem = function () {
  this.currentIndex = this.getCurrentIndex().next;

  if (this.currentIndex <= this.collection.length - 1) {
    var position = this.collection[this.currentIndex].position;

    if (this.config.animate) {
      this.list.style[this.vendorPrefix.lowercase + 'Transform'] =
          'translateX(-' + position + ')';
    }
    else {
      this.list.style.left = '-' + position;
    }

    this.list.addEventListener(this.transitionEnd,
        this.updateCurrentClass(this.currentIndex));
  }
};


/**
 * Update the current class
 */
bit.slideshow.prototype.updateCurrentClass = function (setIndex) {
  var currentSlide = this.elem.querySelector(this.config.current);
  var currentIndex = setIndex || this.currentIndex;
  currentSlide.classList.remove(bit.slideshow.cssClass.CURRENT);

  this.panels[currentIndex].classList.add(bit.slideshow.cssClass.CURRENT);

  this.list.removeEventListener(this.transitionEnd,
    this.updateCurrentClass);

  if (this.config.navigation) {
    this.handleDisabledState(this.currentIndex);
  }

  if (this.config.counter) {
    this.updateCount();
  }

};


/**
 * Generate a unique ID string for use in DOM
 * @return {string} Unique ID
 */
bit.slideshow.prototype.generateId = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};


/**
 * Handles the addition and removal of disabled classes
 * @param {number} currentIndex
 * TODO: make elegant
 */
bit.slideshow.prototype.handleDisabledState = function () {
  if (!this.config.circular) {
    if (this.currentIndex === this.collection.length -1) {
      this.nextBtn.classList.add(bit.slideshow.cssClass.DISABLED);
    }
    else if (this.currentIndex === 0) {
      this.prevBtn.classList.add(bit.slideshow.cssClass.DISABLED);
    }
    else {
      this.prevBtn.classList.remove(bit.slideshow.cssClass.DISABLED);
      this.nextBtn.classList.remove(bit.slideshow.cssClass.DISABLED);
    }
  }
};


/**
 * CSS Class collection
 * @type {Object}
 */
bit.slideshow.cssClass = {
  'BUTTON': 'button button-circle button-jumbo button-royal',
  'CURRENT': 'is-current',
  'DISABLED': 'is-disabled'
};

/**
 * Represents a tabbed component
 * @constructor
 * @param {object} elem  The element to which the tabs is attached.
 * @param {object} config Optional configuration object
 */
bit.tabs = function (elem, config) {

  "use strict";

  this.elem = elem;

  this.config = {
    'tab': '.tabs-nav button',
    'panel': '.tabs-content .panel'
  };

  bit.obj.extend(this.config, config);

  this.tabGroup = this.elem.querySelectorAll(this.config.tab);
  this.tab = Array.prototype.slice.call(this.tabGroup);

  this.panelGroup = this.elem.querySelectorAll(this.config.panel);
  this.panel = Array.prototype.slice.call(this.panelGroup);

  this.init();

};


bit.tabs.prototype.init = function() {

  this.tab.forEach(function (currentValue) {
    var tab = '#tab-' + currentValue.dataset.button;

    currentValue.addEventListener('click', function (event) {
      this.handleClick(tab, event);
    }.bind(this));

  }.bind(this));

};


bit.tabs.prototype.handleClick = function(tab, event) {
  var panel = document.querySelector(tab);
  var currentTab = event.currentTarget;

  this.tearDown.call(this.panel);
  this.tearDown.call(this.tab);

  this.activateTabPanel.call(panel);
  this.activateTabPanel.call(currentTab);
};


bit.tabs.prototype.tearDown = function () {
  this.forEach(function (currentValue) {
    if (currentValue.classList.contains(bit.tabs.cssClass.ACTIVE)) {
      currentValue.classList.remove(bit.tabs.cssClass.ACTIVE);
    }
  });
};


bit.tabs.prototype.activateTabPanel = function () {
  this.classList.add(bit.tabs.cssClass.ACTIVE);
};


/**
 * CSS Class collection
 * @type {Object}
 */
bit.tabs.cssClass = {
  'ACTIVE': 'is-active',
  'DISABLED': 'is-disabled'
};

// Initialize the core
var start = new bit.core();