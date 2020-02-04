import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './Popup.module.scss';

export function Popup (){
	// states


	// hooks


	// methods
	onClickSchedule = ()=>{
		console.log('onClickSchedule')



	}
	onClickSend = ()=>{
		console.log('onClickSend')



	}

	// returns
	return(
		<div>
			<header>Schedule to send in work hours?</header>
			<div className={styles.buttonGroup}>
				<button onClick={onClickSchedule}>Yes, schedule</button>
				<button onClick={onClickSend}>No, send now</button>
			</div>
		</div>
	)
}

export default Popup;