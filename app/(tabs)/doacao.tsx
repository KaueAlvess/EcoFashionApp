import React, { useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  destinoText: { fontSize: 16, color: '#145c2e', textAlign: 'center', fontWeight: 'bold' },
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
});

const destinos = [
  { key: 'exercito_salvacao', nome: 'Exército da Salvação', img: require('../../assets/images/ExercitoSalvaçao.png') },
  { key: 'unibes', nome: 'Unibes', img: require('../../assets/images/Unibes.png') },
  { key: 'darua', nome: 'DaRua', img: require('../../assets/images/DaRua.png') },
  { key: 'bazar', nome: 'Bazar', img: require('../../assets/images/Bazar.png') },
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
  const [destino, setDestino] = useState('');
  const [tempoUso, setTempoUso] = useState('');
  const [estado, setEstado] = useState('');
  const [tamanho, setTamanho] = useState('');
  const [descricao, setDescricao] = useState('');
  const [fotoRoupa, setFotoRoupa] = useState<File | null>(null);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);
  const router = require('expo-router').useRouter();

  const selectedDestino = destinos.find(d => d.key === destino);
  const [quantidadeTrevos, setQuantidadeTrevos] = React.useState(0);

  React.useEffect(() => {
    const email = localStorage.getItem('email'); // Ajuste para mobile se necessário
    if (email) {
      fetch(`http://localhost:3001/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: '' }) // senha vazia só para buscar, ajuste conforme sua lógica
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.usuario) {
            setQuantidadeTrevos(data.usuario.trevos || 0);
          }
        });
    }
  }, []);

  // Função para selecionar foto
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

  // Função para realizar doação
  const realizarDoacao = async () => {
    try {
      const idUsuario = localStorage.getItem('idUsuario');
      if (!idUsuario) {
        setToast({ message: 'Usuário não identificado. Faça login novamente.', type: 'error' });
        setTimeout(() => setToast(null), 2000);
        return;
      }
      const formData = new FormData();
      formData.append('usuario_id', idUsuario);
      formData.append('descricao', descricao);
      formData.append('destino', destino);
      formData.append('tempo_uso', tempoUso);
      formData.append('estado', estado);
      formData.append('tamanho', tamanho);
      if (fotoRoupa) {
        formData.append('foto', fotoRoupa);
      }
      const response = await fetch('http://localhost:3001/api/doacao', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        setToast({ message: 'Doação enviada para análise!', type: 'success' });
        setTimeout(() => {
          setToast(null);
          router.push('/doacao-analise');
        }, 1200);
      } else {
        setToast({ message: data.error || 'Erro ao enviar doação', type: 'error' });
        setTimeout(() => setToast(null), 2000);
      }
    } catch (error) {
      setToast({ message: 'Erro de conexão com o servidor.', type: 'error' });
      setTimeout(() => setToast(null), 2000);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      {toast ? <Toast message={toast.message} type={toast.type} /> : null}
      {/* Header e botão de trevos personalizado */}
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
          onPress={() => window.location.href = '/trevos'}
        >
          {/* Ícone de lista (substituído por imagem 'trevo.png') */}
          <View style={{ marginRight: 18 }}>
            <Image source={require('../../assets/images/trevo.png')} style={{ width: 44, height: 44 }} resizeMode="contain" />
          </View>
          {/* Número de trevos */}
          <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#fff', marginLeft: 6, textShadowColor: '#2E7D32', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 }}>{quantidadeTrevos}</Text>
        </TouchableOpacity>
      </View>
      {/* Espaço entre botão e conteúdo */}
      <View style={{ height: 18 }} />
      <TrevoTroca quantidade={quantidadeTrevos} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Modal Inicial */}
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeModal} onPress={() => setModalVisible(false)}>
                <Text style={{ fontSize: 24 }}>&times;</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Dados da Doação</Text>
              <Text>Preencha os dados abaixo para realizar sua doação:</Text>
            </View>
          </View>
        </Modal>

        <Text style={styles.title}>Preencha os dados abaixo para realizar sua doação:</Text>
        {/* Escolha do Local de Doação */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecione o destino da sua doação:</Text>
          <View style={styles.optionsRow}>
            {destinos.map((d, idx) => (
              <TouchableOpacity
                key={d.key}
                style={[styles.destinoOption, destino === d.key && styles.selectedOption]}
                activeOpacity={0.7}
                onPress={() => setDestino(d.key)}
              >
                <View style={styles.destinoImgWrap}>
                  <Image source={d.img} style={styles.destinoImg} resizeMode="contain" />
                </View>
                <Text style={styles.destinoText}>{d.nome}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tempo de uso */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tempo de uso:</Text>
          <View style={styles.optionsRow}>
            {tempoUsoOptions.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.optionBtn, tempoUso === opt.value && styles.selectedOption]}
                activeOpacity={0.7}
                onPress={() => setTempoUso(opt.value)}
              >
                <Text style={{ color: '#145c2e', fontWeight: tempoUso === opt.value ? 'bold' : 'normal' }}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Estado */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estado da peça:</Text>
          <View style={styles.optionsRow}>
            {estadoOptions.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.optionBtn, estado === opt.value && styles.selectedOption]}
                activeOpacity={0.7}
                onPress={() => setEstado(opt.value)}
              >
                <Text style={{ color: '#145c2e', fontWeight: estado === opt.value ? 'bold' : 'normal' }}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tamanho */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tamanho da peça:</Text>
          <View style={styles.optionsRow}>
            {tamanhoOptions.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[styles.optionBtn, tamanho === opt && styles.selectedOption]}
                activeOpacity={0.7}
                onPress={() => setTamanho(opt)}
              >
                <Text style={{ color: '#145c2e', fontWeight: tamanho === opt ? 'bold' : 'normal' }}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Foto da roupa (web) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Foto da roupa:</Text>
          <input
            type="file"
            accept="image/*"
            onChange={e => setFotoRoupa(e.target.files?.[0] || null)}
            style={{ marginBottom: 8 }}
          />
          {fotoRoupa && (
            <img
              src={URL.createObjectURL(fotoRoupa)}
              alt="Foto da roupa"
              style={{ width: 120, height: 120, borderRadius: 12, marginBottom: 8, objectFit: 'cover' }}
            />
          )}
        </View>
        {/* Descrição */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição do produto:</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="Descrição do produto"
            placeholderTextColor="#43ea7a"
            value={descricao}
            onChangeText={setDescricao}
          />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: !destino || !tempoUso || !estado || !tamanho || !fotoRoupa ? '#b7e7c3' : 'linear-gradient(90deg, #43ea7a 0%, #2E7D32 100%)',
            borderRadius: 18,
            paddingVertical: 16,
            paddingHorizontal: 32,
            alignItems: 'center',
            marginTop: 12,
            elevation: 3,
            shadowColor: '#2E7D32',
            shadowOpacity: 0.12,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            opacity: !destino || !tempoUso || !estado || !tamanho || !fotoRoupa ? 0.6 : 1,
          }}
          activeOpacity={0.7}
          onPress={realizarDoacao}
          disabled={!destino || !tempoUso || !estado || !tamanho || !fotoRoupa}
        >
          <Text style={{
            color: !destino || !tempoUso || !estado || !tamanho || !fotoRoupa ? '#145c2e' : '#fff',
            fontWeight: 'bold',
            fontSize: 18,
            letterSpacing: 1,
            textShadowColor: '#2E7D32',
            textShadowOffset: {width: 1, height: 1},
            textShadowRadius: 2,
          }}>
            REALIZAR DOAÇÃO
          </Text>
        </TouchableOpacity>

        {/* Modal de Confirmação */}
        <Modal visible={confirmModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.confirmModalContent}>
              <TouchableOpacity style={styles.closeModal} onPress={() => setConfirmModalVisible(false)}>
                <Text style={{ fontSize: 24 }}>&times;</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Doação Concluída!</Text>
              <View style={{ alignItems: 'center', marginBottom: 15 }}>
                <Text style={{ fontWeight: 'bold' }}>Local de Doação:</Text>
                {selectedDestino && (
                  <Image source={selectedDestino.img} style={styles.confirmImg} resizeMode="contain" />
                )}
                <Text>{selectedDestino ? selectedDestino.nome : 'Não informado'}</Text>
              </View>
              <Text><Text style={{ fontWeight: 'bold' }}>Tempo de uso:</Text> {tempoUsoOptions.find(o => o.value === tempoUso)?.label || 'Não informado'}</Text>
              <Text><Text style={{ fontWeight: 'bold' }}>Estado da peça:</Text> {estadoOptions.find(o => o.value === estado)?.label || 'Não informado'}</Text>
              <Text><Text style={{ fontWeight: 'bold' }}>Tamanho:</Text> {tamanho || 'Não informado'}</Text>
              <Text><Text style={{ fontWeight: 'bold' }}>Descrição:</Text> {descricao || 'Nenhuma descrição fornecida'}</Text>
              <Text><Text style={{ fontWeight: 'bold' }}>Destino:</Text> {selectedDestino ? selectedDestino.nome : 'Não informado'}</Text>
            </View>
          </View>
        </Modal>

        {/* Como funciona */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Como Funciona:</Text>
          <Text>Saiba como sua doação ajuda as pessoas!</Text>
          <Text>Escolha os dados da peça que deseja doar.</Text>
          <Text>Preencha todas as informações corretamente.</Text>
          <Text>Finalize sua doação e ajude!</Text>
        </View>
      </ScrollView>
    </View>
  );
}