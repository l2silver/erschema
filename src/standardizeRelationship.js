// @flow
import {MANY} from './relationshipTypes'

export type $standardizeRelationship = {
  name: string,
  alias?: string,
  relationshipName?: string,
  type?: number,
  variableRelationshipName?: {
    names: string[],
    getRelationshipName: (ent: Object)=>string,
  }
}

export default function standardizeRelationship ({name, alias, relationshipName, type, variableRelationshipName, ...otherProps}: $standardizeRelationship){
  return {
    name,
    alias: alias || name,
    relationshipName: relationshipName || alias || name,
    type: type || MANY,
    variableRelationshipName,
    ...otherProps
  }
}
