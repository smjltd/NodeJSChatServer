//console.log('S.M.J');
var mongo = require('mongodb').MongoClient,
client = require('socket.io').listen(8080).sockets;

mongo.connect('mongodb://10.42.0.1/chat', function(err, db){
	if(err) throw err;

	client.on('connection', function(socket){ 
		//console.log('A Client Connected');
               var col = db.collection('messages');

		//sendStatus = function(s) {
		//	socket.emit('status',s);
		//};

		//Emit All Messages
		col.find().limit(100).sort({_id: 1}).toArray(function(err, res){
			if(err) throw err;
			socket.emit('output',res);
			});
		
		
		
		// wait for input
                socket.on('input',function(data){

		sendStatus = function(s) {
			socket.emit('status',s);
		};

		//console.log(data);
		  var name = data.name,
	          	message = data.message,
		 	whitespacePattern = /^\s*$/;

			if(whitespacePattern.test(name) || whitespacePattern.test(message) ){
				//console.log('Blank Space Detected');
				sendStatus('Empty Field');
				}
			else{
				 col.insert({name: name,message: message}, function() {

				//Emit latest message to All Clients
				client.emit('output',[data]);

			         //console.log('Message inserted');
				 sendStatus({message: "Sent",clear: true
					});
                     		});	
			}
		   

		});



	});

});

