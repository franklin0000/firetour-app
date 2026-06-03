import React, { useState, useEffect } from 'react';
import { Pencil, Save, X, Image as ImageIcon, DollarSign, Edit3, Type } from 'lucide-react';
import { Tour } from '../types';

export default function AdminPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tours?limit=50')
      .then(res => res.json())
      .then(data => {
        setTours(data.tours || []);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    if (!editingTour) return;
    
    try {
      const res = await fetch(`/api/tours/${editingTour.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTour)
      });
      const updatedTour = await res.json();
      
      setTours(tours.map(t => t.id === updatedTour.id ? updatedTour : t));
      setEditingTour(null);
      alert("¡Excursión actualizada correctamente!");
    } catch (err) {
      alert("Error al guardar los cambios.");
    }
  };

  if (loading) return <div className="text-white text-center mt-20">Cargando panel...</div>;

  return (
    <div className="min-h-screen bg-bgDark p-6 md:p-12 relative z-10 pt-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-8">
          🛠️ Panel de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-blue-500">Administración</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base font-bold mb-12 max-w-2xl">
          Modifica los detalles, precios y fotografías de tus excursiones en tiempo real. Todos los cambios se reflejarán instantáneamente en el catálogo público.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map(tour => (
            <div key={tour.id} className="bg-surface/30 backdrop-blur-md border border-outline rounded-3xl p-5 flex flex-col gap-4 hover:border-cyan/50 transition duration-300">
              <div className="relative h-40">
                <img src={tour.image} alt={tour.name} className="w-full h-full object-cover rounded-2xl" />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-white border border-outline">
                  ID: {tour.id}
                </div>
              </div>
              
              <div>
                <h3 className="text-white text-sm font-black uppercase leading-tight">{tour.name}</h3>
                <p className="text-cyan font-black text-lg mt-1">${tour.price} USD</p>
              </div>
              
              <button 
                onClick={() => setEditingTour(tour)}
                className="mt-auto bg-white/5 hover:bg-cyan/20 hover:text-cyan text-white border border-outline hover:border-cyan/50 rounded-xl py-3 flex justify-center items-center gap-2 transition duration-300 font-bold uppercase tracking-widest text-[10px]"
              >
                <Pencil className="w-4 h-4" /> Editar Excursión
              </button>
            </div>
          ))}
        </div>

        {editingTour && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="bg-surface border border-outline rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative shadow-[0_0_50px_rgba(6,182,212,0.15)] animate-fadeIn">
              <button 
                onClick={() => setEditingTour(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-tight">Editando #{editingTour.id}</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                    <Type className="w-3.5 h-3.5 text-cyan" /> Título de la excursión
                  </label>
                  <input 
                    type="text" 
                    value={editingTour.name}
                    onChange={(e) => setEditingTour({...editingTour, name: e.target.value})}
                    className="w-full bg-bgDark border border-outline rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan transition font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Precio (USD)
                  </label>
                  <input 
                    type="number" 
                    value={editingTour.price}
                    onChange={(e) => setEditingTour({...editingTour, price: parseFloat(e.target.value)})}
                    className="w-full bg-bgDark border border-outline rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 transition font-black text-lg"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" /> Fotografía
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input 
                      type="text" 
                      placeholder="URL de la imagen"
                      value={editingTour.image}
                      onChange={(e) => setEditingTour({...editingTour, image: e.target.value})}
                      className="flex-1 bg-bgDark border border-outline rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 transition text-sm"
                    />
                    <label className="bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl px-4 flex items-center justify-center cursor-pointer transition">
                      <span className="text-xs uppercase tracking-widest">Subir</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          const formData = new FormData();
                          formData.append('image', file);
                          
                          try {
                            const res = await fetch('/api/upload', {
                              method: 'POST',
                              body: formData
                            });
                            const data = await res.json();
                            if (data.imageUrl) {
                              setEditingTour({...editingTour, image: data.imageUrl});
                            }
                          } catch (err) {
                            alert("Error al subir la imagen");
                          }
                        }}
                      />
                    </label>
                  </div>
                  {editingTour.image && (
                    <div className="mt-3 relative h-32 rounded-xl overflow-hidden border border-outline/50 group">
                      <img src={editingTour.image} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <button 
                          onClick={() => setEditingTour({...editingTour, image: ''})}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg"
                        >
                          Borrar Foto
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                    <Edit3 className="w-3.5 h-3.5 text-secondary" /> Descripción Detallada
                  </label>
                  <textarea 
                    value={editingTour.desc}
                    onChange={(e) => setEditingTour({...editingTour, desc: e.target.value})}
                    rows={4}
                    className="w-full bg-bgDark border border-outline rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition resize-none text-sm leading-relaxed"
                  />
                </div>

              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-outline/30 pt-6">
                <button 
                  onClick={() => setEditingTour(null)}
                  className="px-6 py-3 rounded-xl border border-outline text-white text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  className="px-6 py-3 rounded-xl bg-cyan text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-cyan-600 transition shadow-lg shadow-cyan/20"
                >
                  <Save className="w-4 h-4" /> Guardar Cambios
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
