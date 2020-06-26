import ActionTypes from './ActionTypes'
import adapterService from '../../adapterService/adapterService'
//import AlertActionTypes from '../../components/customAlert/ActionTypes'

const filesPrefix = '/files/files/'

export async function request(dispatch, file) {
	let uri = file;
	// Check if uri has /files/files/ alraady
	if (! file.includes(filesPrefix)) {
		uri = filesPrefix + file;
	}

	try {
		// let res = await adapterService.getFileContent(dispatch, uri, {
		// 	cacheBust: true
		// });
		let res = await adapterService.getFileContent(dispatch, uri);
		res.body.lastModified = res.headers['last-modified'] || res.headers.get('Last-Modified');
		dispatch({
			type: ActionTypes.FETCH_SINGLE_PROJECT,
			payload: res.body
		})
	} catch (e) {
		console.log("SINGLE PROJECT ERROR: ", e);
	}
}

export async function fetchSingleProject(dispatch, file, dirty) {

	if (dirty) {
		console.log('DIRTY')
		// dispatch({
		// 	type: AlertActionTypes.OPEN_CONFIRMATION,
		// 	payload: {
		// 		open: true,
		// 		message: "You have not saved changes made to this project, opening a new one will override these changes, do you wish to procced?",
		// 		action: () => request(dispatch, file)
		// 	}
		// })
	} else {
		request(dispatch, file)
	}
}

export function selectProject(dispatch, payload) {
	dispatch({
		type: ActionTypes.SELECT_PROJECT,
		payload
	})
}

export function updateProject(dispatch, newProject) {
	dispatch({
				type: ActionTypes.UPDATE_PROJECT,
				payload: newProject
	})
}

export async function updateFile(dispatch, uri, blob, lastModified) {
	const res = await adapterService.updateFile(dispatch, uri, blob, lastModified);
	return res
}

export function saveChanges(dispatch,result) {
	debugger
		dispatch({
				type: ActionTypes.CHANGES_SAVED,
				payload: result
			})

}