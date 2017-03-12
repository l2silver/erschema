// @flow
import standardizeRelationship from './standardizeRelationship'
import type {$standardizeRelationship} from './standardizeRelationship'
import type {$entitySchema} from '../types'
export type $standardizeEntity = {
  name: string,
  properties: string[] | Object,
  Model: Class<any>,
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
    modifier = (ent)=>ent,
    Model,
    relationships = [],
    ...otherProps
  }: $standardizeEntity) : $entitySchema {
  const standardIdFunc = (ent) => (ent[id || 'id'])
  return {
    name,
    idFunc: idFunc || standardIdFunc,
    properties: Array.isArray(properties) ? properties : Object.keys(properties),
    modifier,
    Model,
    relationships: relationships.map(standardizeRelationship),
    ...otherProps
  }
}
