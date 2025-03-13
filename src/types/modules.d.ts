declare module 'react';
declare module 'react-dom';
declare module 'react-router-dom';
declare module 'antd';
declare module '@ant-design/icons';
declare module 'mobx-react-lite';

// This ensures JSX elements work properly
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
} 