import React, { Component } from 'react';
import { Decorator as Cerebral, Link } from 'cerebral-view-react';

@Cerebral({})
class OpenModalButton extends Component {
	render() {
		const { modal, value } = this.props;
		return (
			<button onClick={ (event) => { this.props.signals.app.modalRequested({ modal }) } }>{ value }</button>
		);
	}
}

@Cerebral({})
class CloseModalButton extends Component {
	render() {
		const { value } = this.props;
		return (
			<button onClick={ (event) => { this.props.signals.app.modalDismissed() } }>{ value || "Close" }</button>
		);
	}
}

@Cerebral({
	error: "error",
	form: "form",
	routing: "routing"
})
export default class App extends Component {
	render() {
		const { form, routing } = this.props;
		return (
			<div>
				<h1>A POC for Cerebral Routing</h1>
				<ul>
					<li><Link signal="app.homeOpened">Home</Link></li>
					<li><Link signal="app.fooOpened">Foo</Link></li>
					<li><Link signal="app.fooItemOpened" params={{ item: "foo item" }}>Foo with item</Link></li>
				</ul>
				<div style={{ border: "1px solid black" }}>
					<h2>I'm the content area</h2>
					{ this.renderView(routing) }
				</div>

				{ this.renderModal(routing) }
			</div>
		);
	}
	renderView(routing) {
		const { signal, params } = routing;
		switch (signal) {
			case "app.homeOpened":
				return (<div>This is the home view <OpenModalButton value="Open Modal" modal="DefaultModal"/></div>);
			case "app.fooOpened":
			case "app.fooItemOpened":
				const item = params.item || "(No item selected)";
				return (<div>This is the foo view with: { item } <OpenModalButton value="Open Modal" modal="DefaultModal"/></div>);
			default:
				return (<div>This is a broken route</div>);
		}
	}
	renderError(error) {
		if (!error) {
			return null;
		}
		return (
			<div style={{ background: "#fc9" }}>
				{ error }
			</div>
		)
	}
	renderModal(routing) {
		const { params: { modal }, signal } = routing;
		if (!modal) {
			this.props.signals.app.modalUnloaded();
			return null;
		}
		const { form, error } = this.props;
		const value = form || '';
		this.props.signals.app.modalLoaded();
		return (
/*		<div style={{ backgroundColor: "rgba(0, 0, 0, .2)", position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}> */
				<div style={{ backgroundColor: "#fff", border: "1px solid #000", position: "absolute", top: "25%", left: "25%", width: "50%", padding: "3em" }}>
					<h2>This is a modal window</h2>
					{ this.renderError(error) }
					<CloseModalButton/>
					<p>
						<label>
							If this field is not empty, routing will be disabled
							<input type="text" value={ value }
								onChange={ (event) => {
									this.props.signals.app.fieldChanged({ value: event.target.value }, { immediate: true })
								} }/>
						</label>
					</p>
				</div>
/*			</div> */
		)
	}
}

