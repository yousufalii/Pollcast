import React, { useEffect, useState } from 'react';
import io, { connect } from 'socket.io-client';

const PollingSystem = () => {
  const [pollOptions, setPollOptions] = useState([]);
  const [pollResults, setPollResults] = useState({});

  useEffect(() => {
    const socket = io('http://localhost:3000'); // Connect to the server on port 3000

    console.log("connected to io.")

    // Receive initial poll data
    socket.on('pollResults', (results) => {
      const options = Object.keys(results);
      setPollOptions(options);
      setPollResults(results);
    });

    // Receive updated poll results
    socket.on('pollResults', (results) => {
      setPollResults(results);
    });

    return () => {
      socket.disconnect(); // Disconnect from the server on component unmount
    };
  }, []);

  const vote = (option) => {
    const socket = io('http://localhost:3000'); // Connect to the server on port 3000
    socket.emit('vote', option); // Send vote event to the server
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Live Polling/Voting System</h1>
      <div className="flex flex-wrap gap-4">
        {pollOptions.map((option) => (
          <button
            key={option}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => vote(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="mt-8">
        {Object.entries(pollResults).map(([option, count]) => (
          <p key={option} className="text-lg">
            {option}: {count}
          </p>
        ))}
      </div>
    </div>
  );
};

export default PollingSystem;
