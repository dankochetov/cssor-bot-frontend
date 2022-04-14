import instance from './instance';

export interface Tokens {
	idToken: string;
	refreshToken: string;
	expiresAt: number;
}

const TOKENS_LOCAL_STORAGE_ITEM_NAME = 'tokens';

export class RedirectToLoginPageError extends Error {
	constructor() {
		super('Redirect to login page');
	}
}

export function redirectToLoginPage(): never {
	console.trace('redirectToLoginPage()');
	location.href = `https://discord.com/api/oauth2/authorize?client_id=${
		import.meta.env.VITE_APP_DISCORD_OAUTH_CLIENT_ID
	}&redirect_uri=${encodeURIComponent(
		import.meta.env.VITE_APP_DISCORD_OAUTH_REDIRECT_URL,
	)}&response_type=code&scope=${encodeURIComponent(
		import.meta.env.VITE_APP_DISCORD_OAUTH_SCOPES,
	)}`;

	// This will never be reached, just required for "never" type to work
	throw new RedirectToLoginPageError();
}

export function getJWT(): Tokens | undefined {
	try {
		const item = localStorage.getItem(TOKENS_LOCAL_STORAGE_ITEM_NAME);
		if (!item) {
			return undefined;
		}
		return JSON.parse(item);
	} catch (e) {
		return undefined;
	}
}

export function setJWT(tokens: Tokens) {
	localStorage.setItem(TOKENS_LOCAL_STORAGE_ITEM_NAME, JSON.stringify(tokens));
}

export function removeJWT() {
	localStorage.removeItem(TOKENS_LOCAL_STORAGE_ITEM_NAME);
}

let refreshTokenPromise: Promise<Tokens> | undefined;

export async function refreshToken(): Promise<Tokens> {
	// Only allow one token refresh at a time
	if (refreshTokenPromise) {
		return refreshTokenPromise;
	}

	refreshTokenPromise = new Promise((resolve, reject) => {
		(async () => {
			console.trace('refreshToken');

			let tokens = getJWT();

			if (!tokens) {
				redirectToLoginPage();
			}

			const refreshTokensResponse = await instance
				.post<Tokens>('/auth/refresh-token', undefined, {
					headers: {
						Authorization: `Bearer ${tokens.refreshToken}`,
					},
				})
				.catch((e) => {
					removeJWT();
					console.error(e);
					redirectToLoginPage();
				});

			tokens = refreshTokensResponse.data;

			setJWT(tokens);

			resolve(tokens);
			refreshTokenPromise = undefined;
		})().catch((e) => {
			reject(e);
		});
	});

	return refreshTokenPromise;
}
