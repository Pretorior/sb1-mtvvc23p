import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Shelf } from '../types';

export function useShelf() {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les étagères
  const fetchShelves = async () => {
    try {
      const { data, error } = await supabase
        .from('shelves')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShelves(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Créer une étagère
  const createShelf = async (shelf: Omit<Shelf, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('shelves')
        .insert([shelf])
        .select()
        .single();

      if (error) throw error;
      setShelves(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de l\'étagère');
      throw err;
    }
  };

  // Mettre à jour une étagère
  const updateShelf = async (id: string, updates: Partial<Shelf>) => {
    try {
      const { data, error } = await supabase
        .from('shelves')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setShelves(prev => prev.map(shelf => shelf.id === id ? { ...shelf, ...data } : shelf));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de l\'étagère');
      throw err;
    }
  };

  // Supprimer une étagère
  const deleteShelf = async (id: string) => {
    try {
      const { error } = await supabase
        .from('shelves')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setShelves(prev => prev.filter(shelf => shelf.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de l\'étagère');
      throw err;
    }
  };

  // Ajouter un livre à une étagère
  const addBookToShelf = async (shelfId: string, bookId: string) => {
    try {
      const { error } = await supabase
        .from('shelf_books')
        .insert([{ shelf_id: shelfId, book_id: bookId }]);

      if (error) throw error;
      await fetchShelves(); // Recharger les étagères pour avoir les données à jour
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout du livre à l\'étagère');
      throw err;
    }
  };

  // Retirer un livre d'une étagère
  const removeBookFromShelf = async (shelfId: string, bookId: string) => {
    try {
      const { error } = await supabase
        .from('shelf_books')
        .delete()
        .match({ shelf_id: shelfId, book_id: bookId });

      if (error) throw error;
      await fetchShelves(); // Recharger les étagères pour avoir les données à jour
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du retrait du livre de l\'étagère');
      throw err;
    }
  };

  // Charger les étagères au montage du composant
  useEffect(() => {
    fetchShelves();
  }, []);

  return {
    shelves,
    loading,
    error,
    createShelf,
    updateShelf,
    deleteShelf,
    addBookToShelf,
    removeBookFromShelf,
    refreshShelves: fetchShelves
  };
}