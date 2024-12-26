import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'

import {createHttpLink} from 'apollo-link-http'
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client'

import AppProvider from './context/AppContext'
import {WEBSERVER_URL, APP_NODE} from './env/env'

import './index.css'
import App from './App'

//@ts-ignore

const link = new createHttpLink({
  uri: WEBSERVER_URL
})

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

const root = ReactDOM.createRoot(
  document.getElementById(APP_NODE) as HTMLElement
)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
)

if ('serviceWorker' in navigator && window.location.pathname === '/') {
  window.navigator.serviceWorker.register('./serviceWorker.js')
}