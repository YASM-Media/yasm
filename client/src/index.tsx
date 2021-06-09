import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {
  ChakraProvider,
  extendTheme,
  withDefaultColorScheme,
} from '@chakra-ui/react';
import thunk from 'redux-thunk';
import {
  createStore,
  applyMiddleware,
  combineReducers,
} from '@reduxjs/toolkit';
import { Provider as ReduxStoreProvider } from 'react-redux';
import authReducer from './store/auth/reducer';
import { composeWithDevTools } from 'redux-devtools-extension';

const reducer = combineReducers({
  auth: authReducer,
});

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

const customTheme = extendTheme(
  withDefaultColorScheme({ colorScheme: 'pink' })
);

ReactDOM.render(
  <React.StrictMode>
    <ReduxStoreProvider store={store}>
      <ChakraProvider theme={customTheme}>
        <App />
      </ChakraProvider>
    </ReduxStoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
