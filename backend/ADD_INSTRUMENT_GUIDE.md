# How to Add a New Instrument

This guide explains how to add a new instrument to the system. **Only admins can add instruments**, and the admin password (`admin@123`) is required.

## Prerequisites

1. You must be logged in as an **admin** user
2. You need your **JWT token** from the admin login session
3. The backend server must be running on `http://localhost:5000`

## Method 1: Using the Node.js Script (Easiest)

A helper script is provided at `backend/add-instrument.js`.

### Step 1: Get Your Admin Token

**What is admin_token?**
The admin_token is a JWT (JSON Web Token) that proves you're logged in as an admin. It's automatically generated when you login and stored in your browser.

**Option A: Get Token via Helper Script (Easiest)**
```bash
cd backend
node get-admin-token.js <your_admin_username> <your_password>
```

This will automatically login and display your token.

**Option B: Get Token from Browser**
1. Login as admin through the frontend at `http://localhost:3000/login`
2. Open browser DevTools (F12)
3. Go to **Application** tab > **Local Storage** > `http://localhost:3000`
4. Find the `token` key and copy its value (it's a long string like `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - OR check the **Network** tab for any API call and look at the `Authorization` header
   - OR in Console tab, type: `localStorage.getItem('token')`

### Step 2: Run the Script

```bash
cd backend
node add-instrument.js <lab_id> <instrument_name> <admin_token> [is_working]
```

**Parameters:**
- `lab_id` - The ID of the lab (integer, e.g., 1, 2, 19)
- `instrument_name` - Name of the instrument (use quotes if it contains spaces)
- `admin_token` - Your JWT token from admin login
- `is_working` - Optional: `1` for working (default), `0` for not working

**Example:**
```bash
node add-instrument.js 19 "New AFM Machine" "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." 1
```

## Method 2: Using cURL (Terminal)

### Step 1: Get Your Admin Token

Same as Method 1, Step 1.

### Step 2: Make the API Call

```bash
curl -X POST http://localhost:5000/api/equipment/add-instrument \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE" \
  -d "{
    \"lab_id\": 19,
    \"instrument_name\": \"New AFM Machine\",
    \"is_working\": 1,
    \"admin_password\": \"admin@123\"
  }"
```

**Replace:**
- `YOUR_ADMIN_TOKEN_HERE` with your actual JWT token
- `19` with the actual lab_id
- `"New AFM Machine"` with your instrument name
- `1` with `0` if the instrument is not working

**Example:**
```bash
curl -X POST http://localhost:5000/api/equipment/add-instrument \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHJpdmlsZWdlX2xldmVsIjoiYWRtaW4iLCJpYXQiOjE3MzUwMDAwMDB9.example" \
  -d "{\"lab_id\": 19, \"instrument_name\": \"New AFM Machine\", \"is_working\": 1, \"admin_password\": \"admin@123\"}"
```

## Method 3: Using PowerShell (Windows)

```powershell
$token = "YOUR_ADMIN_TOKEN_HERE"
$body = @{
    lab_id = 19
    instrument_name = "New AFM Machine"
    is_working = 1
    admin_password = "admin@123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/equipment/add-instrument" `
    -Method Post `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $token"
    } `
    -Body $body
```

## Method 4: Direct SQL (Not Recommended, but Fastest for Testing)

If you want to quickly test without authentication (for development only):

```bash
sqlite3 lab_system.db "INSERT INTO instruments (lab_id, instrument_name, is_working) VALUES (19, 'New AFM Machine', 1);"
```

**⚠️ Warning:** This bypasses all validation and security checks. Use only for quick testing.

## Finding Lab IDs

To see all available labs and their IDs:

```bash
sqlite3 lab_system.db "SELECT id, name FROM labs;"
```

Or use the API:
```bash
curl http://localhost:5000/api/equipment/labs
```

## Response

On success, you'll receive:

```json
{
  "message": "Instrument added successfully",
  "instrument": {
    "instrument_id": 130,
    "lab_id": 19,
    "lab_name": "AFM TR Lab",
    "instrument_name": "New AFM Machine",
    "is_working": 1
  }
}
```

## Verification

After adding, verify the instrument appears:

1. Check the database:
   ```bash
   sqlite3 lab_system.db "SELECT * FROM instruments WHERE instrument_name = 'New AFM Machine';"
   ```

2. Or check via API:
   ```bash
   curl http://localhost:5000/api/equipment/instruments/19
   ```

3. Or visit the frontend booking page for that lab

## Important Notes

- ✅ Only admins can add instruments
- ✅ Admin password (`admin@123`) is required in the request body
- ✅ The instrument will be immediately available for booking (if `is_working = 1`)
- ✅ Bookings will go to the lab supervisor for approval/rejection
- ✅ Multiple instruments with the same name in the same lab are allowed (they share availability)

## Troubleshooting

**Error: "Admin privileges required"**
- Make sure you're logged in as an admin user
- Check that your JWT token is valid and not expired

**Error: "Invalid admin password"**
- Make sure you're sending `admin_password: "admin@123"` in the request body

**Error: "Lab not found"**
- Verify the lab_id exists using: `sqlite3 lab_system.db "SELECT id, name FROM labs;"`

**Error: Connection refused**
- Make sure the backend server is running: `cd backend && npm start` or `node server.js`

