import {useState, useLayoutEffect} from 'react'
//@ts-ignore
import {Routes, Route, Link} from 'react-router-dom'

import {items} from '@/env/routes'
import {RouteItem} from '@/env/types'

const RouterComponent: any = ({account}) => {
    const [pages, setPages] = useState<RouteItem[]>([]) // menu pages by user authentication status
    const [routes, setRoutes] = useState<RouteItem[]>([]) // all routes

    useLayoutEffect(() => {
        let filteredRoutes = items.filter(el => el.isUserAuth === (account.shortid !== ''))
        let filteredPages = filteredRoutes.filter(el => el.inMenuExist)
       
        setPages(filteredPages)
        setRoutes(filteredRoutes)        
    }, [account])

    return (
        <>
            <div className='navbar'>
                {pages.map((el, idx) => <Link to={el.url} key={idx} className='navbar__item'>{el.title}</Link>)}
            </div>
           
            <Routes>
                {routes.map((el, idx) => <Route Component={el.component} path={el.url} key={idx} />)}
            </Routes>
        </>
    )
}

export default RouterComponent