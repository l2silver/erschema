// @flow
import type {$standardizeEntity} from './standardizeEntity'
import type {$schema} from '../types'
export default function schemaMapper(schemas: $standardizeEntity[]) : $schema {
  return schemas.reduce((finalResult, schema)=>{
    finalResult[schema.name] = schema
    return finalResult
  }, {})
}