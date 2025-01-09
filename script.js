const API_KEY = 'AIzaSyD57y3Eap0meO-vKcdKhj-f7B4DywydVUU';
        const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

        const chatMessages = document.getElementById('chat-messages');
        const userInput = document.getElementById('user-input');
        const sendButton = document.getElementById('send-button');
        const typingIndicator = document.getElementById('typing-indicator');

        async function sendMessage() {
            const message = userInput.value.trim();
            if (!message) return;

            // Add user message to chat
            addMessage(message, 'user-message');
            userInput.value = '';

            // Show typing indicator
            typingIndicator.style.display = 'block';

            try {
                const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: message
                            }]
                        }]
                    })
                });

                const data = await response.json();
                
                // Hide typing indicator
                typingIndicator.style.display = 'none';

                if (data.candidates && data.candidates[0].content.parts[0].text) {
                    const aiResponse = data.candidates[0].content.parts[0].text;
                    addMessage(aiResponse, 'bot-message');
                } else {
                    addMessage('Sorry, I encountered an error. Please try again.', 'bot-message');
                }
            } catch (error) {
                console.error('Error:', error);
                typingIndicator.style.display = 'none';
                addMessage('Sorry, I encountered an error. Please try again.', 'bot-message');
            }
        }

        function addMessage(message, className) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${className}`;
            messageDiv.textContent = message;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Event listeners
        sendButton.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });