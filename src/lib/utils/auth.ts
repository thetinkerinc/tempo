import { error } from '@sveltejs/kit';
import { query, form, getRequestEvent } from '$app/server';
import * as _ from 'radashi';

import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { RemoteQueryFunction } from '@sveltejs/kit';

type InferOutput<T extends StandardSchemaV1> =
	T extends StandardSchemaV1<infer _Input, infer Output> ? Output : never;

function protectedQuery<TReturn>(
	schemaOrFn: (ctx: { userId: string }) => TReturn,
	fn?: undefined
): RemoteQueryFunction<void, TReturn>;
function protectedQuery<
	TSchema extends Parameters<typeof query>[0],
	TReturn,
	TParams = InferOutput<TSchema>
>(
	schemaOrFn: TSchema,
	fn?: (ctx: { userId: string; params: TParams }) => TReturn
): RemoteQueryFunction<TParams, TReturn>;
function protectedQuery<
	TSchema extends Parameters<typeof query>[0],
	TReturn,
	TParams = InferOutput<TSchema>
>(
	schemaOrFn: TSchema | ((ctx: { userId: string }) => TReturn),
	fn?: (ctx: { userId: string; params: TParams }) => TReturn
) {
	if (_.isFunction(schemaOrFn)) {
		return query(() => {
			const userId = protect();
			return schemaOrFn({ userId });
		});
	}
	if (fn == null) {
		throw new Error('query with a schema needs to define a handler function');
	}
	return query(schemaOrFn, (params) => {
		const userId = protect();
		return fn({ userId, params: params as TParams });
	});
}

function protectedForm<
	TSchema extends Parameters<typeof form>[0],
	TReturn,
	TData = InferOutput<TSchema>
>(schema: TSchema, fn: (args: { userId: string; data: TData }) => TReturn) {
	return form(schema, (data) => {
		const userId = protect();
		return fn({ userId, data: data as TData });
	});
}

function protect(): string {
	const event = getRequestEvent();
	const { userId } = event.locals.auth();
	if (!userId) {
		error(403, "You don't have permission to perform this action");
	}
	return userId;
}

export { protectedQuery, protectedForm };
