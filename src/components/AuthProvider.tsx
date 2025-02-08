import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getSession } from '../store/authSlice';
import { AppDispatch } from '../store/store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getSession());
  }, [dispatch]);

  return <>{children}</>;
}