import storage from '@/utils/storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Animated, Image, ImageBackground, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// image picker will be required dynamically for native

export default function PerfilScreen() {
  const router = useRouter();
  const avatarAnim = React.useRef(new Animated.Value(0)).current;
  const [nome, setNome] = useState('Nome');
  const [editandoNome, setEditandoNome] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const quantidadeTrevos = 0;
  const [favoritosList, setFavoritosList] = useState<any[]>([]);
  const [showFavoritosModal, setShowFavoritosModal] = useState(false);
  const [showDoacoesModal, setShowDoacoesModal] = useState(false);
  const [doacoesAprovadas, setDoacoesAprovadas] = useState<any[]>([]);
  const [doacoesCount, setDoacoesCount] = useState<number>(0);

  // Produtos fictícios e rotas
  const produtos = [
  { id: 1, nome: 'Doações', icon: null, rota: '/doacao' },
  { id: 2, nome: 'Cadastro', icon: null, rota: '/signup' },
  { id: 3, nome: 'Configurações', icon: null, rota: '/configuracoes' },
  ];

  // Cores personalizadas para os quadrados — mais verdes e vibrantes
  const coresQuadrados = ['#E8F5E9', '#C8E6C9', '#A5D6A7', '#81C784'];
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  // animated scales for card press feedback
  const favScale = React.useRef(new Animated.Value(1)).current;
  const trevoScale = React.useRef(new Animated.Value(1)).current;
  const doaScale = React.useRef(new Animated.Value(1)).current;
  const uploadScale = React.useRef(new Animated.Value(1)).current;
  const removeScale = React.useRef(new Animated.Value(1)).current;
  const avatarScale = React.useRef(new Animated.Value(1)).current;

  // foto de perfil removida: não há seleção de imagem neste perfil
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const n = await storage.getItem('profile_name');
        const img = await storage.getItem('profile_image');
        if (!mounted) return;
        if (n) setNome(n);
        if (img) setProfileImage(img);
      } catch (e) {}
    })();
    // also check if we should open favoritos (flag set by roupas.tsx)
    try {
      const openFav = localStorage.getItem('__open_favoritos');
      if (openFav === '1') {
        const raw = localStorage.getItem('favoritos') || '[]';
        const arr = JSON.parse(raw || '[]');
        setFavoritosList(Array.isArray(arr) ? arr : []);
        setShowFavoritosModal(true);
        try { localStorage.removeItem('__open_favoritos'); } catch (e) {}
      }
    } catch (e) {}

    return () => { mounted = false; };
  }, []);

  // load favoritos initially and listen for changes
  React.useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem('favoritos') || '[]';
        const arr = JSON.parse(raw || '[]');
        setFavoritosList(Array.isArray(arr) ? arr : []);
      } catch (e) { setFavoritosList([]); }
    };
    load();
    const onStorage = (ev: StorageEvent) => {
      if (!ev.key || ev.key === 'favoritos') load();
    };
    try { window.addEventListener('storage', onStorage as any); } catch (e) {}
    // also listen to storage wrapper if available
    try { storage.addChangeListener && storage.addChangeListener((k:string,v:string|null)=> { if (k==='favoritos') load(); }); } catch (e) {}
    return () => { try { window.removeEventListener('storage', onStorage as any); } catch (e) {} };
  }, []);

  // load count of approved donations for this user and update on storage changes
  React.useEffect(() => {
    const loadCount = async () => {
      try {
        const userId = (await storage.getItem('idUsuario')) || localStorage.getItem('idUsuario') || null;
        const raw = localStorage.getItem('solicitacoes_doacao_usuario') || '[]';
        const arr = JSON.parse(raw || '[]') || [];
        const cnt = (Array.isArray(arr) ? arr : []).filter((s:any) => String(s.usuario_id) === String(userId) && s.status === 'aprovado').length;
        setDoacoesCount(cnt);
      } catch (e) { setDoacoesCount(0); }
    };
    loadCount();
    const onStorage = (ev: StorageEvent) => {
      if (!ev.key || ev.key === 'solicitacoes_doacao_usuario') loadCount();
    };
    try { window.addEventListener('storage', onStorage as any); } catch (e) {}
    try { storage.addChangeListener && storage.addChangeListener((k:string)=> { if (k==='solicitacoes_doacao_usuario') loadCount(); }); } catch (e) {}
    return () => { try { window.removeEventListener('storage', onStorage as any); } catch (e) {} };
  }, []);

  const saveNome = async (value: string) => {
    try { await storage.setItem('profile_name', value); } catch (e) {}
  };

  const pickProfileImage = async () => {
    try {
      if (Platform.OS === 'web') return; // web handled via input if needed
      const { launchImageLibraryAsync, requestMediaLibraryPermissionsAsync, MediaTypeOptions } = require('expo-image-picker');
      const permission = await requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert('Permissão necessária para acessar a galeria');
        return;
      }
      const res = await launchImageLibraryAsync({ mediaTypes: MediaTypeOptions.Images, allowsEditing: true, quality: 0.8 });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const uri = res.assets[0].uri;
        setProfileImage(uri);
        try { await storage.setItem('profile_image', uri); } catch (e) {}
      }
    } catch (e) {
      // ignore
    }
  };

  const removeProfileImage = async () => {
    try {
      // fade out avatar then remove
      Animated.timing(avatarAnim, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => setProfileImage(null));
      await storage.removeItem('profile_image');
    } catch (e) {}
  };

  // animate avatar in when profileImage changes
  React.useEffect(() => {
    if (profileImage) {
      avatarAnim.setValue(0);
      Animated.timing(avatarAnim, { toValue: 1, duration: 420, useNativeDriver: true }).start();
    }
  }, [profileImage]);

  return (
    <View style={styles.screenBackground}>
      <View style={styles.card}>
        <ImageBackground source={require('../../assets/images/trevo.png')} style={styles.profileHeroBg} imageStyle={{ opacity: 0.06, resizeMode: 'cover', borderRadius: 12 }}>
          <View style={styles.profileHeroOverlay} />
          <View style={styles.profileHeroContent}>
            {/* decorative blobs behind avatar for a modern look */}
            <View style={styles.decorLeft} />
            <View style={styles.decorRight} />
            <AnimatedTouchable
              style={[styles.avatarOuter, { transform: [{ scale: avatarScale }] }]}
              onPress={pickProfileImage}
              onPressIn={() => Animated.spring(avatarScale, { toValue: 0.98, useNativeDriver: true }).start()}
              onPressOut={() => Animated.spring(avatarScale, { toValue: 1, friction: 6, useNativeDriver: true }).start()}
              activeOpacity={0.9}
            >
              <View style={styles.avatarRing}>
                {profileImage ? (
                  <Animated.Image
                    source={{ uri: profileImage }}
                    style={[styles.avatar, { opacity: avatarAnim }]}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarEmoji}>👤</Text>
                  </View>
                )}
              </View>
            </AnimatedTouchable>

            {editandoNome ? (
              <TextInput
                style={[styles.nomeInputLarge, styles.nomeHero]}
                value={nome}
                onChangeText={setNome}
                onBlur={() => { setEditandoNome(false); saveNome(nome); }}
                autoFocus
              />
            ) : (
              <TouchableOpacity onPress={() => setEditandoNome(true)}>
                <Text style={[styles.nomeTextoLarge, styles.nomeHero]}>{nome}</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.username}>@{(nome || 'usuario').toLowerCase().replace(/\s+/g,'')}</Text>
            <Text style={styles.bio}>Apaixonado por moda sustentável · Doe roupas, ganhe trevos 🌱</Text>

              {/* decorative art on hero (subtle) */}
              <Image source={require('../../assets/images/sobre-nos.png')} style={styles.heroDecor} />

            {/* Removed top statistics (Doações/Trevos/Seguindo) per request. */}
            <View style={styles.topActionsRow}>
            {Platform.OS === 'web' ? (
              <input type="file" accept="image/*" onChange={(e:any)=>{
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = async () => {
                  const result = reader.result as string;
                  setProfileImage(result);
                  try { await storage.setItem('profile_image', result); } catch (err) {}
                  saveNome(nome);
                };
                reader.readAsDataURL(file);
              }} style={{ marginTop: 8 }} />
            ) : (
              <AnimatedTouchable
                style={[styles.uploadBtn, { transform: [{ scale: uploadScale }] }]}
                onPress={pickProfileImage}
                onPressIn={() => Animated.spring(uploadScale, { toValue: 0.98, useNativeDriver: true }).start()}
                onPressOut={() => Animated.spring(uploadScale, { toValue: 1, friction: 6, useNativeDriver: true }).start()}
                activeOpacity={0.9}
              >
                <Text style={styles.uploadBtnText}>Alterar foto</Text>
              </AnimatedTouchable>
            )}
            <AnimatedTouchable
              style={[styles.removeBtn, { transform: [{ scale: removeScale }] }]}
              onPress={removeProfileImage}
              onPressIn={() => Animated.spring(removeScale, { toValue: 0.98, useNativeDriver: true }).start()}
              onPressOut={() => Animated.spring(removeScale, { toValue: 1, friction: 6, useNativeDriver: true }).start()}
              activeOpacity={0.9}
            >
              <Text style={styles.removeBtnText}>Remover</Text>
            </AnimatedTouchable>
          </View>
        </View>
        </ImageBackground>

        <View style={styles.produtosArea}>
          <View style={styles.produtosGrid}>
            <AnimatedTouchable
              style={[styles.produtoItem, { backgroundColor: coresQuadrados[0], transform: [{ scale: favScale }] }]}
              onPress={() => { setFavoritosList(prev => prev); setShowFavoritosModal(true); }}
              activeOpacity={0.85}
              onPressIn={() => { Animated.spring(favScale, { toValue: 0.96, useNativeDriver: true }).start(); }}
              onPressOut={() => { Animated.spring(favScale, { toValue: 1, friction: 6, useNativeDriver: true }).start(); }}
            >
                <View style={styles.produtoConteudo}>
                  {favoritosList && favoritosList.length > 0 ? (
                    <View style={{ alignItems: 'center' }}>
                      {/* show a star cover instead of the last item's thumbnail */}
                            <View style={[styles.coverBase, styles.starCover]}>
                              <Text style={styles.starCoverEmoji}>★</Text>
                            </View>
                      <Text style={[styles.produtoNome, { fontSize: 14 }]} numberOfLines={1}>Favoritos</Text>
                      <Text style={{ color: '#666', fontSize: 12 }}>{favoritosList.length} favorito(s)</Text>
                    </View>
                  ) : (
                    <Text style={styles.produtoNome}>Favoritos</Text>
                  )}
                </View>
            </AnimatedTouchable>
            <AnimatedTouchable
              style={[styles.produtoItem, { backgroundColor: coresQuadrados[1], transform: [{ scale: trevoScale }] }]}
              onPress={() => router.push("/trevos")}
              activeOpacity={0.85}
              onPressIn={() => { Animated.spring(trevoScale, { toValue: 0.96, useNativeDriver: true }).start(); }}
              onPressOut={() => { Animated.spring(trevoScale, { toValue: 1, friction: 6, useNativeDriver: true }).start(); }}
            >
              <View style={styles.produtoConteudo}>
                <View style={[styles.coverBase, styles.trevoCover]}>
                  <Image source={require('../../assets/images/trevo.png')} style={styles.trevoCoverImg} />
                </View>
                <Text style={[styles.produtoNome, { fontSize: 14 }]}>Trevos</Text>
                <Text style={{ color: '#666', fontSize: 12 }}>{quantidadeTrevos} trevo(s)</Text>
              </View>
            </AnimatedTouchable>
            <AnimatedTouchable
              style={[styles.produtoItem, { backgroundColor: coresQuadrados[2], transform: [{ scale: doaScale }] }]}
              onPress={async () => {
                try {
                  // load per-user solicitations and filter approved ones
                  const userId = (await storage.getItem('idUsuario')) || localStorage.getItem('idUsuario') || null;
                  const raw = localStorage.getItem('solicitacoes_doacao_usuario') || '[]';
                  const arr = JSON.parse(raw || '[]') || [];
                  const mine = (Array.isArray(arr) ? arr : []).filter((s:any) => String(s.usuario_id) === String(userId) && s.status === 'aprovado');
                  setDoacoesAprovadas(mine);
                } catch (e) { setDoacoesAprovadas([]); }
                setShowDoacoesModal(true);
              }}
              activeOpacity={0.85}
              onPressIn={() => { Animated.spring(doaScale, { toValue: 0.96, useNativeDriver: true }).start(); }}
              onPressOut={() => { Animated.spring(doaScale, { toValue: 1, friction: 6, useNativeDriver: true }).start(); }}
            >
              <View style={styles.produtoConteudo}>
                {doacoesCount > 0 ? (
                  <View style={{ alignItems: 'center' }}>
                    <View style={[styles.coverBase, styles.handCover]}>
                      <Text style={styles.handEmoji}>🤝</Text>
                    </View>
                    <Text style={[styles.produtoNome, { fontSize: 14 }]} numberOfLines={1}>Doações</Text>
                    <Text style={{ color: '#666', fontSize: 12 }}>{doacoesCount} doação(ões)</Text>
                  </View>
                ) : (
                  <>
                    <View style={[styles.coverBase, styles.handCover]}>
                      <Text style={styles.handEmoji}>🤝</Text>
                    </View>
                    <Text style={styles.produtoNome}>Doações</Text>
                  </>
                )}
              </View>
            </AnimatedTouchable>
          </View>
        </View>
        {/* Favoritos modal (opened when user clicks star on a product) */}
        <Modal visible={showFavoritosModal} transparent animationType="slide">
          <View style={styles.favoritosModalOverlay}>
            <View style={styles.favoritosModalContent}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontWeight: '800', fontSize: 16 }}>Seus Favoritos</Text>
                <TouchableOpacity onPress={() => setShowFavoritosModal(false)}>
                  <Text style={{ fontSize: 20 }}>&times;</Text>
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={{ paddingVertical: 12 }}>
                {favoritosList.length === 0 ? (
                  <Text style={{ color: '#666' }}>Você não tem favoritos ainda.</Text>
                ) : favoritosList.map((f, i) => (
                  <View key={i} style={styles.favoritoItem}>
                    {f.imagem ? <Image source={{ uri: f.imagem }} style={styles.favoritoImg} /> : null}
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={{ fontWeight: '700' }}>{f.nome}</Text>
                      <Text style={{ color: '#666' }}>{f.descricao}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
        {/* Doações aprovadas modal (opened from Doações card) */}
        <Modal visible={showDoacoesModal} transparent animationType="slide">
          <View style={styles.doacoesModalOverlay}>
            <View style={styles.doacoesModalContent}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontWeight: '800', fontSize: 16 }}>Suas Doações Aprovadas</Text>
                <TouchableOpacity onPress={() => setShowDoacoesModal(false)}>
                  <Text style={{ fontSize: 20 }}>&times;</Text>
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={{ paddingVertical: 12 }}>
                {doacoesAprovadas.length === 0 ? (
                  <Text style={{ color: '#666' }}>Você ainda não teve doações aprovadas.</Text>
                ) : doacoesAprovadas.map((d, i) => {
                  const prod = d.produto || { nome: d.nome, descricao: d.descricao, imagem: d.imagem };
                  return (
                    <View key={d.id || i} style={styles.doacaoItem}>
                      {prod.imagem ? <Image source={{ uri: prod.imagem }} style={styles.doacaoImg} /> : null}
                      <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={{ fontWeight: '800' }}>{prod.nome || d.nome}</Text>
                        {d.adminMessage ? <Text style={{ color: '#666', marginTop: 4 }}>{d.adminMessage}</Text> : null}
                        <Text style={{ color: '#999', marginTop: 6, fontSize: 12 }}>{d.createdAt ? new Date(d.createdAt).toLocaleString() : ''}</Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
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
    fontSize: 18,
    color: '#222',
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 10,
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
    gap: 20,
    marginTop: 18,
  },
  produtoItem: {
    width: 128,
    height: 128,
    backgroundColor: '#fff',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
    padding: 8,
  },
  produtoIcon: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
    tintColor: '#222', // Deixa o ícone escuro, pode ajustar conforme o ícone
  },
  screenBackground: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  card: {
    width: '92%',
    maxWidth: 720,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    marginBottom: 18,
  },
  userArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  btnPrimary: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: '#43A047',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  btnOutlineText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  subtle: {
    color: '#666',
    marginTop: 4,
  },
  profileTop: {
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 12,
  },
  /* Hero/profile background and avatar ring */
  profileHeroBg: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  profileHeroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(76,175,80,0.06)'
  },
  profileHeroContent: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRing: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.88)',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    marginBottom: 12,
  },
  avatarOuter: {
    padding: 6,
    borderRadius: 84,
    backgroundColor: 'rgba(46,125,50,0.06)',
    alignSelf: 'center',
    marginBottom: 8,
  },
  nomeHero: {
    textShadowColor: 'rgba(0,0,0,0.08)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  decorLeft: {
    position: 'absolute',
    left: -36,
    top: 8,
    width: 140,
    height: 140,
    borderRadius: 80,
    backgroundColor: 'rgba(76,175,80,0.10)',
    transform: [{ rotate: '-12deg' }],
  },
  decorRight: {
    position: 'absolute',
    right: -28,
    top: 28,
    width: 120,
    height: 120,
    borderRadius: 64,
    backgroundColor: 'rgba(76,175,80,0.10)',
    transform: [{ rotate: '8deg' }],
  },
  heroDecor: {
    position: 'absolute',
    right: 12,
    bottom: 6,
    width: 160,
    height: 120,
    opacity: 0.08,
    resizeMode: 'contain',
    transform: [{ translateY: 6 }],
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#eee',
    resizeMode: 'cover',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  avatarPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e6e6e6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  avatarEmoji: { fontSize: 48 },
  nomeInputLarge: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginTop: 12,
    textAlign: 'center',
    minWidth: 140,
  },
  nomeTextoLarge: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginTop: 12,
    textAlign: 'center',
  },
  username: {
    color: '#666',
    marginTop: 4,
  },
  bio: {
    color: '#444',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 12,
  },
  stat: { alignItems: 'center' },
  statNumber: { fontWeight: '700', fontSize: 16 },
  statLabel: { color: '#666', fontSize: 12 },
  editBtn: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 28,
    borderRadius: 6,
  },
  editBtnText: { fontWeight: '700', color: '#222' },
  topActionsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  uploadBtn: {
    backgroundColor: '#43A047',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  uploadBtnText: { color: '#fff', fontWeight: '700' },
  removeBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e6f4ea',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  removeBtnText: { color: '#444' },
  favoritosModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.32)',
    justifyContent: 'center',
    padding: 16,
  },
  favoritosModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    maxHeight: '80%'
  },
  favoritoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f4'
  },
  favoritoImg: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#f7f7f7'
  },
  starCover: {
    width: 92,
    height: 92,
    borderRadius: 16,
    backgroundColor: '#FFD166',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  starCoverEmoji: {
    color: '#fff',
    fontSize: 44,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.08)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 4,
  },
  trevoCover: {
    width: 92,
    height: 92,
    borderRadius: 16,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  trevoCoverImg: {
    width: 56,
    height: 56,
    tintColor: '#fff',
    resizeMode: 'contain',
  },
  /* shared cover base so all cards have the same layout for covers */
  coverBase: {
    width: 92,
    height: 92,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  /* Helping-hand cover for Doações */
  handCover: {
    width: 92,
    height: 92,
    borderRadius: 16,
    backgroundColor: '#43A047',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  handEmoji: {
    fontSize: 44,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.08)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 4,
  },
  doacoesModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.32)',
    justifyContent: 'center',
    padding: 16,
  },
  doacoesModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    maxHeight: '80%'
  },
  doacaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f4'
  },
  doacaoImg: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#f7f7f7'
  },
  // Anotação: Estilos e layout modificados conforme print de referência
});