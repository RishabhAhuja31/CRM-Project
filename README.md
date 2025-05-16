1. Set Environment Variables

.env for CRM-backend
PORT=5000
MONGODB_URI=your_mongo_uri
OPENAI_API_KEY=your_openai_api_key
CLERK_SECRET_KEY=your_clerk_secret

.env for CRM
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

2. Install Dependencies
cd crm
npm install

3. Run Development Servers
cd CRM-backend
 node server.js

4. Start frontend
cd ../client
npm start