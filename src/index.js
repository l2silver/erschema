// @flow
import type {$schema, $entitySchema} from '../types'

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

export const validateSchema = (schema: $schema)=>{
  if (typeof schema !== 'object'){
    throw new TypeError('schema must be an object')
  }
  Object.keys(schema).forEach(key => {
    const entitySchema = schema[key];
    if (entitySchema.relationships) {
      entitySchema.relationships.forEach((relationship)=>{
        if (!relationship.entityName) {
          throw new TypeError(`${key} entitySchema is missing a relationship entityName for the relationship ${relationship.alias || relationship.name || 'Undefined'}`)
        }
        if (!relationship.type) {
          throw new TypeError(`${key} entitySchema is missing a relationship type for the relationship ${relationship.alias || relationship.name || relationship.entityName}`)
        }
      })
    }
  })
  return 'valid'
}

export default function normalize(
  input: Object,
  entityName: string,
  schema: $schema,
  startingSchema?: $entitySchema
) : $normalizeResponse {
  const entities = {}
  const relationships = {}
  _normalizeRecursive(input, entityName, schema, entities, relationships, startingSchema)
  return {entities, relationships}
}

const noopModifier = (ent)=>ent;

const defaultIdFunc = (ent)=>ent.id

const _normalizeRecursive = function (preinput: Object, entityName: string, schema: $schema, entities: $entities, relationshipData: $relationships, startingSchema?: $entitySchema) {
  const entitySchema = (startingSchema || schema[entityName])
  if (!entitySchema){
    throw Error(`schema ${entityName} not defined`)
  }
  const {premodifier = noopModifier, modifier = noopModifier, relationships, idFunc = defaultIdFunc} = entitySchema
  const input = premodifier(preinput);
  const inputId = idFunc(input)
  const finalEntityName = entitySchema.nameFunc ? entitySchema.nameFunc(preinput) : entityName
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
          _addToRelationships(relationshipData, finalEntityName, name, inputId, relationshipIds)
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
          _addToRelationships(relationshipData, finalEntityName, name, inputId, relationshipId)
        }
      }
    })
  }
  _addToEntities(entities, finalEntityName, input, modifier, inputId)
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
  entities[entityName][id] = modifier({ ...entity, id})
}
