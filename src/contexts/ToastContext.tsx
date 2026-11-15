import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

interface ToastItem {
  id: number;
  message: string;
}

const TOAST_DURATION_MS = 2600;
const MAX_VISIBLE_TOASTS = 2;

const ToastContext = createContext<((message: string) => void) | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const toast = useCallback((message: string) => {
    nextId.current += 1;
    const id = nextId.current;
    setItems((previous) => [
      ...previous.slice(-(MAX_VISIBLE_TOASTS - 1)),
      { id, message },
    ]);
    setTimeout(() => {
      setItems((previous) => previous.filter((item) => item.id !== id));
    }, TOAST_DURATION_MS);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        id="toast-region"
        className="toast-region"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {items.map((item) => (
          <div key={item.id} className="toast-msg">
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
