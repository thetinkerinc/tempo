/// <reference types="svelte-clerk/env" />

import type { Local } from '@thetinkerinc/isolocal';

import * as remote from '$remote/entry.remote';

declare global {
	type EnhanceParams<T> = Parameters<Parameters<T>[0]>[0];
	type AddEntryEnhanceParams = EnhanceParams<typeof remote.addEntry.enhance>;
	type UpdateEntryEnhanceParams = EnhanceParams<typeof remote.updateEntry.enhance>;
	type DeleteEntryEnhanceParams = EnhanceParams<typeof remote.deleteEntry.enhance>;

	namespace App {
		interface Platform {
			env: Env;
			cf: CfProperties;
			ctx: ExecutionContext;
		}
		interface Locals {
			localStorage: Local & {
				sessionStarted?: number;
				sessionPauses: number[];
			};
		}
	}
}

export {};
