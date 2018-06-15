import Css from './Css';
import Direction from './Direction';
import Node from '../node/Node';
import Element from '../node/Element';

var normal = function (value) {
  return function (element) {
    return value;
  };
};

var lookups = {
  start: Direction.onDirection('left', 'right'),
  end: Direction.onDirection('right', 'left'),
  justify: normal('justify'),
  center: normal('center'),
  'match-parent': normal('match-parent')
};

var getAlignment = function (element: Element, property) {
  var raw = Css.get(element, property);
  return lookups[raw] !== undefined ? lookups[raw](element) : raw;
};

var hasAlignment = function (element: Element, property, value) {
  return Node.isText(element) ? false : getAlignment(element, property) === value;
};

export default <any> {
  hasAlignment: hasAlignment
};