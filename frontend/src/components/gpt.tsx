import { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import dots_loading from '../assets/images/dots_loading.svg'; // Loading image asset

const Gpt: React.FC = () => {
  // State to store the user's question
  const [question, setQuestion] = useState('');
  // State to store the generated answer
  const [answer, setAnswer] = useState('');
  // State to indicate whether the request is being processed
  const [loading, setLoading] = useState(false);

  // Function to handle asking a question
  const askQuestion = async () => {
    setLoading(true); // Set loading state to true while processing
    try {
      // Make a POST request to the backend with the question
      const response = await axios.post(
        'http://127.0.0.1:8000/ask',
        {
          question: question,
          chat_history: [], // Additional data can be sent if required
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      // Update the answer state with the response from the server
      setAnswer(response.data.answer);
    } catch (error) {
      // Log errors if any
      console.error(error);
    }
    setLoading(false); // Reset loading state after processing
  };

  return (
    // Main container for the component
    <div className="grid h-1/2 w-full place-items-center">
      {/* Container for input field and submit button */}
      <div className="w-1/3 rounded-md border border-slate-600 bg-slate-800 bg-opacity-30 p-8 shadow-lg backdrop-blur-lg backdrop-filter">
        <h1 className="mb-6 text-center text-4xl font-bold">Ask a Question</h1>
        {/* Input field for the question */}
        <div className="relative my-4">
          <input
            type="text"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-white focus:border-blue-600 focus:text-white focus:outline-none focus:ring-0 dark:focus:border-blue-500"
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)} // Update question state on input change
          />
          {/* Button to submit the question */}
          <button
            className="mt-6 w-full rounded bg-blue-500 py-2 text-[18px] text-white transition-colors duration-300 hover:bg-blue-600"
            onClick={askQuestion} // Trigger askQuestion on click
          >
            Ask
          </button>
        </div>
      </div>

      {/* Container to display the answer or loading indicator */}
      {loading ? (
        // Display loading indicator while processing
        <div className="mt-4 flex justify-center">
          <img src={dots_loading} alt="Loading..." />
        </div>
      ) : answer ? (
        // Display the answer if available
        <div className="mt-4 w-1/2 rounded-md border  border-slate-600 bg-slate-800 bg-opacity-30 p-8 text-white shadow-lg backdrop-blur-lg backdrop-filter">
          <p className="text-white">{answer}</p>
        </div>
      ) : null}
    </div>
  );
};

export default Gpt;
