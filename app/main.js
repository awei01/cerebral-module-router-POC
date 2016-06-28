import React from 'react';
import ReactDOM from 'react-dom';
import { Container } from 'cerebral-view-react';
import Controller from 'cerebral';
import Model from 'cerebral-model-baobab';
import Devtools from 'cerebral-module-devtools';
import Router from 'cerebral-module-router';

import AppModule from './modules/App';
import App from './components/App';

// instantiate controller and set model layer
const controller = Controller(Model({}));
controller.addModules({
	devtools: Devtools(),
	app: AppModule(),
	router: Router({
		"/": "app.homeOpened",
		"/foo": "app.fooOpened",
		"/foo/:item": "app.fooItemOpened",
		"/*": "app.routeNotFound",
	}, { mapper: { query: true } }),
});

ReactDOM.render(
	(
		<Container controller={ controller }>
			<App/>
		</Container>
	),
	document.getElementById('root')
);
