import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  const [votes, setVotes] = useState({});

  useEffect(() => {
    // Receive the initial vote count from the server
    socket.on('voteCount', (voteCount) => {
      setVotes(voteCount);
    });

    // Clean up socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleVote = (option) => {
    // Send the vote to the server
    socket.emit('vote', option);
  };

  const calculateVotePercentage = (option) => {
    const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
    if (totalVotes === 0) {
      return 0;
    }
    return ((votes[option] || 0) / totalVotes) * 100;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">POLLCAST: Live Voting</h1>
      <h2 className="text-2x1 font-bold mb-2">Who is the best batsman in the world?</h2>
      <br />
      <div className="flex mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
          onClick={() => handleVote('optionA')}
        >
          Babar Azam
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleVote('optionB')}
        >
          Virat Kohli
        </button>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">Vote Count:</h3>
        <div className="mb-4">
          <p className="flex items-center mb-1">
            Babar Azam: <span className="bg-blue-200 h-4" style={{ width: `${calculateVotePercentage('optionA')}%` }}></span> {votes.optionA || 0}
          </p>
        </div>
        <div className="mb-4">
          <p className="flex items-center mb-1">
            Virat Kohli: <span className="bg-blue-200 h-4" style={{ width: `${calculateVotePercentage('optionB')}%` }}></span> {votes.optionB || 0}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
