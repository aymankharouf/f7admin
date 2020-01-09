import React, { useContext, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar } from 'framework7-react'
import BottomToolbar from './bottom-toolbar'
import { StoreContext } from '../data/store'
import moment from 'moment'
import PackImage from './pack-image'
import labels from '../data/labels'

const Offers = props => {
  const { state } = useContext(StoreContext)
  const storePacks = useMemo(() => {
    let storePacks = state.storePacks.filter(p => p.offerEnd)
    storePacks = storePacks.map(p => {
      const packInfo = state.packs.find(pa => pa.id === p.packId)
      const storeName = p.storeId ? (p.storeId === 'm' ? labels.multipleStores : state.stores.find(s => s.id === p.storeId).name) : ''
      return {
        ...p,
        packInfo,
        storeName
      }
    })
    return storePacks.sort((p1, p2) => p1.offerEnd.seconds - p2.offerEnd.seconds)
  }, [state.storePacks, state.packs, state.stores])
  return(
    <Page>
      <Navbar title={labels.EndedOffers} backLink={labels.back} />
        <Block>
          <List mediaList>
            {storePacks.length === 0 ? 
              <ListItem title={labels.noData} /> 
            : storePacks.map(p => 
                <ListItem
                  link={`/store-pack-details/${p.id}`}
                  title={p.packInfo.productName}
                  subtitle={p.packInfo.name}
                  text={`${labels.productOf} ${p.packInfo.trademark ? labels.company + ' ' + p.packInfo.trademark + '-' : ''}${p.packInfo.country}`}
                  footer={moment(p.offerEnd.toDate()).format('Y/M/D')}
                  after={(p.price / 1000).toFixed(3)}
                  key={p.id}
                >
                  <PackImage slot="media" pack={p.packInfo} type="list" />
                  {p.storeName ? <div className="list-subtext1">{`${labels.storeName}: ${p.storeName}`}</div> : ''}
                </ListItem>
              )
            }
          </List>
      </Block>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default Offers