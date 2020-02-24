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
		Gmail.tools.add_compose_button(compose_ref, btnHTML, ()=>this.onClickSmartSend(compose_ref, false, true), btnCls);
	}
	onClickSmartSend = (compose_ref, forceSchedule=false, autoSend=false)=>{
		// if within work hours, send directly
		let WH = [8, 18];
		let WorkHours = WH.map(t=>{
			let res = new Date().setHours(t,0,0,0);
			return res;
		});
		let now = new Date().getTime();
		// show schedule interface if outside work hours
		if(forceSchedule || now < WorkHours[0] || now > WorkHours[1]){
			let scheduleTargetParent = document.querySelectorAll('div[selector="scheduledSend"]')[0];
			let scheduleTarget;
			if(scheduleTargetParent){
				scheduleTarget = scheduleTargetParent.children[0];
			}

			if(!scheduleTarget){
				console.error('cannot find scheduleTarget');
				return;
			}

			// click the target!
			// need to set mouse event properties to make it work
			const mousedown = new MouseEvent('mousedown', {bubbles: true, cancelable: true, view: window, composed: true});
			const mouseup = new MouseEvent('mouseup', {bubbles: true, cancelable: true, view: window, composed: true});
			// dispatch in sequence
			scheduleTarget.dispatchEvent(mousedown);
			scheduleTarget.dispatchEvent(mouseup);

			function findMenu(){
				const alertModal = document.querySelectorAll('div[role="alertdialog"]')[0];
				if(alertModal){
					return 'alert';
				}

				// now find the schedule menu modal and make the selection
				const modals = document.querySelectorAll('div[role="dialog"]');
				let menu;
				modals.forEach(elem=>{
					if(elem.textContent.startsWith("Schedule")){
						menu = elem;
					}
				});
				return menu;
			}

			const checkExist = setInterval(()=>{
				let menu = findMenu();
				if(menu && typeof menu !== 'string'){
					clearInterval(checkExist);

					// auto send and hide popup (still will be a flash)
					if(autoSend){
						menu.style.display = 'none';
						// backdrop is the previous sibling
						menu.previousElementSibling.style.opacity = '0';
						// auto send by clicking the first menu item (tomorrow 8am)
						const timePickerDiv = menu.querySelectorAll('div[role="menu"]')[0];
						const menuItems = timePickerDiv.querySelectorAll('div[role="menuitem"]');
						menuItems[0].click();	
					}
					// not autosend, will show the popup with a send now button attached
					else{
						// add send now button to menu
						let sendNowBtn = document.createElement('button');
						sendNowBtn.innerText = 'Send Now';
						sendNowBtn.style.borderLeft = '0';
						sendNowBtn.style.borderRight = '0';
						sendNowBtn.addEventListener('click', ()=>{
							// send now
							let sendButtons = compose_ref.dom('send_button');
							sendButtons[0].click();
							// close menu modal
							let closeBtn = menu.querySelector('span[aria-label="Close"]');
							closeBtn.click();
						});
						menu.append(sendNowBtn);
					}
					return;
				}
				else if(typeof menu === 'string' && menu === 'alert'){
					clearInterval(checkExist);
					return;
				}
				else{
					// console.log("wait to find menu");
				}
			}, 100); // check every 100ms;

			checkExist();
			return;
		}
		// send directly
		else{
			let sendButtons = compose_ref.dom('send_button');
			sendButtons[0].click();
			return;
		}
	}
  render(){
	  return (<div/>)
	}
}

export default App;