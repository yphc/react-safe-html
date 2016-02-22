exports.createSimpleElement = createSimpleElement;
exports.makeElements = makeElements;

function createSimpleElement(tag, allowed, extraProps={}) {
  return (props) => {
    var resultProps = {};
    Object.keys(allowed).forEach((allowedKey) => {
      if (props[allowedKey]) {
        var result = props[allowedKey];

        if (typeof allowed[allowedKey] === 'function') {
          [allowedKey, result] = allowed[allowedKey](result);
        }

        resultProps[allowedKey] = result;
      }
    });

    Object.assign(resultProps, extraProps);

    return React.createElement(tag, resultProps, props.children);
  };
}

var standardAllowedProps = {
  class: (value) => ['className', value],
  height: true,
  width: true,
  href: (value) => ['href', value], // TODO: sanatize href
  placeholder: true,
};

exports.standardAllowedProps = standardAllowedProps;

function makeElements(standardAllowedProps) {
  var elements = {};
  var makeSimple = (tag, extraAllowededProps={}, extraProps={}) => (
      createSimpleElement(tag, {...standardAllowedProps, ...extraAllowededProps}, extraProps)
  )
  var makeSimpleAndAssign = (tag, ...args) => elements[tag] = makeSimple(tag, ...args);

  // Basic elements
  makeSimpleAndAssign('div');
  makeSimpleAndAssign('span');
  makeSimpleAndAssign('a');
  makeSimpleAndAssign('img');
  makeSimpleAndAssign('p');

  // Tables
  makeSimpleAndAssign('table');
  makeSimpleAndAssign('tr');
  makeSimpleAndAssign('td');
  makeSimpleAndAssign('tbody');
  makeSimpleAndAssign('thead');

  // Headers
  ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7'].forEach((tag) => makeSimpleAndAssign('tag'));

  return elements;
}

