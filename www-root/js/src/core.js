/**
 * Name of data attribute containing module list
 * @enum {string}
 */
SAMS.modConf = {
  ATTRIBUTE: 'data-mod',
  DATA: 'mod',
  CONFIG_PREFIX: 'conf',
  PREFIX_: 'data-'
};


/**
 * Application core for locating and instantiating page modules
 * @constructor
 */
SAMS.core = function() {
  this.executeModules();
};


SAMS.core.prototype.knownMods = function(mod) {
  return SAMS[mod];
};


/**
 * Search the DOM to locate all elements with associated modules.
 * @param {Element} rootElem Root element used to locate modules.
 * @return {Array} Array of elements containing modules.
 * @private
 */
SAMS.core.prototype.locateModules = function(rootElem) {
  var query = document.querySelectorAll('[' + SAMS.modConf.ATTRIBUTE + ']',
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
SAMS.core.prototype.instantiateModules = function(elem, index, arr) {
  var data = SAMS.util.getAllDataSets(elem);
  var mods = data[SAMS.modConf.DATA].split(' ');
  var numberOfMods = mods.length;
  var modConfig = {};
  var modName, modPath, configAttrName;

  if (!elem.id) {
    elem.id = SAMS.util.buildString(
        SAMS.util.toSelectorCase(SAMS.modConf.DATA), '-', index);
  }

  for (var i = 0; i < numberOfMods; i += 1) {
    modName = mods[i];
    modPath = this.knownMods(modName);
    configAttrName = SAMS.util.toCamelCase(SAMS.util.buildString(
        SAMS.modConf.CONFIG_PREFIX, '-', modName.toLowerCase()));

    if (configAttrName in data) {
      modConfig = JSON.parse(data[configAttrName].replace(/'/g, '"'));
    }

    if (SAMS.util.isFunction(modPath)) {
      new modPath(elem, modConfig);
    }
  }
};


SAMS.core.prototype.getDataSet = function(elem, key) {
  if (elem.dataset) {
    return elem.dataset[key];
  } else {
    return elem.getAttribute(SAMS.modConf.PREFIX_ +
        SAMS.util.toSelectorCase(key));
  }
};


/**
 * Locate all modules in the DOM or within the supplied root element and
 * instantiate the associated modules.
 * @param {Element=} opt_rootElem Optional root element used to locate modules.
 */
SAMS.core.prototype.executeModules = function(opt_rootElem) {
  var modContainers = this.locateModules(opt_rootElem);

  modContainers.forEach(function(currentValue, index, array) {
    this.instantiateModules(currentValue, index, array);
  }.bind(this));
};