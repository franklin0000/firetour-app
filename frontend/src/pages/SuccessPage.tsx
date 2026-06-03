import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader, CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Procesando tu pago...');
  
  useEffect(() => {
    const paymentIntent = searchParams.get('payment_intent');
    
    if (!paymentIntent) {
      navigate('/');
      return;
    }

    const pendingCheckoutStr = localStorage.getItem('pendingCheckout');
    const fallbackMetadata = pendingCheckoutStr ? JSON.parse(pendingCheckoutStr) : {};
    
    // Llamar al backend para verificar el pago y registrar la reservación
    fetch('/api/payment/verify-and-book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        payment_intent: paymentIntent,
        fallbackMetadata,
        fallbackAmount: fallbackMetadata.amountPaid || 0
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.reservation) {
        localStorage.removeItem('pendingCheckout');
        setStatus('¡Pago completado con éxito!');
        setTimeout(() => {
          navigate(`/ticket/${data.reservation.id}`, { state: { reservation: data.reservation } });
        }, 1500);
      } else {
        setStatus('Error al verificar el pago: ' + (data.error || 'Inténtalo de nuevo.'));
      }
    })
    .catch(err => {
      console.error(err);
      setStatus('Error de red al verificar el pago.');
    });

  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-bgDark flex flex-col items-center justify-center text-white px-4">
      <div className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 text-center max-w-md w-full shadow-2xl">
        <div className="flex justify-center mb-6">
          {status.includes('Error') ? (
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-500">
               <span className="text-3xl">⚠️</span>
            </div>
          ) : status.includes('éxito') ? (
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
               <CheckCircle className="w-8 h-8" />
            </div>
          ) : (
            <Loader className="w-12 h-12 text-cyan animate-spin" />
          )}
        </div>
        <h2 className="text-2xl font-black font-display mb-2">Estado del Pago</h2>
        <p className="text-gray-400">{status}</p>
      </div>
    </div>
  );
}
