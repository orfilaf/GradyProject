import { Search, Bell, User, Menu } from 'lucide-react';
import gradyLogo from '../../imports/grady-logo.svg';

export function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <img src={gradyLogo} alt="Grady Memorial Hospital" className="h-7" />
            <div className="border-l border-gray-300 pl-3">
              <h1 className="text-base font-semibold text-gray-900">Patient Registry</h1>
            </div>
          </div>
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
