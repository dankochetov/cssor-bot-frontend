interface ImportMetaEnv extends Readonly<Record<string, string>> {
	readonly VITE_APP_HTTP_API_HOST: string;
	readonly VITE_APP_WS_API_HOST: string;
	readonly VITE_APP_DISCORD_OAUTH_CLIENT_ID: string;
	readonly VITE_APP_DISCORD_OAUTH_SCOPES: string;
	readonly VITE_APP_DISCORD_OAUTH_REDIRECT_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
