export interface Tool {
  id: string;
  name: string;
  icon: string;
  path: string;
  component: React.ComponentType;
  requiresAuth?: boolean;
}

export type ToolId = 
  | 'password-generator'
  | 'password-vault'
  | 'password-strength'
  | 'word-counter'
  | 'json-beautifier'
  | 'qr-generator'
  | 'unit-converter'
  | 'url-shortener';
