import React, { useState } from 'react';
import { CreditCard, MapPin, Package, Truck, User, X } from 'lucide-react';
import { Book } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
  onPaymentComplete: () => void;
}

export function CheckoutModal({ isOpen, onClose, book, onPaymentComplete }: CheckoutModalProps) {
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [shippingMethod, setShippingMethod] = useState<'postal' | 'inPerson'>('postal');
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'lydia'>('card');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const shippingCost = shippingMethod === 'postal' ? 4.95 : 0;
  const total = (book.forSale?.price || 0) + shippingCost;

  const handlePayment = async () => {
    try {
      // Simulation du paiement
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowConfirmation(true);
      onPaymentComplete();
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {showConfirmation ? 'Confirmation' : 'Finaliser votre achat'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {showConfirmation ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-feijoa-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-feijoa-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Votre achat est confirmé !
            </h3>
            <p className="text-gray-600 mb-6">
              Vous recevrez un email de confirmation avec tous les détails.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
            >
              Fermer
            </button>
          </div>
        ) : (
          <>
            {/* Récapitulatif de la commande */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex gap-4">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-20 h-28 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{book.title}</h3>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <div className="mt-2 text-sm">
                    <p className="text-gray-600">État : {
                      book.forSale?.condition === 'new' ? 'Neuf' :
                      book.forSale?.condition === 'like-new' ? 'Comme neuf' :
                      book.forSale?.condition === 'very-good' ? 'Très bon état' :
                      book.forSale?.condition === 'good' ? 'Bon état' : 'État correct'
                    }</p>
                  </div>
                </div>
                <div className="ml-auto">
                  <p className="font-medium text-gray-900">{book.forSale?.price}€</p>
                </div>
              </div>
            </div>

            {step === 'shipping' ? (
              <>
                {/* Méthode de livraison */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Mode de livraison
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setShippingMethod('postal')}
                      className={`p-4 rounded-xl border-2 transition-colors ${
                        shippingMethod === 'postal'
                          ? 'border-malibu-500 bg-malibu-50'
                          : 'border-gray-200 hover:border-malibu-300'
                      }`}
                    >
                      <Truck className={`w-6 h-6 mx-auto mb-2 ${
                        shippingMethod === 'postal' ? 'text-malibu-500' : 'text-gray-400'
                      }`} />
                      <p className="font-medium text-gray-900">Envoi postal</p>
                      <p className="text-sm text-gray-500">4.95€</p>
                    </button>

                    <button
                      onClick={() => setShippingMethod('inPerson')}
                      className={`p-4 rounded-xl border-2 transition-colors ${
                        shippingMethod === 'inPerson'
                          ? 'border-malibu-500 bg-malibu-50'
                          : 'border-gray-200 hover:border-malibu-300'
                      }`}
                    >
                      <MapPin className={`w-6 h-6 mx-auto mb-2 ${
                        shippingMethod === 'inPerson' ? 'text-malibu-500' : 'text-gray-400'
                      }`} />
                      <p className="font-medium text-gray-900">En main propre</p>
                      <p className="text-sm text-gray-500">Gratuit</p>
                    </button>
                  </div>
                </div>

                {/* Formulaire de livraison */}
                {shippingMethod === 'postal' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.name}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Adresse
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Code postal
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.postalCode}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ville
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Point de rendez-vous */}
                {shippingMethod === 'inPerson' && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-600">
                      Le vendeur vous contactera pour convenir d'un lieu et d'une heure de rendez-vous.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Méthode de paiement */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Mode de paiement
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 rounded-xl border-2 transition-colors ${
                        paymentMethod === 'card'
                          ? 'border-malibu-500 bg-malibu-50'
                          : 'border-gray-200 hover:border-malibu-300'
                      }`}
                    >
                      <CreditCard className={`w-6 h-6 mx-auto mb-2 ${
                        paymentMethod === 'card' ? 'text-malibu-500' : 'text-gray-400'
                      }`} />
                      <p className="font-medium text-gray-900">Carte bancaire</p>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-4 rounded-xl border-2 transition-colors ${
                        paymentMethod === 'paypal'
                          ? 'border-malibu-500 bg-malibu-50'
                          : 'border-gray-200 hover:border-malibu-300'
                      }`}
                    >
                      <img
                        src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
                        alt="PayPal"
                        className="w-12 mx-auto mb-2"
                      />
                      <p className="font-medium text-gray-900">PayPal</p>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('lydia')}
                      className={`p-4 rounded-xl border-2 transition-colors ${
                        paymentMethod === 'lydia'
                          ? 'border-malibu-500 bg-malibu-50'
                          : 'border-gray-200 hover:border-malibu-300'
                      }`}
                    >
                      <img
                        src="https://www.lydia-app.com/assets/images/logo.svg"
                        alt="Lydia"
                        className="w-12 mx-auto mb-2"
                      />
                      <p className="font-medium text-gray-900">Lydia</p>
                    </button>
                  </div>
                </div>

                {/* Formulaire de carte bancaire */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Numéro de carte
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date d'expiration
                        </label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVC
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Total et actions */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-medium text-gray-900">{book.forSale?.price}€</span>
              </div>
              {shippingMethod === 'postal' && (
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Frais de port</span>
                  <span className="font-medium text-gray-900">{shippingCost}€</span>
                </div>
              )}
              <div className="flex justify-between items-center mb-6">
                <span className="font-medium text-gray-900">Total</span>
                <span className="text-xl font-semibold text-gray-900">{total}€</span>
              </div>

              <div className="flex justify-end gap-3">
                {step === 'shipping' ? (
                  <button
                    onClick={() => setStep('payment')}
                    disabled={shippingMethod === 'postal' && Object.values(shippingInfo).some(v => !v)}
                    className="px-6 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continuer
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setStep('shipping')}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900"
                    >
                      Retour
                    </button>
                    <button
                      onClick={handlePayment}
                      className="px-6 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
                    >
                      Payer {total}€
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}