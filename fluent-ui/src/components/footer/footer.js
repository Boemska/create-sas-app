import React from 'react'
import './footer.scss'
import {Customizations} from '@fluentui/react'

const Footer = () => {
	const customization = Customizations.getSettings(['theme'])
	return <footer className={'bfooter'} style={{backgroundColor: customization.theme.palette.themePrimary}}>Boemska Technology Solutions Limited v0.16</footer>
}

export default Footer
