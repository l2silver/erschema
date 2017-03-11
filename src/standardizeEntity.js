// @flow
import standardizeRelationship from './standardizeRelationship'
import type {$standardizeRelationship} from './standardizeRelationship'
import type {$entitySchema} from '../types'
export type $standardizeEntity = {
  name: string,
  properties: string[] | Object,
  id?: string,
  idFunc?: (ent: Object)=>string,
  modifier?: (ent: Object)=>Object,
  relationships?: $standardizeRelationship[]
}

export default function standardizeEntity (
  {
    name,
    id,
    idFunc,
    properties,
    modifier,
    relationships = [],
    ...otherProps
  }: $standardizeEntity) : $entitySchema {
  const standardIdFunc = (ent) => (ent[id || 'id'])
  return {
    name,
    idFunc: idFunc || standardIdFunc,
    properties: Array.isArray(properties) ? properties : Object.keys(properties),
    modifier,
    relationships: relationships.map(standardizeRelationship),
    ...otherProps
  }
}
