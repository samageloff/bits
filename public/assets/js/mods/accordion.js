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
  this.panel = bit.util.toArray(this.panelGroup);

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
  }
};


bit.accordion.prototype.tearDown = function (panel) {
  panel.forEach(function (currentValue) {
    if (currentValue.classList.contains(bit.accordion.cssClass.ACTIVE)) {
      currentValue.classList.remove(bit.accordion.cssClass.ACTIVE);
    }
  });
};


/**
 * CSS Class collection
 * @type {Object}
 */
bit.accordion.cssClass = {
  'ACTIVE': 'is-active'
};
