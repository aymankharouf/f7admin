import React, { useContext, useEffect, useMemo } from 'react'
import { Block, Fab, Page, Navbar, List, ListItem, Toolbar, Link, Icon, Stepper, Badge } from 'framework7-react'
import { StoreContext } from '../data/Store';

const Basket = props => {
  const { state, dispatch } = useContext(StoreContext)
  const store = useMemo(() => state.basket.storeId ? state.stores.find(rec => rec.id === state.basket.storeId) : '', [state.basket, state.stores])
  const totalPrice = useMemo(() => state.basket.packs ? (state.basket.packs.reduce((a, pack) => a + pack.netPrice, 0)) : '', [state.basket])
  const handleAdd = pack => {
    const storeQuantity = pack.stores.find(rec => rec.id === store.id).quantity
    if (!storeQuantity) {
      dispatch({type: 'ADD_QUANTITY', pack})
    }
  }
  useEffect(() => {
    if (!state.basket.storeId) {
      props.f7router.navigate('/home/')
    }
  }, [state.basket])
  return (
    <Page>
      <Navbar title={`${state.labels.basket_from} ${store ? store.name : ''}`} backLink={state.labels.back} />
      <Block>
        <List mediaList>
          {state.basket.packs && state.basket.packs.map(pack => {
            const productInfo = state.products.find(rec => rec.id === pack.productId)
            return (
              <ListItem
                title={productInfo.name}
                footer={(pack.netPrice / 1000).toFixed(3)}
                subtitle={pack.name}
                key={pack.id}
              >
                <img slot="media" src={productInfo.imageUrl} width="80" alt="" />
                {pack.quantity > 1 ? <Badge slot="title" color="red">{pack.quantity}</Badge> : null}
                <Stepper
                  slot="after"
                  buttonsOnly={true}
                  small
                  raised
                  onStepperPlusClick={() => handleAdd(pack)}
                  onStepperMinusClick={() => dispatch({type: 'REMOVE_QUANTITY', pack})}
                />
              </ListItem>
            )
          })}
        </List>
      </Block>
      <Fab position="center-bottom" slot="fixed" text={`${state.labels.submit} ${(totalPrice / 1000).toFixed(3)}`} color="green" onClick={() => props.f7router.navigate('/confirmPurchase/')}>
        <Icon ios="f7:checkmark" aurora="f7:checkmark" md="material:done"></Icon>
      </Fab>

      <Toolbar bottom>
        <Link href='/home/'>
          <Icon ios="f7:home_fill" aurora="f7:home_fill" md="material:home"></Icon>
        </Link>
        <Link href='#' onClick={() => dispatch({type: 'CLEAR_BASKET'})}>
          <Icon ios="f7:trash_fill" aurora="f7:trash_fill" md="material:delete"></Icon>
        </Link>
      </Toolbar>
    </Page>
  )
}
export default Basket
