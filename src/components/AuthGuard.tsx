import { FC, ReactElement, useState } from 'react';
import { useMount } from 'react-use';
import qs from 'qs';

import { getJWT, redirectToLoginPage, setJWT, Tokens } from '@/utils/auth';
import instance from '@/utils/instance';
import useLog from '@/utils/useLog';

interface Props {
	children: ReactElement;
}

const AuthGuard: FC<Props> = ({ children }) => {
	const [authState, setAuthState] = useState<'pending' | 'success'>('pending');
	const log = useLog('AuthGuard');

	useMount(() => {
		(async () => {
			if (location.search !== '') {
				log('Discord callback code detected, initializing login');
				const code = qs.parse(location.search.slice(1)).code;

				// Remove query string from current URL
				window.history.replaceState(null, '', location.pathname);

				if (typeof code === 'string') {
					const loginResponse = await instance.post<Tokens>(
						'/auth/login',
						{ code },
						{
							skipAuth: true,
						},
					);

					setJWT(loginResponse.data);
					setAuthState('success');
					return;
				}
			}

			if (getJWT()) {
				setAuthState('success');
				return;
			}

			log('JWT missing in local storage, redirecting to login page');

			redirectToLoginPage();
		})().catch((e) => {
			console.error(e);
		});
	});

	if (authState !== 'success') {
		return null;
	}

	return children;
};

export default AuthGuard;
