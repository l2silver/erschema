// @flow
import Chance from 'chance'
import normalize, {validateSchema, relationshipTypes} from './index'

const chance = new Chance()
describe('reducerUtils', function () {
  describe('validateSchema', function(){
    let friendsRelationship
    let schema
    beforeEach(()=>{
      friendsRelationship = {

      }
      schema = {
        users: {
          relationships: [
            friendsRelationship
          ]
        }
      }
    })
    it('fails without entityName', function(){
      expect(()=>validateSchema(schema)).toThrowError('users entitySchema is missing a relationship entityName for the relationship Undefined')
    })
    it('fails without type', function(){
      friendsRelationship.entityName = 'users'
      expect(()=>validateSchema(schema)).toThrowError('users entitySchema is missing a relationship type for the relationship users')
    })
    it('passes', function(){
      friendsRelationship.entityName = 'users'
      friendsRelationship.type = 1
      expect(validateSchema(schema)).toEqual('valid')
    })
  })
  describe('normalize', function () {
    let input, schema, relationshipSchema, comment
    beforeEach(function () {
      comment = {
        id: chance.natural(),
        content: chance.sentence()
      }
      input = {
        id: 1,
        title: chance.word(),
        comments: [
          comment
        ]
      }
      
      schema = {
        articles: {
          relationships: [
            {
              entityName: 'comments',
              type: relationshipTypes.MANY,
            }
          ],
        },
        comments: {},
      };
    })
    it('returns entities and relationships based on the input', function () {
      const {entities, relationships} = normalize(input, 'articles', schema)
      expect(entities).toEqual({
        articles: {
          [input.id]: {
            id: input.id,
            title: input.title,
            comments: input.comments,
          }
        },
        comments: {
          [comment.id]: comment
        }
      })
      expect(relationships).toEqual({
        articles: {
          comments: {
            [input.id]: [comment.id]
          }
        }
      })
    })
  })
})
