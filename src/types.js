// @flow
export type $relationshipSchema = {
    name?: string;
    alias?: string;
    entityName: string;
    type?: number;
};

export type $entitySchema = {
  idFunc?: Function;
  premodifier?: (ent: Object)=>Object;
  modifier?: (ent: Object)=>Object;
  relationships?: $relationshipSchema[]
};

export type $schema = {[key: string]: $entitySchema};
