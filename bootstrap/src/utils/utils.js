export function getFormJson(xml, lang = 'en') {
	const qnr_data = xml
	const tables = {}
	qnr_data['farm_return']['tables']['table'].forEach(table => {
		tables[table['id_table']] = table
	})

	const groups = {}
	qnr_data['farm_return']['groups']['group'].forEach(group => {
		groups[group['id_group']] = group
	})
	const categories = {}
	qnr_data['farm_return']['categories']['category'].forEach(category => {
		categories[category['id_category']] = category
	})
	const columns = {}
	qnr_data['farm_return']['columns']['column'].forEach(column => {
		columns[column['id_column']] = column
	})

	const navbar = []
	qnr_data['farm_return']['tables']['table'].forEach(table => {
		let nav_element = {}
		nav_element = tables[table['id_table']]

		//add subelements
		nav_element['groups'] = []
		table['allowed_groups'].split(',').forEach(subelement => {
			nav_element['groups'].push(groups[subelement])
		})
		//attach subelements to object
		navbar.push(nav_element)
	})

	const collection_of_schemas = {}
	navbar.forEach(nav => {
		nav['groups'].forEach(g => {
			const thisGroupId = g['id_group']
			const newGroup = {...groups[thisGroupId]}
			newGroup.categories = {}
			g['allowed_categories'].split(',').forEach(categoryName => {
				const newCategory = categories[categoryName]
				newCategory.columns = []
				categories[categoryName]['allowed_columns'].split(',').forEach(columnName => {
					newCategory.columns.push(columns[columnName])
					newGroup.categories[newCategory.id_category] = newCategory
					collection_of_schemas[thisGroupId] = newGroup
				})
			})
		})
	})
	return {navbar, collection: collection_of_schemas};
}
