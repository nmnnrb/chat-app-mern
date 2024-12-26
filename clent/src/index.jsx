import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { ChatProvider } from './Context/ChatProvider';

// ...existing code...

ReactDOM.render(
  <Router>
    <ChatProvider>
      <App />
    </ChatProvider>
  </Router>,
  document.getElementById('root')
);
