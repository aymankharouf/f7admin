import React, { useContext, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Fab, Icon, FabButton, FabButtons } from 'framework7-react'
import { StoreContext } from '../data/store'
import labels from '../data/labels'
import BottomToolbar from './bottom-toolbar'

const Categories = props => {
  const { state } = useContext(StoreContext)
  const categories = useMemo(() => {
    const categories = state.categories.filter(c => c.parentId === props.id)
    return categories.sort((c1, c2) => c1.ordering - c2.ordering)
  }, [state.categories, props.id])
  const currentCategory = useMemo(() => props.id === '0' ? '' : state.categories.find(c => c.id === props.id)
  , [state.categories, props.id])
  return (
    <Page>
      <Navbar title={`${labels.categories} ${currentCategory?.name || ''}`} backLink={labels.back} />
      <Block>
        <List>
          {categories.length === 0 ? 
            <ListItem title={labels.noData} /> 
          : categories.map(c =>
              <ListItem 
                link={`/categories/${c.id}`} 
                title={c.name} 
                key={c.id} 
              />
            )
          }
        </List>
      </Block>
      <Fab position="left-top" slot="fixed" color="orange" className="top-fab">
        <Icon material="keyboard_arrow_down"></Icon>
        <Icon material="close"></Icon>
        <FabButtons position="bottom">
          <FabButton color="green" onClick={() => props.f7router.navigate(`/add-category/${props.id}`)}>
            <Icon material="add"></Icon>
          </FabButton>
          {props.id === '0' ? '' :
            <FabButton color="blue" onClick={() => props.f7router.navigate(`/edit-category/${props.id}`)}>
              <Icon material="edit"></Icon>
            </FabButton>
          }
        </FabButtons>
      </Fab>

      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default Categories