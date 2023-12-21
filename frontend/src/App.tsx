import { useState } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const askQuestion = async () => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/ask',
        {
          question: question,
          chat_history: [],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      setAnswer(response.data.answer);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <div className="rounded-md bg-white p-4 shadow-md">
        <input
          type="text"
          className="w-64 rounded-md border border-gray-300 p-2"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          className="ml-2 mt-2 rounded-md bg-blue-500 p-2 text-white"
          onClick={askQuestion}
        >
          Ask
        </button>
        {answer && (
          <div className="mt-4 rounded-md bg-gray-200 p-2">
            <p>{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
