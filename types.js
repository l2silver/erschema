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
  idFunc: Function;
  properties: string[];
  modifier: (ent: Object)=>Object;
  Model: Class<any>;
  relationships: $relationshipSchema[];
}

export type $schema = {[key: string]: $entitySchema}