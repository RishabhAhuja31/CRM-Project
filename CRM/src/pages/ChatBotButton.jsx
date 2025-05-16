import React, { useState } from 'react';
import './ChatBotButton.css';

function ChatBotButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi there, enter segment name.' },
  ]);
  const [input, setInput] = useState('');
  const [conditions, setConditions] = useState([]);
  const [segmentName, setSegmentName] = useState('');
  const [step, setStep] = useState(1); // 1=waiting name, 2=waiting conditions, 3=ready to save

  const toggleOpen = () => setOpen(!open);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userInput = input.trim();
    setMessages((prev) => [...prev, { from: 'user', text: userInput }]);
    setInput('');

    if (step === 1) {
      // Step 1: user enters segment name
      setSegmentName(userInput);
      setMessages((prev) => [...prev, { from: 'bot', text: `Tell me the conditions.` }]);
      setStep(2);
      return;
    }

    if (step === 2) {
      // Step 2: user enters conditions to parse and preview audience
      setMessages((prev) => [...prev, { from: 'bot', text: 'Parsing conditions...' }]);
      const loadingIndex = messages.length + 1;

      try {
        // Call NLP parse API
        const nlpResponse = await fetch('http://localhost:5000/api/segments/nlp-parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: userInput }),
        });

        if (!nlpResponse.ok) throw new Error('NLP parse API failed');
        const nlpData = await nlpResponse.json();

        if (nlpData.success && nlpData.conditions) {
          setConditions(nlpData.conditions);

          // Call audience preview API
          const previewResponse = await fetch('http://localhost:5000/api/segments/preview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conditions: nlpData.conditions }),
          });

          if (!previewResponse.ok) throw new Error('Audience preview API failed');
          const previewData = await previewResponse.json();

          if (previewData.success && previewData.count !== undefined) {
            setMessages((prev) => {
              const withoutLoading = prev.slice(0, loadingIndex);
              return [...withoutLoading, { from: 'bot', text: `Audience size: ${previewData.count} customers.` }];
            });
            setStep(3);
          } else {
            setMessages((prev) => {
              const withoutLoading = prev.slice(0, loadingIndex);
              return [...withoutLoading, { from: 'bot', text: 'Could not get audience size.' }];
            });
          }
        } else {
          setMessages((prev) => {
            const withoutLoading = prev.slice(0, loadingIndex);
            return [...withoutLoading, { from: 'bot', text: 'Sorry, I could not parse those conditions.' }];
          });
        }
      } catch (error) {
        setMessages((prev) => {
          const withoutLoading = prev.slice(0, loadingIndex);
          return [...withoutLoading, { from: 'bot', text: `Error: ${error.message}` }];
        });
      }
      return;
    }

    if (step === 3) {
      // Step 3: waiting for "Save this segment" command
      try {
        const response = await fetch('http://localhost:5000/api/segments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: segmentName, conditions }),
        });
        const data = await response.json();
    
        if (data.success) {
          setMessages((prev) => [...prev, { from: 'bot', text: 'Segment saved successfully!' }]);
          setSegmentName('');
          setConditions([]);
    
          // Check if on segmentation page, then reload
          if (window.location.pathname === '/segmentations') {
            setTimeout(() => {
              window.location.reload();
            }, 1000); // Delay a bit so user sees success message
          }
        } else {
          setMessages((prev) => [...prev, { from: 'bot', text: 'Error saving segment.' }]);
        }
      } catch (error) {
        setMessages((prev) => [...prev, { from: 'bot', text: `Error: ${error.message}` }]);
      }
      return;
    }
  };

  return (
    <>
      {open && (
        <div className="chatbot-popup">
          <div className="chatbot-header">
            <span>ChatBot</span>
            <button onClick={toggleOpen}>X</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chatbot-message ${msg.from === 'bot' ? 'bot' : 'user'}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}

      <button className="chatbot-toggle-btn" onClick={toggleOpen}>
        💬
      </button>
    </>
  );
}

export default ChatBotButton;
