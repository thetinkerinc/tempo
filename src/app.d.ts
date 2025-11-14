/// <reference types="svelte-clerk/env" />

import type { Local } from '@thetinkerinc/isolocal';

import * as remote from '$remote/entry.remote';

declare global {
	type AddEntryEnhanceParams = Parameters<Parameters<typeof remote.addEntry.enhance>[0]>[0];
	type UpdateEntryEnhanceParams = Parameters<Parameters<typeof remote.updateEntry.enhance>[0]>[0];
	type DeleteEntryEnhanceParams = Parameters<Parameters<typeof remote.deleteEntry.enhance>[0]>[0];

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
