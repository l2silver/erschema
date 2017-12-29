# erschema

[![Build Status](https://travis-ci.org/l2silver/erschema.svg?branch=master)](https://travis-ci.org/l2silver/erschema)

A normalizer that uses plain objects for schema definitions so that they can be reused with other libraries

## Setup

```npm i erschema```

## Usage

```
import normalize, {relationshipTypes} from 'erschema'

const users = {
  idFunc: (ent)=>ent.id,
  modifier: ({name, ...otherProps})=>({name})
  premodifier: (ent)=>({
    ...ent,
    closeFriends: ent.friends.filter(f=>f.name === 'Harry')
  }),
  relationships: [{
    entityName: 'users',
    name: 'friends',
    type: relationshipTypes.MANY,
  },{
    entityName: 'users',
    name: 'closeFriends',
    type: relationshipTypes.ONE,
  }]
}

const schema = {
  users,
}

const data = [{
  id: 1,
  name: 'Loyd',
  friends: [{
    id: 2,
    name: 'Harry'
  }]
}]

const {entities, relationships} = normalize(data, 'users', schema);
console.log(entities)
/*
{
  [1]: {
    name: 'Loyd'
  },
  [2]: {
    name: 'Harry'
  }
}
*/

console.log(relationships)
/*
{
 users: {
  friends: {
    [1]: [2],
  },
  closeFriends: {
    [1]: 2
  }
 }
}
```

## Why Another Normalizer?

I really liked the [normalizr](https://github.com/paularmstrong/normalizr) project by Dan Abramov and Paul Armstrong, but I felt like if I was going to all the trouble of creating a schema for my data, I'd like to be able to do as much as possible with the schema. I also wanted to extract the relationships from the entities into a completely separate structure.

For example:
* I could use the schema to easily construct the shape of the redux store
* I could listen for delete actions for a certain entityType, and know to search specific relationships for that id and scrub them

## Flowtype

type $ONE = 1;
type $MANY = 2;

type $relationships = Array<{
  entityName: string,
  name?: string,
  alias?: string,
  type: $ONE | $MANY
}>

type $schema = {
  modifier?: (ent)=>ent,
  premodifier?: (ent)=>ent,
  idFunc?: (ent)=>string|id,
  relationships: $relationships,
}

type $schemaName = string;

type $schemas = {[key: $schemaName]: $schema}

### premodifier
Runs right before a single entity is about to be processed.

* If you wanted to split an array of related entities into two separate relationships, you could run the premodifier to do so

### modifier
Runs right after an entity is processed

* Good for cleaning up and removing unneccessary object properties

### idFunc
Used to retrieve the id of an entity

* default is (ent)=>ent.id

### relationships
An array of relationshipSchemas used to build relationships

#### entityName
The entityName of the related entity. This is the only required field.

#### name
The name of the relationship. For example, friends is the name of the relationship above, but the entityName of the relationship is users

#### alias
When a relationship is stored as a different property.

#### type
Is the relationship ONE-TO-ONE or ONE-TO-MANY

## In production

I currently use derivatives of this approach for a number of my professional and side projects. My own specific versions are quite sophisticated, usually involving actions, selectors, and reducers, and are heavily alloyed with immutablejs, but feel free to design your own system.
