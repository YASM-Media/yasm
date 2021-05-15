import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from '@reduxjs/toolkit';
import { Provider as ReduxStoreProvider } from 'react-redux';
import authReducer from './store/auth/reducer';

const store = createStore(authReducer, applyMiddleware(thunk));

ReactDOM.render(
  <React.StrictMode>
    <ReduxStoreProvider store={store}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ReduxStoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
