import { useState, useEffect } from 'react';

const SESSION_KEY = 'tunu_session_id';

export const useSessionId = () => {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
    }
    setSessionId(id);
  }, []);

  return sessionId;
};

export const getSessionId = (): string => {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
};
