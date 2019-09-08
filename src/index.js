import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react'
import createIdbStorage from '@piotr-cz/redux-persist-idb-storage/src';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import rootReducer from './components/shared/reducers';

import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'BetterPixels';
    src: url('./BetterPixels.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  body {
    font-family: 'BetterPixels', Helvetica, Arial, sans-serif;
  }
`;

const persistConfig = {
    key: 'root',
    storage: createIdbStorage({name: 'myApp', storeName: 'keyval'}),
    serialize: true, // Data serialization is not required and disabling it allows you to inspect storage value in DevTools
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(persistedReducer);
const persistor = persistStore(store);


ReactDOM.render(<Provider store={store}><PersistGate loading={null} persistor={persistor}><GlobalStyle/><App /></PersistGate></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
