import ActionTypes from './ActionTypes'
import {adapterConsts as constants} from '../../services/constants'
import adapterService from '../../adapterService/adapterService'
import config from '../../adapterService/config'

const sasVersionGetUserDetailsFunctions = {
	'viya': getViyaUsetData,
	'v9': getV9UserData
}

export function setTestState(dispatch, payload) {
	dispatch({
		type: ActionTypes.TEST,
		payload
	})
}

export function setWelcomeMessage(dispatch, isActive) {
	dispatch({
		type: ActionTypes.SHOW_WELCOME_MESSAGE,
		isActive
	})
}

async function getViyaUsetData(dispatch, method, userDataApi) {
	const response = await adapterService.managedRequest(dispatch, 'get', userDataApi)
		let payload = response.body
		const userAvatar = adapterService._adapter.hostUrl + constants.USER_AVATAR;
		payload.userAvatar = userAvatar;
		return payload;
}

async function getV9UserData(dispatch, method, userDataApi) {
	 const res = await adapterService.call(dispatch, userDataApi, null);
		return res
}


export async function getUserData(dispatch) {
	const userDataApi = config.sasVersion === 'v9' ? constants.STARTUP_SERVICE : constants.USER_INDENTITIES

	const fn = sasVersionGetUserDetailsFunctions[config.sasVersion || 'v9']

	try {
		const payload = await fn(dispatch, 'get', userDataApi)
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
		let callData = await adapterService.managedRequest(dispatch, null, '/DummyCall/', options)
		if (typeof callData === 'string') {
			callData = JSON.parse(callData);
		}
		console.log('ManagedRequest', callData)
	} catch (e) {
		console.log('dummycall-catch', e)
	}
}
