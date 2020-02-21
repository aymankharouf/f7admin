import React, { useContext, useEffect, useState } from 'react'
import { f7, Block, Fab, Page, Navbar, List, ListItem, Toolbar, Link, Icon, Stepper } from 'framework7-react'
import { StoreContext } from '../data/store'
import { updateOrderStatus, editOrder, showMessage, showError, getMessage, quantityDetails, returnOrder } from '../data/actions'
import PackImage from './pack-image'
import labels from '../data/labels'

const EditOrder = props => {
  const { state, dispatch } = useContext(StoreContext)
  const [error, setError] = useState('')
  const [inprocess, setInprocess] = useState(false)
  const [order] = useState(() => state.orders.find(o => o.id === props.id))
  const [orderBasket, setOrderBasket] = useState([])
  const [total, setTotal] = useState('')
  const [hasChanged, setHasChanged] = useState(false)
  useEffect(() => {
    const params = {
      type: props.type,
      order
    }
    dispatch({type: 'LOAD_ORDER_BASKET', params})
  }, [dispatch, order, props.type])
  useEffect(() => {
    setOrderBasket(() => {
      const orderBasket = state.orderBasket?.filter(p => p.quantity > 0) || []
      return orderBasket.map(p => {
        const packInfo = state.packs.find(pa => pa.id === p.packId) || ''
        return {
          ...p,
          packInfo
        }
      })
    })
  }, [state.orderBasket, state.packs])
  useEffect(() => {
    setHasChanged(() => state.orderBasket?.find(p => p.oldQuantity !== p.quantity) ? true : false)
  }, [state.orderBasket])
  useEffect(() => {
    setTotal(() => orderBasket.reduce((sum, p) => sum + p.gross, 0))
  }, [orderBasket])
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

  const handleDelete = () => {
    f7.dialog.confirm(labels.confirmationText, labels.confirmationTitle, async () => {
      try{
        const type = ['f', 'p', 'e'].includes(order.status) ? 'i' : 'c'
        setInprocess(true)
        await updateOrderStatus(order, type, state.storePacks, state.packs, false)
        setInprocess(false)
        showMessage(labels.deleteSuccess)
        dispatch({type: 'CLEAR_ORDER_BASKET'})
        props.f7router.back()
      } catch(err) {
        setInprocess(false)
        setError(getMessage(props, err))
      }
    })  
  }
  const handleSubmit = async () => {
    try{
      setInprocess(true)
      if (props.type === 'e') {
        await editOrder(order, state.orderBasket, state.storePacks, state.packs)
      } else {
        const userLocation = state.users.find(c => c.id === order.userId).locationId
        const locationFees = state.lookups.find(l => l.id === 'l').values.find(l => l.id === userLocation).fees
        await returnOrder(order, state.orderBasket, locationFees, state.storePacks, state.packs)
      }
      setInprocess(false)
      showMessage(labels.editSuccess)
      dispatch({type: 'CLEAR_ORDER_BASKET'})
      props.f7router.back()
    } catch(err) {
      setInprocess(false)
			setError(getMessage(props, err))
		}
  }
  const handleIncrease = pack => {
    if (props.type === 'e' || (props.type === 'r' && pack.quantity < pack.oldQuantity)) {
      dispatch({type: 'INCREASE_ORDER_QUANTITY', pack})
    }
  }
  const handleDecrease = pack => {
    const params = {
      type: props.type,
      pack
    }
    dispatch({type: 'DECREASE_ORDER_QUANTITY', params})
  }
  return (
    <Page>
      <Navbar title={props.type === 'e' ? labels.editOrder : labels.returnOrder} backLink={labels.back} />
      <Block>
        <List mediaList>
          {orderBasket.length === 0 ? 
            <ListItem title={labels.noData} />
          :orderBasket.map(p =>
            <ListItem
              title={p.productName}
              subtitle={p.productAlias}
              text={p.packName}
              footer={`${labels.grossPrice}: ${(p.gross / 1000).toFixed(3)}`}
              key={p.packId}
            >
              <PackImage slot="media" pack={p.packInfo} type="list" />
              <div className="list-subtext1">{`${labels.unitPrice}: ${(p.price / 1000).toFixed(3)}`}</div>
              <div className="list-subtext2">{quantityDetails(p)}</div>
              <Stepper
                slot="after"
                fill
                buttonsOnly
                onStepperPlusClick={() => handleIncrease(p)}
                onStepperMinusClick={() => handleDecrease(p)}
              />
            </ListItem>
          )}
        </List>
      </Block>
      {hasChanged ? 
        <Fab position="center-bottom" slot="fixed" text={`${labels.submit} ${(total / 1000).toFixed(3)}`} color="green" onClick={() => handleSubmit()}>
          <Icon material="done"></Icon>
        </Fab>
      : ''}
      <Toolbar bottom>
        <Link href='/home/' iconMaterial="home" />
        {props.type === 'n' ?
          <Link href='#' iconMaterial="delete" onClick={() => handleDelete()} />
        : ''}
      </Toolbar>
    </Page>
  )
}
export default EditOrder
