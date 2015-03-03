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
  'BUTTON': 'button button-circle button-jumbo',
  'CURRENT': 'is-current',
  'DISABLED': 'is-disabled'
};
