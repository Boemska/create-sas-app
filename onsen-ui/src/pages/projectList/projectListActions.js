import ActionTypes from './ActionTypes'
import adapterService from '../../adapterService/adapterService'
import ADAPTER_SETTINGS from '../../adapterService/config'
import {getSelfUriFromLinks} from '../../common/utils'

export async function fetchProjects(dispatch) {

	let url = "/folders/folders/@item?path=" + ADAPTER_SETTINGS.metadataRoot;
	try {
		let res = await adapterService.managedRequest(dispatch, 'get', url, {});
		const afiUrl = getSelfUriFromLinks(res.body)
		if (afiUrl !== '') {
			let url = afiUrl + "/members?filter=and(eq('contentType', 'file'),endsWith('name','" + '' + "'))&limit=10000";
			res = await adapterService.managedRequest(dispatch, 'get', url, {}, 'project list');
			dispatch({
				type: ActionTypes.FETCH_PROJECTS_RECIVED,
				payload: res.body.items
			})
		}
		return true
	} catch (e) {
		console.log("FETCH_PROJECTS_ERROR: ", e);
		return true
	}
}
