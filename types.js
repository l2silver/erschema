// @flow
export type $relationshipSchema = {
    entityName: string;
    alias?: string;
    name?: string;
    type: number;
}

export type $entitySchema = {
  idFunc?: Function;
  premodifier?: (ent: Object)=>Object;
  modifier?: (ent: Object)=>Object;
  relationships?: $relationshipSchema[];
}

export type $schema = {[key: string]: $entitySchema}