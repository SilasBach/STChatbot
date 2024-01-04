import { useState } from 'react';
import axios from 'axios';
import dots_loading from './assets/images/dots_loading.svg';

const App: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    setLoading(true);
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
    setLoading(false);
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
        {loading ? (
          <div className="mt-4 flex justify-center">
            <img src={dots_loading} alt="Loading..." />
          </div>
        ) : answer ? (
          <div className="mt-4 rounded-md bg-gray-200 p-2">
            <p>{answer}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default App;
