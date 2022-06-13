import {createContext} from 'react';
import {Producto} from '../interfaces/appInterfaces';

interface ProductsContextProps {
  products: Producto[];
  loadProducts: () => Promise<void>;
  addProduct: (categoryId: string, productName: string) => Promise<Producto>;
  updateProduct: (
    categoryId: string,
    productName: string,
    productId: string,
  ) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  loadProductById: (id: string) => Promise<Producto>;
  uploadImage: (data: any, id: string) => Promise<void>; // TODO: Cambiar ANY
}

export const ProductsContext = createContext({} as ProductsContextProps);
