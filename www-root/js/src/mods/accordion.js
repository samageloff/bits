SAMS.accordion = function (elem, config) {

  "use strict";

  this.elem = elem;

  this.config = {
    'panel': '.panel',
    'toggle': false,
    'collapse': true
  };

  SAMS.obj.extend(this.config, config);

  this.panelGroup = this.elem.querySelectorAll(this.config.panel);
  this.panel = Array.prototype.slice.call(this.panelGroup);

  this.init();

};

SAMS.accordion.prototype.init = function () {

  this.panel.forEach(function (currentValue) {
    var header = currentValue.children[0];

    header.addEventListener('click', function (event) {
      this.handleClick(header, event);
    }.bind(this));

  }.bind(this));

};

SAMS.accordion.prototype.handleClick = function (header, event) {

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

SAMS.accordion.prototype.tearDown = function (panel) {

  panel.forEach(function (currentValue) {
    if (currentValue.classList.contains('active')) {
      currentValue.classList.remove('active');
    }
  });

};