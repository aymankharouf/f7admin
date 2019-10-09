import React, { useContext, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Fab, Icon, FabButton, FabButtons } from 'framework7-react'
import BottomToolbar from './BottomToolbar';
import { StoreContext } from '../data/Store';


const SectionCategories = props => {
  const { state } = useContext(StoreContext)
  const section = useMemo(() => state.sections.find(rec => rec.id === props.id), [state.sections])
  const categories = useMemo(() => {
    let categories = state.categories.filter(rec => rec.sectionId === props.id)
    return categories.sort((rec1, rec2) => rec1.name > rec2.name ? 1 : -1)
  }, [state.categories])

  return (
    <Page>
      <Navbar title={`${state.labels.categories} - ${section.name}`} backLink={state.labels.back} />
      <Block>
        <List>
          {categories && categories.map(rec =>
            <ListItem 
              link={`/editCategory/${rec.id}`}
              title={rec.name} 
              key={rec.id} 
              badge={rec.isActive === false ? state.labels.inActive : ''}
              badgeColor='red' 
            />
          )}
        </List>
      </Block>
      <Fab position="left-bottom" slot="fixed" color="orange">
        <Icon ios="f7:chevron_up" aurora="f7:chevron_up" md="material:keyboard_arrow_up"></Icon>
        <Icon ios="f7:close" aurora="f7:close" md="material:close"></Icon>
        <FabButtons position="top">
          <FabButton color="blue" onClick={() => props.f7router.navigate(`/editSection/${props.id}`)}>
            <Icon ios="f7:edit" aurora="f7:edit" md="material:edit"></Icon>
          </FabButton>
          <FabButton color="green" onClick={() => props.f7router.navigate(`/addCategory/${props.id}`)}>
            <Icon ios="f7:add" aurora="f7:add" md="material:add"></Icon>
          </FabButton>
        </FabButtons>
      </Fab>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default SectionCategories
