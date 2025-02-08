import React from 'react';
import { useParams } from 'react-router-dom';
import { BookDetailsPage } from './BookDetailsPage';

export function BookPage() {
  const { id } = useParams();
  return <BookDetailsPage />;
}