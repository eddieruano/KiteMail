var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var scheduler = require('node-schedule');
var imess = require("iMessageModule");
var message;
var recipient;
app.use(bodyParser.json());
Conversations = require('./models/conversations');
//Connect

mongoose.connect('mongodb://localhost/kiteVault');
var db = mongoose.connection;

app.get('/', function(req, res){
	res.send('Wrong command. Use /api/');
});

app.get('/api/conversations', function(req, res){
	Conversations.getConversations(function(err, conversations){
		if(err){
			throw err;
		}
		//res.json({recipient: 'John', type: "Titties"});
		res.json(conversations);
	});
});

app.post('/api/send', function(req,res){
	recipient = req.body.r;
	message = req.body.p;
	
	var delay = parseInt(req.body.d);

	var pullback = parseInt(req.body.pull);

	//set start
	var start = new Date(Date.now());
	var sendTime = new Date(start.getTime() + (delay * 1000)); 
	if (pullback == 0)
	{
		res.json({status:"pulled"});
		return;
	}
	if (delay != 0)
	{
		scheduler.scheduleJob(sendTime, function(err){
			if(err){
				throw err;
			}
			if (delay >0)
			{
				var delayed = "\n\n*This message was delayed by " +delay.toString()+" seconds*";
				message = message + delayed;
			}
			deliver(recipient,message);
			res.json({status: "Success"});
		});

	}
	else
	{
		deliver(recipient,message);
		res.json({status: "Success"});
	}
});


app.post('/api/undo', function(req,res){
	command = req.body.command;
	if (err)
	{
		throw err;
	}
	scheduler.cancel();
	res.json({status: "Success Cancel"});
});
function deliver(recipient, message){
	imess.sendMessage(recipient, message);
}

app.listen(9000);
console.log('Started Service');