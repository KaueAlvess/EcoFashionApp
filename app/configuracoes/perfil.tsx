import * as ImagePicker from 'expo-image-picker';
import { TextInput, TouchableOpacity } from 'react-native';
// Importação correta do ImagePicker
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export default function PerfilScreen() {
  const router = useRouter();
  const [nome, setNome] = useState('Nome');
  const [editandoNome, setEditandoNome] = useState(false);
  const [userImage, setUserImage] = useState<string | null>(null);
  const quantidadeTrevos = 0;

  // Produtos fictícios e rotas
  const produtos = [
  { id: 1, nome: 'Doações', icon: null, rota: '/doacao' },
  { id: 2, nome: 'Cadastro', icon: null, rota: '/signup' },
  { id: 3, nome: 'Configurações', icon: null, rota: '/configuracoes' },
  ];

  // Cores personalizadas para os quadrados
  // Paleta profissional: tons sóbrios e modernos
  const coresQuadrados = ['#F5F5F5', '#E0E0E0', '#C8E6C9', '#B3E5FC'];
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  // Função para selecionar foto
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

  return (
    <View style={styles.fundoVerde}>
      {/* Ícone de usuário ou foto */}
      <View style={styles.userIconArea}>
        <View style={styles.userIconCircle}>
          {userImage ? (
            <Image source={userImage} style={styles.userFoto} />
          ) : (
            <Text style={styles.userIcon}>👤</Text>
          )}
        </View>
        <TouchableOpacity style={styles.fotoBtn} onPress={pickImage}>
          <Text style={styles.fotoBtnText}>Selecionar Foto</Text>
        </TouchableOpacity>
        {/* Nome do usuário editável */}
        <View style={styles.nomeArea}>
          {editandoNome ? (
            <TextInput
              style={styles.nomeInput}
              value={nome}
              onChangeText={setNome}
              onBlur={() => setEditandoNome(false)}
              autoFocus
            />
          ) : (
            <TouchableOpacity onPress={() => setEditandoNome(true)}>
              <Text style={styles.nomeTexto}>{nome}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* Texto de incentivo */}
      <Text style={styles.incentivo}>Doe e ganhe trevos de doação</Text>
      {/* Botão para explorar produtos */}
      <TouchableOpacity style={styles.exploreBtn} onPress={() => router.push('/roupas')}>
        <Text style={styles.exploreBtnText}>Ir para Produtos</Text>
      </TouchableOpacity>
      {/* Produtos */}
      <View style={styles.produtosArea}>
        <View style={styles.produtosGrid}>
          <AnimatedTouchable
            style={[styles.produtoItem, { backgroundColor: coresQuadrados[0] }]}
            onPress={() => router.push("/doacao")}
            activeOpacity={0.8}
          >
            <View style={styles.produtoConteudo}>
              <Text style={styles.produtoNome}>Doações</Text>
            </View>
          </AnimatedTouchable>
          <AnimatedTouchable
            style={[styles.produtoItem, { backgroundColor: coresQuadrados[1] }]}
            onPress={() => router.push("/signup")}
            activeOpacity={0.8}
          >
            <View style={styles.produtoConteudo}>
              <Text style={styles.produtoNome}>Cadastro</Text>
            </View>
          </AnimatedTouchable>
          <AnimatedTouchable
            style={[styles.produtoItem, { backgroundColor: coresQuadrados[2] }]}
            onPress={() => router.push("/configuracoes")}
            activeOpacity={0.8}
          >
            <View style={styles.produtoConteudo}>
              <Text style={styles.produtoNome}>Configurações</Text>
            </View>
          </AnimatedTouchable>
        </View>
      </View>
      {/* Anotação: Agora funcional conforme solicitado */}
    </View>
  );
}

const styles = StyleSheet.create({
  produtoConteudo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  produtoNome: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  userFoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'cover',
  },
  fotoBtn: {
    backgroundColor: '#009E60',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 8,
  },
  fotoBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  nomeInput: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#222',
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 80,
  },
  exploreBtn: {
    backgroundColor: '#00C853',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 8,
    marginBottom: 8,
  },
  exploreBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fundoVerde: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  trevoArea: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: 24,
    marginBottom: 8,
  },
  trevoIcon: {
    width: 32,
    height: 32,
    marginRight: 4,
  },
  trevoTexto: {
    fontSize: 20,
    color: '#388E3C',
    fontWeight: 'bold',
  },
  userIconArea: {
    alignItems: 'center',
    marginBottom: 8,
  },
  userIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  userIcon: {
    fontSize: 80,
    color: '#222',
  },
  nomeArea: {
    backgroundColor: '#eee',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 4,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#222',
  },
  nomeTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },
  incentivo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
    textAlign: 'center',
  },
  produtosArea: {
    width: '90%',
    alignItems: 'center',
    marginBottom: 12,
  },
  produtosTitulo: {
    backgroundColor: '#009E60',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  produtosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 12,
  },
  produtoItem: {
    width: 90,
    height: 90,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  produtoIcon: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
    tintColor: '#222', // Deixa o ícone escuro, pode ajustar conforme o ícone
  },
  // Anotação: Estilos e layout modificados conforme print de referência
});