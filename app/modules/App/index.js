const shouldRouteContinue = ({ state, output, services }) => {
	if (state.get('reverting')) {
		console.log('reverted');
		state.unset('reverting');
		output.reverted();
		return;
	}
	if (!services.app.isRouteAllowed(state.get)) {
		console.log('denied');
		output.denied();
		return;
	}
	console.log('allowed');
	output.allowed();
}

const storeRoute = ({ services, state }) => {
	const route = services.router.getMatchedRoute();
	state.set('routing', route);
}
const unsetDenialMessage = ({ state }) => {
	state.unset('error');
}
const setDenialMessage = ({ state }) => {
	state.set('error', 'Empty the form before trying to route');
}

/*
not sure why the two following actions won't work
somehow the input gets all kinds of fucked up.
If anyone can figure this out, please tell me.

const revertToPreviousRoute = [
	mergeInputToCurrentRoute,
	({ input, state }) => {
		console.log('input', input);
	}
]
*/

const revertToPreviousRoute = [
	// set a reverting flag so we won't infinitely loop
	({ state }) => {
		state.set('reverting', true);
	},
	// actually do the redirection
	({ state, services }) => {
		const previousRoute = state.get('routing');
		const url = services.router.getSignalUrl(previousRoute.signal, previousRoute.params || {});
		services.router.redirect(url, { replace: true });
	}
]

const defaultRouteHandling = [
	shouldRouteContinue, {
		reverted: [
		],
		allowed: [
			unsetDenialMessage,
			storeRoute,
		],
		denied: [
			setDenialMessage,
			...revertToPreviousRoute
		]
	}
]

/* route handling */
const homeOpened = [
	...defaultRouteHandling
];
const fooOpened = [
	...defaultRouteHandling
];
const fooItemOpened = [
	...defaultRouteHandling
];
const routeNotFound = [
	...defaultRouteHandling
]

/* modal handling */
const outputModal = ({ input, output }) => {
	const { modal } = input;
	output({ nextRoute: { params: { modal } } });
}
const mergeInputToCurrentRoute = ({ input, state, output }) => {
	const nextRoute = input.nextRoute || {};
	const nextParams = nextRoute.params || {};
	const currentRoute = state.get('routing');
	const route = {
		signal: nextRoute.signal || currentRoute.signal,
		params: { ...currentRoute.params, ...nextParams }
	}
	output({ nextRoute: route });
}
const redirectToSignalUsingInput = ({ input, services }) => {
	const { nextRoute: { signal, params } } = input;
	services.router.redirectToSignal(signal, { ...params });
}
const modalRequested = [
	outputModal,
	mergeInputToCurrentRoute,
	redirectToSignalUsingInput,
]
const modalDismissed = [
	outputModal,
	mergeInputToCurrentRoute,
	redirectToSignalUsingInput,
]

/* more modal handling */
const ensureFormNotDirty = (get) => {
	return !get('form');
}

const modalLoaded = [
	({ services }) => {
		services.app.addRouteCheck(ensureFormNotDirty);
	}
]
const modalUnloaded = [
	({ services }) => {
		services.app.removeRouteCheck(ensureFormNotDirty);
	}
]

/* form handling */
const setFieldValue = ({ input, state }) => {
	const { value } = input;
	state.set('form', value);
}
const fieldChanged = [
	setFieldValue,
]

export default () => {
	return (module, controller) => {

		module.addServices({
			isRouteAllowed,
			addRouteCheck,
			removeRouteCheck,
		});

		module.addSignals({
			// route signals
			homeOpened,
			fooOpened,
			fooItemOpened,
			routeNotFound,

			// handle modal signals
			modalRequested,
			modalDismissed,
			modalLoaded,
			modalUnloaded,

			// handle form signal
			fieldChanged
		});
	}
}

// bucket to hold our callbacks
const _routeChecks = [];
// services for handling routes
const isRouteAllowed = (get) => {
	return _routeChecks.every((callback) => {
		return callback(get);
	})
}
const addRouteCheck = (callback) => {
	if (_routeChecks.indexOf(callback) === -1) {
		_routeChecks.push(callback);
	}
}
const removeRouteCheck = (callback) => {
	const index = _routeChecks.indexOf(callback);
	if (index !== -1) {
		_routeChecks.splice(index, 1);
	}
}

