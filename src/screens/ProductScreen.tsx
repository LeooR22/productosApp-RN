import React, {FC, useEffect, useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
  Image,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {ProductsStackParams} from '../navigator/ProductsNavigator';

import {Picker} from '@react-native-picker/picker';
import {useCategories} from '../hooks/useCategories';
import {LoadingScreen} from './LoadingScreen';
import {useForm} from '../hooks/useForm';
import {ProductsContext} from '../context';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

interface Props
  extends StackScreenProps<ProductsStackParams, 'ProductScreen'> {}

export const ProductScreen: FC<Props> = ({navigation, route}) => {
  const {loadProductById, addProduct, updateProduct, uploadImage} =
    useContext(ProductsContext);

  const {id = '', name = ''} = route.params;

  const [tempUri, setTempUri] = useState<string>('');

  const {categories, isLoading} = useCategories();
  const {_id, categoriaId, nombre, imagen, form, onChange, setFormValue} =
    useForm({
      _id: id,
      categoriaId: '',
      nombre: name,
      imagen: '',
    });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: nombre ? nombre : 'Sin nombre del producto',
      headerRight: () => (
        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.pop()}>
          <Text style={{marginRight: 10}}>Regresar</Text>
        </TouchableOpacity>
      ),
    });
  }, [nombre]);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    if (id.length === 0) return;
    const product = await loadProductById(id);
    setFormValue({
      _id: id,
      categoriaId: product.categoria._id,
      imagen: product.img || '',
      nombre,
    });
  };

  const saveOrUpdate = async () => {
    if (id.length > 0) {
      return updateProduct(categoriaId, nombre, id);
    }

    const tempCategoriaId = categoriaId || categories[0]._id;
    const newProduct = await addProduct(tempCategoriaId, nombre);
    onChange(newProduct._id, '_id');
  };

  const takePhoto = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.5,
      },
      resp => {
        if (resp.didCancel) return;
        if (!resp.assets![0].uri) return;
        setTempUri(resp.assets![0].uri);
        uploadImage(resp.assets![0], _id);
      },
    );
  };

  const takePhotoFromGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.5,
      },
      resp => {
        if (resp.didCancel) return;
        if (!resp.assets![0].uri) return;
        setTempUri(resp.assets![0].uri);
        uploadImage(resp.assets![0], _id);
      },
    );
  };

  if (isLoading === true) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Nombre del producto: </Text>
        <TextInput
          placeholder="Producto"
          style={styles.textInput}
          value={nombre}
          onChangeText={val => onChange(val, 'nombre')}
          //TODO:
          // Value
          // onChangeText
        />

        {/* Picker / Selector */}
        <Text style={styles.label}>Categoria: </Text>
        <Picker
          selectedValue={categoriaId}
          onValueChange={itemValue => onChange(itemValue, 'categoriaId')}>
          {categories.map(c => (
            <Picker.Item label={c.nombre} value={c._id} key={c._id} />
          ))}
        </Picker>
        <Button title="Guardar" onPress={saveOrUpdate} color="#5856D6" />

        {_id.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <Button title="Camara" onPress={takePhoto} color="#5856D6" />
            <View style={{width: 10}} />
            <Button
              title="Galeria"
              onPress={takePhotoFromGallery}
              color="#5856D6"
            />
          </View>
        )}

        {imagen.length > 0 && !tempUri && (
          <Image
            source={{uri: imagen}}
            style={{width: '100%', height: 300, marginTop: 20}}
          />
        )}

        {/* TODO:  Mostrar imagen temporal */}

        {tempUri.length > 0 && (
          <Image
            source={{uri: tempUri}}
            style={{width: '100%', height: 300, marginTop: 20}}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 20,
  },
  label: {
    fontSize: 18,
    color: 'black',
  },
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderColor: 'rgba(0,0,0,0.2)',
    height: 45,
    color: 'black',
    marginTop: 5,
    marginBottom: 15,
  },
});
