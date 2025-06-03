const { spawn } = require('child_process');
const path = require('path');
const express = require('express');
const app = express();
const port = 3001;

// Serve static files from the loading page directory
app.use(express.static(__dirname));

// Serve the login page directory as static files under /login
app.use('/login', express.static(path.join(__dirname, '../login page/Modern Login Page Design')));

// Serve the org_login page directory as static files under /org_login
app.use('/org_login', express.static(path.join(__dirname, '../org_login page/aicte-tracker')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// THIS MUST BE LAST: fallback to loading page index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Function to start a process with error handling
function startProcess(command, args, cwd) {
  console.log(`Starting process in directory: ${cwd}`);
  console.log(`Command: ${command} ${args.join(' ')}`);

  const process = spawn(command, args, {
    cwd: cwd,
    stdio: 'inherit',
    shell: true
  });

  process.on('error', (error) => {
    console.error(`Failed to start ${command}:`, error);
  });

  process.on('exit', (code) => {
    if (code !== 0) {
      console.error(`${command} process exited with code ${code}`);
    }
  });

  return process;
}

// Start the backend server
console.log('Starting backend server...');
const backendProcess = startProcess('node', ['server.js'], path.join(__dirname, '../backend'));

// Start the React app
console.log('Starting React app...');
console.log('Installing React app dependencies...');
const installProcess = startProcess('npm', ['install'], path.join(__dirname, '../choice/photo-sparkle-motion-5f47131a'));

installProcess.on('exit', (code) => {
  if (code === 0) {
    console.log('Dependencies installed successfully, starting React app...');
    const frontendProcess = startProcess('npm', ['run', 'dev'], path.join(__dirname, '../choice/photo-sparkle-motion-5f47131a'));
  } else {
    console.error('Failed to install React app dependencies');
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down servers...');
  backendProcess.kill();
  process.exit();
});

// Start the loading page server with error handling
const server = app.listen(port, () => {
  console.log(`Loading page server running at http://localhost:${port}`);
  console.log('Waiting for backend and frontend to start...');
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Please try a different port or close the application using this port.`);
    process.exit(1);
  } else {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}); 