let config = {};

export const loadConfig = async () => {
  try {
    const response = await fetch('/config.json');
    config = await response.json();
  } catch (error) {
    console.error('Error loading config:', error);
  }
};

export const getBackendUrl = () => config.backendUrl || 'http://localhost:5000';
export const getFrontendUrl = () => config.frontendUrl || 'http://localhost:3000';
