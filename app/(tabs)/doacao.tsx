import storage from '@/utils/storage';
import React, { useState } from 'react';
import { Image, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from '../../components/Toast';
import TrevoTroca from '../../components/TrevoTroca';

                  const styles = StyleSheet.create({
                    container: { padding: 24, backgroundColor: '#F5F5F5', alignItems: 'center' },
                    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#2E7D32', textAlign: 'center' },
                    section: { marginBottom: 18, width: '100%', alignItems: 'center' },
                    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#388E3C', marginBottom: 8, textAlign: 'center' },
                    optionsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
                    destinoOption: {
                      alignItems: 'center',
                      marginHorizontal: 8,
                      padding: 12,
                      borderRadius: 16,
                      backgroundColor: '#e8f8e8',
                      elevation: 3,
                      borderWidth: 2,
                      borderColor: '#43ea7a',
                      shadowColor: '#2E7D32',
                      shadowOpacity: 0.10,
                      shadowRadius: 6,
                      shadowOffset: { width: 0, height: 2 },
                    },
                    selectedOption: {
                      borderColor: '#2E7D32',
                      backgroundColor: '#c6f7d0',
                      elevation: 5,
                      shadowOpacity: 0.18,
                    },
                    destinoImg: { width: 52, height: 52, borderRadius: 26, marginBottom: 6 },
                    destinoImgWrap: { width: 160, height: 84, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', marginBottom: 6 },
                    optionBtn: {
                      backgroundColor: '#e8f8e8',
                      borderRadius: 14,
                      paddingVertical: 10,
                      paddingHorizontal: 18,
                      margin: 6,
                      elevation: 2,
                      borderWidth: 2,
                      borderColor: '#43ea7a',
                      shadowColor: '#2E7D32',
                      shadowOpacity: 0.10,
                      shadowRadius: 6,
                      shadowOffset: { width: 0, height: 2 },
                    },
                    textArea: {
                      backgroundColor: '#fff',
                      borderRadius: 16,
                      padding: 16,
                      minHeight: 80,
                      width: '100%',
                      marginTop: 8,
                      marginBottom: 8,
                      textAlignVertical: 'top',
                      borderWidth: 2,
                      borderColor: '#43ea7a',
                      shadowColor: '#2E7D32',
                      shadowOpacity: 0.10,
                      shadowRadius: 6,
                      shadowOffset: { width: 0, height: 2 },
                      fontSize: 16,
                      color: '#145c2e',
                    },
                    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
                    modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', width: 320, elevation: 4, position: 'relative' },
                    confirmModalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', width: 320, elevation: 4, position: 'relative' },
                    closeModal: { position: 'absolute', top: 8, right: 12, zIndex: 2 },
                    confirmImg: { width: 60, height: 60, borderRadius: 30, marginTop: 5, marginBottom: 5, backgroundColor: 'transparent' },
                    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#2E7D32', marginBottom: 8, textAlign: 'center' },
                    topTabs: {
                      flexDirection: 'row',
                      alignSelf: 'center',
                      backgroundColor: '#fff',
                      borderRadius: 24,
                      padding: 6,
                      marginVertical: 12,
                      elevation: 2,
                    },
                    tabButton: {
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      borderRadius: 20,
                    },
                    activeTab: {
                      backgroundColor: '#c6f7d0',
                    },
                    tabText: {
                      color: '#145c2e',
                      fontSize: 16,
                    },
                    cardsRow: {
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 16,
                      marginBottom: 18,
                      marginTop: 12,
                      width: '100%',
                    },
                    card: {
                      width: 140,
                      height: 160,
                      backgroundColor: '#fff',
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginHorizontal: 8,
                      elevation: 3,
                      borderWidth: 1,
                      borderColor: '#c6f7d0',
                    },
                    addCard: {
                      backgroundColor: '#e8f8e8',
                      borderStyle: 'dashed',
                    },
                    plusText: {
                      fontSize: 36,
                      color: '#2E7D32',
                      marginBottom: 6,
                    },
                    cardImage: {
                      width: 100,
                      height: 100,
                      borderRadius: 8,
                      marginBottom: 8,
                    },
                    cardTitle: {
                      fontSize: 14,
                      fontWeight: 'bold',
                      color: '#145c2e',
                    },
                    subtitle: { fontSize: 14, color: '#2E7D32', textAlign: 'center', marginHorizontal: 10, marginTop: 6 },
                    banner: {
                      alignSelf: 'stretch',
                      marginHorizontal: 12,
                      backgroundColor: '#e8f8ec',
                      borderRadius: 12,
                      paddingVertical: 12,
                      paddingHorizontal: 14,
                      marginBottom: 12,
                      alignItems: 'center',
                      shadowColor: '#2E7D32',
                      shadowOpacity: 0.08,
                      shadowRadius: 8,
                      shadowOffset: { width: 0, height: 3 },
                      elevation: 3,
                    },
                    bannerText: {
                      color: '#145c2e',
                      fontWeight: '700',
                      fontSize: 15,
                      textAlign: 'center',
                    },
                    bannerSubtitle: {
                      color: '#2E7D32',
                      fontSize: 13,
                      marginTop: 6,
                      textAlign: 'center',
                    },
                    bannerButton: {
                      marginTop: 10,
                      backgroundColor: '#2E7D32',
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      borderRadius: 20,
                    },
                    bannerButtonText: {
                      color: '#fff',
                      fontWeight: '700',
                      fontSize: 14,
                    },
                    featuredCardWrap: {
                      width: '100%',
                      alignItems: 'center',
                      marginBottom: 8,
                    },
                    
                    featuredAccent: {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 8,
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                      backgroundColor: '#43ea7a',
                    },
                    featuredImage: {
                      width: 180,
                      height: 180,
                      borderRadius: 12,
                      marginTop: 12,
                      marginBottom: 12,
                    },
                    featuredCard: {
                      width: '100%',
                      backgroundColor: '#ffffff',
                      borderRadius: 16,
                      paddingVertical: 20,
                      paddingHorizontal: 18,
                      alignItems: 'center',
                      elevation: 6,
                      shadowColor: '#000',
                      shadowOpacity: 0.08,
                      shadowRadius: 12,
                      shadowOffset: { width: 0, height: 6 },
                    },
                    featuredTitle: {
                      fontSize: 20,
                      fontWeight: '900',
                      color: '#145c2e',
                      textAlign: 'center',
                      marginBottom: 6,
                    },
                    featuredDesc: {
                      fontSize: 14,
                      color: '#486b4b',
                      textAlign: 'center',
                      marginBottom: 14,
                      lineHeight: 20,
                    },
                    featuredButton: {
                      backgroundColor: '#2E7D32',
                      paddingVertical: 12,
                      paddingHorizontal: 28,
                      borderRadius: 30,
                      shadowColor: '#2E7D32',
                      shadowOpacity: 0.25,
                      shadowRadius: 8,
                      shadowOffset: { width: 0, height: 4 },
                      elevation: 4,
                    },
                    featuredButtonText: {
                      color: '#fff',
                      fontWeight: '800',
                      fontSize: 16,
                    },
                    titleLink: {
                      fontSize: 12,
                      color: '#2E7D32',
                      marginTop: 6,
                      textDecorationLine: 'underline',
                    },
                    headerCard: {
                      width: '100%',
                      backgroundColor: '#f0fff4',
                      borderRadius: 14,
                      paddingVertical: 12,
                      paddingHorizontal: 14,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 12,
                      borderWidth: 1,
                      borderColor: '#dff6e8',
                    },
                    headerCardEmoji: {
                      fontSize: 28,
                      marginRight: 8,
                    },
                    headerCardTitle: {
                      fontSize: 16,
                      fontWeight: '800',
                      color: '#145c2e',
                    },
                    headerCardSubtitle: {
                      fontSize: 12,
                      color: '#2E7D32',
                      marginTop: 4,
                    },
                  });

                  const destinos = [
                    { key: 'exercito_salvacao', nome: 'Exército da Salvação', img: require('../../assets/images/ExercitoSalvaçao.png') },
                    { key: 'unibes', nome: 'Unibes', img: require('../../assets/images/Unibes.png') },
                    { key: 'darua', nome: 'DaRua', img: require('../../assets/images/DaRua.png') },
                    { key: 'bazar', nome: 'Bazar', img: require('../../assets/images/trevo.png') },
                  ];

                  const tempoUsoOptions = [
                    { label: '1 a 6 meses', value: '1-6m' },
                    { label: '6 meses a 1 ano', value: '6m-1a' },
                    { label: '1 ano a 2 anos', value: '1a-2a' },
                    { label: '3 a 5 anos', value: '3-5a' },
                    { label: '5 a 7 anos', value: '5-7a' },
                    { label: '8 anos ou mais', value: '8+a' },
                  ];

                  const estadoOptions = [
                    { label: 'Ruim', value: 'ruim' },
                    { label: 'Ok', value: 'ok' },
                    { label: 'Bom', value: 'bom' },
                    { label: 'Muito bom', value: 'muito_bom' },
                  ];

                  const tamanhoOptions = ['36', '38', '40', '42', '44', '46', '48', '50'];

                  export default function DoacaoTab() {
                    const [modalVisible, setModalVisible] = useState(true);
                    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
                    const [activeTopTab, setActiveTopTab] = useState('roupas');
                    const [addModalVisible, setAddModalVisible] = useState(false);
                    const [newNome, setNewNome] = useState('');
                    const [newImagem, setNewImagem] = useState('');
                    const [newDescricao, setNewDescricao] = useState('');
                    const [destino, setDestino] = useState('');
                    const [tempoUso, setTempoUso] = useState('');
                    const [estado, setEstado] = useState('');
                    const [tamanho, setTamanho] = useState('');
                    const [descricao, setDescricao] = useState('');
                    const [fotoRoupa, setFotoRoupa] = useState<string | null>(null);
                    const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);
                    const router = require('expo-router').useRouter();

                    const selectedDestino = destinos.find(d => d.key === destino);
                    const [quantidadeTrevos, setQuantidadeTrevos] = React.useState(0);

                    React.useEffect(() => {
                      (async () => {
                        try {
                          const email = await storage.getItem('email');
                          if (email) {
                            const res = await fetch(`http://localhost:3001/api/login`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ email, senha: '' })
                            });
                            const data = await res.json();
                            if (data.success && data.usuario) {
                              setQuantidadeTrevos(data.usuario.trevos || 0);
                            }
                          }
                        } catch (e) {
                          // ignore
                        }
                      })();
                    }, []);

                    const selecionarFoto = async () => {
                      const { launchImageLibraryAsync, requestMediaLibraryPermissionsAsync, MediaTypeOptions } = require('expo-image-picker');
                      const permissionResult = await requestMediaLibraryPermissionsAsync();
                      if (!permissionResult.granted) {
                        alert('Permissão para acessar a galeria é necessária!');
                        return;
                      }
                      const result = await launchImageLibraryAsync({
                        mediaTypes: MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [1, 1],
                        quality: 1,
                      });
                      if (!result.canceled && result.assets && result.assets.length > 0) {
                        setFotoRoupa(result.assets[0].uri);
                      }
                    };

                    const pickImageForNew = async () => {
                      if (Platform.OS === 'web') return;
                      const { launchImageLibraryAsync, requestMediaLibraryPermissionsAsync, MediaTypeOptions } = require('expo-image-picker');
                      const permissionResult = await requestMediaLibraryPermissionsAsync();
                      if (!permissionResult.granted) {
                        alert('Permissão para acessar a galeria é necessária!');
                        return;
                      }
                      const result = await launchImageLibraryAsync({
                        mediaTypes: MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [1, 1],
                        quality: 0.8,
                      });
                      if (!result.canceled && result.assets && result.assets.length > 0) {
                        setNewImagem(result.assets[0].uri);
                      }
                    };

                    const realizarDoacao = async () => {
                      try {
                        const idUsuario = await storage.getItem('idUsuario');
                        if (!idUsuario) {
                          setToast({ message: 'Usuário não identificado. Faça login novamente.', type: 'error' });
                          setTimeout(() => setToast(null), 2000);
                          return;
                        }
                        setToast({ message: 'Funcionalidade de doação pronta via modal de adicionar.', type: 'success' });
                        setTimeout(() => setToast(null), 1200);
                      } catch (e) {
                        setToast({ message: 'Erro de conexão com o servidor.', type: 'error' });
                        setTimeout(() => setToast(null), 2000);
                      }
                    };

                    return (
                      <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
                        {toast ? <Toast message={toast.message} type={toast.type} /> : null}
                        <View style={{ width: '100%', alignItems: 'center', marginTop: 32, marginBottom: 8 }}>
                          <TouchableOpacity
                            style={{
                              backgroundColor: 'linear-gradient(90deg, #43ea7a 0%, #2E7D32 100%)',
                              borderRadius: 28,
                              paddingVertical: 20,
                              paddingHorizontal: 38,
                              flexDirection: 'row',
                              alignItems: 'center',
                              shadowColor: '#2E7D32',
                              shadowRadius: 12,
                              shadowOffset: { width: 0, height: 4 },
                              borderColor: '#43ea7a',
                            }}
                            onPress={() => router.push('/trevos')}
                          >
                            <View style={{ marginRight: 18 }}>
                              <Image source={require('../../assets/images/trevo.png')} style={{ width: 44, height: 44 }} resizeMode="contain" />
                            </View>
                            <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#fff', marginLeft: 6, textShadowColor: '#2E7D32', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 }}>{quantidadeTrevos}</Text>
                          </TouchableOpacity>
                        </View>

                        <View style={{ height: 18 }} />
                        <TrevoTroca quantidade={quantidadeTrevos} />

                        <ScrollView contentContainerStyle={styles.container}>
                          <TouchableOpacity onPress={() => router.push('/explore')} activeOpacity={0.85} style={styles.headerCard}>
                            <Text style={styles.headerCardEmoji}>🔎</Text>
                            <View style={{ alignItems: 'center' }}>
                              <Text style={styles.headerCardTitle}>Doe sua roupa e ganhe trevos de troca</Text>
                              <Text style={styles.headerCardSubtitle}>Visite a área de Explorar para ver peças disponíveis →</Text>
                            </View>
                          </TouchableOpacity>

                          {/* Banner atraente acima do card de camiseta */}
                          <View style={styles.banner}>
                            <Text style={styles.bannerText}>🌱 Doe com propósito — ganhe trevos e renove seu guarda-roupa</Text>
                            <Text style={styles.bannerSubtitle}>Sua doação vai para a área de Roupas e poderá ser adquirida por outras pessoas através da troca de roupas.</Text>
                            {/* botão de adicionar removido daqui para manter apenas o CTA no featured card */}
                          </View>

                          {/* Featured card: substitui os cards por um layout mais atrativo */}
                          <View style={styles.featuredCardWrap}>
                            <View style={styles.featuredCard}>
                              {/* faixa de destaque no topo do card */}
                              <View style={styles.featuredAccent} />
                              <Image source={require('../../assets/images/camiseta.png')} style={styles.featuredImage} />
                              <Text style={styles.featuredTitle}>Doe uma peça, ganhe trevos ✨</Text>
                              <Text style={styles.featuredDesc}>Faça sua doação de forma rápida e responsável. Cada doação válida gera trevos que poderão ser usados por outras pessoas na área de Roupas.</Text>
                              <TouchableOpacity style={styles.featuredButton} onPress={() => setAddModalVisible(true)} activeOpacity={0.85}>
                                <Text style={styles.featuredButtonText}>✨ Adicionar peça</Text>
                              </TouchableOpacity>
                            </View>
                          </View>

                          {/* Título e subtítulo explicando as outras opções de doações */}
                          <View style={{ width: '100%', alignItems: 'center', marginTop: 8 }}>
                            <Text style={styles.sectionTitle}>Outras opções de doações</Text>
                            <Text style={styles.subtitle}>Doe roupas que você não usa mais — entregue para entidades, envie para bazares ou participe de trocas. Cada doação válida gera trevos de troca que você pode usar para adquirir outras peças.</Text>
                          </View>

                          <Modal visible={addModalVisible} transparent animationType="slide">
                            <View style={styles.modalOverlay}>
                              <View style={styles.modalContent}>
                                <TouchableOpacity style={styles.closeModal} onPress={() => setAddModalVisible(false)}>
                                  <Text style={{ fontSize: 24 }}>&times;</Text>
                                </TouchableOpacity>
                                <Text style={styles.modalTitle}>Adicionar Roupa</Text>
                                <TextInput
                                  placeholder="Nome da peça"
                                  value={newNome}
                                  onChangeText={setNewNome}
                                  style={[styles.textArea, { height: 44, marginBottom: 8 }]}
                                />
                                {Platform.OS === 'web' ? (
                                  <>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e: any) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                          setNewImagem(reader.result as string);
                                        };
                                        reader.readAsDataURL(file);
                                      }}
                                      style={{ marginBottom: 8 }}
                                    />
                                    {newImagem ? (
                                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                      // @ts-ignore
                                      <img src={newImagem} alt="preview" style={{ width: 120, height: 120, borderRadius: 12, marginBottom: 8, objectFit: 'cover' }} />
                                    ) : null}
                                  </>
                                ) : (
                                  <>
                                    <TouchableOpacity style={[styles.optionBtn, { width: '100%', marginBottom: 8 }]} onPress={pickImageForNew}>
                                      <Text style={{ color: '#145c2e', fontWeight: '700', textAlign: 'center' }}>Escolher imagem</Text>
                                    </TouchableOpacity>
                                    {newImagem ? <Image source={{ uri: newImagem }} style={{ width: 120, height: 120, borderRadius: 12, marginBottom: 8 }} /> : null}
                                  </>
                                )}
                                <TextInput
                                  placeholder="Descrição"
                                  value={newDescricao}
                                  onChangeText={setNewDescricao}
                                  multiline
                                  numberOfLines={3}
                                  style={[styles.textArea, { height: 80, marginBottom: 12 }]}
                                />
                                <TouchableOpacity
                                  style={[styles.optionBtn, { width: 160 }]}
                                  onPress={async () => {
                                    try {
                                      if (!newNome || !newImagem) {
                                        setToast({ message: 'Preencha nome e imagem.', type: 'error' });
                                        setTimeout(() => setToast(null), 2000);
                                        return;
                                      }
                                      if (Platform.OS === 'web' && typeof newImagem === 'string' && newImagem.startsWith('data:')) {
                                        const payload = { nome: newNome, descricao: newDescricao, imagemBase64: newImagem };
                                        const resp = await fetch('http://localhost:3001/api/admin-upload', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify(payload),
                                        });
                                        const data = await resp.json();
                                        if (resp.ok && data.success) {
                                          setToast({ message: 'Imagem enviada para Administração!', type: 'success' });
                                          setTimeout(() => setToast(null), 1400);
                                          setAddModalVisible(false);
                                          setNewNome('');
                                          setNewImagem('');
                                          setNewDescricao('');
                                        } else {
                                          setToast({ message: data.error || 'Erro ao enviar imagem', type: 'error' });
                                          setTimeout(() => setToast(null), 2000);
                                        }
                                      } else {
                                        const idUsuario = await storage.getItem('idUsuario') || '0';
                                        const formData = new FormData();
                                        formData.append('usuario_id', idUsuario as any);
                                        formData.append('descricao', newDescricao || newNome);
                                        formData.append('destino', 'bazar');
                                        formData.append('tempo_uso', '0');
                                        formData.append('estado', 'novo');
                                        formData.append('tamanho', 'N/A');
                                        const uri = newImagem as unknown as string;
                                        const filename = uri.split('/').pop() || `photo.jpg`;
                                        const match = filename.match(/\.([a-zA-Z0-9]+)$/);
                                        const ext = match ? match[1].toLowerCase() : 'jpg';
                                        const type = ext === 'png' ? 'image/png' : 'image/jpeg';
                                        formData.append('foto', { uri, name: filename, type } as any);
                                        const resp = await fetch('http://localhost:3001/api/doacao', {
                                          method: 'POST',
                                          body: formData,
                                        });
                                        const data = await resp.json();
                                        if (resp.ok && data.success) {
                                          setToast({ message: 'Imagem enviada para Administração!', type: 'success' });
                                          setTimeout(() => setToast(null), 1400);
                                          setAddModalVisible(false);
                                          setNewNome('');
                                          setNewImagem('');
                                          setNewDescricao('');
                                        } else {
                                          setToast({ message: data.error || 'Erro ao enviar imagem', type: 'error' });
                                          setTimeout(() => setToast(null), 2000);
                                        }
                                      }
                                    } catch (e) {
                                      setToast({ message: 'Erro ao enviar imagem.', type: 'error' });
                                      setTimeout(() => setToast(null), 2000);
                                    }
                                  }}
                                >
                                  <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Enviar para Admin</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </Modal>

                        </ScrollView>
                      </View>
                    );
                  }