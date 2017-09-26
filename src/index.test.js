// @flow
import Chance from 'chance'
import normalize, {relationshipTypes} from './index'

const chance = new Chance()
describe('reducerUtils', function () {
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
