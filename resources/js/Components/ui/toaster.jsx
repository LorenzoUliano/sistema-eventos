import React from 'react';
import { ToastViewport } from './toast-viewport';
import { ToastProvider } from './toast-provider';
import { ToastContainer } from './toast-container';

export function Toaster() {
  return (
    <ToastProvider>
      <ToastContainer />
      <ToastViewport />
    </ToastProvider>
  );
}

