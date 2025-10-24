import { lazy } from 'react';
import { Tool } from '../types';
import Home from '../components/tools/Home';

// Lazy load tool components for code splitting
const PasswordGenerator = lazy(() => import('../components/tools/PasswordGenerator'));
const PasswordStrength = lazy(() => import('../components/tools/PasswordStrength'));
const WordCounter = lazy(() => import('../components/tools/WordCounter'));
const JsonBeautifier = lazy(() => import('../components/tools/JsonBeautifier'));
const QrGenerator = lazy(() => import('../components/tools/QrGenerator'));
const UnitConverter = lazy(() => import('../components/tools/UnitConverter'));

export const tools: Tool[] = [
  {
    id: 'home',
    name: 'Home',
    icon: '🏠',
    path: '/',
    component: Home,
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    icon: '🔑',
    path: '/password-generator',
    component: PasswordGenerator,
  },

  {
    id: 'password-strength',
    name: 'Password Strength',
    icon: '💪',
    path: '/password-strength',
    component: PasswordStrength,
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    icon: '📝',
    path: '/word-counter',
    component: WordCounter,
  },
  {
    id: 'json-beautifier',
    name: 'JSON Beautifier',
    icon: '✨',
    path: '/json-beautifier',
    component: JsonBeautifier,
  },
  {
    id: 'qr-generator',
    name: 'QR Generator',
    icon: '📱',
    path: '/qr-generator',
    component: QrGenerator,
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    icon: '⚖️',
    path: '/unit-converter',
    component: UnitConverter,
  },
];
