// @flow
export type $relationshipSchema = {
    entityName: string;
    alias?: string;
    name?: string;
    type: number;
}

export type $entitySchema = {
  nameFunc?: (ent: Object)=>string;
  idFunc?: (ent: Object)=>string;
  premodifier?: (ent: Object)=>Object;
  modifier?: (ent: Object)=>Object;
  relationships?: $relationshipSchema[];
}

export type $schema = {[key: string]: $entitySchema}