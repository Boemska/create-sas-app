# h54s <3 Bootstrap

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting started
In order to get the application up and running in no time at all, run the following 3 commands from within this folder:

### Deploy the backend
1. Register our application's startup service. **On Viya** this is a File of type Job Definition, and can be registered through the SASJobExecution WebApp (`https://[yourViyaServer]/SASJobExecution/`). **On SAS v9** this is a Stored Process and can be registered through SAS Management Console or Enterprise Guide. In both cases you'll be registering the code object to a SAS folder that you have permission to write to. In both Viya and v9, I created mine in a sub-folder of my user's `My Folder` location: `csa-boostrap/common/startupService`:

2. Edit the code for the newly registered code object and populate it with the code from the `startupService.sas` file in the `sas` folder of this application.

3. Configure the output type for your newly registered code object.  

**On Viya**, right click on the job name and select properties. From the properties menu select "Parameters". Add the following parameter and then click save:
  * Name: `_output_type`
  * Default value: `html`
  * Field type: `Character`
  * Required: `false`

**On SAS v9**, make sure you enable Streaming Output as the output type. If you are using Enterprise Guide to do this, also be sure to check "Global Macro Variables" and uncheck "Include Stored Procedure Macros" under the "Include code for" dropdown.

### Modify adapterService configuration
Update the `config.js` file found in `./src/adapterService`. We need to update the `sasVersion` for the version of the SAS platform that we are running on and update the `metadataRoot` to the location of where we deployed our `startupService` in the step above. 


### `yarn install` 
Install all the dependencies listed within `package.json` in the local `node_modules` folder.

### `yarn run configure`
In the `package.json` for this quick-start application we hav defined a scripts object called `configure`, this command will run the specified [configure] script. The `configure` script is a guided process for connecting your local quick-start application to your remote SAS instance.

### `yarn start`
Runs the app in the development mode.<br />
Open [https://localhost:3000](https://localhost:3000) to view it in the browser.

The app uses a proxy to communicate with the server so it has to open on a an https connection

The page will reload if you make edits.<br />
You will also see any lint errors in the console.


## Other commands

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn watch`

Starts build with watch - used npm-watch with setthins in package.json
```javascript
"scripts": {
	...,
	"watch": "npm-watch"
},
"watch": {
	"build": "src/"
}
```

### `serve -s build`
Serve prod build locally. To use this first run
```javascript
yarn global add serve
```

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### To run development scripts follow
```text
1. yarn watch
2. in separated terminal run serve -s build
3. in separated terminal cd build and run bapsync script
```

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
