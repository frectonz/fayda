# Better Auth Fayda Plugin

Better Auth plugin for Fayda.

## Installation

You can install the plugin using `pnpm`, `npm`, or `yarn`.

```
pnpm add fayda
```

## Auth Configuration

To use the plugin, you need to add it to your `better-auth` plugin list. Ensure you set the `accountLinking` options to link the user's Fayda identity with their local account.

The `clientId` and `privateKey` should be loaded from your environment variables.

```ts
import { fayda } from 'fayda';
import { betterAuth } from 'better-auth';

export const auth = betterAuth({
	// ...
	plugins: [
		// ...
		await fayda({
			clientId: env.CLIENT_ID,
			privateKey: env.PRIVATE_KEY,
		})
	],
	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ['fayda']
		}
	}
});
```

### Redirect Configuration

**IMPORTANT**: The `clientId` you receive from Fayda must have its `redirectURL` configured to `<baseUrl>/api/auth/oauth2/callback/fayda` where `<baseUrl>` is the address of your application like `https://example.com`.

If you are using a development `clientId` and need to use a different `callbackUrl` (e.g., `http://localhost:3000/callback`), you will need to set up a redirector. This redirector will accept the request and forward it to the correct better-auth callback handler.

Below is a `SvelteKit` example of how to implement this redirect. In this example, if your `callbackURL` is `http://localhost:3000/callback`, you would place this code in `src/routes/callback/+page.server.ts`.

```ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (req) => {
	const originalUrl = new URL(req.url, `http://localhost:3000`);
	const target = new URL('http://localhost:3000/api/auth/oauth2/callback/fayda');
	target.search = originalUrl.search;

	redirect(302, target);
};
```

## Auth Configuration

Next, you need to add the generic OAuth client plugin to your client-side authentication configuration. This will enable the client to initiate the OAuth flow with the Fayda provider.

```ts
import { createAuthClient } from 'better-auth/svelte';
import { genericOAuthClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
	baseURL: 'http://localhost:3000',
	plugins: [genericOAuthClient()]
});
```

Once the client is configured, you can use the `signIn.oauth2` method to start the authentication flow.

```ts
authClient.signIn.oauth2({
	providerId: 'fayda',
});
```
