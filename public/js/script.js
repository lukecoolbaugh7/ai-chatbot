const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; 
const recognition = new SpeechRecognition(); 
const socket = io(); 

const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');

startBtn.addEventListener('click', () => {
    recognition.start(); 
    startBtn.style.display = 'none';
    stopBtn.style.display = 'inline-block';
}); 

stopBtn.addEventListener('click', () => {
    recognition.stop();
    appendMessage(tempText, 'user-message'); 
    socket.emit('chat message', tempText); 
    tempText = ''; 
    stopBtn.style.display = 'none';
    startBtn.style.display = 'inline-block';
});


let tempText = ''; 

recognition.addEventListener('result', (e) => {
    let last = e.results.length - 1; 
    tempText = e.results[last][0].transcript; 
    //appendMessage(text, 'user-message'); 

    console.log('Confidence: ' + e.results[0][0].confidence); 

    // socket.emit('chat message', text);  
}); 

socket.on('bot reply', function(replyText) {
    synthVoice(replyText); 
     

    if(replyText == '') replyText = '(No answer...)';
    appendMessage(replyText, 'bot-message');
}); 

function synthVoice(text) {
    const synth = window.speechSynthesis; 
    const utterance = new SpeechSynthesisUtterance(); 
    utterance.text = text; 
    synth.speak(utterance); 
}

function appendMessage(text, className) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message', className);
    messageContainer.textContent = text;
    document.getElementById('chat-window').appendChild(messageContainer);
    document.getElementById('chat-window').scrollTop = document.getElementById('chat-window').scrollHeight; // Scroll to the bottom
}