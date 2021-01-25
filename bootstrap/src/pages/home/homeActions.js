import ActionTypes from './ActionTypes'
import {adapterConsts as constants} from '../../services/constants'
import adapterService from '../../adapterService/adapterService'

export function setTestState(dispatch, payload) {
	dispatch({
		type: ActionTypes.TEST,
		payload
	})
}

export function setMainSpinner(dispatch, payload) {
	dispatch({
		type: ActionTypes.MAIN_SPINNER,
		payload
	})
}

export async function getUserData(dispatch) {
	const userDataApi = constants.USER_INDENTITIES

	// *** Using Promise ***
	// adapterService.managedRequest(dispatch, 'get', userDataApi, {})
	// 	.then(res => {
	// 		debugger
	// 		console.log('getUserData-then', res)
	// 		//TODO Dispatch data
	// 	})
	// 	.catch(e => {
	// 		console.log('getUserData-catch', e)
	// 		//TODO return error
	// 	})

	// *** Using async await ***
	try {
		const userData = await adapterService.managedRequest(dispatch, 'get', userDataApi, {})
		let payload = userData.body
		const userAvatar = adapterService._adapter.hostUrl + constants.USER_AVATAR;
		payload.userAvatar = userAvatar;
		setUserData(dispatch, payload)
	} catch (e) {
		console.log('error', e)
	}
}

export function setUserData(dispatch, payload) {
	dispatch({
		type: ActionTypes.SET_USER_DATA,
		payload
	})
}

export async function dummyCall(dispatch, options) {
	try {
		let callData = await adapterService.managedRequest(dispatch, 'post', '/SASJobExecution/', null, options)
		if (typeof callData === 'string') {
			callData = callData.body;
		}
		console.log('dummycall-then', callData)
	} catch (e) {
		console.log('dummycall-catch', e)
	}
}

export function setGlobalData(dispatch, data) {
	dispatch({
		type: ActionTypes.SET_GLOBAL_DATA,
		payload: data
	})
}

export function setQuestionData(dispatch, data) {
	dispatch({
		type: ActionTypes.SET_QUESTION_DATA,
		payload: data
	})
}
export function setLanguage(dispatch, data) {
	dispatch({
		type: ActionTypes.SET_LANGUAGE,
		payload: data
	})
}


