const express = require('express'); 
const app = express(); 
require('dotenv').config(); 

app.use(express.static(__dirname + '/views')); // html 
app.use(express.static(__dirname + '/public')); // js, css, images
const APIAI_TOKEN = process.env.APIAI_TOKEN; 
const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID;
const apiai = require('apiai')(APIAI_TOKEN);

const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Express server listening at http://localhost:${server.address().port}`);
});


const io = require('socket.io')(server); 
 

app.get('/', (req, res) => {
    res.sendFile('index.html'); 
});  

io.on('connection', function(socket) {
    console.log('user connected'); 

    socket.on('error', function(error) {
        console.error('Socket.IO Error', error); 
    }); 

    socket.on('chat message', (text) => {
        
        // get a reply from API.AI

        let apiaiReq = apiai.textRequest(text, {
            sessionId: APIAI_SESSION_ID
        }); 

        apiaiReq.on('response', (response) => {
            let aiText = response.result.fulfillment.speech; 
            console.log('Bot reply: ' + aiText);
            socket.emit('bot reply', aiText); // send the result back to the browser
        }); 

        apiaiReq.on('error', (error) => {
            console.log(error); 
        }); 

        apiaiReq.end(); 
    }); 
}); 

