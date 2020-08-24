import adapterService from '../../adapterService/adapterService'
import ADAPTER_SETTINGS from '../../adapterService/config'
//import ActionTypes from './ActionTypes';
import { fetchProjects } from '../../pages/projectList/projectListActions';
//import ProjectActionTypes from '../../pages/projectProperties/ActionTypes'
import {getSelfUriFromLinks} from '../utils'

export const PROJECT_EXTENTION = ''; //TODO: SET FILE EXTENTION FOR YOUR TYPE OF FILE

export async function createNewProject(dispatch, projectName, projectObjc, override, metadataRoot) {
    if (projectName === ''){
        // dispatch({
        //     type: ActionTypes.SUBMIT_ERROR,
        //     payload: {
        //         error: true,
        //         message: "Please enter a name for the project",
        //         override: false
        //     }
        // })
        return Promise.reject("Please enter a name for the project");
    }
    // if (JSON.parse(localStorage.getItem('save')) && !override){
    //     dispatch({
    //         type: ActionTypes.SUBMIT_ERROR,
    //         payload: {
    //             error: true,
    //             message: "You have not saved changes made to this project, creating a new one will override these changes, do you wish to proceed?",
    //             override: true,
    //         }
    //     })
    //     return Promise.reject();
    // }
    try{
        const name = projectName + PROJECT_EXTENTION;

        //CREATE BLOB
        const project = JSON.stringify(projectObjc)
        let blob = new Blob([project], {type: "octet/stream"});

        //REST CALL
        const res = await adapterService.createNewFileToFolderPath(dispatch, name, blob, metadataRoot, {});
        console.log("CREATE PROJECT RESULT: ", res)

        if (res.status === 201) {
            // dispatch({
            //     type: ProjectActionTypes.OVERRIDE
            // })
            const fullUri = getSelfUriFromLinks(res.body)
						const uri = fullUri.split("/").pop()
            return Promise.resolve(uri);
        }
    }
    catch(e){
        console.log("CREATE PROJECT ERROR: ", e)

        if (e.status === 409) {
            // dispatch({
            //     type: ActionTypes.SUBMIT_ERROR,
            //     payload: {
            //         error: true,
            //         message: "A project with this name already exists",
            //         override: false
            //     }
            // })
          return Promise.reject("A project with this name already exists.");
        }
        else {
            // dispatch({
            //     type: ActionTypes.SUBMIT_ERROR,
            //     payload: {
            //         error: true,
            //         message: e.message,
            //         override: false
            //     }
            // })
            return Promise.reject(e.message);
        }
    }
}
