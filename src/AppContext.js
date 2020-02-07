import { createContext } from 'react';

export function initContext() {
  const persitent = localStorage.getItem('ctx');
  if (!persitent) {
    return {};
  }
  return JSON.parse(persitent);
}

export default createContext({ data: initContext(), update: () => {} });
