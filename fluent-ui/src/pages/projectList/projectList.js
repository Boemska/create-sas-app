import React from 'react'
import "./projectList.scss";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Stack, Separator,CommandButton,  Breadcrumb , DetailsList, FontIcon, SelectionMode, DetailsRow} from '@fluentui/react'
import {  fetchRootFolders, fetchFolderChildren, fetchFolderChildrenByUri, setBreadcrumbs,  updateBreadCrumb, resetBreadcrumbs } from './projectListActions'
import NewProject from '../../components/newProject/newProject'
import NewFolder from '../../components/newProject/newFolder'
import moment from 'moment'
import RenameFolder from '../../components/newProject/renameFolder';

const uploadMenuProps = {
  items: [
    {
      key: 'upload',
      text: 'Upload project',
      iconProps: { iconName: 'ChatBot' },
      onClick: ()=>{console.log("Upload project")}
    }
  ]
};

class ProjectList extends React.PureComponent {
  
  constructor(props){
    super(props);
    
    const columns = [
      {
        key: 'column0',
        name: 'File Type',
        className: 'fileIconCell',
        iconClassName: 'fileIconHeaderIcon',
        ariaLabel: 'Column operations for File type, Press to sort on File type',
        iconName: 'Page',
        isIconOnly: true,
        fieldName: 'name',
        minWidth: 16,
        maxWidth: 16,
        onRender: (item) => {
          const icon = this.getIconDependOnItemType(item);
          return <FontIcon iconName={icon} className={'fileIconImg'} />
        },
      },
      { 
        key: 'column1', 
        name: 'Name', 
        fieldName: 'name',
        minWidth: 210,
        maxWidth: 350, 
        isResizable: true, 
        data: 'string',
        isPadded: true,
        onRender: (item) => {
          return <span>{item.name}</span>;
        }
      },
      { 
        key: 'column2', 
        name: 'Modified', 
        fieldName: 'modified',  
        minWidth: 200,
        maxWidth: 230, 
        data: 'number',
        isResizable: true,
        onRender: (item) => {
          return <span>{moment(item.modifiedTimeStamp).format('DD-MM-YYYY HH:mm')}</span>;
        }
      },
      { key: 'column3', name: 'Modified By', fieldName: 'modifiedBy', minWidth: 200, maxWidth: 230, isResizable: true, data: 'string'}
    ];
    
    this.state={
      menuProps : {
        items: [
          {
            key: 'Project',
            text: 'Project',
            iconProps: { iconName: 'TextDocument' },
            onClick: ()=>{this.setState({isOpenNewProject:true})}
          },
          {
            key: 'Folder',
            text: 'Folder',
            iconProps: { iconName: 'OpenFolderHorizontal' },
            onClick: ()=>{this.setState({isOpenNewFolder:true})}
          }
        ]
      },
      metadataRoot: "/", //use it for creating a new project
      folderName: 'Files',
      isOpenRenameFolder: false,
      isOpenNewFolder: false,
      isOpenNewProject: false,
      breadCrumb : [{ text: 'Files', key: 'Files', onClick: ()=>{this.handleBcClick({id:'Files'})}}],
      columns: columns,
      items: []
    }
  }
  
  componentDidMount = () => {
    if (!this.props.folders.length) {
			this.props.fetchRootFolders();
    }
  }
  
  UNSAFE_componentWillUpdate(nextProps, nextState) {
    this.setState({items : nextProps.folders})
  }
  
  getIconDependOnItemType= (item) =>{
    switch(item.contentType){
      case 'file': return 'TextDocument'
      default: return 'OpenFolderHorizontal'
    }
  }
  
  renderRow= (props) => {
    const {item} = props;
    return <DetailsRow {...props} onClick={()=>this.handleRowClick(item)} />
  }

  generateMetadataRoot=(breadCrumb)=>{
    let metadataRoot='/';
    if(breadCrumb.length>1){
      breadCrumb.forEach((bc,index) => {
        if(index!==0){
          metadataRoot +=`${bc.text}/`
        }
      });
    }
    return metadataRoot;
  }

  handleRowClick= (item) => {
    if(item.contentType==='file'){
      let uri = item.uri.split('/').pop()
      this.props.history.push(`/project/${uri}`)
    }else {
      const breadcrumbs = this.props.breadcrumbs;
      let bc = { 
        text: item.name,
        key: item.id, 
        uri: item.uri? item.uri : null,
        onClick: () => {this.handleBcClick(item)}}
      if (breadcrumbs.length === 1) { // we are in root folder
        this.props.fetchFolderChildren(item.id);
      } else {
        this.props.fetchFolderChildrenByUri(item.uri);
      }
      this.props.setBreadcrumbs(this.props.breadcrumbs.concat(bc))
    }
  }

  handleBcClick= (item) => {
    const breadcrumbs = this.props.breadcrumbs;
    const index = breadcrumbs.findIndex((bc)=>bc.key === item.id)
    if(index===0){ //root
      this.props.fetchRootFolders()
    } else if (index === 1) { // we are in root folder
      this.props.fetchFolderChildren(item.id)
		} else {
      this.props.fetchFolderChildrenByUri(item.uri)
		}
		this.props.setBreadcrumbs(this.props.breadcrumbs.slice(0, index+1))
  }

  render(){
    const metadataPath = this.generateMetadataRoot(this.props.breadcrumbs);
    return (
      <div className={'align-center'}>
        <Stack>
          <Stack horizontal className={'projectListHeader'}>
            <CommandButton
              iconProps={ { iconName: 'Add' }}
              text="New"
              menuProps={this.state.menuProps}
            />
            <CommandButton
              iconProps={ { iconName: 'Upload' }}
              text="Upload"
              menuProps={uploadMenuProps}
            />
            <CommandButton
              iconProps={ { iconName: 'Edit' }}
              text="Rename folder"
              onClick={()=>this.setState({isOpenRenameFolder:true})}
            />
          </Stack>
          <Separator/>
          <Breadcrumb
            items={this.props.breadcrumbs}
            ariaLabel="With last item rendered as heading"
            overflowAriaLabel="More links"
          />
          <DetailsList
            items={this.props.folders}
            columns={this.state.columns}
            setKey="none"
            selectionMode={SelectionMode.none} //select row feature
            onRenderRow={this.renderRow}
          />
        </Stack>
        <NewProject isOpen={this.state.isOpenNewProject} metadataRoot={metadataPath} close={()=>this.setState({isOpenNewProject:false})}/>
        <NewFolder isOpen={this.state.isOpenNewFolder} metadataRoot={metadataPath} close={()=>this.setState({isOpenNewFolder:false})} 
           openFolder={(newFolder)=>this.handleRowClick(newFolder)} 
          />
        <RenameFolder isOpen={this.state.isOpenRenameFolder} folder={this.state.breadCrumb[this.state.breadCrumb.length-1]} close={()=>this.setState({isOpenRenameFolder:false})}/>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
	return {
    resetBreadcrumbs: ()=> resetBreadcrumbs(dispatch),
    updateBreadCrumb: (item) => updateBreadCrumb(dispatch, item),
    fetchRootFolders: () => fetchRootFolders(dispatch),
    fetchFolderChildren: (folderId) => fetchFolderChildren(dispatch, folderId),
    fetchFolderChildrenByUri: (uri) => fetchFolderChildrenByUri(dispatch, uri),
    setBreadcrumbs: bc =>  setBreadcrumbs(dispatch, bc),
	}
}

function mapStateToProps(store) {
	return {
     folders: store.projectList.folders,
     breadcrumbs: store.projectList.breadcrumbs
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectList));