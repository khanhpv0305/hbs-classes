import generateComponentId from './generateComponentId'
import {venderName} from '../public/config'

var escapeRegex = /[[\].#*$><+~=|^:(),"'`-]+/g;
var dashesAtEnds = /(^-|-$)/g;
/**
 * TODO: Explore using CSS.escape when it becomes more available
 * in evergreen browsers.
 */

function escape(str) {
  return str // Replace all possible CSS selectors
    .replace(escapeRegex, '-') // Remove extraneous hyphens at the start and end
    .replace(dashesAtEnds, '');
}

const identifiers = {}

function generateId(displayName, parentComponentId) {
  var name = typeof displayName !== 'string' ? venderName : escape(displayName); // Ensure that no displayName can lead to duplicate componentIds

  identifiers[name] = (identifiers[name] || 0) + 1;
  var componentId = name + '-' + generateComponentId(name + identifiers[name]);
  return parentComponentId ? parentComponentId + '-' + componentId : componentId;
}

export {generateId as default}
