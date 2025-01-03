import ReactDOM from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <TaskProvider>
      <App />
    </TaskProvider>
  </AuthProvider>
);