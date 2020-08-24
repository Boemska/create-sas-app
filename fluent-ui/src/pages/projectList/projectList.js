import React from 'react'
import "./projectList.scss";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Stack, Separator,CommandButton,  Breadcrumb , DetailsList, FontIcon, SelectionMode, DetailsRow} from '@fluentui/react'
import {  fetchRootFolders, fetchFolderChildren, fetchFolderChildrenByUri } from './projectListActions'
import NewProject from '../../components/newProject/newProject'
import moment from 'moment'

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
            onClick: ()=>console.log("Add new folder")
          }
        ]
      },
      metadataRoot: "/", //use it for creating a new project
      isOpenNewProject: false,
      breadCrumb : [{ text: 'Files', key: 'Files', onClick: ()=>{this.handleBcClick({id:'Files'})}}],
      columns: columns,
      items: []
    }
  }
  
  componentDidMount = () => {
    this.props.fetchRootFolders();
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

  generateMetadataRoot=(folderName)=>{
    this.setState({metadataRoot : `${this.state.metadataRoot}/${folderName}`})
  }

  handleRowClick= (item) => {
    if(item.contentType==='file'){
      let uri = item.uri.split('/').pop()
      this.props.history.push(`/project/${uri}`)
    }else {
      const { breadCrumb } = this.state;
      let bc = { 
        text: item.name,
        key: item.id, 
        uri: item.uri? item.uri : null,
        onClick: () => {this.handleBcClick(item)}}
      if (breadCrumb.length === 1) { // we are in root folder
        this.props.fetchFolderChildren(item.id);
      } else {
        this.props.fetchFolderChildrenByUri(item.uri);
      }
      this.setState({ breadCrumb : breadCrumb.concat(bc) })
      this.setState({ metadataRoot : `${this.state.metadataRoot}${bc.text}/`})
    }
  }

  handleBcClick= (item) => {
    const {breadCrumb} = this.state;
    const index = breadCrumb.findIndex((bc)=>bc.key === item.id)
    if(index===0){ //root
      this.props.fetchRootFolders();
    } else if (index === 1) { // we are in root folder
      this.props.fetchFolderChildren(item.id);
		} else {
      this.props.fetchFolderChildrenByUri(item.uri);
		}
    this.setState({breadCrumb: breadCrumb.slice(0, index+1)})
    if(breadCrumb[index+1]){ //handle for click on last on breadCrumb
    let position = this.state.metadataRoot.search(`${breadCrumb[index+1].text}/`)
    let newMetadataRoot = this.state.metadataRoot.slice(0,position);
    this.setState({metadataRoot: newMetadataRoot})
    }
  }

  render(){
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
              iconProps={ { iconName: 'Link' }}
              text="Copy link"
            />
          </Stack>
          <Separator/>
          <Breadcrumb
            items={this.state.breadCrumb}
            ariaLabel="With last item rendered as heading"
            overflowAriaLabel="More links"
          />
          <DetailsList
            items={this.state.items}
            columns={this.state.columns}
            setKey="none"
            selectionMode={SelectionMode.none} //select row feature
            onRenderRow={this.renderRow}
          />
        </Stack>
        <NewProject isOpen={this.state.isOpenNewProject} metadataRoot={this.state.metadataRoot} close={()=>this.setState({isOpenNewProject:false})}/>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
	return {
    fetchRootFolders: () => fetchRootFolders(dispatch),
    fetchFolderChildren: (folderId) => fetchFolderChildren(dispatch, folderId),
		fetchFolderChildrenByUri: (uri) => fetchFolderChildrenByUri(dispatch, uri)
	}
}

function mapStateToProps(store) {
	return {
		 folders: store.projectList.folders,
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectList));