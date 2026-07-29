import { Search, Bell, User, Menu } from 'lucide-react';
import gradyLogo from '../../imports/grady-logo.svg';

export type Module = 'hub' | 'registry' | 'pi';

interface NavigationProps {
  onBackToList?: () => void;
  activeModule: Module;
  onModuleSwitch: (module: Module) => void;
}

export function Navigation({ onBackToList, activeModule, onModuleSwitch }: NavigationProps) {
  return (
    <nav className="bg-white border-b border-gray-200 px-6">
      <div className="flex items-stretch justify-between h-12">
        <div className="flex items-stretch">
          {/* Grady logo — back button when in patient record */}
          <button
            onClick={onBackToList}
            className={`flex items-center pr-5 ${onBackToList ? 'cursor-pointer hover:opacity-75 transition-opacity' : 'cursor-default'}`}
          >
            <img src={gradyLogo} alt="Grady Memorial Hospital" className="h-7" />
          </button>

          {/* Module tabs — sit flush against the nav bottom border */}
          <button
            onClick={() => onModuleSwitch('hub')}
            className={`px-5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              activeModule === 'hub'
                ? 'text-indigo-600 border-indigo-500'
                : 'text-gray-400 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Patient Record Hub
          </button>
          <button
            onClick={() => onModuleSwitch('registry')}
            className={`px-5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              activeModule === 'registry'
                ? 'text-primary border-primary'
                : 'text-gray-400 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Trauma Registry
          </button>
          <button
            onClick={() => onModuleSwitch('pi')}
            className={`px-5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              activeModule === 'pi'
                ? 'text-amber-600 border-amber-500'
                : 'text-gray-400 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Process Improvement
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-1.5 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-md">
            <Search className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-md">
            <Bell className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-md">
            <User className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-md lg:hidden">
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
