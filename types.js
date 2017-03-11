// @flow
export type $relationshipSchema = {
    name: string;
    alias: string;
    relationshipName: string;
    type: number;
    variableRelationshipName?: {
      names: string[];
      getRelationshipName: Function;
    }
}

export type $entitySchema = {
  name: string;
  idFunc: Function;
  properties: string[];
  modifier?: Function;
  relationships: $relationshipSchema[];
}

export type $schema = {[key: string]: $entitySchema}