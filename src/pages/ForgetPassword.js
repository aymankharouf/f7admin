import React, { useContext, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar} from 'framework7-react'
import BottomToolbar from './BottomToolbar'
import moment from 'moment'
import 'moment/locale/ar'
import { StoreContext } from '../data/store'

const ForgetPassword = props => {
  const { state } = useContext(StoreContext)
  const forgetPassword = useMemo(() => {
    const forgetpassword = state.forgetPassword.filter(f => f.status === 'n')
    return forgetpassword.sort((f1, f2) => f1.time.seconds - f2.time.seconds)
  } , [state.forgetPassword])
  return(
    <Page>
      <Navbar title={state.labels.forgetPassword} backLink={state.labels.back} />
      <Block>
          <List mediaList>
            {forgetPassword.length === 0 ? 
              <ListItem title={state.labels.noData} /> 
            : forgetPassword.map(f => {
                const userInfo = state.users.find(u => u.mobile === f.mobile)
                if (!userInfo) return ''
                return (
                  <ListItem
                    link={`/retreivePassword/${f.id}`}
                    title={`${state.labels.user}: ${userInfo.name}`}
                    subtitle={`${state.labels.mobile}: ${userInfo.mobile}`}
                    text={moment(f.time.toDate()).fromNow()}
                    key={f.id}
                  />
                )
              })
            }
          </List>
      </Block>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default ForgetPassword
