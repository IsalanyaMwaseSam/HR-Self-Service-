import React, { useState, useEffect } from 'react';
import { loadConfig, getBackendUrl } from '../config';

const SMTPForm = () => {
  const backendUrl = getBackendUrl();

  useEffect(() => {
    const fetchConfig = async () => {
      await loadConfig();
    };
    fetchConfig();
  }, []);
  const [settings, setSettings] = useState({
    smtpServer: '',
    smtpServerPort: '',
    username: '',
    password: '',
  });
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/smtp-settings`);
        const data = await response.json();
        setSettings(data || {});
      } catch (error) {
        console.error('Error fetching SMTP settings', error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${backendUrl}/smtp-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);

      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);

      if (!contentType || !contentType.includes('application/json')) {
        console.error('Expected JSON response, but got:', contentType);
        alert('Error: Expected JSON response, but got a different content-type');
        return;
      }

      const data = await response.json();

      if (response.ok) {
        alert('SMTP settings saved successfully!');
      } else {
        console.error('Error response from server:', data);
        alert(`Error: ${data.error || 'Failed to save SMTP settings'}`);
      }
    } catch (error) {
      console.error('Error saving SMTP settings:', error);
      alert('Error saving SMTP settings');
    }
  };

  const handleTest = async () => {
    try {
      const response = await fetch(`${backendUrl}/test-smtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'eazikezi1999@gmail.com',
          subject: 'SMTP Test',
          text: 'This is a test email.',
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setTestResult(`Test email sent: ${data.message}`);
      } else {
        setTestResult(`Error: ${data.error || 'Failed to send test email'}`);
      }
    } catch (error) {
      console.error('Error testing SMTP settings', error);
      setTestResult('Error sending test email');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">SMTP Settings</h1>
        <form>
          <label className="block mb-4">
            <span className="text-gray-700">SMTP Server:</span>
            <input
              type="text"
              name="smtpServer"
              value={settings.smtpServer}
              onChange={handleChange}
              className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">SMTP Server Port:</span>
            <input
              type="number"
              name="smtpServerPort"
              value={settings.smtpServerPort}
              onChange={handleChange}
              className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Username:</span>
            <input
              type="text"
              name="username"
              value={settings.username}
              onChange={handleChange}
              className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Password:</span>
            <input
              type="password"
              name="password"
              value={settings.password}
              onChange={handleChange}
              className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Settings
            </button>
            <button
              type="button"
              onClick={handleTest}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-500 shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Test Email
            </button>
          </div>
        </form>
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Test Result:</h2>
          <p className="mt-2 text-gray-600">{testResult}</p>
        </div>
      </div>
    </div>
  );
};

export default SMTPForm;
