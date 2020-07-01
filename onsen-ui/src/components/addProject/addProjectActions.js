import adapterService from '../../adapterService/adapterService'
import ADAPTER_SETTINGS from '../../adapterService/config'
import {fetchProjects} from '../../pages/projectList/projectListActions';
import ActionTypes from './ActionTypes'
import {getSelfUriFromLinks} from '../../common/utils'
export const PROJECT_EXTENTION = ''; //TODO: SET FILE EXTENTION FOR YOUR TYPE OF FILE

export async function createNewProject(dispatch, projectName, projectObjc, override) {

    if (projectName === ''){
        dispatch({
            type: ActionTypes.SUBMIT_ERROR,
            payload: {
                error: true,
                message: "Please enter a name for the project",
                override: false
            }
        })

        return Promise.reject();
    }

    // if (JSON.parse(localStorage.getItem('save')) && !override){
		//
    //     dispatch({
    //         type: ActionTypes.SUBMIT_ERROR,
    //         payload: {
    //             error: true,
    //             message: "You have not saved changes made to this project, creating a new one will override these changes, do you wish to proceed?",
    //             override: true,
    //         }
    //     })
		//
    //     return Promise.reject();
		//
    // }

    try{
        const name = projectName + PROJECT_EXTENTION;

        //CREATE BLOB
        const project = JSON.stringify(projectObjc)
        let blob = new Blob([project], {type: "octet/stream"});

        //REST CALL
        const res = await adapterService.createNewFileToFolderPath(dispatch, name, blob, ADAPTER_SETTINGS.metadataRoot, {});

        console.log("CREATE PROJECT RESULT: ", res)

        if (res.status === 201) {
            // dispatch({
            //     type: ProjectActionTypes.OVERRIDE
            // })
            await fetchProjects(dispatch);
            const fullUri = getSelfUriFromLinks(res.body)
						const uri = fullUri.split("/").pop()
            return Promise.resolve(uri);
        }
    }
    catch(e){
        console.log("CREATE PROJECT ERROR: ", e)

        if (e.status === 409) {
            dispatch({
                type: ActionTypes.SUBMIT_ERROR,
                payload: {
                    error: true,
                    message: "A project with this name already exists",
                    override: false
                }
            })}


        // else {
        //     dispatch({
        //         type: ActionTypes.SUBMIT_ERROR,
        //         payload: {
        //             error: true,
        //             message: e.message,
        //             override: false
        //         }
        //     })
        }

        return Promise.reject();
    }
