/**
 * Represents a tooltip component
 * @constructor
 * @param {object} elem  The element to which the tooltip is attached.
 * @param {object} config Optional configuration object
 */
bit.tooltip = function (elem, config) {

  "use strict";

  this.elem = elem;

  this.config = {
  };

  bit.obj.extend(this.config, config);

  this.trigger = this.elem;

  this.tooltip = null;

  this.init();

};


/**
 * [init description]
 * @return {[type]} [description]
 */
bit.tooltip.prototype.init = function() {

  this.elem.addEventListener('mouseover', function (event) {
    this.handleMouseOver(event);
  }.bind(this));

  this.elem.addEventListener('mouseout', function (event) {
    this.handleMouseOut(event);
  }.bind(this));

};


/**
 * [handleMouseOver description]
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
bit.tooltip.prototype.handleMouseOver = function(event) {
  var currentTip = event.currentTarget;
  this.activateTooltip(currentTip);
};


/**
 * [activateTooltip description]
 * @return {[type]} [description]
 */
bit.tooltip.prototype.activateTooltip = function () {

  if (!this.tooltip) {
    var text = this.config.text;

    this.tooltip = document.createElement('div');
    this.tooltip.textContent = text;

    this.trigger.appendChild(this.tooltip);
  }

  this.tooltip.classList.add('active');

};


/**
 * [handleMouseOut description]
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
bit.tooltip.prototype.handleMouseOut = function(event) {
  this.tooltip.classList.remove('active');
};


/**
 * CSS Class collection
 * @type {Object}
 */
bit.tooltip.cssClass = {
  'ACTIVE': 'active'
};
