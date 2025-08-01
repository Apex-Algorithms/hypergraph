# Schema

The Hypergraph schema allows you to define the data model for your application. It is based on the GRC-20 specification and allows you to define Types with properties and relations to other Types.

## Example

Here is an example of a schema for an Event app with the properties `name` and `description`.

```ts
import { Entity, Type } from '@graphprotocol/hypergraph';

export class Event extends Entity.Class<Event>('Event')({
  name: Type.String,
  description: Type.String,
}) {}
```

## Relations

In order to define relations between Types, you can use the `Type.Relation` type.

```ts
import { Entity, Type } from '@graphprotocol/hypergraph';

export class Company extends Entity.Class<Company>('Company')({
  name: Type.String,
}) {}

export class Event extends Entity.Class<Event>('Event')({
  name: Type.String,
  description: Type.String,
  sponsors: Type.Relation(Company),
}) {}
```

## Available Types

- `Type.String` (string)
- `Type.Number` (number)
- `Type.Date` (date)
- `Type.Boolean` (boolean)
- `Type.Point` (serialized to a string with a comma separated list of numbers)
- `Type.Relation` (relation to another Type)

Example:

```ts
import { Entity, Type } from '@graphprotocol/hypergraph';

export class Company extends Entity.Class<Company>('Company')({
  name: Type.String,
  employees: Type.Number,
  founded: Type.Date,
  active: Type.Boolean,
  location: Type.Point,
}) {}
```

## Optional Fields

You can make a field optional by wrapping it in `Type.optional`.

```ts
import { Entity, Type } from '@graphprotocol/hypergraph';

export class Company extends Entity.Class<Company>('Company')({
  name: Type.String,
  description: Type.optional(Type.String),
  founded: Type.optional(Type.Date),
}) {}
```

## Schema Examples

You can search for dozens of schema/mapping examples on the [Hypergraph Schema Browser](https://schema-browser.vercel.app/).