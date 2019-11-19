import React, { useContext, useMemo } from 'react'
import { Block, Fab, Icon, Page, Navbar, List, ListItem, Toolbar, Searchbar, NavRight, Link, Badge, FabButton, FabButtons } from 'framework7-react'
import BottomToolbar from './BottomToolbar';
import { StoreContext } from '../data/Store';
import moment from 'moment'
import 'moment/locale/ar'

const StorePacks = props => {
  const { state } = useContext(StoreContext)
  const store = useMemo(() => state.stores.find(s => s.id === props.id)
  , [state.stores, props.id])
  let storePacks = useMemo(() => {
    let storePacks = state.packs.filter(p => p.stores.find(s => s.storeId === props.id))
    storePacks = storePacks.map(p => {
      return {
        ...p,
        price: p.stores.find(s => s.storeId === props.id).price,
        time: p.stores.find(s => s.storeId === props.id).time
      }
    })
    return storePacks.sort((p1, p2) => p2.time.seconds - p1.time.seconds)
  }, [state.packs, props.id])
  return(
    <Page>
      <Navbar title={`${store.name}`} backLink={state.labels.back}>
        <NavRight>
          <Link searchbarEnable=".searchbar" iconMaterial="search"></Link>
        </NavRight>
        <Searchbar
          className="searchbar"
          searchContainer=".search-list"
          searchIn=".item-title, .item-subtitle"
          clearButton
          expandable
          placeholder={state.labels.search}
        ></Searchbar>
      </Navbar>
      <Block>
        <List className="searchbar-not-found">
          <ListItem title={state.labels.noData} />
        </List>
        <List mediaList className="search-list searchbar-found">
          {storePacks.map(p => {
            const productInfo = state.products.find(pr => pr.id === p.productId)
            return (
              <ListItem
                link={`/storePack/${store.id}/pack/${p.id}`}
                title={productInfo.name}
                after={(p.price / 1000).toFixed(3)}
                subtitle={p.name}
                text={moment(p.time.toDate()).fromNow()}
                key={p.id}
              >
                <img slot="media" src={productInfo.imageUrl} className="lazy lazy-fadeIn avatar" alt={productInfo.name} />
                {productInfo.isNew ? <Badge slot="title" color='red'>{state.labels.new}</Badge> : ''}
                {p.isOffer ? <Badge slot="title" color='green'>{state.labels.offer}</Badge> : ''}
              </ListItem>
            )
          })}
          {storePacks.length === 0 ? <ListItem title={state.labels.noData} /> : null}
        </List>
      </Block>
      {store.id === 's' ? '' : 
        <Fab position="left-top" slot="fixed" color="orange">
          <Icon material="keyboard_arrow_down"></Icon>
          <Icon material="close"></Icon>
          <FabButtons position="bottom">
            <FabButton color="blue" onClick={() => props.f7router.navigate(`/editStore/${props.id}`)}>
              <Icon material="edit"></Icon>
            </FabButton>
            <FabButton color="green" onClick={() => props.f7router.navigate(`/addStorePack/${props.id}`)}>
              <Icon material="add"></Icon>
            </FabButton>
          </FabButtons>
        </Fab>
      }
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default StorePacks
