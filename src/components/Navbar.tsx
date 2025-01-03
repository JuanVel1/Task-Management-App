import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const { signOut } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-900">Task Manager</h1>
          </div>
          <div>
            <button
              onClick={signOut}
              className="px-4 py-2 text-sm  bg-red-500 font-medium text-red-50 hover:bg-red-400 hover:text-white focus:outline-none rounded-md"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 