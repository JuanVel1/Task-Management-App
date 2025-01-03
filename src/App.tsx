import { useState } from 'react';
import { Board } from './components/Board';
import { Navbar } from './components/Navbar';
import { useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
function App() {
  const { user } = useAuth();
  const [view, setView] = useState<'tablero' | 'equipos'>('tablero');

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setView('tablero')}
              className={`${
                view === 'tablero'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Tablero
            </button>
            <button
              onClick={() => setView('equipos')}
              className={`${
                view === 'equipos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Equipos
            </button>
          </nav>
        </div>
        <Board view={view} />
      </div>
    </div>
  );
}

export default App;