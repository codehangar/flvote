'use strict';

try {
  // Loads environment settings from '.env' into process.env
  // This is for local development
  require('dotenv').load();
} catch (e) {
  console.log('.env file not found')
}

var prompt = require('prompt');
var exec = require('child_process').exec;
var chalk = require('chalk');

prompt.start();

prompt.get(['localPort', 'remotePort', 'remoteUser', 'remoteHost'], function(err, results) {
	var command = 'ssh -L ' + results.localPort + ':localhost:' + results.remotePort + ' ' + results.remoteUser + '@' + results.remoteHost;
  	console.log(chalk.green('Connected to ' + results.remoteHost + ':' + results.remotePort + ' on localhost:' + results.localPort));
  	console.log(chalk.green('Keep this process running to maintain the connection'));
	exec(command, function(err, stdout, stderr) {
	  if (err !== null) {
	    console.log(chalk.red('failed to ssh tunnel to remote host and port'));
	  }
	});
});
