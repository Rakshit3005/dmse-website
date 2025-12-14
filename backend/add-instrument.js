/**
 * Script to add a new instrument to the system
 * Usage: node add-instrument.js <lab_id> <instrument_name> [is_working] [admin_token]
 * 
 * Example:
 * node add-instrument.js 1 "New Microscope" 1 "your-jwt-token-here"
 * 
 * Note: You need to be logged in as admin and provide your JWT token
 * To get your token, login through the frontend and check the browser's localStorage or network tab
 */

const http = require('http');

// Configuration
const API_URL = 'http://localhost:5000';
const ADMIN_PASSWORD = 'admin@123';

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 3) {
  console.log(`
Usage: node add-instrument.js <lab_id> <instrument_name> <admin_token> [is_working]

Arguments:
  lab_id          - ID of the lab (integer)
  instrument_name - Name of the instrument (string, use quotes if it contains spaces)
  admin_token     - JWT token from admin login
  is_working      - Optional: 1 for working, 0 for not working (default: 1)

Example:
  node add-instrument.js 1 "AFM Microscope" "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

To get your admin token:
  1. Login as admin through the frontend
  2. Open browser DevTools (F12)
  3. Go to Application/Storage > Local Storage
  4. Find the 'token' key and copy its value
  OR
  4. Go to Network tab, make any API call, and check the Authorization header
`);
  process.exit(1);
}

const lab_id = parseInt(args[0]);
const instrument_name = args[1];
const admin_token = args[2];
const is_working = args[3] !== undefined ? parseInt(args[3]) : 1;

if (isNaN(lab_id)) {
  console.error('Error: lab_id must be a number');
  process.exit(1);
}

if (is_working !== 0 && is_working !== 1) {
  console.error('Error: is_working must be 0 or 1');
  process.exit(1);
}

// Prepare request data
const data = JSON.stringify({
  lab_id: lab_id,
  instrument_name: instrument_name,
  is_working: is_working,
  admin_password: ADMIN_PASSWORD
});

const url = new URL(`${API_URL}/api/equipment/add-instrument`);

const options = {
  hostname: url.hostname,
  port: url.port || 5000,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Authorization': `Bearer ${admin_token}`
  }
};

console.log('Adding instrument...');
console.log(`Lab ID: ${lab_id}`);
console.log(`Instrument Name: ${instrument_name}`);
console.log(`Is Working: ${is_working}`);
console.log('');

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(responseData);
      
      if (res.statusCode === 201) {
        console.log('✅ Success! Instrument added successfully.');
        console.log('');
        console.log('Instrument Details:');
        console.log(`  Instrument ID: ${response.instrument.instrument_id}`);
        console.log(`  Lab ID: ${response.instrument.lab_id}`);
        console.log(`  Lab Name: ${response.instrument.lab_name}`);
        console.log(`  Instrument Name: ${response.instrument.instrument_name}`);
        console.log(`  Is Working: ${response.instrument.is_working}`);
        console.log('');
        console.log('The instrument is now available for booking!');
      } else {
        console.error('❌ Error:', response.error || responseData);
        process.exit(1);
      }
    } catch (e) {
      console.error('❌ Error parsing response:', responseData);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error.message);
  console.error('Make sure the backend server is running on', API_URL);
  process.exit(1);
});

req.write(data);
req.end();

