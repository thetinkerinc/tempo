/// <reference types="svelte-clerk/env" />

import type { Local } from '@thetinkerinc/isolocal';

import * as remote from '$routes/dashboard/data.remote';

declare global {
	type AddEntryEnhanceParams = Parameters<Parameters<typeof remote.addEntry.enhance>[0]>[0];

	namespace App {
		interface Locals {
			localStorage: Local & {
				sessionStarted?: number;
				sessionPauses: number[];
			};
		}
	}
}

export {};
