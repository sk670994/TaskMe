import { Component } from 'react';
import Tasks from 'views/Tasks/Tasks.jsx';

const routes = [
  {
    name : 'Tasks',
    path: '/tasks',
    element: <Tasks />,
    Component : Tasks
  },
];

export default routes;
