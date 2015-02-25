 // TODOS:
 // disable prev/next when at front/back of slideshow
 //       option: set starting value
 //       option: circular
 //       vertical vs horizontal
 //       animation options

/**
 * [slideshow description]
 * @param  {[type]} elem   [description]
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
SAMS.slideshow = function (elem, config) {

  "use strict";

  this.elem = elem;

  this.config = {
    'panel': '.panel',
    'wrapper': '.slideshow-wrapper',
    'wrapperInner': '.slideshow-wrapper-inner',
    'current': '.is-current',
    'animate': false,
    'navigation': true,
    'counter': true
  };

  // Extend the config object with custom attributes
  SAMS.obj.extend(this.config, config);

  // Store reference to vendor prefix
  this.vendorPrefix = SAMS.util.vendorPrefix();

  this.panelGroup = this.elem.querySelectorAll(this.config.panel);
  this.panels = Array.prototype.slice.call(this.panelGroup);

  this.wrapper = this.elem.querySelector(this.config.wrapper);
  this.wrapperInner = this.elem.querySelector(this.config.wrapperInner);

  this.list = this.wrapperInner.children[0];

  // Set up transition end
  this.transitionEnd = SAMS.util.transitionEndEventName();

  this.collection = [];

  this.currentIndex = 0;

  this.init();
};


/**
 *
 * @return {[type]} [description]
 */
SAMS.slideshow.prototype.init = function () {
  this.calculateDimensions();
  this.generateControls();
  this.bindEvents();
};


/**
 *
 * @return {[type]} [description]
 */
SAMS.slideshow.prototype.generateControls = function () {
  if (this.config.navigation) {
    this.createPrevNext();
    this.handleDisabledState();
  }
  if (this.config.counter) {
    this.generateCounter();
  }
};


/**
 *
 * @return {[type]} [description]
 */
SAMS.slideshow.prototype.bindEvents = function () {
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

    if (keyCode === 39) {
      this.getNextItem();
    }
    else if (keyCode === 37) {
      this.getPreviousItem();
    }
  }.bind(this);

};


/**
 *
 * @return {[type]} [description]
 */
SAMS.slideshow.prototype.calculateDimensions = function () {
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
 *
 * @return {[type]} [description]
 */
SAMS.slideshow.prototype.createPrevNext = function() {
  function createButton(id, text, klass) {
    var button = document.createElement('button');
    button.setAttribute('id', id);
    button.setAttribute('class', klass);
    button.textContent = text;
    return button;
  }

  this.prevBtn = createButton('previous', '‹', SAMS.slideshow.cssClass.BUTTON);
  this.nextBtn = createButton('next', '›', SAMS.slideshow.cssClass.BUTTON);

  this.wrapperInner.parentNode.appendChild(this.prevBtn);
  this.wrapperInner.parentNode.appendChild(this.nextBtn);
};


/**
 *
 * @return {[type]} [description]
 */
SAMS.slideshow.prototype.generateCounter = function() {
  this.countWrap = document.createElement('div');
  this.countWrap.setAttribute('class', 'count');

  this.elem.appendChild(this.countWrap);
  this.updateCount();
};


/**
 *
 * @return {[type]} [description]
 */
SAMS.slideshow.prototype.updateCount = function() {
  this.countWrap.innerHTML =
      (this.currentIndex + 1) + ' / ' + this.collection.length;
};


/**
 *
 * @return {object}
 * TODO: rewrite to optimize. shouldn't need to loop each time
 */
SAMS.slideshow.prototype.getCurrentIndex = function () {
  var obj = {};

  this.panels.forEach(function (currentValue, index) {
    if (currentValue.classList.contains(SAMS.slideshow.cssClass.CURRENT)) {
      obj.current = index;
      obj.previous = index - 1;
      obj.next = index + 1;
    }
  });
  return obj;
};


/**
 *
 * @return {[type]} [description]
 */
SAMS.slideshow.prototype.getPreviousItem = function () {
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
 *
 *
 */
SAMS.slideshow.prototype.getNextItem = function () {
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
 *
 * @param {number} currentIndex
 */
SAMS.slideshow.prototype.updateCurrentClass = function () {
  var currentSlide = this.elem.querySelector(this.config.current);
  currentSlide.classList.remove(SAMS.slideshow.cssClass.CURRENT);
  this.panels[this.currentIndex].classList.add(SAMS.slideshow.cssClass.CURRENT);

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
SAMS.slideshow.prototype.generateId = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};


/**
 * Handles the addition and removal of disabled classes
 * @param {number} currentIndex
 * TODO: make elegant
 */
SAMS.slideshow.prototype.handleDisabledState = function () {
  if (this.currentIndex === this.collection.length -1) {
    this.nextBtn.classList.add(SAMS.slideshow.cssClass.DISABLED);
  }
  else if (this.currentIndex === 0) {
    this.prevBtn.classList.add(SAMS.slideshow.cssClass.DISABLED);
  }
  else {
    this.prevBtn.classList.remove(SAMS.slideshow.cssClass.DISABLED);
    this.nextBtn.classList.remove(SAMS.slideshow.cssClass.DISABLED);
  }
};


/**
 * CSS Class collection
 * @type {Object}
 */
SAMS.slideshow.cssClass = {
  'BUTTON': 'button button-circle button-jumbo button-primary',
  'INDICIE': 'button button-circle',
  'CURRENT': 'is-current',
  'DISABLED': 'is-disabled'
};
