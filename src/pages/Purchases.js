import React, { useContext, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar} from 'framework7-react'
import BottomToolbar from './BottomToolbar'
import moment from 'moment'
import 'moment/locale/ar'
import { StoreContext } from '../data/store'


const Purchases = props => {
  const { state } = useContext(StoreContext)
  const purchases = useMemo(() => [...state.purchases].sort((p1, p2) => p2.time.seconds - p1.time.seconds)
  , [state.purchases])
  return(
    <Page>
      <Navbar title={state.labels.purchases} backLink={state.labels.back} />
      <Block>
        <List mediaList>
          {purchases.length === 0 ? 
            <ListItem title={state.labels.noData} /> 
          : purchases.map(p => 
              <ListItem
                link={`/purchaseDetails/${p.id}`}
                title={state.stores.find(s => s.id === p.storeId).name}
                subtitle={moment(p.time.toDate()).fromNow()}
                after={((p.total - p.discount) / 1000).toFixed(3)}
                key={p.id}
              />
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

export default Purchases
