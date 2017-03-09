// @flow
import {handleActions} from 'redux-actions'
import actionNames from 'resource-action-types'
import {Map} from 'immutable'
import handlers from './handlers'
import generateDefaultState from './generateDefaultState'

type $props = {
  name: string,
  defaultStateConfig?: Object,
	options?: Object,
  otherActions?: Object,
  modelGenerator?: (entity: Object) => Class<any>,
  Model?: Class<any>,
  locationPath?: string[],
};


export default function ({name, Model, modelGenerator, defaultStateConfig = {}, otherActions = {}, locationPath}: $props) {
  let finalModelGenerator
  if (Model) {
    // $FlowFixMe
    finalModelGenerator = () => Model
  }
  else if (modelGenerator) {
    finalModelGenerator = modelGenerator
  }
  else {
    throw new TypeError('please include Model name')
  }

  return handleActions(
    {
      [actionNames.create(name)]: handlers.create(finalModelGenerator, locationPath),
      [actionNames.update(name)]: handlers.update(locationPath),
      [actionNames.remove(name)]: handlers.remove(locationPath),
      [actionNames.get(name)]: handlers.get(finalModelGenerator, locationPath),
      [actionNames.index(name)]: handlers.index(finalModelGenerator, locationPath),
      ...otherActions
    },
    generateDefaultState({data: new Map(), ...defaultStateConfig}))
}