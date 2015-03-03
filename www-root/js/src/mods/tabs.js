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
    var tab = '#tab-' + currentValue.dataset.tab;

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
