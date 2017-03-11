// @flow
import type {$standardizeEntity} from './standardizeEntity'
import type {$schema, $entitySchema} from '../types'
export default function schemaMapper(schemas: $entitySchema[]) : $schema {
  return schemas.reduce((finalResult, schema)=>{
    finalResult[schema.name] = schema
    return finalResult
  }, {})
}