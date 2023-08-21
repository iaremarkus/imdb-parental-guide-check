import { useState } from "react";

const messages = [
  "Reeling in the parental deets for you...",
  "Bringing the movie lowdown just in time for the countdown!",
  "Asking the movie guardians for guidance...",
  "Just checking which scenes to cover your eyes for...",
  "Cue the suspenseful music... Fetching info!",
  "Diving behind the scenes for the scoop...",
  "Parental guide on its way! Stay tuned...",
  "Sifting through the movie reels for you...",
  "Lights, Camera, Fetching!",
  "Scouring the film vault. One moment please..."
];

export const useLoadingMessages = () => {
  const [message, setMessage] = useState<string | undefined>();
  let interval: NodeJS.Timeout;

  const startMessages = () => {
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
    interval = setInterval(() => setMessage(messages[Math.floor(Math.random() * messages.length)]), 2000);
  };

  const stopMessages = () => {
    clearInterval(interval);
    setMessage(undefined);
  };

  return { message, startMessages, stopMessages };
};
