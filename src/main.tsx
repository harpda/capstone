import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // // React.strictMode는 무조건 두 번 실행 
  // <React.StrictMode>
    <App />
  // </React.StrictMode>,
)
