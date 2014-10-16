# How to make chat work

1. Install [Node.js](http://nodejs.org) (also would be installed package manager NPM)

2. Install [MongoDB](http://www.mongodb.org/downloads)

3. Register MongoDB as Windows server (all folders & config file should be created):
`"C:\MongoDB\bin\mongod.exe" --config "C:\MongoDB\mongodb.conf" --install`

4. Install [Git](http://git-scm.com) (check option "Use Git from Windows Command Prompt" during install)

5. Install [Ruby](http://rubyinstaller.org) (check option "Add to system PATH" during install)

6. Install console utility Grunt via NPM (-g mean install globally):
`npm install grunt-cli -g`

7. Install Bower:
`npm install -g bower`

8. Install Yeoman (only for developers):
`npm install -g yo`

9. Install AngularJS generator (only for developers):
`npm install -g generator-angular`

10. Install Forevo for running scrips continuously (for production):
`npm install forever -g`

Or install Nodemon (for development):
`npm install -g nodemon`

11. Instal Ruby Gems (including SASS):
`gem update --system`

12. Install Compass:
`gem install compass --pre`

13. Go to project folder

14. Install frontend libraries:
`bower install`

15. Install backend libraries:
`npm install`

16. Run MongoDB (for Windows, if MongoDB is installed as a service):
`net start MongoDB`

17. Run NodeJS server on production environment (better to use PM2 module, but it doesn't support Windows platform):
`set NODE_ENV=production && forever start -l forever.log -o out.log -e error.log -a -c node server.js`

Or run NodeJS server on developement environment (we can't use Forever because watch task restarts server without "node" command what cause error on Windows platform):
`nodemon -e js --ignore app/ server.js > server.log`

18. Preview chat:
`grunt serve`

# How to check MongoDB records?
1. Go to MongoDB installation folder

2. Run MongoDB:
`bin/mongo`

3. Display list of all tables:
`show dbs`

4. Tablw which we use:
`db`

4. Select chat table:
`use ChatDB`