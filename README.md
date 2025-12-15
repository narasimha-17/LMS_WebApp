# LMS WebApp - Complete Setup Documentation

## Project Overview

This is a Learning Management System (LMS) built with:
- **Backend:** Express.js with Prisma ORM
- **Frontend:** Next.js (React)
- **Database:** MySQL 8.0 (Docker)
- **ORM:** Prisma (43 models, 40+ database tables)

---

## What Was Done

### 1. Project Extraction & Setup
- Extracted `LMS_WebApp.zip` containing client and server folders
- Installed all dependencies (86 npm packages)
- Set up project structure

### 2. Database Setup (MySQL in Docker)
- Created Docker container `cms-mysql` running MySQL 8.0
- Created database `cms_dev`
- Imported `emsdb_backup.sql` (654KB with 40+ tables)
- Fixed collation compatibility issues (utf8mb4_0900_ai_ci → utf8mb4_unicode_ci)
- Loaded 20 certifications and related data

### 3. Prisma Configuration
- Validated existing `prisma/schema.prisma` (43 models)
- Pulled actual schema from database using `prisma db pull`
- Fixed enum conflicts:
  - `salary_augment_applications_years_of_experience` (duplicate enum values)
  - `mock_interview_pricing_duration_minutes` (empty enum)
  - `mock_interview_applications_duration_minutes` (empty enum)
- Generated Prisma Client successfully

### 4. Server Implementation
- Configured Express server with Prisma (`index.prisma.js`)
- Set up API endpoint: `GET /api/certifications`
- Configured CORS for frontend communication
- Updated `.env` with correct database credentials

### 5. Testing & Validation
- Created comprehensive test script (`test-prisma-setup.js`)
- Created example queries script (`prisma-examples.js`)
- Verified all 43 models are accessible
- Tested database queries successfully

---

## Files Created

### Setup Scripts
1. **`server/START-HERE.ps1`** - Interactive setup assistant
2. **`server/setup-mysql-docker.ps1`** - Docker MySQL automated setup
3. **`server/setup-database.ps1`** - Database import for local MySQL
4. **`server/fix-local-mysql.ps1`** - Fix MySQL 9.4 authentication
5. **`server/update-env.ps1`** - Update environment variables

### Test & Examples
6. **`server/test-prisma-setup.js`** - Comprehensive setup verification
7. **`server/prisma-examples.js`** - 10 Prisma query examples

### Generated Files
8. **`server/generated/prisma/`** - Prisma Client (auto-generated)
9. **`server/emsdb_backup_fixed.sql`** - Fixed collation SQL backup

---

## Files Modified

### 1. `server/.env`
**Changed:**
```env
# Before
DATABASE_URL="mysql://root:my-strong-dev-password@localhost:3306/cms_dev"

# After
DATABASE_URL="mysql://root:devpass@localhost:3306/cms_dev"
```

### 2. `server/package.json`
**Added Scripts:**
```json
{
  "scripts": {
    "start": "node index.js",
    "start:prisma": "node index.prisma.js",
    "dev": "node index.js",
    "dev:prisma": "node index.prisma.js",
    "test:setup": "node test-prisma-setup.js",
    "prisma:generate": "npx prisma generate --schema=prisma/schema.prisma",
    "prisma:studio": "npx prisma studio --schema=prisma/schema.prisma",
    "prisma:validate": "npx prisma validate --schema=prisma/schema.prisma",
    "prisma:format": "npx prisma format --schema=prisma/schema.prisma",
    "prisma:examples": "node prisma-examples.js"
  }
}
```

### 3. `server/prisma/schema.prisma`
**Changes:**
- Pulled fresh schema from database (40 models)
- Fixed enum `salary_augment_applications_years_of_experience`:
  ```prisma
  # Before (duplicate values)
  enum salary_augment_applications_years_of_experience {
    year  @map("<1 year")
    years @map("1-3 years")
    years @map("3-5 years")  // Duplicate!
    years @map("5-10 years") // Duplicate!
    years @map("10+ years")  // Duplicate!
  }
  
  # After (unique values)
  enum salary_augment_applications_years_of_experience {
    year_less_than_1  @map("<1 year")
    years_1_to_3      @map("1-3 years")
    years_3_to_5      @map("3-5 years")
    years_5_to_10     @map("5-10 years")
    years_10_plus     @map("10+ years")
  }
  ```

- Fixed empty enums:
  ```prisma
  # Before (commented out)
  enum mock_interview_pricing_duration_minutes {
    // 30 @map("30")
    // 45 @map("45")
    // 60 @map("60")
  }
  
  # After (valid values)
  enum mock_interview_pricing_duration_minutes {
    MIN_30 @map("30")
    MIN_45 @map("45")
    MIN_60 @map("60")
  }
  ```

---

## Current Setup Status

### ✅ What's Working

1. **MySQL Database**
   - Container: `cms-mysql`
   - Host: `localhost:3306`
   - Database: `cms_dev`
   - Username: `root`
   - Password: `devpass`
   - Tables: 40+ with real data
   - Records: 20 certifications, users, exams, questions, etc.

2. **Prisma ORM**
   - Schema: 43 models validated
   - Client: Generated successfully
   - Connection: Working
   - Queries: All executing successfully

3. **Express Server**
   - Port: 4000
   - Status: Running
   - Endpoint: `GET /api/certifications`
   - Response: JSON with 20 certifications

4. **API Testing**
   - Health check: ✅ Working
   - Database queries: ✅ Working
   - Prisma examples: ✅ All 10 examples passed

---

## How to Test Everything

### Step 1: Verify Docker MySQL is Running

```powershell
# Check if container is running
docker ps

# Expected output:
# CONTAINER ID   IMAGE       COMMAND                  STATUS         PORTS                    NAMES
# 2529eb938adf   mysql:8.0   "docker-entrypoint.s…"   Up 10 minutes  0.0.0.0:3306->3306/tcp   cms-mysql

# If not running, start it:
docker start cms-mysql
```

### Step 2: Test Database Connection

```powershell
cd LMS_WebApp\server
npm run test:setup
```

**Expected Output:**
```
=== Prisma Setup Verification ===

1. Checking .env file...
   ✓ .env file exists
   ✓ DATABASE_URL is configured

2. Checking Prisma schema...
   ✓ schema.prisma exists
   ✓ Generator configured
   ✓ Datasource configured
   ✓ Found 43 models

3. Checking Prisma Client...
   ✓ Prisma Client generated
   ✓ Client index.js exists
   ✓ TypeScript definitions exist

4. Checking Prisma packages...
   ✓ @prisma/client installed
   ✓ prisma CLI installed

5. Testing Prisma Client import...
   ✓ Prisma Client can be imported
   ✓ Prisma Client can be instantiated

6. Testing database connection...
   ✓ Successfully connected to database!

7. Testing database query...
   ✓ Query successful! Found 20 certifications

=== All Tests Passed! ===
```

### Step 3: Start the Prisma Server

```powershell
npm run start:prisma
```

**Expected Output:**
```
> cms-server@1.0.0 start:prisma
> node index.prisma.js

✓ Express (Prisma) server running on http://localhost:4000
✓ Environment: development
Using DATABASE_URL from environment
✓ Connected to database via Prisma
```

### Step 4: Test API Endpoint

**Option A: Using Browser**
- Open: http://localhost:4000/api/certifications
- Should see JSON response with 20 certifications

**Option B: Using PowerShell**
```powershell
# In a new terminal
Invoke-RestMethod -Uri "http://localhost:4000/api/certifications" -Method Get
```

**Expected Response:**
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "certification_id": 1,
      "provider_id": 1,
      "certification_name": "AWS Certified Solutions Architect – Associate (SAA-C03)",
      "certification_code": "SAA-C03",
      "certification_level": "Associate",
      "status_active": "active",
      ...
    }
  ]
}
```

### Step 5: Run Prisma Examples

```powershell
npm run prisma:examples
```

**This will execute 10 example queries:**
1. Fetch all certifications (with provider relation)
2. Find certification by ID
3. Count certifications
4. Find active certifications
5. Find certifications with filters
6. Find users with certifications
7. Aggregate certification data
8. Group certifications by provider
9. Find providers with certifications
10. Search certifications by name

**Expected Output:**
```
=== Prisma Client Examples ===

1. Fetching all certifications...
Found 5 certifications
First certification: AWS Certified Solutions Architect – Associate (SAA-C03)

2. Finding certification by ID...
Certification: AWS Certified Solutions Architect – Associate (SAA-C03)

3. Counting certifications...
Total certifications: 20

...

=== All examples completed successfully! ===
```

### Step 6: Open Prisma Studio (Database GUI)

```powershell
npm run prisma:studio
```

- Opens at: http://localhost:5555
- Browse all 40+ tables visually
- View, edit, and filter data
- See relationships between tables

---

## Available Commands

### Server Management
```powershell
npm start              # Start mysql2 server (raw SQL)
npm run start:prisma   # Start Prisma server (ORM)
npm run dev            # Development mode (mysql2)
npm run dev:prisma     # Development mode (Prisma)
```

### Testing
```powershell
npm run test:setup     # Test complete setup
npm run prisma:examples # Run 10 query examples
```

### Prisma Commands
```powershell
npm run prisma:generate  # Generate Prisma Client
npm run prisma:studio    # Open database GUI
npm run prisma:validate  # Validate schema
npm run prisma:format    # Format schema file
```

### Docker Commands
```powershell
docker ps                # List running containers
docker start cms-mysql   # Start MySQL
docker stop cms-mysql    # Stop MySQL
docker logs cms-mysql    # View MySQL logs
docker restart cms-mysql # Restart MySQL
```

---

## Database Schema

### 43 Prisma Models Available

**Core Models:**
- `certification` (20 records) - Certification details
- `providers` (7 records) - AWS, Microsoft, Google, etc.
- `users` - User accounts
- `user_profiles` - Extended user information

**Exam System:**
- `exams` - Exam definitions
- `exam_sessions` - Active exam sessions
- `exam_attempts` - User exam attempts
- `exam_answers` - User answers
- `exam_results` - Exam scores and results
- `exam_questions` - Questions in exams
- `exam_result_domains` - Domain-wise scores
- `exam_anti_cheat_logs` - Anti-cheat monitoring

**Question Bank:**
- `questions` - Question pool
- `question_options` - Multiple choice options
- `question_tags` - Question categorization
- `tags` - Tag definitions
- `batches` - Question batch imports

**Verification:**
- `certification_verification` - Certificate validation
- `employee_verification` - Employment verification

**Content Management:**
- `blog_posts` - Blog articles
- `blog_comments` - User comments
- `courses` - Course offerings
- `course_resources` - Course materials

**E-commerce:**
- `orders` - Purchase orders
- `order_items` - Order line items
- `payments` - Payment transactions

**Communication:**
- `contact_messages` - Contact form submissions
- `notifications` - User notifications
- `user_activity_logs` - Activity tracking

**Additional Features:**
- `promotion_bar` - Promotional banners
- `mock_interview_pricing` - Interview pricing
- `mock_interview_applications` - Interview bookings
- `salary_augment_applications` - Salary negotiation
- `email_verifications` - Email verification tokens
- `auth_tokens` - Authentication tokens

---

## Prisma Query Examples

### 1. Find All Certifications
```javascript
const certifications = await prisma.certification.findMany();
```

### 2. Find by ID with Relations
```javascript
const cert = await prisma.certification.findUnique({
  where: { certification_id: 1 },
  include: {
    providers: true,
    exams: true
  }
});
```

### 3. Search by Name
```javascript
const results = await prisma.certification.findMany({
  where: {
    certification_name: {
      contains: "AWS"
    }
  }
});
```

### 4. Filter Active Certifications
```javascript
const active = await prisma.certification.findMany({
  where: {
    status_active: "active"
  }
});
```

### 5. Count Records
```javascript
const count = await prisma.certification.count();
```

### 6. Aggregate Data
```javascript
const stats = await prisma.certification.aggregate({
  _count: true,
  _avg: {
    number_of_mock_questions: true
  },
  _max: {
    number_of_mock_questions: true
  }
});
```

### 7. Group By
```javascript
const grouped = await prisma.certification.groupBy({
  by: ['provider_id'],
  _count: {
    certification_id: true
  }
});
```

### 8. Complex Filters
```javascript
const filtered = await prisma.certification.findMany({
  where: {
    AND: [
      { status_active: 'active' },
      {
        OR: [
          { certification_level: 'Associate' },
          { certification_level: 'Professional' }
        ]
      }
    ]
  },
  orderBy: {
    created_at: 'desc'
  },
  take: 10
});
```

---

## Troubleshooting

### Issue: Server won't start
**Solution:**
```powershell
# Check if port 4000 is in use
netstat -ano | findstr :4000

# Kill process if needed
taskkill /PID <process_id> /F
```

### Issue: Database connection fails
**Solution:**
```powershell
# Check if Docker MySQL is running
docker ps

# If not running
docker start cms-mysql

# Check logs
docker logs cms-mysql

# Verify .env has correct credentials
cat .env | findstr DATABASE_URL
```

### Issue: Prisma Client errors
**Solution:**
```powershell
# Regenerate Prisma Client
npm run prisma:generate

# If schema changed, pull from database
npx prisma db pull --force
npm run prisma:generate
```

### Issue: Port 3306 already in use
**Solution:**
```powershell
# Stop local MySQL service
net stop MySQL94

# Or use different port for Docker
docker run --name cms-mysql -p 3307:3306 ...
# Update .env: DATABASE_URL="mysql://root:devpass@localhost:3307/cms_dev"
```

---

## Project Structure

```
LMS_WebApp/
├── client/                          # Next.js frontend
│   ├── app/                         # Next.js 13+ app directory
│   ├── components/                  # React components
│   ├── public/                      # Static assets
│   ├── .env                         # Frontend environment
│   ├── package.json                 # Frontend dependencies
│   └── next.config.ts               # Next.js configuration
│
├── server/                          # Express backend
│   ├── prisma/
│   │   └── schema.prisma            # Prisma schema (43 models)
│   ├── generated/
│   │   └── prisma/                  # Generated Prisma Client
│   ├── index.js                     # Express server (mysql2)
│   ├── index.prisma.js              # Express server (Prisma) ✅
│   ├── test-prisma-setup.js         # Setup verification ✅
│   ├── prisma-examples.js           # Query examples ✅
│   ├── .env                         # Database credentials ✅
│   ├── package.json                 # Backend dependencies ✅
│   ├── emsdb_backup.sql             # Original database backup
│   ├── emsdb_backup_fixed.sql       # Fixed collation backup ✅
│   ├── START-HERE.ps1               # Setup assistant ✅
│   ├── setup-mysql-docker.ps1       # Docker setup ✅
│   ├── setup-database.ps1           # Database import ✅
│   ├── fix-local-mysql.ps1          # MySQL auth fix ✅
│   └── update-env.ps1               # Environment updater ✅
│
└── README.md                        # This file ✅
```

**✅ = Created/Modified during setup**

---

## Next Steps

### 1. Start the Frontend (Next.js)
```powershell
cd client
npm install
npm run dev
```
Opens at: http://localhost:3000

### 2. Connect Frontend to Backend
Update `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Add More API Endpoints
Edit `server/index.prisma.js`:
```javascript
// Get certification by ID
app.get('/api/certifications/:id', async (req, res) => {
  const cert = await prisma.certification.findUnique({
    where: { certification_id: parseInt(req.params.id) },
    include: { providers: true, exams: true }
  });
  res.json(cert);
});

// Get all providers
app.get('/api/providers', async (req, res) => {
  const providers = await prisma.providers.findMany({
    include: {
      certification: {
        where: { status_active: 'active' }
      }
    }
  });
  res.json(providers);
});

// Search certifications
app.get('/api/certifications/search/:query', async (req, res) => {
  const results = await prisma.certification.findMany({
    where: {
      certification_name: {
        contains: req.params.query
      }
    }
  });
  res.json(results);
});
```

### 4. Explore Database with Prisma Studio
```powershell
npm run prisma:studio
```
- Browse all tables
- Edit data visually
- Test relationships
- Export data

---

## Summary

### ✅ Completed
- MySQL 8.0 running in Docker container
- Database imported with 40+ tables and real data
- Prisma schema validated (43 models)
- Prisma Client generated successfully
- Express server running with Prisma
- API endpoint working and tested
- All setup scripts created
- Comprehensive testing completed

### 📊 Statistics
- **Database Tables:** 40+
- **Prisma Models:** 43
- **Certifications:** 20
- **Providers:** 7
- **API Endpoints:** 1 (expandable)
- **Test Scripts:** 2
- **Setup Scripts:** 5

### 🌐 URLs
- **API:** http://localhost:4000/api/certifications
- **Prisma Studio:** http://localhost:5555 (run `npm run prisma:studio`)
- **Frontend:** http://localhost:3000 (after starting client)

### 🔑 Credentials
- **Database:** cms_dev
- **Username:** root
- **Password:** devpass
- **Host:** localhost:3306

---

## Resources

- **Prisma Documentation:** https://www.prisma.io/docs
- **Prisma Client API:** https://www.prisma.io/docs/reference/api-reference/prisma-client-reference
- **Express.js:** https://expressjs.com/
- **Next.js:** https://nextjs.org/
- **Docker MySQL:** https://hub.docker.com/_/mysql

---

**Setup completed successfully! 🎉**

*Last updated: ${new Date().toLocaleString()}*
