
interface NavigationProps {
  activeView: 'board' | 'teams';
  onViewChange: (view: 'board' | 'teams') => void;
}

export function Navigation({ activeView, onViewChange }: NavigationProps) {
  return (
    <nav className=" bg-white border-b border-gray-200 mb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="pflex space-x-8">
          <button
            className={`py-4 px-3 border-b-2 ${
              activeView === 'board'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => onViewChange('board')}
          >
            Tablero
          </button>
          <button
            className={`py-4 px-3 border-b-2 ${
              activeView === 'teams'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => onViewChange('teams')}
          >
            Equipos
          </button>
        </div>
      </div>
    </nav>
  );
}