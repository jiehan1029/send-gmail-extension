/*global chrome*/

import React, { Component } from "react";
import Popup from './components/Popup';
import gmailJS from 'gmail-js';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const Gmail = gmailJS.Gmail();

export class App extends Component {
	static propTypes = {

	}
	constructor(props){
		super(props);
		this.state = {
			showPopup: false,
			leftOffset: 0
		}
	}
	componentDidMount(){
		Gmail.observe.on('compose', this.onOpenComposeWindow);
		window.addEventListener('resize', this.calcLeftOffset);
	}
	onOpenComposeWindow = (params)=>{
		// hide the original send buttons
		let sendButtons = Gmail.dom.compose(params.$el).dom('send_button');
		sendButtons[0].parentNode.style.display = 'None';

		// insert new compose button
		const compose_ref = Gmail.dom.compose(params.$el);
		let btnHTML = '<button>Smart Send</button>';
		let btnCls = 'smart-send-btn';
		Gmail.tools.add_compose_button(compose_ref, btnHTML, ()=>this.togglePopup(), btnCls);
	}
	togglePopup = (setTo=!this.state.showPopup)=>{
		this.calcLeftOffset();
		let popupScheduleBtn = document.querySelector('div[selector="scheduledSend"]');
		let elem = popupScheduleBtn.parentNode.parentNode;
		elem.style.width = '160px';
  	elem.style.height = '45px';
  	elem.style.bottom = '40px';
		if(setTo){
			elem.style.display = 'block';
			this.setState({showPopup: true});
		}
		else{
			elem.style.display = 'None';
			this.setState({showPopup: false});
		}
	}
  onClickSend = ()=>{
  	this.togglePopup(false);
  	// find send button
  	let currComposeBtnElement = Gmail.dom.composes()[0].$el;
  	let sendButtons = Gmail.dom.compose(currComposeBtnElement).dom('send_button');
  	let sendButton = sendButtons[0];
  	sendButton.click();
  }
	calcLeftOffset = ()=>{
		// calculate left offset to left edge of compose window
		let composeObj = Gmail.dom.composes()[0];
		if(composeObj){
			// let temp = Gmail.dom.compose(composeObj.$el).$el;
			let bodyElem = composeObj.$el[0].querySelector('table');
			if(bodyElem){
				const rect = bodyElem.getBoundingClientRect();
				// 16px padding around the compose table
				this.setState({
					leftOffset: (rect.left-16)
				});
			}
		}
	}  
  render(){
	  return (
	    <Popup
	    	show={this.state.showPopup}
	    	onClickSend={this.onClickSend}
	    	leftOffset={this.state.leftOffset}
	    />
	  )
	}
}

export default App;