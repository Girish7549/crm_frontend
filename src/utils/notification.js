export const playSound = () => {
    const audio = new Audio("/notification.mp3"); // Public folder me daal de sound
    audio.play();
  };
  
  export const showNotification = (title, message) => {
    toast.info(`${title}: ${message}`, {
      position: "top-right",
      autoClose: 5000,
      theme: "light",
    });
  };
  