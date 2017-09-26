// @flow
import type {$schema} from './types'

export const relationshipTypes = {
  ONE: 1,
  MANY: 2,
}

type $$id = string | number;
type $$mapOf<X> = {[key: string]: X};
type $$idMapOf<X> = {[key: string | number]: X};

type $entities = $$mapOf<$$idMapOf<Object>>
type $relationships = $$mapOf<$$mapOf<$$idMapOf<$$id | $$id[]>>>

export type $normalizeResponse = {
  entities: $entities,
  relationships: $relationships,
};



export default function normalize(
  input: Object,
  entityName: string,
  schema: $schema,
  startingSchema?: $schema
) : $normalizeResponse {
  const entities = {}
  const relationships = {}
  _normalizeRecursive(input, entityName, schema, entities, relationships, startingSchema)
  return {entities, relationships}
}

const noopModifier = (ent)=>ent;

const defaultIdFunc = (ent)=>ent.id

const _normalizeRecursive = function (preinput: Object, entityName: string, schema: $schema, entities: $entities, relationshipData: $relationships, startingSchema?: $schema) {
  const entitySchema = (startingSchema || schema[entityName])
  if (!entitySchema){
    throw Error(`schema ${entityName} not defined`)
  }
  const {premodifier = noopModifier, modifier = noopModifier, relationships, idFunc = defaultIdFunc} = entitySchema
  // $FlowFixMe
  const input = premodifier(preinput);
  // $FlowFixMe
  const inputId = idFunc(input)
  if(relationships && Array.isArray(relationships)){
    relationships.forEach(relationshipSchema => {
      const {name = relationshipSchema.entityName} = relationshipSchema
      const {alias = name} = relationshipSchema
      const relation = input[alias]
      if (relation) {
        const { idFunc: relationshipIdFunc = defaultIdFunc } = schema[relationshipSchema.entityName];
        if (relationshipSchema.type === relationshipTypes.MANY) {
          let relationshipIds = []
          relation.forEach(relatedEntity => {
            if (typeof relatedEntity !== 'object') {
              relationshipIds.push(relatedEntity)
            }
            else {
              _normalizeRecursive(relatedEntity, relationshipSchema.entityName, schema, entities, relationshipData)
              relationshipIds.push(relationshipIdFunc(relatedEntity))
            }
          })
          _addToRelationships(relationshipData, entityName, name, inputId, relationshipIds)
        }
        else {
          let relationshipId
          if (typeof relation !== 'object') {
            relationshipId = relation
          }
          else {
            relationshipId = relationshipIdFunc(relation)
            _normalizeRecursive(relation, relationshipSchema.entityName, schema, entities, relationshipData)
          }
          _addToRelationships(relationshipData, entityName, name, inputId, relationshipId)
        }
      }
    })
  }
  _addToEntities(entities, entityName, input, modifier, inputId)
}

const _addToRelationships = function (relationships, entityName, name, entityId, values) {
  if (!relationships[entityName]) {
    relationships[entityName] = {}
  }
  if (!relationships[entityName][name]) {
    relationships[entityName][name] = {}
  }
  relationships[entityName][name][entityId] = values
}

const _addToEntities = function (entities, entityName, entity, modifier, id) {
  if (!entities[entityName]) {
    entities[entityName] = {}
  }
  // $FlowFixMe
  entities[entityName][id] = modifier({ ...entity, id})
}
