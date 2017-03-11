// @flow
import standardizeRelationship from './standardizeRelationship'
import type {$standardizeRelationship} from './standardizeRelationship'

export type $standardizeEntity = {
  name: string,
  properties: string[] | Object,
  id?: string,
  idFunc?: (ent: Object)=>string,
  modifier?: (ent: Object)=>Object,
  relationships?: $standardizeRelationship[]
}

export default function standardizeEntity ({name, id, idFunc, properties, modifier, relationships = [], ...otherProps}: $standardizeEntity){
  return {
    name,
    idFunc: idFunc || id || 'id',
    properties: Array.isArray(properties) ? properties : Object.keys(properties),
    modifier,
    relationships: relationships.map(standardizeRelationship),
    ...otherProps
  }
}
