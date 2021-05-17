import {useContext, useState, useEffect} from 'react'
import {f7, Page, Block, Navbar, List, ListItem, Searchbar, NavRight, Link, Fab, Icon} from 'framework7-react'
import {StateContext} from '../data/state-provider'
import labels from '../data/labels'
import {getCategoryName, getArchivedProducts, getMessage, productOfText} from '../data/actions'
import {Category, Country, Product, Trademark} from '../data/types'
import { useIonLoading, useIonToast } from '@ionic/react'
import { useLocation } from 'react-router'

type ExtendedProduct = Product & {
  categoryInfo: Category,
  trademarkInfo?: Trademark,
  countryInfo: Country
}
const ArchivedProducts = () => {
  const {state, dispatch} = useContext(StateContext)
  const [message] = useIonToast()
  const location = useLocation()
  const [loading, dismiss] = useIonLoading()
  const [products, setProducts] = useState<ExtendedProduct[]>([])
  useEffect(() => {
    setProducts(() => {
      const archivedProducts = state.products.filter(p => !p.isActive)
      const products = archivedProducts.map(p => {
        const categoryInfo = state.categories.find(c => c.id === p.categoryId)!
        const trademarkInfo = state.trademarks.find(t => t.id === p.trademarkId)
        const countryInfo = state.countries.find(c => c.id === p.countryId)!
        return {
          ...p,
          categoryInfo,
          trademarkInfo,
          countryInfo
        }
      })
      return products.sort((p1, p2) => p1.name > p2.name ? -1 : 1)
    })
  }, [state.products, state.categories, state.countries, state.trademarks])
  const handleRetreive = async () => {
    try{
      loading()
      const products = await getArchivedProducts()
      if (products.length > 0) {
        dispatch({type: 'SET_ARCHIVED_PRODUCTS', payload: products})
      }
      dismiss()
    } catch(err) {
      dismiss()
      message(getMessage(location.pathname, err), 3000)
    }
  }
  if (!state.user) return <Page><h3 className="center"><a href="/login/">{labels.relogin}</a></h3></Page>
  return(
    <Page>
      <Navbar title={labels.archivedProducts} backLink={labels.back}>
        <NavRight>
          <Link searchbarEnable=".searchbar" iconMaterial="search"></Link>
        </NavRight>
        <Searchbar
          className="searchbar"
          searchContainer=".search-list"
          searchIn=".item-inner"
          clearButton
          expandable
          placeholder={labels.search}
        />
      </Navbar>
        <Block>
          <List className="searchbar-not-found">
            <ListItem title={labels.noData} />
          </List>
          <List mediaList className="search-list searchbar-found">
            {products.length === 0 ? 
              <ListItem title={labels.noData} /> 
            : products.map(p => 
                <ListItem
                  link={`/product-packs/${p.id}/a`}
                  title={p.name}
                  subtitle={getCategoryName(p.categoryInfo!, state.categories)}
                  text={productOfText(p.countryInfo.name, p.trademarkInfo?.name)}
                  key={p.id}
                >
                  <img slot="media" src={p.imageUrl} className="img-list" alt={p.name} />
                </ListItem>
              )
            }
          </List>
      </Block>
      <Fab position="left-top" slot="fixed" color="green" className="top-fab" onClick={() => handleRetreive()}>
        <Icon material="cached"></Icon>
      </Fab>
    </Page>
  )
}

export default ArchivedProducts