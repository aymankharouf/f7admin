import React, { useContext, useState, useEffect, useRef } from 'react'
import { f7, Block, Page, Navbar, List, ListItem, Toolbar, Fab, Icon } from 'framework7-react'
import moment from 'moment'
import 'moment/locale/ar'
import { StoreContext } from '../data/store'
import BottomToolbar from './bottom-toolbar'
import labels from '../data/labels'
import { stockTransTypes } from '../data/config'
import { getArchivedStockTrans, getMessage, showError } from '../data/actions'

const ArchivedStockTrans = props => {
  const { state, dispatch } = useContext(StoreContext)
  const [error, setError] = useState('')
  const [inprocess, setInprocess] = useState(false)
  const [stockTrans, setStockTrans] = useState([])
  const [monthlyTrans] = useState(() => [...state.monthlyTrans.sort((t1, t2) => t2.id - t1.id)])
  const lastMonth = useRef(0)
  useEffect(() => {
    setStockTrans(() => {
      const stockTrans = state.stockTrans.map(t => {
        const stockTransTypeInfo = stockTransTypes.find(ty => ty.id === t.type)
        const storeInfo = state.stores.find(s => s.id === t.storeId)
        return {
          ...t,
          stockTransTypeInfo,
          storeInfo
        }
      })
      return stockTrans.sort((t1, t2) => t2.time.seconds - t1.time.seconds)
    })
  }, [state.stockTrans, state.stores])
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
  useEffect(() => {
    if (inprocess) {
      f7.dialog.preloader(labels.inprocess)
    } else {
      f7.dialog.close()
    }
  }, [inprocess])
  const handleRetreive = async () => {
    try{
      const id = monthlyTrans[lastMonth.current]?.id
      if (!id) {
        throw new Error('noMoreArchive')
      }
      setInprocess(true)
      const trans = await getArchivedStockTrans(id)
      setInprocess(false)  
      if (trans.length > 0) {
        dispatch({type: 'ADD_ARCHIVED_STOCK_TRANS', trans})
      }
      lastMonth.current++
  } catch(err) {
      setInprocess(false)
      setError(getMessage(props, err))
    }
  }

  return(
    <Page>
      <Navbar title={labels.archivedStockTrans} backLink={labels.back} />
      <Block>
        <List mediaList>
          {stockTrans.length === 0 ? 
            <ListItem title={labels.noData} /> 
          : stockTrans.map(t => 
              <ListItem
                link={`/stock-trans-details/${t.id}/type/a`}
                title={`${t.stockTransTypeInfo.name} ${t.storeId ? t.storeInfo.name : ''}`}
                subtitle={moment(t.time.toDate()).fromNow()}
                after={(t.total / 1000).toFixed(3)}
                key={t.id}
              />
            )
          }
        </List>
      </Block>
      <Fab position="left-top" slot="fixed" color="green" className="top-fab" onClick={() => handleRetreive()}>
        <Icon material="cached"></Icon>
      </Fab>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default ArchivedStockTrans