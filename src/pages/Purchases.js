import React, { useContext } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar} from 'framework7-react'
import BottomToolbar from './BottomToolbar';
import moment from 'moment'
import 'moment/locale/ar'
import { StoreContext } from '../data/Store';


const Purchases = props => {
  const { state } = useContext(StoreContext)
  let purchases = state.purchases
  purchases.sort((purchase1, purchase2) => purchase2.time.seconds - purchase1.time.seconds)
  return(
    <Page>
      <Navbar title={state.labels.purchases} backLink={state.labels.back} />
      <Block>
          <List mediaList>
            {purchases && purchases.map(purchase => 
              <ListItem
                link={`/purchase/${purchase.id}`}
                title={state.stores.find(rec => rec.id === purchase.storeId).name}
                after={(purchase.total / 1000).toFixed(3)}
                text={moment(purchase.time.toDate()).fromNow()}
                key={purchase.id}
              />
            )}
            { purchases.length === 0 ? <ListItem title={state.labels.noData} /> : null }
          </List>
      </Block>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default Purchases
