import { useCallback, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components/macro';

import SongControls from './SongControls';
import Colors from '../schema/colors';
import Queue from './Queue';
import Header from './Header';
import Routes from '@/components/Routes';
import GlobalWebSocketsListener from '@/components/ws-listeners/GlobalWebSocketsListener';
import AuthGuard from '@/components/AuthGuard';

function App() {
	const [isQueueShown, setQueueShown] = useState(true);

	const toggleQueue = useCallback(() => {
		setQueueShown((v) => !v);
	}, [setQueueShown]);

	const hideQueue = useCallback(() => {
		setQueueShown(false);
	}, [setQueueShown]);

	return (
		<AuthGuard>
			<Root>
				<GlobalWebSocketsListener />
				<GlobalStyle />
				<Top>
					<Header />
					<Middle>
						<Routes />
						{isQueueShown && (
							<Queue isShown={isQueueShown} hideQueue={hideQueue} />
						)}
					</Middle>
				</Top>
				<SongControls toggleQueue={toggleQueue} isQueueShown={isQueueShown} />
			</Root>
		</AuthGuard>
	);
}

export default App;

const Root = styled.div`
	height: 100%;
	display: flex;
	flex-flow: column nowrap;
	max-width: 1920px;
	position: relative;
	margin: 0 auto;
`;

const Top = styled.div`
	display: flex;
	flex: 1;
	flex-flow: column nowrap;
`;

const Middle = styled.div`
	display: flex;
	flex-flow: row nowrap;
	flex: 1;
`;

const GlobalStyle = createGlobalStyle`
	* {
		box-sizing: border-box;
	}
	
	body {
		height: 100vh;
		background: ${Colors.backgroundDark};
		font-family: Rubik, sans-serif;
		color: ${Colors.font};
		overflow: hidden;
		margin: 0;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	
	a {
		text-decoration: none;
		color: ${Colors.font};
	}

	code {
		font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
		monospace;
	}
	
	h1 {
		font-size: 30px;
		font-weight: 600;
		margin: 0;
	}
	
	h2 {
		font-size: 22px;
		font-weight: 400;
		margin: 0;
	}

	#root {
		height: 100%;
	}

	.material-icons {
		font-family: 'Material Icons';
		font-weight: normal;
		font-style: normal;
		font-size: 24px;  /* Preferred icon size */
		display: inline-block;
		line-height: 1;
		text-transform: none;
		letter-spacing: normal;
		word-wrap: normal;
		white-space: nowrap;
		direction: ltr;

		/* Support for all WebKit browsers. */
		-webkit-font-smoothing: antialiased;
		/* Support for Safari and Chrome. */
		text-rendering: optimizeLegibility;

		/* Support for Firefox. */
		-moz-osx-font-smoothing: grayscale;

		/* Support for IE. */
		font-feature-settings: 'liga';
	}
`;
