/**
 * Helper script to get admin token via login
 * This script logs in as admin and retrieves the token
 * 
 * Usage: node get-admin-token.js <username> <password>
 * 
 * Example:
 * node get-admin-token.js admin_user mypassword
 */

const http = require('http');

const API_URL = 'http://localhost:5000';

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log(`
Usage: node get-admin-token.js <username> <password>

This script logs in as an admin user and retrieves the JWT token.

Example:
  node get-admin-token.js admin_user mypassword

Note: The user must have privilege_level = 'admin' in the database.
`);
  process.exit(1);
}

const username = args[0];
const password = args[1];

// Prepare request data
const data = JSON.stringify({
  username: username,
  password: password
});

const url = new URL(`${API_URL}/api/auth/login`);

const options = {
  hostname: url.hostname,
  port: url.port || 5000,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('Logging in as admin...');
console.log(`Username: ${username}`);
console.log('');

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(responseData);
      
      if (res.statusCode === 200 && response.token) {
        // Check if user is admin
        if (response.user.privilege_level !== 'admin') {
          console.error('❌ Error: This user is not an admin.');
          console.error(`   Privilege level: ${response.user.privilege_level}`);
          console.error('   Please login with an admin account.');
          process.exit(1);
        }

        console.log('✅ Login successful!');
        console.log('');
        console.log('Admin Token:');
        console.log('─'.repeat(80));
        console.log(response.token);
        console.log('─'.repeat(80));
        console.log('');
        console.log('User Info:');
        console.log(`  ID: ${response.user.id}`);
        console.log(`  Username: ${response.user.username}`);
        console.log(`  Privilege Level: ${response.user.privilege_level}`);
        console.log('');
        console.log('You can now use this token with the add-instrument script:');
        console.log(`  node add-instrument.js <lab_id> <instrument_name> "${response.token}" [is_working]`);
        console.log('');
        console.log('Or use it in cURL:');
        console.log(`  curl -X POST http://localhost:5000/api/equipment/add-instrument \\`);
        console.log(`    -H "Content-Type: application/json" \\`);
        console.log(`    -H "Authorization: Bearer ${response.token}" \\`);
        console.log(`    -d '{"lab_id": 19, "instrument_name": "New Instrument", "is_working": 1, "admin_password": "admin@123"}'`);
      } else {
        console.error('❌ Login failed:', response.error || responseData);
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

