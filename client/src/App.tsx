import React, { useState, useEffect } from 'react';

function App() {
  const [JumboCashData, setJumboCashData] = useState(null);

  useEffect(() => {
    const fetchSwipes = async () => {
      const response = await fetch("http://localhost:3001/swipes");
      const json = await response.json();
      setJumboCashData(json);
    }

    fetchSwipes();
  }, [])
  
  return (
    <div className="text-center w-full ">
      {JumboCashData 
        ? <p>{JumboCashData["id"]}</p>
        : <p>Loading...</p>
      }
    </div>
  );
}

export default App;
