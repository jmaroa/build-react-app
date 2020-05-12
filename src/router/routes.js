import { lazy } from 'react';

/**
 * Layouts
 */

/**
 * Lazy load components by webpack chunks
 */
const Login = lazy(() => import('ui/views/Login'));

const routes = [
  /* Public Routes */
  { key: 'login', path: '/login', component: Login },
];

export default routes;
