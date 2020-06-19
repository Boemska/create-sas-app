import ActionTypes from './ActionTypes'


export function showToast(dispatch, message,btnText,action) {
	dispatch({
		type: ActionTypes.SHOW_TOAST,
		payload :{
			message:message,
			isOpen:true,
			btnText:btnText,
			action:action
		}
	})
}

export function hideToast(dispatch) {
	dispatch({
		type: ActionTypes.HIDE_TOAST
	})
}