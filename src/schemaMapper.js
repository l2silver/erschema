// @flow
import type {$standardizeEntity} from './standardizeEntity'
export default function schemaMapper(schemas: $standardizeEntity[]){
  return schemas.reduce((finalResult, schema)=>{
    finalResult[schema.name] = schema
    return finalResult
  }, {})
}