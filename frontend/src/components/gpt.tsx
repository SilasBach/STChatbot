import { useState } from 'react';
import axios from 'axios';
import dots_loading from '../assets/images/dots_loading.svg';

const Gpt: React.FC = () => {
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
    <div className="grid h-1/2 w-full place-items-center">
      {/* Container for form elements */}
      <div className="w-1/3 rounded-md border border-slate-600 bg-slate-800 bg-opacity-30 p-8 shadow-lg backdrop-blur-lg backdrop-filter">
        <h1 className="mb-6 text-center text-4xl font-bold">Ask a Question</h1>
        <div className="relative my-4">
          <input
            type="text"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-white focus:border-blue-600 focus:text-white focus:outline-none focus:ring-0 dark:focus:border-blue-500"
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button
            className="mt-6 w-full rounded bg-blue-500 py-2 text-[18px] text-white transition-colors duration-300 hover:bg-blue-600"
            onClick={askQuestion}
          >
            Ask
          </button>
        </div>
      </div>

      {/* Separate container for the answer */}
      {loading ? (
        <div className="mt-4 flex justify-center">
          <img src={dots_loading} alt="Loading..." />
        </div>
      ) : answer ? (
        <div className="mt-4 w-1/2 rounded-md border  border-slate-600 bg-slate-800 bg-opacity-30 p-8 text-white shadow-lg backdrop-blur-lg backdrop-filter">
          <p className="text-white">{answer}</p>
        </div>
      ) : null}
    </div>
  );
};

export default Gpt;
