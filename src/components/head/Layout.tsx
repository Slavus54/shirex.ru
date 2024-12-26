import {useLayoutEffect, useContext} from 'react'
import RouterComponent from '../router/Router'
import {AppContext} from '@/context/AppContext'
import {getTownsFromStorage, getTownsFromServer, onInitLocation, onInitHistory, onInitDrafts, onInitTest, onInitMapStyle} from '@/utils/storage'
import {ContextType, TownType} from '@/env/types'

const Layout = () => {
    const {account, accountUpdate} = useContext<ContextType>(AppContext)

    useLayoutEffect(() => {
        accountUpdate(true)
    
        let towns: TownType[] = getTownsFromStorage()

        if (towns.length === 0) {
            getTownsFromServer()
        }
    
        onInitLocation()
        onInitHistory()
        onInitDrafts()
        onInitTest()
        onInitMapStyle()
    }, [])  

    return (
        <div className='main'>
            <RouterComponent account={account} />
        </div>
    )
}

export default Layout