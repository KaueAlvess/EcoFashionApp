import storage from '@/utils/storage';
import React, { useState } from 'react';
import { Animated, Image, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Toast from '../../components/Toast';

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
                    destinoImg: { width: 52, height: 52, borderRadius: 26, marginBottom: 6 },
                    destinoImgWrap: { width: 160, height: 84, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', marginBottom: 6 },
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
                    /* single-line input styled to match other inputs: white bg, rounded corners and subtle shadow */
                    smallInput: {
                      backgroundColor: '#fff',
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      width: '100%',
                      borderWidth: 1,
                      borderColor: '#e6f4ea',
                      fontSize: 16,
                      color: '#145c2e',
                      shadowColor: '#2E7D32',
                      shadowOpacity: 0.06,
                      shadowRadius: 6,
                      shadowOffset: { width: 0, height: 2 },
                      elevation: 2,
                    },
                    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
                    modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 18, alignItems: 'center', width: '60%', minWidth: 360, maxWidth: 720, maxHeight: '86%', elevation: 8, position: 'relative', borderWidth: 1, borderColor: '#e6f4ea' },
                    confirmModalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 18, alignItems: 'center', width: '60%', minWidth: 320, maxWidth: 720, maxHeight: '86%', elevation: 8, position: 'relative', borderWidth: 1, borderColor: '#e6f4ea' },
                    modalHeader: { width: '100%', alignItems: 'center', marginBottom: 8 },
                    headerBadge: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#e8fef0', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#bff0c4', marginBottom: 8 },
                    modalSubtitle: { color: '#2E7D32', fontSize: 13, marginBottom: 6, textAlign: 'center' },
                    primaryBtn: { backgroundColor: '#2E7D32', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 28, alignItems: 'center', justifyContent: 'center', width: 160, elevation: 6 },
                    primaryBtnText: { color: '#fff', fontWeight: '800' },
                    secondaryBtn: { backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 28, alignItems: 'center', justifyContent: 'center', width: 160, borderWidth: 2, borderColor: '#2E7D32' },
                    secondaryBtnText: { color: '#145c2e', fontWeight: '800' },
                    optionBtn: {
                      backgroundColor: '#f7fff7',
                      borderRadius: 14,
                      paddingVertical: 10,
                      paddingHorizontal: 18,
                      margin: 6,
                      elevation: 2,
                      borderWidth: 1,
                      borderColor: '#dff6e8',
                      shadowColor: '#2E7D32',
                      shadowOpacity: 0.06,
                      shadowRadius: 6,
                      shadowOffset: { width: 0, height: 2 },
                    },
                    selectedOption: {
                      borderColor: '#2E7D32',
                      backgroundColor: '#c6f7d0',
                      elevation: 8,
                      shadowOpacity: 0.22,
                      transform: [{ translateY: -2 } as any],
                    },
                    closeModal: { position: 'absolute', top: 8, right: 12, zIndex: 3 },
                    closeModalBtn: { position: 'absolute', top: 8, right: 12, zIndex: 4, width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
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
                    linkCardsRow: {
                      flexDirection: 'row',
                      justifyContent: 'center',
                      gap: 12,
                      marginTop: 12,
                      width: '100%',
                    },
                    linkCard: {
                      width: 320,
                      backgroundColor: '#fff',
                      borderRadius: 12,
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                      alignItems: 'flex-start',
                      borderWidth: 1,
                      borderColor: '#e6f4ea',
                      shadowColor: '#2E7D32',
                      shadowOpacity: 0.06,
                      shadowRadius: 8,
                      shadowOffset: { width: 0, height: 4 },
                      elevation: 3,
                    },
                    linkCardTitle: {
                      fontSize: 16,
                      fontWeight: '800',
                      color: '#145c2e',
                    },
                    linkCardDesc: {
                      fontSize: 13,
                      color: '#356b3a',
                      marginTop: 8,
                    },
                    linkCardAction: {
                      marginTop: 12,
                      alignSelf: 'stretch',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    },
                    linkCardActionPill: {
                      backgroundColor: '#2E7D32',
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderRadius: 20,
                      elevation: 2,
                    },
                    linkCardActionText: {
                      color: '#fff',
                      fontWeight: '800',
                      fontSize: 13,
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
                    // modalVisible was unused and defaulting to true; remove to avoid accidental overlays
                    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
                    const [linkModalVisible, setLinkModalVisible] = useState(false);
                    const [linkModalUrl, setLinkModalUrl] = useState('');
                    const [activeTopTab, setActiveTopTab] = useState('roupas');
                    const [addModalVisible, setAddModalVisible] = useState(false);
                    const [newNome, setNewNome] = useState('');
                    const [newImagem, setNewImagem] = useState('');
                    const [newDescricao, setNewDescricao] = useState('');
                    const [destino, setDestino] = useState('');
                    const [tempoUso, setTempoUso] = useState('');
                    const [estado, setEstado] = useState('');
                    const [requestedTrevos, setRequestedTrevos] = useState<number>(5);
                    const [tamanho, setTamanho] = useState('');
                    const [tipo, setTipo] = useState('');
                    const [descricao, setDescricao] = useState('');
                    const [fotoRoupa, setFotoRoupa] = useState<string | null>(null);
                    const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);
                    const router = require('expo-router').useRouter();

                    const selectedDestino = destinos.find(d => d.key === destino);
                    const [quantidadeTrevos, setQuantidadeTrevos] = React.useState(0);
                    const trevoPulse = React.useRef(new Animated.Value(1)).current;

                    const openLinkInModal = (url: string) => {
                      setLinkModalUrl(url);
                      setLinkModalVisible(true);
                    };

                    React.useEffect(() => {
                      let mounted = true;
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
                            if (data.success && data.usuario && mounted) {
                              setQuantidadeTrevos(data.usuario.trevos || 0);
                            }
                          }
                        } catch (e) {
                          // ignore
                        }
                      })();

                      // initialize from storage quickly (if present) and subscribe to updates
                      (async () => {
                        try {
                          const t = await storage.getItem('trevos');
                          if (mounted && t) setQuantidadeTrevos(parseInt(t, 10));
                        } catch (e) {}
                      })();

                      const handle = (key: string, newValue: string | null) => {
                        if (key === 'trevos') {
                          const val = newValue ? parseInt(newValue, 10) : 0;
                          setQuantidadeTrevos(val);
                          // small pulse animation when value changes
                          Animated.sequence([
                            Animated.timing(trevoPulse, { toValue: 1.12, duration: 220, useNativeDriver: true }),
                            Animated.timing(trevoPulse, { toValue: 1, duration: 300, useNativeDriver: true }),
                          ]).start();
                        }
                      };
                      try { storage.addChangeListener && storage.addChangeListener(handle); } catch (e) {}

                      return () => {
                        mounted = false;
                        try { storage.removeChangeListener && storage.removeChangeListener(handle); } catch (e) {}
                      };
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
                              {Platform.OS === 'web' ? (
                                // Use a plain HTML button on web to avoid occasional react-native-web touchable/text rendering quirks
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                <button onClick={() => setAddModalVisible(true)} style={{ all: 'unset', cursor: 'pointer' }} aria-label="Adicionar peça">
                                  <div style={{ backgroundColor: '#2E7D32', padding: '12px 28px', borderRadius: 30, color: '#fff', fontWeight: 800, fontSize: 16, textAlign: 'center', display: 'inline-block' }}>
                                    ✨ Adicionar peça
                                  </div>
                                </button>
                              ) : (
                                <TouchableOpacity style={styles.featuredButton} onPress={() => setAddModalVisible(true)} activeOpacity={0.85} accessibilityLabel="Adicionar peça">
                                  <Text style={styles.featuredButtonText}>✨ Adicionar peça</Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          </View>

                          {/* Título e subtítulo explicando as outras opções de doações */}
                          <View style={{ width: '100%', alignItems: 'center', marginTop: 8 }}>
                            <Text style={styles.sectionTitle}>Outras opções de doações</Text>
                            <Text style={styles.subtitle}>Doe roupas que você não usa mais — entregue para entidades, envie para bazares ou participe de trocas. Cada doação válida gera trevos de troca que você pode usar para adquirir outras peças.</Text>
                          </View>

                          {/* Links para pontos de coleta externos */}
                          <View style={styles.linkCardsRow}>
                            {/* Exército de Salvação */}
                            {Platform.OS === 'web' ? (
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore
                              <a href="#" onClick={(e:any) => { e.preventDefault(); openLinkInModal('https://www.amigosdobem.org/arrecadacaodeprodutos'); }} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                                <div style={{ display: 'inline-block' }}>
                                  <View style={styles.linkCard}>
                                    <Text style={styles.linkCardTitle}>Amigos do Bem</Text>
                                    <Text style={styles.linkCardDesc}>Pontos de arrecadação — descubra locais para doar produtos e roupas.</Text>
                                    <View style={styles.linkCardAction}>
                                      <View style={styles.linkCardActionPill}>
                                        <Text style={styles.linkCardActionText}>Abrir ↗</Text>
                                      </View>
                                    </View>
                                  </View>
                                </div>
                              </a>
                            ) : (
                              <TouchableOpacity style={styles.linkCard} activeOpacity={0.85} onPress={() => openLinkInModal('https://www.amigosdobem.org/arrecadacaodeprodutos')}>
                                <Text style={styles.linkCardTitle}>Amigos do Bem</Text>
                                <Text style={styles.linkCardDesc}>Pontos de arrecadação — descubra locais para doar produtos e roupas.</Text>
                                <View style={styles.linkCardAction}>
                                  <View style={styles.linkCardActionPill}>
                                    <Text style={styles.linkCardActionText}>Abrir ↗</Text>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            )}

                            {/* Gerando Falcões */}
                            {Platform.OS === 'web' ? (
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore
                              <a href="#" onClick={(e:any) => { e.preventDefault(); openLinkInModal('https://gerandofalcoes.com/pontos-de-coleta'); }} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                                <div style={{ display: 'inline-block' }}>
                                  <View style={styles.linkCard}>
                                    <Text style={styles.linkCardTitle}>Gerando Falcões</Text>
                                    <Text style={styles.linkCardDesc}>Consulte pontos de coleta locais e contribua com campanhas sociais.</Text>
                                    <View style={styles.linkCardAction}>
                                      <View style={styles.linkCardActionPill}>
                                        <Text style={styles.linkCardActionText}>Abrir ↗</Text>
                                      </View>
                                    </View>
                                  </View>
                                </div>
                              </a>
                            ) : (
                              <TouchableOpacity style={styles.linkCard} activeOpacity={0.85} onPress={() => openLinkInModal('https://gerandofalcoes.com/pontos-de-coleta')}>
                                <Text style={styles.linkCardTitle}>Gerando Falcões</Text>
                                <Text style={styles.linkCardDesc}>Consulte pontos de coleta locais e contribua com campanhas sociais.</Text>
                                <View style={styles.linkCardAction}>
                                  <View style={styles.linkCardActionPill}>
                                    <Text style={styles.linkCardActionText}>Abrir ↗</Text>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            )}
                          </View>

                          <Modal visible={addModalVisible} transparent animationType="slide">
                            <View style={styles.modalOverlay}>
                              <View style={styles.modalContent}>
                                <TouchableOpacity style={styles.closeModal} onPress={() => setAddModalVisible(false)}>
                                  <Text style={{ fontSize: 24 }}>&times;</Text>
                                </TouchableOpacity>
                                <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center', paddingVertical: 8 }}>
                                  <View style={styles.modalHeader}>
                                    <View style={styles.headerBadge}>
                                      <Image source={require('../../assets/images/trevo.png')} style={{ width: 36, height: 36 }} resizeMode="contain" />
                                    </View>
                                    <Text style={[styles.modalTitle, { fontSize: 22 }]}>Adicionar Roupa</Text>
                                    <Text style={styles.modalSubtitle}>Compartilhe sua peça e ganhe trevos ✨</Text>
                                  </View>
                                  <TextInput
                                    placeholder="Nome da peça"
                                    value={newNome}
                                    onChangeText={setNewNome}
                                    style={[styles.smallInput, { height: 44, marginBottom: 8 }]}
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
                                  {/* Tipo da peça (camiseta/blusa/short/calça) */}
                                  <View style={{ width: '100%', marginBottom: 10 }}>
                                    <Text style={{ color: '#145c2e', fontWeight: '700', marginBottom: 8 }}>Tipo da peça</Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                      {['camiseta','blusa','short','calça'].map(t => (
                                        <TouchableOpacity key={t} onPress={() => setTipo(t)} style={[styles.optionBtn, tipo === t ? styles.selectedOption : {}, { marginRight: 8, marginBottom: 8 }]}>
                                          <Text style={{ color: tipo === t ? '#145c2e' : '#2E7D32', fontWeight: tipo === t ? '800' : '600', textTransform: 'capitalize' }}>{t}</Text>
                                        </TouchableOpacity>
                                      ))}
                                    </View>
                                  </View>
                                  {/* Tamanhos — adaptam ao tipo selecionado (camiseta/blusa => P/M/G/GG ; calça/short => 36..48) */}
                                  <View style={{ width: '100%', marginBottom: 10 }}>
                                    <Text style={{ color: '#145c2e', fontWeight: '700', marginBottom: 8 }}>Tamanho</Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                      {(() => {
                                        const camisaSizes = ['P','M','G','GG'];
                                        const calcaSizes = ['36','38','40','42','44','46','48'];
                                        const opts = (tipo === 'calça' || tipo === 'calca') ? calcaSizes : (tipo === 'short' ? calcaSizes : (tipo === 'camiseta' || tipo === 'blusa' ? camisaSizes : ['P','M','G']));
                                        return opts.map(s => (
                                          <TouchableOpacity key={s} onPress={() => setTamanho(s)} style={[styles.optionBtn, tamanho === s ? styles.selectedOption : {}, { marginRight: 8, marginBottom: 8 }]}>
                                            <Text style={{ color: tamanho === s ? '#145c2e' : '#2E7D32', fontWeight: tamanho === s ? '800' : '600' }}>{s}</Text>
                                          </TouchableOpacity>
                                        ));
                                      })()}
                                    </View>
                                  </View>
                                  {/* Estado da roupa (ruim/ok/bom/muito bom) */}
                                  <View style={{ width: '100%', marginBottom: 10 }}>
                                    <Text style={{ color: '#145c2e', fontWeight: '700', marginBottom: 8 }}>Estado da roupa</Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                      {estadoOptions.map(opt => (
                                        <TouchableOpacity
                                          key={opt.value}
                                          onPress={() => setEstado(opt.value)}
                                          style={[styles.optionBtn, estado === opt.value ? styles.selectedOption : {}, { marginRight: 8, marginBottom: 8 }]}
                                        >
                                          <Text style={{ color: estado === opt.value ? '#145c2e' : '#2E7D32', fontWeight: estado === opt.value ? '800' : '600' }}>{opt.label}</Text>
                                        </TouchableOpacity>
                                      ))}
                                    </View>
                                  </View>
                                  {/* Trevos solicitados: opção removida — valor padrão utilizado internamente */}
                                  {/* New button: move locally to admin solicitations immediately (works offline) */}
                                  <TouchableOpacity
                                    style={styles.secondaryBtn}
                                    onPress={async () => {
                                      try {
                                        if (!newNome || !newImagem) {
                                          setToast({ message: 'Preencha nome e imagem.', type: 'error' });
                                          setTimeout(() => setToast(null), 2000);
                                          return;
                                        }
                                        // add to local solicitations so admin can review even if server is offline
                                        const raw = (await storage.getItem('solicitacoes_doacao')) || '[]';
                                        let arr = [] as any[];
                                        try { arr = JSON.parse(raw || '[]'); } catch (e) { arr = []; }
                                        const uid = (await storage.getItem('idUsuario')) || '0';
                                        const solicit = { id: Date.now(), usuario_id: parseInt(uid as string, 10) || 0, nome: newNome, descricao: newDescricao, imagem: newImagem, estado: estado || 'ok', trevosSolicitados: requestedTrevos || 0, tamanho: tamanho || null, tipo: tipo || null, createdAt: new Date().toISOString(), status: 'pendente' };
                                        arr.unshift(solicit);
                                        await storage.setItem('solicitacoes_doacao', JSON.stringify(arr));
                                        setToast({ message: 'Movido para solicitações (Admin).', type: 'success' });
                                        setTimeout(() => setToast(null), 1400);
                                        setAddModalVisible(false);
                                        setNewNome('');
                                        setNewImagem('');
                                        setNewDescricao('');
                                      } catch (e) {
                                        setToast({ message: 'Erro ao mover para solicitações', type: 'error' });
                                        setTimeout(() => setToast(null), 2000);
                                      }
                                    }}
                                  >
                                    <Text style={styles.secondaryBtnText}>Mover para Solicitações</Text>
                                  </TouchableOpacity>

                                  {/* Botão "Enviar para Admin" removido — mantemos apenas a opção de mover para solicitações */}
                                </ScrollView>
                              </View>
                            </View>
                          </Modal>

                          {/* Modal para abrir links externos dentro do app (iframe/webview) */}
                          <Modal visible={linkModalVisible} transparent animationType="slide">
                            <View style={styles.modalOverlay}>
                              <View style={[styles.modalContent, { width: '92%', maxWidth: 1000, height: '80%', padding: 0, overflow: 'hidden' }]}>
                                <TouchableOpacity style={styles.closeModalBtn} onPress={() => setLinkModalVisible(false)} accessibilityLabel="Fechar" accessibilityRole="button">
                                  <Text style={{ fontSize: 20, fontWeight: '900' }}>✕</Text>
                                </TouchableOpacity>
                                {Platform.OS === 'web' ? (
                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  // @ts-ignore
                                  <iframe src={linkModalUrl} title="Pontos de Coleta" style={{ flex: 1, width: '100%', height: '100%', border: 0, borderRadius: 12 }} />
                                ) : (
                                  <WebView source={{ uri: linkModalUrl }} style={{ flex: 1 }} />
                                )}
                              </View>
                            </View>
                          </Modal>

                        </ScrollView>
                      </View>
                    );
                  }