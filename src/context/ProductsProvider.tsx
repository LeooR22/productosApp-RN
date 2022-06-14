import React, {FC, useReducer} from 'react';
import {ProductsContext, productsReducer} from './';
import {Producto, ProductsResponse} from '../interfaces/appInterfaces';
import {useState, useEffect} from 'react';
import productsApi from '../api/productsApi';
import {Asset} from 'react-native-image-picker';

export interface ProductsState {
  products: Producto[];
}

// const PRODUCTS_INITIAL_STATE: ProductsState = {
//   products: [],
// };

type Props = {
  children?: React.ReactNode;
};

export const ProductsProvider: FC<Props> = ({children}) => {
  // const [state, dispatch] = useReducer(productsReducer, PRODUCTS_INITIAL_STATE);

  const [products, setProducts] = useState<Producto[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const {data} = await productsApi.get<ProductsResponse>(
      '/productos?limite=50',
    );

    setProducts([...data.productos]);
  };
  const addProduct = async (
    categoryId: string,
    productName: string,
  ): Promise<Producto> => {
    const {data} = await productsApi.post<Producto>('/productos', {
      nombre: productName,
      categoria: categoryId,
    });
    setProducts([...products, data]);

    return data;
  };
  const updateProduct = async (
    categoryId: string,
    productName: string,
    productId: string,
  ) => {
    const {data} = await productsApi.put<Producto>(`/productos/${productId}`, {
      nombre: productName,
      categoria: categoryId,
    });
    setProducts(products.map(prod => (prod._id === productId ? data : prod)));
  };

  const deleteProduct = async (id: string) => {};

  const loadProductById = async (id: string): Promise<Producto> => {
    const {data} = await productsApi.get<Producto>(`/productos/${id}`);

    return data;
  };
  const uploadImage = async (data: Asset, id: string) => {
    const fileToUpload = {
      uri: data.uri,
      type: data.type,
      name: data.fileName,
    };

    const formData = new FormData();
    formData.append('archivo', fileToUpload);

    const baseURL = 'http://192.168.56.1:8080/api';

    try {
      const resp = await fetch(`${baseURL}/uploads/productos/${id}`, {
        method: 'PUT',
        body: formData,
      });
      console.log(resp);
    } catch (error) {
      console.log({error});
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        loadProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        loadProductById,
        uploadImage,
      }}>
      {children}
    </ProductsContext.Provider>
  );
};
