import React from 'react';
import ReactDOM from 'react-dom';
import "./content.css";
import App from './App';

// inject react app
const app = document.createElement('div');
app.id = "my-extension-root";
document.body.appendChild(app);
ReactDOM.render(<App />, app);
