import { useEffect, useState } from 'react';

function ElapsedTime({ timestamp, type }) {
  const [elapsedTime, setElapsedTime] = useState('');

  useEffect(() => {
    const calculateElapsedTime = () => {
      const currentTime = Date.now();
      if (isNaN(timestamp)) {
        setElapsedTime("")
      } else {
        const timeDifference = currentTime - timestamp;
        
        const hours = Math.floor(timeDifference / 3600000);
        const minutes = Math.floor(timeDifference / 60000);
  
        
        let formattedTime;
        
        if (minutes === 0) {
          formattedTime = `Now`;
        } else if (hours === 0) {
          formattedTime = `${minutes}m ${type=== "text"? "ago": ""}`;
        } else if (hours < 24) {
          formattedTime = `${hours}h ${type=== "text"? "ago": ""}`;
        } else {
          formattedTime = `${Math.floor(hours / 24)}d ${type=== "text"? "ago": ""}`;
        }
        setElapsedTime(formattedTime);
      }
    };

    calculateElapsedTime()

    const interval = setInterval(() => {
      calculateElapsedTime()
    }, 0);

    return () => clearInterval(interval)
  }, [timestamp])

  return <span className="text-[#b1b2bc] group-hover:text-white text-xs"> {type==="text"? elapsedTime : elapsedTime === ""? "": "•"+elapsedTime}</span>;
}

export default ElapsedTime;
