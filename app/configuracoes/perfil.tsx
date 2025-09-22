import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import TrevoTroca from '../../components/TrevoTroca';

export default function PerfilScreen() {
  const [userImage, setUserImage] = useState<string | null>(null);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permissão para acessar a galeria é necessária!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setUserImage(result.assets[0].uri);
    }
  };

  const quantidadeTrevos = 5;
  return (
    <View style={{ flex: 1 }}>
      <TrevoTroca quantidade={quantidadeTrevos} />
      <View style={styles.container}>
        <Text style={styles.title}>Perfil do Usuário</Text>
        <View style={styles.centerContainer}>
          {userImage ? (
            <Image
              source={userImage}
              style={styles.userImage}
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>Nenhuma foto selecionada</Text>
            </View>
          )}
          <Button title="Selecionar Foto de Usuário" onPress={pickImage} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 32,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 16,
  },
  placeholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    color: '#888',
    fontSize: 14,
  },
});