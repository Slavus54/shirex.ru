import React, {useState, useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import {AppContext} from '../../context/AppContext'
import {RouterNavigatorPropsType, ContextType} from '../../env/types'

const RouterNavigator: React.FC<RouterNavigatorPropsType> = ({url, isOnMap = false, children}) => {
    const {account} = useContext<ContextType>(AppContext)
    const [items] = useState<string[]>(url.split('/profile/'))

    const navigate = useNavigate()
    
    const onRedirect = () => {
        let id = Boolean(items.length - 1) ? items[1] : '/'

        if (account.shortid === id) {
            navigate('/')
        } else {
            navigate(url)
        }
    }

    return (
        <div onClick={onRedirect} className={isOnMap ? 'red navigator' : 'navigator'}>
            {children}
        </div>
    )
}

export default RouterNavigator