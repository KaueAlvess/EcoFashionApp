import React from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const produtos = [
  {
    nome: 'Camiseta West Coast Choopers',
    descricao: 'Conforto e estilo no mesmo lugar',
    imagem: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSifv2Ge_x22O73douF4mHmVifsEJMz32uUUQ47YnWyEPGuuCV20EK9EVEPQ5rdIY6s-DuVX_ZA5kbGpwP7sF_j5wTOOQqVYMwgqZPRacauZTJRnMZw2yINsA',
  },
  {
    nome: 'Moletom Cropped de Jeans',
    descricao: 'Moletom feminino',
    imagem: 'https://lojabeefancy.com.br/cdn/shop/files/jaqueta-streetwear-611736_1200x.png?v=1724351656',
  },
  {
    nome: 'Calça Denim Preta',
    descricao: 'Calça preta masculina',
    imagem: 'https://img4.dhresource.com/webp/m/0x0/f3/albu/jc/l/19/e8ce0efc-a8b1-471f-9612-4bf617c2cf4b.jpg',
  },
  {
    nome: 'Camiseta feminina cinza',
    descricao: 'Confortavel e basica',
    imagem: 'https://p.globalsources.com/IMAGES/PDT/B5418846505/Y2K-Camisa-top-de-manga-curta.jpg',
  },
  {
    nome: 'Blusa masculina preta',
    descricao: 'Blusa preta masculina',
    imagem: 'https://down-br.img.susercontent.com/file/sg-11134201-22100-3g4v6a7aabjv89',
  },
  {
    nome: 'Camiseta marrom chocolate',
    descricao: 'Camiseta confeccionada em algodão de gola em V e manga comprida.',
    imagem: 'https://static.zara.net/assets/public/dbe6/e35b/dbe641d4b5fa/753b7ba98790/01044628717-e1/01044628717-e1.jpg?ts=1727362866626&w=750',
  },
  {
    nome: 'Camiseta esmeralda',
    descricao: 'Camisa confeccionada em tecido acetinado. Gola com lapela e manga comprida com acabamento em punho com pregas.',
    imagem: 'https://static.zara.net/assets/public/e9d3/e101/d50a454ea287/e07083d79b6d/03645194504-e1/03645194504-e1.jpg?ts=1724757386887&w=850',
  },
  {
    nome: 'Camiseta verde claro',
    descricao: 'Camisa confeccionada em linho e viscose 48%. Gola com lapela e manga abaixo do cotovelo com punho. Fecho frontal com botões.',
    imagem: 'https://static.zara.net/assets/public/9537/108a/03ca496e9eb1/a0237551c131/07138089912-e1/07138089912-e1.jpg?ts=1732885643105&w=750',
  },
  {
    nome: 'Calça de veludo verde',
    descricao: 'Calça de cintura alta e cós elástico. Parte inferior com acabamento em linha evasê.',
    imagem: 'https://static.zara.net/assets/public/6595/04e1/9dee4b1ab836/e54b41a587e9/07705617527-e1/07705617527-e1.jpg?ts=1741863059988&w=750',
  },
  {
    nome: 'Calça verde',
    descricao: 'Calça confeccionada com linho e viscose 45%. Cintura alta com cós elástico. Bolsos laterais.',
    imagem: 'https://static.zara.net/assets/public/11af/573d/b0a34191871c/8623a0223f94/04088912500-e1/04088912500-e1.jpg?ts=1733143227582&w=850',
  },
  {
    nome: 'Moletom Racionais',
    descricao: 'Moletom baseado no Grupo de rap Racionais, ela é feita de algodão.',
    imagem: 'https://i.pinimg.com/736x/43/0c/8c/430c8cb913f9c4940cdfbe370374a524.jpg',
  },
  {
    nome: 'Casaco Bomber em Poliuretano',
    descricao: 'Jaqueta bomber de gola com lapela e manga comprida com punho e botão. Bolsos de debrum na frente. Bainha com elástico. Fecho frontal com zíper metálico.',
    imagem: 'https://static.zara.net/assets/public/a8d5/1357/3ff04fa3b5e1/bfc397028692/04391865717-e1/04391865717-e1.jpg?ts=1730642518057&w=750',
  },
];

export default function ExploreScreen() {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = React.useState<{
    nome: string;
    descricao: string;
    imagem: string;
  } | null>(null);

  const handleTroca = (produto: { nome: string; descricao: string; imagem: string }) => {
    setProdutoSelecionado(produto);
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    setProdutoSelecionado(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Roupas</Text>
      <View style={styles.grid}>
        {produtos.map((produto, idx) => (
          <View key={idx} style={styles.card}>
            <Image source={{ uri: produto.imagem }} style={styles.imagem} />
            <Text style={styles.nome}>{produto.nome}</Text>
            <Text style={styles.descricao}>{produto.descricao}</Text>
            <TouchableOpacity style={styles.trocaBtn} onPress={() => handleTroca(produto)}>
              <Text style={styles.trocaBtnText}>Trocar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Modal de confirmação de troca */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeModal} onPress={fecharModal}>
              <Text style={{ fontSize: 24 }}>&times;</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Confirmar Troca</Text>
            {produtoSelecionado && (
              <>
                <Image source={{ uri: produtoSelecionado.imagem }} style={styles.modalImg} />
                <Text style={styles.nome}>{produtoSelecionado.nome}</Text>
                <Text style={styles.descricao}>{produtoSelecionado.descricao}</Text>
              </>
            )}
            <Text style={{ marginVertical: 12 }}>Deseja confirmar a troca deste produto?</Text>
            <TouchableOpacity style={styles.confirmBtn} onPress={fecharModal}>
              <Text style={styles.confirmBtnText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: 170,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  imagem: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
    textAlign: 'center',
  },
  descricao: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
  },
  trocaBtn: {
    backgroundColor: '#2E7D32',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginTop: 8,
  },
  trocaBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: 320,
    elevation: 4,
    position: 'relative',
  },
  closeModal: {
    position: 'absolute',
    top: 8,
    right: 12,
    zIndex: 2,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalImg: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  confirmBtn: {
    backgroundColor: '#388E3C',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginTop: 12,
  },
  confirmBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});