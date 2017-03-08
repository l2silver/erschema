// @flow

export default function generateDefaultState(Immutable, defaultPropsConfig: Object = {}){
  const {Record} = Immutable
  const DefaultState = Record({
    ...defaultPropsConfig
  })
  const defaultState = new DefaultState()
  return defaultState
}
