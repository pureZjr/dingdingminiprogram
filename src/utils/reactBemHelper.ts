import reactBemHelper from 'react-bem-helper'

export const ComponentBENHelper = function(componentName) {
  return new reactBemHelper({
    name: componentName, // required
    prefix: 'o-',
    modifierDelimiter: '--',
    outputIsString: true
  })
}
