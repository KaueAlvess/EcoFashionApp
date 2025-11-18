import { useRouter } from 'expo-router';
import React from 'react';
import { Animated, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from '../../components/Toast';

export default function ConfiguracoesScreen() {
  const router = useRouter();

  const [quantidadeTrevos, setQuantidadeTrevos] = React.useState(0);
  const logoPulse = React.useRef(new Animated.Value(1)).current;
  const sparkleA = React.useRef(new Animated.Value(0)).current;
  const sparkleB = React.useRef(new Animated.Value(0)).current;
  const sparkleC = React.useRef(new Animated.Value(0)).current;
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  // three card animations (opacity + translateY)
  const cardAnims = React.useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;
  // hover scale animations for web (default 1)
  const hoverAnims = React.useRef([new Animated.Value(1), new Animated.Value(1), new Animated.Value(1)]).current;
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const handleHoverIn = (i: number) => {
    setHoveredIndex(i);
    Animated.timing(hoverAnims[i], { toValue: 1.06, duration: 160, useNativeDriver: true }).start();
  };

  const handleHoverOut = (i: number) => {
    setHoveredIndex((prev) => (prev === i ? null : prev));
    Animated.timing(hoverAnims[i], { toValue: 1, duration: 160, useNativeDriver: true }).start();
  };

  // simple per-card palette (titleColor, subColor, iconBg, chevronColor)
  const cardPalette = [
    { titleColor: '#D97706', subColor: '#8A5B2B', iconBg: '#FFF3D7', chevronColor: '#F59E0B' },
    { titleColor: '#0EA5A1', subColor: '#256D6B', iconBg: '#DFFAF7', chevronColor: '#06B6D4' },
    { titleColor: '#2563EB', subColor: '#274E9A', iconBg: '#EAF4FF', chevronColor: '#3B82F6' },
  ];

  React.useEffect(() => {
    // logo pulse loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoPulse, { toValue: 1.06, duration: 900, useNativeDriver: true }),
        Animated.timing(logoPulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();

    // sparkles loop (staggered)
    Animated.loop(
      Animated.stagger(280, [
        Animated.sequence([Animated.timing(sparkleA, { toValue: 1, duration: 450, useNativeDriver: true }), Animated.timing(sparkleA, { toValue: 0, duration: 450, useNativeDriver: true })]),
        Animated.sequence([Animated.timing(sparkleB, { toValue: 1, duration: 500, useNativeDriver: true }), Animated.timing(sparkleB, { toValue: 0, duration: 500, useNativeDriver: true })]),
        Animated.sequence([Animated.timing(sparkleC, { toValue: 1, duration: 420, useNativeDriver: true }), Animated.timing(sparkleC, { toValue: 0, duration: 420, useNativeDriver: true })]),
      ])
    ).start();

    // entrance for cards (stagger)
    Animated.stagger(120, cardAnims.map((v) => Animated.timing(v, { toValue: 1, duration: 480, useNativeDriver: true }))).start();
  }, []);
  const [toast, setToast] = React.useState<{ message: string; type?: 'success' | 'error' } | null>(null);
  const [feedbackModalVisible, setFeedbackModalVisible] = React.useState(false);
  const [feedbackText, setFeedbackText] = React.useState('');

  React.useEffect(() => {
    // Buscar dados do usuário logado (exemplo simples)
    const email = localStorage.getItem('email'); // Ajuste para mobile se necessário
    if (email) {
      fetch(`http://localhost:3001/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: '' })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.usuario) {
            setQuantidadeTrevos(data.usuario.trevos || 0);
          }
        });
    }
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* animated sparkles and pulsing logo area */}
        <View style={styles.headerDecorWrap} pointerEvents="none">
          <Animated.View style={[styles.sparkle, { left: 28, top: 8, opacity: sparkleA, transform: [{ scale: sparkleA.interpolate({ inputRange: [0,1], outputRange: [0.6,1.2] }) }] }]} />
          <Animated.View style={[styles.sparkle, { left: 120, top: 2, opacity: sparkleB, transform: [{ scale: sparkleB.interpolate({ inputRange: [0,1], outputRange: [0.6,1.2] }) }], width: 10, height: 10 }]} />
          <Animated.View style={[styles.sparkle, { left: 62, top: 44, opacity: sparkleC, transform: [{ scale: sparkleC.interpolate({ inputRange: [0,1], outputRange: [0.6,1.2] }) }], backgroundColor: '#fffef0' }]} />
        </View>
        <Animated.View style={[styles.header, { transform: [{ scale: logoPulse }] }]}> 
          <View style={styles.header}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Configurações</Text>
          </View>
        </Animated.View>

        <View style={styles.options}>
          <AnimatedTouchable
            onMouseEnter={() => handleHoverIn(0)}
            onMouseLeave={() => handleHoverOut(0)}
            style={[
              styles.optionButton,
              {
                opacity: cardAnims[0],
                transform: [
                  { translateY: cardAnims[0].interpolate({ inputRange: [0,1], outputRange: [18,0] }) },
                  { scale: hoverAnims[0] },
                ],
                backgroundColor: hoveredIndex === 0 ? '#fbfff9' : undefined,
              },
            ]}
            onPress={() => router.push('/configuracoes/perfil')}
            activeOpacity={0.85}
          >
            <View style={[styles.optionIconWrap, { backgroundColor: cardPalette[0].iconBg }]}>
              <Image source={require('../../assets/images/mobile.png')} style={styles.optionIcon} />
            </View>
            <View style={styles.optionTextWrap}>
              <Text style={[styles.optionText, { color: cardPalette[0].titleColor }]}>Perfil</Text>
              <Text style={[styles.optionSub, { color: cardPalette[0].subColor }]}>Editar seu perfil e preferências</Text>
            </View>
            <Text style={[styles.optionChevron, { color: cardPalette[0].chevronColor }]}>›</Text>
          </AnimatedTouchable>

          <AnimatedTouchable
            onMouseEnter={() => handleHoverIn(1)}
            onMouseLeave={() => handleHoverOut(1)}
            style={[
              styles.optionButton,
              {
                opacity: cardAnims[1],
                transform: [
                  { translateY: cardAnims[1].interpolate({ inputRange: [0,1], outputRange: [18,0] }) },
                  { scale: hoverAnims[1] },
                ],
                backgroundColor: hoveredIndex === 1 ? '#f4fffb' : undefined,
              },
            ]}
            onPress={() => router.push('/configuracoes/sobrenos')}
            activeOpacity={0.85}
          >
            <View style={[styles.optionIconWrap, { backgroundColor: cardPalette[1].iconBg }]}>
              <Image source={require('../../assets/images/bar.png')} style={styles.optionIcon} />
            </View>
            <View style={styles.optionTextWrap}>
              <Text style={[styles.optionText, { color: cardPalette[1].titleColor }]}>Sobre Nós</Text>
              <Text style={[styles.optionSub, { color: cardPalette[1].subColor }]}>Nossa história e missão</Text>
            </View>
            <Text style={[styles.optionChevron, { color: cardPalette[1].chevronColor }]}>›</Text>
          </AnimatedTouchable>

          <AnimatedTouchable
            onMouseEnter={() => handleHoverIn(2)}
            onMouseLeave={() => handleHoverOut(2)}
            style={[
              styles.optionButton,
              {
                opacity: cardAnims[2],
                transform: [
                  { translateY: cardAnims[2].interpolate({ inputRange: [0,1], outputRange: [18,0] }) },
                  { scale: hoverAnims[2] },
                ],
                backgroundColor: hoveredIndex === 2 ? '#f4fbff' : undefined,
              },
            ]}
            onPress={() => setFeedbackModalVisible(true)}
            activeOpacity={0.85}
          >
            <View style={[styles.optionIconWrap, { backgroundColor: cardPalette[2].iconBg }]}>
              <Image source={require('../../assets/images/sobre-nos.png')} style={styles.optionIcon} />
            </View>
            <View style={styles.optionTextWrap}>
              <Text style={[styles.optionText, { color: cardPalette[2].titleColor }]}>Feedbacks</Text>
              <Text style={[styles.optionSub, { color: cardPalette[2].subColor }]}>Envie sugestões ou reporte problemas</Text>
            </View>
            <Text style={[styles.optionChevron, { color: cardPalette[2].chevronColor }]}>›</Text>
          </AnimatedTouchable>
        </View>
      </View>

      <Modal visible={feedbackModalVisible} transparent animationType="fade">
        <View style={modalStyles.overlay}>
          <View style={modalStyles.card}>
            <Text style={modalStyles.title}>Enviar Feedback</Text>
            <TextInput
              value={feedbackText}
              onChangeText={setFeedbackText}
              placeholder="Conte-nos sua sugestão ou problema..."
              placeholderTextColor="#777"
              multiline
              style={modalStyles.input}
            />
            <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
              <TouchableOpacity style={modalStyles.btn} onPress={() => setFeedbackModalVisible(false)}>
                <Text style={modalStyles.btnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[modalStyles.btn, modalStyles.btnPrimary]} onPress={() => {
                const v = String(feedbackText || '').trim();
                if (!v) { setToast({ message: 'Escreva uma mensagem antes de enviar.', type: 'error' }); setTimeout(() => setToast(null), 1400); return; }
                try {
                  const raw = localStorage.getItem('feedbacks') || '[]';
                  const arr = JSON.parse(raw || '[]');
                  const novo = { id: Date.now(), message: v, createdAt: new Date().toISOString() };
                  arr.unshift(novo);
                  localStorage.setItem('feedbacks', JSON.stringify(arr));
                  setToast({ message: 'Feedback enviado. Obrigado!', type: 'success' });
                  setTimeout(() => setToast(null), 1600);
                  setFeedbackModalVisible(false);
                  setFeedbackText('');
                } catch (e) {
                  setToast({ message: 'Erro ao enviar feedback.', type: 'error' });
                  setTimeout(() => setToast(null), 1600);
                }
              }}>
                <Text style={[modalStyles.btnText, { color: '#fff' }]}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {toast ? <Toast message={toast.message} type={toast.type} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F8F8',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerDecorWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 8,
    height: 96,
    zIndex: 0,
  },
  sparkle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    opacity: 0.9,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2EC4B6',
    marginBottom: 8,
  },
  options: {
    width: '100%',
    alignItems: 'center',
    gap: 24,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    width: '80%',
    elevation: 2,
  },
  optionIcon: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  optionIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  optionTextWrap: {
    flex: 1,
  },
  optionSub: {
    fontSize: 13,
    color: '#6b9b94',
    marginTop: 4,
  },
  optionChevron: {
    fontSize: 28,
    color: '#c8e7e3',
    marginLeft: 8,
  },
  optionText: {
    fontSize: 18,
    color: '#2EC4B6',
    fontWeight: 'bold',
  },
});

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.32)', justifyContent: 'center', alignItems: 'center' },
  card: { width: '92%', maxWidth: 640, backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  title: { fontSize: 18, fontWeight: '800', color: '#2E7D32', marginBottom: 8, textAlign: 'center' },
  input: { minHeight: 120, borderWidth: 1, borderColor: '#e6efe6', borderRadius: 8, padding: 12, textAlignVertical: 'top', marginBottom: 12, color: '#333' },
  btn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, backgroundColor: '#f0f0f0' },
  btnPrimary: { backgroundColor: '#2E7D32' },
  btnText: { color: '#333', fontWeight: '700' },
});