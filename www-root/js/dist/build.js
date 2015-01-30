var Sams = {};

/**
 * Name of data attribute containing module list
 * @enum {string}
 */
var ModKey = {
  ATTRIBUTE: 'data-mod',
  DATA: 'mod',
  CONFIG_PREFIX: 'conf',
  PREFIX_: 'data-'
};


/**
 * Application core for locating and instantiating page modules
 * @constructor
 */
var Core = function() {
  this.executeModules();
};



Core.prototype.knownMods = function(mod) {
  return Sams[mod];
};


/**
 * Search the DOM to locate all elements with associated modules.
 * @param {Element} rootElem Root element used to locate modules.
 * @return {Array} Array of elements containing modules.
 * @private
 */
Core.prototype.locateModules = function(rootElem) {
  var query = document.querySelectorAll('[' + ModKey.ATTRIBUTE + ']', rootElem),
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
Core.prototype.instantiateModules = function(elem, index, arr) {
  var data = this.getDataSet(elem, ModKey.DATA);
  var mods = data.split(' ');
  var numberOfMods = mods.length;
  var modConfig = {};
  var modName, modPath, configAttrName;

  if (!elem.id) {
    elem.id = this.buildString(this.toSelectorCase(ModKey.DATA), '-', index);
  }

  for (var i = 0; i < numberOfMods; i += 1) {
    modName = mods[i];
    modPath = this.knownMods(modName);
    configAttrName = this.toCamelCase(this.buildString(
        ModKey.CONFIG_PREFIX, '-', modName.toLowerCase()));

    if (this.isFunction(modPath)) {
      new modPath(elem, modConfig);
    }
  }
};


Core.prototype.getDataSet = function(elem, key) {
  if (elem.dataset) {
    return elem.dataset[key];
  } else {
    return elem.getAttribute(ModKey.PREFIX_ + this.toSelectorCase(key));
  }
};


/**
 * Converts a string from camelCase to selector-case (e.g. from
 * "multiPartString" to "multi-part-string"), useful for converting JS
 * style and dataset properties to equivalent CSS selectors and HTML keys.
 * @param {string} str The string in camelCase form.
 * @return {string} The string in selector-case form.
 */
Core.prototype.toSelectorCase = function(str) {
  return String(str).replace(/([A-Z])/g, '-$1').toLowerCase();
};


/**
 * Locate all modules in the DOM or within the supplied root element and
 * instantiate the associated modules.
 * @param {Element=} opt_rootElem Optional root element used to locate modules.
 */
Core.prototype.executeModules = function(opt_rootElem) {
  var modContainers = this.locateModules(opt_rootElem);

  modContainers.forEach(function(currentValue, index, array) {
    this.instantiateModules(currentValue, index, array);
  }.bind(this));
};


/**
 * Converts a string from selector-case to camelCase (e.g. from
 * "multi-part-string" to "multiPartString"), useful for converting
 * CSS selectors and HTML dataset keys to their equivalent JS properties.
 * @param {string} str The string in selector-case form.
 * @return {string} The string in camelCase form.
 */
Core.prototype.toCamelCase = function(str) {
  return String(str).replace(/\-([a-z])/g, function(all, match) {
    return match.toUpperCase();
  });
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
Core.prototype.buildString = function(var_args) {
  return Array.prototype.join.call(arguments, '');
};


/**
 * Returns true if the specified value is a function.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a function.
 */
Core.prototype.isFunction = function(val) {
  var getType = {};
  return val && getType.toString.call(val) === '[object Function]';
};
Sams.accordion = function (elem) {

  "use strict";

  this.elem = elem;

  this.config = {
    'panel': '.panel',
    'toggle': false,
    'collapse': true
  };

  this.panelGroup = this.elem.querySelectorAll(this.config.panel);
  this.panel = Array.prototype.slice.call(this.panelGroup);

  this.init();

};

Sams.accordion.prototype.init = function () {

  this.panel.forEach(function (currentValue) {
    var header = currentValue.children[0];

    header.addEventListener('click', function (event) {
      this.handleClick(header, event);
    }.bind(this));

  }.bind(this));

};

Sams.accordion.prototype.handleClick = function (header, event) {

  var currentPanel = event.target.parentElement;

  if (this.config.toggle) {
    currentPanel.classList.toggle('active');
  } else {
    if (currentPanel.classList.contains('active')) {
      return;
    }
    this.tearDown(this.panel);
    currentPanel.classList.add('active');
  }

};

Sams.accordion.prototype.tearDown = function (panel) {

  panel.forEach(function (currentValue) {
    if (currentValue.classList.contains('active')) {
      currentValue.classList.remove('active');
    }
  });

};
 // TODOS:
 // disable prev/next when at front/back of slideshow
 //       find "correct" solution instead of using _self
 //       fluid width
 //       option: set starting value
 //       option: circular
 //       option: indicies
 //       option: left/right arrow

Sams.slideshow = function (elem) {

  "use strict";

  this.elem = elem;

  this.config = {
    'panel': '.panel',
    'wrapper': '.slideshow-wrapper',
    'current': '.current'
  };

  this.panelGroup = this.elem.querySelectorAll(this.config.panel);
  this.panels = Array.prototype.slice.call(this.panelGroup);
  this.wrapper = this.elem.querySelector(this.config.wrapper);
  this.list = this.wrapper.children[0];

  this.collection = [];

  this.init();
};

Sams.slideshow.prototype.init = function () {
  this.list.style.width = this.calculateDimensions();
  this.generateControls();
  this.bindEvents();
};

Sams.slideshow.prototype.calculateDimensions = function () {
  var slideshow_width = 0;

  this.panels.forEach(function (currentValue, index, array) {

    var id = this.generateId(),
      position = (100 / array.length) * index + '%',
      obj = {};

    currentValue.setAttribute('id', id);

    obj.id = id;
    obj.position = position;

    this.collection.push(obj);
    slideshow_width += currentValue.offsetWidth;

  }.bind(this));

  return slideshow_width + 'px';
};

Sams.slideshow.prototype.generateControls = function () {
  function createButton(id, klass) {
    var button = document.createElement('button');
    button.setAttribute('id', id);
    button.setAttribute('class', klass);
    button.textContent = id;
    return button;
  }

  this.prevBtn = createButton('previous', 'navigation');
  this.nextBtn = createButton('next', 'navigation');

  this.wrapper.parentElement.appendChild(this.prevBtn);
  this.wrapper.parentElement.appendChild(this.nextBtn);
};

Sams.slideshow.prototype.bindEvents = function () {
  this.prevBtn.addEventListener('click', function () {
    this.getPreviousItem();
  }.bind(this));

  this.nextBtn.addEventListener('click', function () {
    this.getNextItem();
  }.bind(this));
};

Sams.slideshow.prototype.getCurrentIndex = function () {
  var obj = {};

  this.panels.forEach(function (currentValue, index) {
    if (currentValue.classList.contains('current')) {
      obj.current = index;
      obj.previous = index - 1;
      obj.next = index + 1;
    }
  });
  return obj;
};

Sams.slideshow.prototype.getPreviousItem = function () {
  var currentIndex = this.getCurrentIndex().previous;

  if (currentIndex !== -1) {
    var position = this.collection[currentIndex].position;
    this.list.style.webkitTransform = 'translateX(-' + position + ')';

    this.list.addEventListener('webkitTransitionEnd', function () {
      this.updateCurrentClass(currentIndex);
    }.bind(this));
  }
};

Sams.slideshow.prototype.getNextItem = function () {
  var currentIndex = this.getCurrentIndex().next;

  if (currentIndex <= this.collection.length - 1) {
    var position = this.collection[currentIndex].position;
    this.list.style.webkitTransform = 'translateX(-' + position + ')';

    this.list.addEventListener('webkitTransitionEnd', function () {
      this.updateCurrentClass(currentIndex);
    }.bind(this));
  }
};

Sams.slideshow.prototype.updateCurrentClass = function (currentIndex) {
  var currentSlide = this.elem.querySelector(this.config.current);
  currentSlide.classList.remove('current');
  this.panels[currentIndex].classList.add('current');
};

Sams.slideshow.prototype.generateId = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};
// Initialize the core
var start = new Core();