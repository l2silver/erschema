// @flow

export default function generateDefaultState(Immutable: Object, defaultPropsConfig: Object = {}){
  const {Record} = Immutable
  const DefaultState = Record({
    ...defaultPropsConfig
  })
  const defaultState = new DefaultState()
  return defaultState
}
