// @flow
import {decamelize} from 'humps'
import {createAction} from 'redux-actions'

const generateActionName = (name: string) => decamelize(name).toUpperCase()
export const actionifyName = generateActionName
export default {
  create: (name: string) => `CREATE_${generateActionName(name)}`,
  update: (name: string) => `UPDATE_${generateActionName(name)}`,
  remove: (name: string) => `REMOVE_${generateActionName(name)}`,
  get: (name: string) => `GET_${generateActionName(name)}`,
  index: (name: string) => `INDEX_${generateActionName(name)}`,
}