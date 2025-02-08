import React, { useState } from 'react';
import { Book } from '../../types';
import { CheckoutModal } from './CheckoutModal';

interface PaymentButtonProps {
  book: Book;
  onPaymentComplete: () => void;
}

export function PaymentButton({ book, onPaymentComplete }: PaymentButtonProps) {
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowCheckout(true)}
        className="px-6 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
      >
        Acheter {book.forSale?.price}€
      </button>

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        book={book}
        onPaymentComplete={onPaymentComplete}
      />
    </>
  );
}