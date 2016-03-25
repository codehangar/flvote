
### Initial Installation
* Clone this repo and check out the `dev` Branch
* In Terminal.app, run: `npm install`

### Database

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

DATABASE_HOST={{host}}
DATABASE_PORT={{post}}
DATABASE_NAME=flvote
```

### How to Run

The database and local enviornment steps should ideally be configured before running the application

```shell
$ npm start
```