import axios, { AxiosError } from 'axios';
import moment from 'moment';

import {
	getJWT,
	redirectToLoginPage,
	refreshToken,
	setJWT,
} from '@/utils/auth';

const instance = axios.create({
	baseURL: import.meta.env.VITE_APP_HTTP_API_HOST,
});

instance.interceptors.request.use(async (config) => {
	if (config.skipAuth || config.headers?.Authorization) return config;

	let tokens = getJWT();
	if (!tokens) {
		redirectToLoginPage();
	}

	if (moment.unix(tokens.expiresAt).isSameOrBefore()) {
		tokens = await refreshToken();
		setJWT(tokens);
	}

	config.headers = {
		...config.headers,
		Authorization: `Bearer ${tokens.idToken}`,
	};

	return config;
});

instance.interceptors.response.use(undefined, (e: AxiosError) => {
	if (e.response?.status === 401) {
		redirectToLoginPage();
	}
	throw e;
});

export default instance;
