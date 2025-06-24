import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Tasks from './views/Tasks/Tasks.jsx';
import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme';
import { useState } from 'react';

export default function App() {
  const [currentTheme] = useState(initialTheme);

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </ChakraProvider>
  );
}
