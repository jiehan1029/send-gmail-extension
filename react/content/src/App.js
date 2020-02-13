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
			leftOffset: 0,
			bottomOffset: 90
		}
	}
	componentDidMount(){
		// bug to fix: event listener onscroll
		window.addEventListener('resize', this.onResize);
		Gmail.observe.on('compose', this.onOpenComposeWindow);
		Gmail.observe.on('compose_cancelled', ()=>{
			console.log('on compose_cancelled')
			this.togglePopup(false)
		});
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
		const { leftOffset, bottomOffset, type } = this.calcOffset();
  	let popupScheduleBtn = document.querySelector('div[selector="scheduledSend"]');
		let elem = popupScheduleBtn.parentNode.parentNode;
		this.moveScheduleBtn(elem, type, bottomOffset);
		if(setTo){
			elem.style.display = 'block';
			this.setState({
				showPopup: true,
				leftOffset: leftOffset,
				bottomOffset: bottomOffset
			});
		}
		else{
			elem.style.display = 'None';
			this.setState({
				showPopup: false,
				leftOffset: leftOffset,
				bottomOffset: bottomOffset
			});
		}
	}
	findComposeType = (composeElem)=>{
		let type = 'standalone';
		if(!composeElem){
			return;
		}
		// decide the type of the compose window by class
		let cls = composeElem.classList;
		if(cls.contains('inboxsdk__compose')){
			if(cls.contains('inboxsdk__compose_inlineReply')){
				type = 'inlineReply';
			}
			// else if(cls.contains('inboxsdk__size_fixer')){
			// 	type = 'popup';
			// }
		}
		return type;
	}
  onClickSend = ()=>{
  	this.togglePopup(false);
  	// find send button
  	let currComposeBtnElement = Gmail.dom.composes()[0].$el;
  	let sendButtons = Gmail.dom.compose(currComposeBtnElement).dom('send_button');
  	let sendButton = sendButtons[0];
  	sendButton.click();
  }
  onResize = ()=>{
  	let temp = this.calcOffset();
  	let popupScheduleBtn = document.querySelector('div[selector="scheduledSend"]');
		let elem = popupScheduleBtn.parentNode.parentNode;
		this.moveScheduleBtn(elem, temp.type, temp.bottomOffset);
  	this.setState({
  		leftOffset: temp.leftOffset,
  		bottomOffset: temp.bottomOffset
  	});
  }
  moveScheduleBtn = (elem, type='standalone', bottomOffset)=>{
		elem.style.width = '160px';
  	elem.style.height = '45px';
  	elem.style.top = 'auto';
  	elem.style.bottom = '40px';
  	// tweak position of schedule button
  	if(type === 'inlineReply'){
  		elem.style.left = '85px';
  		elem.style.bottom = (bottomOffset-70) + 'px';
  	}
  	else if(type === 'popup'){
  		elem.style.bottom = '70px';
  	}
  }
	calcOffset = ()=>{
		// maybe do something or tweak button position for fullscreen
		let fullScreenCompose = Gmail.check.should_compose_fullscreen();
		console.log('fullScreenCompose = ', fullScreenCompose);


		let bottomOffset = 90, leftOffset = 200;
		// calculate left offset to left edge of compose window
		// bug to fix: what if there is multiple compose boxes
		let composeObj = document.querySelector('div.inboxsdk__compose');
		let type = this.findComposeType(composeObj);
		if(composeObj){
			// let temp = Gmail.dom.compose(composeObj.$el).$el;
			let bodyElemList = composeObj.querySelectorAll('table');
			// can be multiple table for header, to, from, etc
			// the one(s) with large height is our target
			for(let i=0; i<bodyElemList.length; i++){
				const bodyElem = bodyElemList[i];
				const rect = bodyElem.getBoundingClientRect();
				// min reply area height is 85px (desktop)
				if(rect.height > 50){
					// 16px padding around the compose table
					bottomOffset = 90 + (window.innerHeight-rect.bottom);
					leftOffset = rect.left-16;
					if(type === 'inlineReply'){
						bottomOffset += 30;
						leftOffset += 85;
					}
					break;
				}
			}
		}
		return {
			leftOffset: leftOffset,
			bottomOffset: bottomOffset,
			type: type
		}
	}  
  render(){
	  return (
	    <Popup
	    	show={this.state.showPopup}
	    	onClickSend={this.onClickSend}
	    	leftOffset={this.state.leftOffset}
	    	bottomOffset={this.state.bottomOffset}
	    />
	  )
	}
}

export default App;