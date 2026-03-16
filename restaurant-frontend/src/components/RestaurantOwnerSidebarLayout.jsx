import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Home,
  ClipboardList,
  User,
  UtensilsCrossed,
  LogOut,
  Wallet,
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Home, end: true },
  { to: '/dashboard/orders', label: 'Orders', icon: ClipboardList },
  { to: '/dashboard/menu', label: 'Menu Management', icon: UtensilsCrossed },
  { to: '/dashboard/payouts', label: 'Payouts', icon: Wallet },
  { to: '/dashboard/profile', label: 'Profile Settings', icon: User },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'text-red-600 font-semibold bg-red-50'
      : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
  }`;

function RestaurantOwnerSidebarLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('restaurantOwnerToken');
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-600/75 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:shadow-xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Logo row */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img src="/quickbite_logo.svg" alt="QuickBite Logo" className="w-8 h-8 flex-shrink-0" />
            <span className="text-xl font-bold text-gray-900 truncate">QuickBite</span>
          </div>
          <button
            onClick={closeSidebar}
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 flex-shrink-0"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={linkClass}
              onClick={closeSidebar}
            >
              <Icon size={20} className="flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile top bar */}
        <header
          className="flex items-center gap-3 px-4 h-14 bg-white border-b border-gray-200 lg:hidden flex-shrink-0"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-1 text-gray-600 rounded-lg hover:bg-gray-100 flex-shrink-0"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <img src="/quickbite_logo.svg" alt="QuickBite" className="w-6 h-6 flex-shrink-0" />
            <span className="font-bold text-gray-800 truncate">QuickBite</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default RestaurantOwnerSidebarLayout;
