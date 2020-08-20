import adapterService from '../../adapterService/adapterService'
import ActionTypes from './ActionTypes'

export async function fetchRootFolders(dispatch) {
	let url = "/folders/folders?limit=10000&&filter=and(isNull(parent),in(type,'applicationDataFolder','folder','favoritesFolder','historyFolder','myFolder','userFolder','userRoot','trashFolder','hiddenFolder'))";
	try {
		let res = await adapterService.managedRequest(dispatch, 'get', url, {});
		dispatch({
			type: ActionTypes.FETCH_ROOT_FOLDERS,
			payload: res.body.items
		})
	} catch (error) {
		console.log("Fethc root folders error: ", error);
	}
}

export async function fetchFolderChildren(dispatch,folderId) {
	let url = "/folders/folders/" + folderId + "/members?filter=in(contentType,'applicationDataFolder','folder','favoritesFolder','historyFolder','myFolder','userFolder','userRoot','trashFolder','hiddenFolder')&limit=10000";
	try {
		let res = await adapterService.managedRequest(dispatch, 'get', url, {});
		dispatch({
			type: ActionTypes.FETCH_FOLDER_CHILDREN,
			payload: res.body.items
		})
	} catch (error) {
		console.log("Fetch folder's children error: ", error);
	}
}

export async function fetchFolderChildrenByUri(dispatch,uri) {
	//uri - folder/folder/ID
	let url =uri+"/members?filter=in(contentType,'applicationDataFolder','folder','favoritesFolder','historyFolder','myFolder','userFolder','userRoot','trashFolder','hiddenFolder')&limit=10000";
	try {
		let res = await adapterService.managedRequest(dispatch, 'get', url, {});
		dispatch({
			type: ActionTypes.FETCH_FOLDER_CHILDREN,
			payload: res.body.items
		})
	} catch (error) {
		console.log("Fetch folder's children by uri error: ", error);
	}
}

export async function leaveCurrentFolder(dispatch) {
  dispatch({
    type: ActionTypes.LEAVE_CURRENT_FOLDER
  })
}