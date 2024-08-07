import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useIdleTimer } from 'react-idle-timer';
import { useState, useEffect } from 'react';
import { loadConfig, getBackendUrl } from '../config';

const navigation = [
  { name: 'Dashboard', href: '/', current: true },
  // Add other links here if needed
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function NavBar() {
  const [logoURL, setLogoURL] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  const backendUrl = getBackendUrl();

  useEffect(() => {
    const fetchConfig = async () => {
      await loadConfig();
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, document.title, window.location.pathname); // Remove token from URL
    }

    const fetchLogoUrl = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/logo`);
        const data = await response.json();
        setLogoURL(data.logoURL);
      } catch (error) {
        console.error('Error fetching logo URL:', error);
      }
    };

    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        handleLogout();
        return;
      }
      try {
        const response = await fetch(`${backendUrl}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserEmail(data.userData.email);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchLogoUrl();
    fetchUserData();
  }, []);

  const handleOnIdle = () => {
    handleLogout();
  };

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * 60, // 60 minutes
    onIdle: handleOnIdle,
    debounce: 500,
  });

  return (
    <>
      <Disclosure as="nav" className="bg-blue-600 text-white fixed top-0 left-0 w-full z-50 shadow-lg">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-200 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
              </DisclosureButton>
            </div>
            <div className="flex flex-1 items-center justify-between sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <img alt="Your Company" src={logoURL} className="h-12 w-12 rounded-full" />
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <Menu as="div" className="relative ml-3">
                <div className="flex items-center">
                  <span className="ml-2 text-sm text-white">{userEmail}</span>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="h-8 w-8 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <MenuItem>
                    <a href="/profile/personal" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:no-underline">
                      My Profile
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a href="/my-applications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:no-underline">
                      My Applications
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:no-underline">
                      My Subscriptions
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:no-underline">
                      My Account
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a onClick={handleLogout} href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:no-underline">
                      Logout
                    </a>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>
      </Disclosure>

      <Disclosure as="nav" className="bg-white text-gray-700 fixed top-16 left-0 w-full z-40 shadow-lg">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-12 items-center justify-between">
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current ? 'border-b-2 border-gray-800 hover:no-underline hover:text-blue-950' : 'hover:border-b-2 hover:border-gray-500 ',
                      'text-gray-700 text-sm font-medium',
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Disclosure>
    </>
  );
}
