/*global chrome*/

import React, { Component } from "react";
import gmailJS from 'gmail-js';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const Gmail = gmailJS.Gmail();

export class App extends Component {
	static propTypes = {

	}
	constructor(props){
		super(props);
		this.state = {}
	}
	componentDidMount(){
		Gmail.observe.on('compose', this.onOpenComposeWindow);
	}
	onOpenComposeWindow = (params)=>{
		// hide the original send buttons
		let sendButtons = Gmail.dom.compose(params.$el).dom('send_button');
		sendButtons[0].parentNode.style.display = 'None';

		// insert new compose button
		const compose_ref = Gmail.dom.compose(params.$el);
		let btnHTML = '<button>Smart Send</button>';
		let btnCls = 'smart-send-btn';
		Gmail.tools.add_compose_button(compose_ref, btnHTML, ()=>this.onClickSmartSend(), btnCls);
	}
	onClickSmartSend = ()=>{
		// find the target component by selector
		const slist = document.querySelectorAll('[selector]');
		let scheduleTarget;
		slist.forEach(e=>{
			if(e.attributes.selector.value == 'scheduledSend'){
				scheduleTarget = e.children[0];
			}
		});

		// click the target!
		// need to set mouse event properties to make it work
		const mousedown = new MouseEvent('mousedown', {bubbles: true, cancelable: true, view: window, composed: true});
		const mouseup = new MouseEvent('mouseup', {bubbles: true, cancelable: true, view: window, composed: true});
		// dispatch in sequence
		scheduleTarget.dispatchEvent(mousedown);
		scheduleTarget.dispatchEvent(mouseup);
		return;
	}
  render(){
	  return (<div/>)
	}
}

export default App;