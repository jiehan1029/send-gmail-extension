import React from "react";
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import classNames from 'classnames';
import styles from './Popup.module.scss';

export function Popup (props){
	return(
		<div
			style={{
				display: props.show ? 'block' : 'none',
				left: props.leftOffset + 'px',
				bottom: props.bottomOffset + 'px'
			}}
			className={classNames(styles.wrapper)}
		>
			<Button color="btn-secondary" onClick={props.onClickSend}>Send Now</Button>
		</div>
	)
}

export default Popup;