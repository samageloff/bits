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