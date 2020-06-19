import ActionTypes from './ActionTypes'

import * as adapterLogs from 'h54s/src/logs';

const initialState = {
	requests: new Map(),
	logs: adapterLogs.get.getAllLogs()
}

export function adapterReducer(state = initialState, action) {
	switch (action.type) {
		case ActionTypes.SET_REQUEST:
			const requests = new Map(state.requests.entries())
			const newLogs = adapterLogs.get.getAllLogs()
			const newParams = Object.assign({},requests.get(action.payload.promise), action.payload.params )
			requests.set(action.payload.promise, newParams)
			return Object.assign({}, state, {
				requests,
				logs: newLogs
			})
		case ActionTypes.REMOVE_REQUEST:
			const requestsToRemove = new Map(state.requests.entries())
			requestsToRemove.delete(action.payload)
			return Object.assign({}, state, {
				requests: requestsToRemove
			})
		default:
			return state
	}
}
