// @flow
import type {$standardizeEntity} from './standardizeEntity'
export type $schema = {[key: string]: $standardizeEntity}
export default function schemaMapper(schemas: $standardizeEntity[]) : $schema{
  return schemas.reduce((finalResult, schema)=>{
    finalResult[schema.name] = schema
    return finalResult
  }, {})
}