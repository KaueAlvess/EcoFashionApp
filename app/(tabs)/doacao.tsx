import React, { useState } from 'react';
import { Button, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import TrevoTroca from '../../components/TrevoTroca';

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#F5F5F5', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#2E7D32', textAlign: 'center' },
  section: { marginBottom: 18, width: '100%', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#388E3C', marginBottom: 8, textAlign: 'center' },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  destinoOption: { alignItems: 'center', marginHorizontal: 8, padding: 8, borderRadius: 12, backgroundColor: '#fff', elevation: 2, borderWidth: 2, borderColor: 'transparent' },
  selectedOption: { borderColor: '#2E7D32', backgroundColor: '#E8F8F8' },
  destinoImg: { width: 48, height: 48, borderRadius: 24, marginBottom: 4 },
  destinoText: { fontSize: 14, color: '#2E7D32', textAlign: 'center' },
  optionBtn: { backgroundColor: '#fff', borderRadius: 12, padding: 8, margin: 4, elevation: 1, borderWidth: 2, borderColor: 'transparent' },
  textArea: { backgroundColor: '#fff', borderRadius: 12, padding: 12, minHeight: 80, width: '100%', marginTop: 8, marginBottom: 8, textAlignVertical: 'top' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', width: 320, elevation: 4, position: 'relative' },
  confirmModalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', width: 320, elevation: 4, position: 'relative' },
  closeModal: { position: 'absolute', top: 8, right: 12, zIndex: 2 },
  confirmImg: { width: 60, height: 60, borderRadius: 30, marginTop: 5, marginBottom: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#2E7D32', marginBottom: 8, textAlign: 'center' },
});

const destinos = [
  { key: 'exercito_salvacao', nome: 'Exército da Salvação', img: require('../../assets/images/bar.png') },
  { key: 'unibes', nome: 'Unibes', img: require('../../assets/images/icon.png') },
  { key: 'darua', nome: 'DaRua', img: require('../../assets/images/camiseta.png') },
  { key: 'bazar', nome: 'Bazar', img: require('../../assets/images/logo.png') },
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

  const selectedDestino = destinos.find(d => d.key === destino);
  const quantidadeTrevos = 5;

  return (
    <View style={{ flex: 1 }}>
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
            {destinos.map((d) => (
              <TouchableOpacity
                key={d.key}
                style={[styles.destinoOption, destino === d.key && styles.selectedOption]}
                onPress={() => setDestino(d.key)}
              >
                <Image source={d.img} style={styles.destinoImg} />
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
                onPress={() => setTempoUso(opt.value)}
              >
                <Text>{opt.label}</Text>
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
                onPress={() => setEstado(opt.value)}
              >
                <Text>{opt.label}</Text>
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
                onPress={() => setTamanho(opt)}
              >
                <Text>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Descrição */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição do produto:</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="Descrição do produto"
            value={descricao}
            onChangeText={setDescricao}
          />
        </View>

        <Button
          title="Realizar Doação"
          onPress={() => setConfirmModalVisible(true)}
          disabled={!destino || !tempoUso || !estado || !tamanho}
        />

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
                  <Image source={selectedDestino.img} style={styles.confirmImg} />
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