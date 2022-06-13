import {useEffect, useState} from 'react';
import productsApi from '../api/productsApi';
import {Categoria, CategoriesResponse} from '../interfaces/appInterfaces';

export const useCategories = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Categoria[]>([]);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    const resp = await productsApi.get<CategoriesResponse>('/categorias');
    setCategories(resp.data.categorias);
    setIsLoading(false);
  };

  return {
    isLoading,
    categories,
  };
};
