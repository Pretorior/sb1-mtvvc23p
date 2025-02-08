import React, { useRef, useEffect, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';

interface ISBNScannerProps {
  onScan: (isbn: string) => void;
  isLoading: boolean;
}

export function ISBNScanner({ onScan, isLoading }: ISBNScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Vérifier si la caméra est disponible
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        setHasCamera(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => {
        setHasCamera(false);
      });

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const handleManualInput = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('isbn') as HTMLInputElement;
    if (input.value.trim()) {
      onScan(input.value.trim());
      input.value = '';
    }
  };

  if (!hasCamera) {
    return (
      <div className="space-y-4">
        <p className="text-gray-600 text-center">
          Aucune caméra détectée. Veuillez entrer l'ISBN manuellement.
        </p>
        <form onSubmit={handleManualInput} className="flex gap-2">
          <input
            type="text"
            name="isbn"
            placeholder="Entrez l'ISBN..."
            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-malibu-500 text-white rounded-xl hover:bg-malibu-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Rechercher'
            )}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-1 bg-malibu-500 animate-scan" />
        </div>
      </div>

      <div className="text-center">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Recherche du livre...</span>
          </div>
        ) : (
          <p className="text-gray-600">
            Placez le code-barres dans le cadre pour scanner
          </p>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={() => setIsScanning(!isScanning)}
          className="px-6 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors inline-flex items-center gap-2"
        >
          <Camera className="w-5 h-5" />
          {isScanning ? 'Arrêter' : 'Commencer'} le scan
        </button>
      </div>
    </div>
  );
}