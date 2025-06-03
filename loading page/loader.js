// Function to check if the React app is ready
async function checkReactAppStatus() {
  try {
    const response = await fetch('http://localhost:5176');
    return response.ok;
  } catch (error) {
    console.log('React app not ready yet...');
    return false;
  }
}

// Function to check if the backend is ready
async function checkBackendStatus() {
  try {
    const response = await fetch('http://localhost:3000/api/health');
    return response.ok;
  } catch (error) {
    console.log('Backend not ready yet...');
    return false;
  }
}

// Function to check if the loading page server is ready
async function checkLoadingPageStatus() {
  try {
    const response = await fetch('http://localhost:3001/health');
    return response.ok;
  } catch (error) {
    console.log('Loading page server not ready yet...');
    return false;
  }
}

// Function to redirect to the React app
function redirectToReactApp() {
  document.querySelector('.gif-loader-container').classList.add('fade-out');
  setTimeout(() => {
    window.location.href = "http://localhost:5176";
  }, 700);
}

// Function to show error message
function showError(message) {
  const appName = document.getElementById('appName');
  appName.textContent = message;
  appName.style.color = 'red';
  appName.style.fontSize = '1.2rem';
}

// Function to show status message
function showStatus(message) {
  const appName = document.getElementById('appName');
  appName.textContent = message;
  appName.style.color = '#2da0a8';
  appName.style.fontSize = '1.2rem';
}

// Wait for the DOM to load
window.onload = async function() {
  // Fade in app name after 3s
  setTimeout(async function() {
    document.getElementById('appName').classList.add('visible');
    
    // Check server status and redirect
    let attempts = 0;
    const maxAttempts = 30;
    
    const checkServers = async () => {
      try {
        showStatus(`Starting servers... (${attempts + 1}/${maxAttempts})`);
        
        const [reactReady, backendReady] = await Promise.all([
          checkReactAppStatus(),
          checkBackendStatus()
        ]);
        
        if (reactReady && backendReady) {
          showStatus('All servers ready! Redirecting...');
          redirectToReactApp();
        } else {
          let statusMessage = 'Starting: ';
          if (!reactReady) statusMessage += 'React app ';
          if (!backendReady) statusMessage += 'Backend ';
          
          if (attempts < maxAttempts) {
            attempts++;
            showStatus(`${statusMessage}(${attempts}/${maxAttempts})`);
            setTimeout(checkServers, 1000);
          } else {
            showError('Error: Could not start servers. Please try refreshing the page.');
          }
        }
      } catch (error) {
        console.error('Error checking servers:', error);
        if (attempts < maxAttempts) {
          attempts++;
          showStatus(`Retrying... (${attempts}/${maxAttempts})`);
          setTimeout(checkServers, 1000);
        } else {
          showError('Error: Could not start servers. Please try refreshing the page.');
        }
      }
    };
    
    // Start checking servers after 2s
    setTimeout(checkServers, 2000);
  }, 3000);
};
