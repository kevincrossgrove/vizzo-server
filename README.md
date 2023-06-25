# vizzo-server

### Server Setup
1. `cd server`
2. `npm install`
3. Open 2 Terminals
4. In one terminal, run `npm run devBuild`
5. In the other terminal, ren `npm run devStart`

### Client Setup
1. `cd client`
2. `npm install`
3. `npm run dev`

### Database Setup
1. Install Docker Desktop
2. Create a folder for your local MongoDB database files
3. Run this command but using your folder location
   `docker run --name vizzo-mongodb -p 27017:27017 -v "/path/to/folder/on/desktop:/data/db" -d mongo`
4. 

