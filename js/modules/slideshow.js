Sams.slideshow = function (elem) {

  "use strict";

  this.elem = document.querySelector(elem);

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