import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'
import configureStore, { history } from './configureStore'
import * as serviceWorker from './serviceWorker';
import { ThemeProvider } from 'styled-components'

const store = configureStore()
const theme = {
  color: 'royalblue',
  bgc: '#E8F5FD'
}

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <App history={history} />
    </Provider>
  </ThemeProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();
