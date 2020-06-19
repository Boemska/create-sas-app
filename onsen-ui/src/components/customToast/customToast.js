import {Toast} from 'react-onsenui'
import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import ActionTypes from './ActionTypes';
import {hideToast} from './customToastActions'

export const CustomToast = () => {

	const dispatch = useDispatch();
	const {
		isOpen,
		btnText,
		message,
		action
	} = useSelector(state => state.customToast);

	const handleDismiss=()=>{
		if(action){
			action()
		}
		hideToast(dispatch)
	}

	return <Toast isOpen={isOpen}>
		<div className="message">
			{message}
		</div>
			<button onClick={handleDismiss}>
				{btnText}
			</button>
	</Toast>

}