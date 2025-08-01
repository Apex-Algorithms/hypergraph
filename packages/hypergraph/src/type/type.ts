import * as Schema from 'effect/Schema';
import { Field } from '../entity/entity.js';
import type { AnyNoContext, EntityWithRelation } from '../entity/types.js';

// biome-ignore lint/suspicious/noShadowRestrictedNames: is part of a namespaces module and therefor ok
export const String = Schema.String;
// biome-ignore lint/suspicious/noShadowRestrictedNames: is part of a namespaces module and therefor ok
export const Number = Schema.Number;
// biome-ignore lint/suspicious/noShadowRestrictedNames: is part of a namespaces module and therefor ok
export const Boolean = Schema.Boolean;
// biome-ignore lint/suspicious/noShadowRestrictedNames: is part of a namespaces module and therefor ok
export const Date = Schema.Date;
export const Point = Schema.transform(Schema.String, Schema.Array(Number), {
  strict: true,
  decode: (str: string) => {
    return str.split(',').map((n: string) => globalThis.Number(n));
  },
  encode: (points: readonly number[]) => points.join(','),
});

export const optional = Schema.optional;

export const Relation = <S extends AnyNoContext>(schema: S) => {
  const relationSchema = Field({
    select: Schema.Array(schema) as unknown as Schema.Schema<ReadonlyArray<EntityWithRelation<S>>>,
    insert: Schema.optional(Schema.Array(Schema.String)),
    update: Schema.Undefined,
  });
  return relationSchema;
};
