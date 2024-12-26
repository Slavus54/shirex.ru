import {useState, createContext} from 'react'
import Cookies from 'js-cookie'
import {useNavigate} from 'react-router-dom'
import {UserCookieType, ContextPropsType} from '../env/types'
import {ACCOUNT_COOKIE_KEY} from '../env/env'

const initialState: UserCookieType = {
    shortid: '',
    name: '',
    token: ''
}

export const AppContext = createContext<any>(initialState)

const AppProvider = ({children}: ContextPropsType) => {
    const navigate = useNavigate()
    const [account, setAccount] = useState(initialState) 

    const accountUpdate = (isCreate = true, data = null, expires = 1, url = '/', isReload = true) => {

        if (isCreate === true) {
            const cookie = Cookies.get(ACCOUNT_COOKIE_KEY)
            let result = cookie === undefined ? null : JSON.parse(cookie)
           
            if (result !== null) {
                setAccount({...account, ...result})
            } else {    
                Cookies.set(ACCOUNT_COOKIE_KEY, result, {expires})
            }
          
        } else {
            Cookies.set(ACCOUNT_COOKIE_KEY, JSON.stringify(data), {expires})
   
            if (isReload) {
                setTimeout(() => {
                    navigate(url) 
                    window.location.reload()
                }, 5e2)   
            }
        }  
    }

    return <AppContext.Provider value={{account, accountUpdate}}>{children}</AppContext.Provider>
}

export default AppProvider