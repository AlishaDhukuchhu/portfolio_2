import React, { createContext, useContext, useState } from 'react';

const CursorContext = createContext();

export const CursorProvider = ({ children }) => {
  const [cursorType, setCursorType] = useState('default');
  const [cursorText, setCursorText] = useState('');

  const mouseEnterHandler = (type, text = '') => {
    setCursorType(type);
    setCursorText(text);
  };

  const mouseLeaveHandler = () => {
    setCursorType('default');
    setCursorText('');
  };

  return (
    <CursorContext.Provider value={{ cursorType, cursorText, mouseEnterHandler, mouseLeaveHandler }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => useContext(CursorContext);
