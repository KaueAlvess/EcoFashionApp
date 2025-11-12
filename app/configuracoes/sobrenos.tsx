import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Image, ImageBackground, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TrevoTroca from '../../components/TrevoTroca';

export default function SobreNosScreen() {
  const handleDownloadApp = () => {
    Alert.alert('Essa função ainda está em desenvolvimento.', 'Em breve estará disponível!');
  };

  const quantidadeTrevos = 5;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const downloadScale = useRef(new Animated.Value(1)).current;
  const card1Scale = useRef(new Animated.Value(1)).current;
  const card2Scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    logoAnim.setValue(0);
    Animated.spring(logoAnim, { toValue: 1, friction: 8, useNativeDriver: true }).start();
  }, []);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [infoModalData, setInfoModalData] = useState<{title:string, body:string}>({ title: '', body: '' });

  const infoCards = [
    { id: 'missao', title: 'Nossa Missão', subtitle: 'Moda circular e comunidades', body: 'Nossa missão é reduzir desperdício, incentivar o reuso e fortalecer redes locais por meio da moda.' },
    { id: 'doar', title: 'Como Doar', subtitle: 'Rápido e fácil', body: 'Vá em Doar, preencha os campos e envie boas fotos. A equipe avalia e você recebe notificação quando aprovado.' },
    { id: 'trocar', title: 'Como Trocar', subtitle: 'Use seus trevos', body: 'Troque trevos por peças aprovadas na loja. Ganhe trevos ao doar e ajudar a comunidade.' },
  ];
  return (
    <View style={{ flex: 1 }}>
      <TrevoTroca quantidade={quantidadeTrevos} />
      <ScrollView contentContainerStyle={styles.container}>
        <ImageBackground source={require('../../assets/images/sobre-nos.png')} style={styles.heroBg} imageStyle={{ opacity: 0.08 }}>
          <Animated.View style={[styles.hero, { opacity: logoAnim, transform: [{ translateY: logoAnim.interpolate({ inputRange: [0,1], outputRange: [8,0] }) }] }]}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Sobre Nós</Text>
            <Text style={styles.lead}>Moda circular, impacto local.</Text>
          </Animated.View>
        </ImageBackground>

        <View style={styles.section}>
          <View style={styles.contentCard}>
            <View style={styles.accent} />
            <View style={styles.contentBody}>
              <Text style={styles.sectionTitle}>EcoFashion</Text>
              <Text style={styles.paragraphCard}>
                Somos uma comunidade que promove doação e recompensa — aqui doadores e receptores se conectam para reduzir desperdício.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.contentCard}>
            <View style={styles.accent} />
            <View style={styles.contentBody}>
              <Text style={styles.sectionTitle}>Como doar no nosso app?</Text>
              <Text style={styles.paragraphCard}>
                Acesse a aba Doar, preencha os campos com informações e fotos do item. Nosso time revisará e te avisará quando aprovado.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.contentCard}>
            <View style={styles.accent} />
            <View style={styles.contentBody}>
              <Text style={styles.sectionTitle}>Como adquirir nossos produtos?</Text>
              <Text style={styles.paragraphCard}>
                Use seus trevos para resgatar peças aprovadas ou participe das trocas — o app guia cada etapa do processo.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O que fazemos</Text>
          <Text style={styles.paragraph}>Promovemos doação, troca e reuso com impacto social. Clique em um card para saber mais.</Text>

          <View style={styles.cardContainer}>
            {infoCards.map((c, i) => (
              <Animated.View key={c.id} style={[styles.infoCard, { transform: [{ scale: i === 0 ? card1Scale : card2Scale }] }]}>
                <TouchableOpacity
                  activeOpacity={0.95}
                  onPress={() => { setInfoModalData({ title: c.title, body: c.body }); setInfoModalVisible(true); }}
                  onPressIn={() => Animated.spring(i === 0 ? card1Scale : card2Scale, { toValue: 0.98, useNativeDriver: true }).start()}
                  onPressOut={() => Animated.spring(i === 0 ? card1Scale : card2Scale, { toValue: 1, friction: 6, useNativeDriver: true }).start()}
                >
                  <View style={styles.infoIconWrap}>
                    <Image
                      source={i === 0 ? require('../../assets/images/Bazar.png') : i === 1 ? require('../../assets/images/camiseta.png') : require('../../assets/images/trevo.png')}
                      style={styles.infoIconImg}
                    />
                  </View>
                  <Text style={styles.infoTitle}>{c.title}</Text>
                  <Text style={styles.infoSub}>{c.subtitle}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>
        {/* Feedbacks moved to the main Configurações screen */}
        {/* download removed per request; interactive info modal below */}
        <Modal visible={infoModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{infoModalData.title}</Text>
              <ScrollView style={{ maxHeight: 240 }}>
                <Text style={styles.modalBody}>{infoModalData.body}</Text>
              </ScrollView>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setInfoModalVisible(false)}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Text style={styles.footer}>&copy; EcoFashion - Moda Sustentável</Text>
      </ScrollView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    width: '100%'
  },
  lead: {
    fontSize: 16,
    color: '#388E3C',
    marginBottom: 12,
    textAlign: 'center',
    maxWidth: 560,
    paddingHorizontal: 8,
  },
  heroBg: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 18,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2E7D32',
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    color: '#444',
    marginBottom: 12,
    textAlign: 'center',
  },
  section: {
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#388E3C',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: 180,
    marginBottom: 12,
    elevation: 2,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
  },
  downloadSection: {
    marginTop: 24,
    alignItems: 'center',
    width: '100%',
  },
  downloadButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginTop: 8,
    marginBottom: 8,
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  downloadImage: {
    width: 120,
    height: 120,
    marginTop: 8,
    borderRadius: 16,
  },
  /* content card styles for section texts */
  contentCard: {
    width: '100%',
    backgroundColor: '#FAFFFB',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  accent: {
    width: 6,
    height: '100%',
    backgroundColor: '#A5D6A7',
    borderRadius: 4,
    marginRight: 12,
  },
  contentBody: {
    flex: 1,
  },
  paragraphCard: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
    marginTop: 6,
  },
  /* info cards */
  infoCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    margin: 8,
    elevation: 3,
  },
  infoIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  infoIcon: { fontSize: 28 },
  infoIconImg: { width: 40, height: 40, resizeMode: 'contain' },
  infoTitle: { fontSize: 16, fontWeight: '700', color: '#2E7D32', textAlign: 'center' },
  infoSub: { fontSize: 13, color: '#666', textAlign: 'center', marginTop: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.32)', justifyContent: 'center', padding: 16 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 16, maxHeight: '80%' },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  modalBody: { fontSize: 15, color: '#444' },
  closeBtn: { marginTop: 12, backgroundColor: '#2E7D32', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  footer: {
    marginTop: 32,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  
});