import { useEffect, useState } from 'react';

const CallbackTimer = ({ scheduledTime }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const target = new Date(scheduledTime);
      const diffMs = target - now;

      if (diffMs > 0) {
        const mins = Math.floor(diffMs / 1000 / 60);
        const secs = Math.floor((diffMs / 1000) % 60);
        setTimeLeft(`${mins} min ${secs} sec remaining`);
      } else {
        setTimeLeft('Time Passed');
      }
    };

    updateTimer(); 
    const interval = setInterval(updateTimer, 1000); 

    return () => clearInterval(interval); 
  }, [scheduledTime]);

  return <span style={{ color: '#0070f3' , fontSize:'20px', fontWeight:'800'}}>{timeLeft}</span>;
};


export default CallbackTimer