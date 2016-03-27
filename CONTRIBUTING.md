
### Initial Installation
* Clone this repo and check out the `dev` Branch
* In Terminal.app, run: `npm install`

### Database Setup

Use this tutorial to configure a tool called Kitematic
IMPORTANT!!! - Instead of using mongodb/redis like the tutorial explains use rethinkdb in Kitematic instead, everthing else will be similar.
http://codehangar.io/local-dbs-with-ease-ft-kitematic-from-docker-toolbox/

```shell
$ npm run setupdb
```

### Local Environment

To test locally, be sure to include a file named `.env` in the root of the project with the following settings:

```shell
TWITTER_CONSUMER_KEY={{your_key}}
TWITTER_CONSUMER_SECRET={{your_secret}}

TWITTER_ACCESS_TOKEN={{your_token}}
TWITTER_ACCESS_TOKEN_SECRET={{your_secret}}

# ReThink DB
DATABASE_HOST={{host}}
DATABASE_PORT={{post}}
DATABASE_NAME=flvote

# Remote Database
DATABASE_REMOTE_HOST=localhost
DATABASE_REMOTE_PORT=28015
DATABASE_REMOTE_KEY={{value}}
```

### How to Run

The database and local enviornment steps should ideally be configured before running the application

```shell
$ npm start
```

## Useful Tasks/Scripts

### Setup Database

The following command will setup the database, tables, and index's needed for local development.

```shell
npm run setupdb
```

### Generate Auth Key

This command will generate and set an authkey on your current rethink database connection settings. Remember to copy and paste the output of this command to your .env file.

```shell
npm run generateauthkey
```

### Reset Auth Key

This command will set your rethinkdb authkey back to null. You must have your old auth key in your .env file before you do this. After the command has successfully been executed you can leave your DATABASE_KEY {{value}} empty.

```shell
npm run resetauthkey
```

### SSH tunnel to remote database server

This command will open up a ssh tunnel for a remote server. Running the command will prompt you for the following:

- localPort (Local port to bind ssh tunnel too)
- remotePort (Remote port to bind ssh tunnel too)
- remoteUser (Remote ssh user)
- remoteHost (Remote host ip address or domain)

```shell
npm run sshremoteserver
```

### Clone RethinkDB remote database

This command is dependant on the Remote Database .env variables. You will also need the ssh tunnel command running before this will work. This command will connect to the remote database and prompt the user to select a remote database to clone. It will then clone down that remote database to your local database connection.

```shell
npm run cloneremotedb
```