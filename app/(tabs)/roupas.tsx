import React from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';

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

export default function RoupasScreen() {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = React.useState<{
    nome: string;
    descricao: string;
    imagem: string;
  } | null>(null);
  const [userTrevos, setUserTrevos] = React.useState<number>(() => {
    try {
      const t = localStorage.getItem('trevos');
      return t ? parseInt(t, 10) : 0;
    } catch (e) {
      return 0;
    }
  });
  const COST_PER_ITEM = 3; // custo padrão por troca (pode ajustar)
  const [selectedCost, setSelectedCost] = React.useState<number | null>(null);

  // fluxo de modais/etapas: 'check' | 'address' | 'loading' | 'success' | 'not_enough' | null
  const [flowStage, setFlowStage] = React.useState<string | null>(null);
  const [address, setAddress] = React.useState({ rua: '', numero: '', cidade: '', cep: '' });
  const [loadingSeconds, setLoadingSeconds] = React.useState<number>(10);

  // Lista de produtos que combina os padrões com produtos adicionados pelo usuário
  const [listaProdutos, setListaProdutos] = React.useState(() => {
    try {
      const custom = JSON.parse(localStorage.getItem('produtos_custom') || '[]');
      // remove itens indesejados (p.ex. entradas de teste como 'dasd', 'KAUE', 'f wsf')
      const unwanted = ['dasd', 'kaue', 'f wsf', 'a chave', 'o virus', 'personagem de branco'];
      const filteredCustom = (custom || []).filter((p: any) => {
        if (!p || !p.nome) return false;
        const n = String(p.nome).trim().toLowerCase();
        return !unwanted.includes(n);
      });
      // persist cleanup if we removed unwanted entries
      try {
        if (Array.isArray(custom) && filteredCustom.length !== custom.length) {
          localStorage.setItem('produtos_custom', JSON.stringify(filteredCustom));
        }
      } catch (e) {}
      return [...filteredCustom, ...produtos];
    } catch (e) {
      return produtos;
    }
  });

  // Escuta mudanças no localStorage para atualizar a lista (quando o usuário adiciona novas roupas)
  React.useEffect(() => {
    const handleStorage = (ev: StorageEvent) => {
      if (ev.key === 'produtos_custom' || ev.key === '__last_produtos_update') {
        try {
          const custom = JSON.parse(localStorage.getItem('produtos_custom') || '[]');
          const unwanted = ['dasd', 'kaue', 'f wsf', 'a chave', 'o virus', 'personagem de branco'];
          const filteredCustom = (custom || []).filter((p: any) => {
            if (!p || !p.nome) return false;
            const n = String(p.nome).trim().toLowerCase();
            return !unwanted.includes(n);
          });
          try {
            // persist cleanup if unwanted entries were present
            const raw = localStorage.getItem('produtos_custom') || '[]';
            const original = JSON.parse(raw || '[]');
            if (Array.isArray(original) && filteredCustom.length !== original.length) {
              localStorage.setItem('produtos_custom', JSON.stringify(filteredCustom));
            }
          } catch (e) {}
          setListaProdutos([...filteredCustom, ...produtos]);
        } catch (e) {
          setListaProdutos(produtos);
        }
      }
    };
    try {
      window.addEventListener('storage', handleStorage as any);
    } catch (e) {}
    return () => {
      try {
        window.removeEventListener('storage', handleStorage as any);
      } catch (e) {}
    };
  }, []);

  // Para facilitar testes locais, garantimos que o usuário possui 10 trevos
  // Isto sobrescreve apenas o valor localStorage no carregamento desta tela.
  React.useEffect(() => {
    try {
      localStorage.setItem('trevos', '10');
    } catch (e) {}
    setUserTrevos(10);
    // dispatch storage event para outras abas/componentes
    try {
      window.dispatchEvent(new StorageEvent('storage', { key: 'trevos', newValue: '10' } as any));
    } catch (e) {}
  }, []);

  // Responsividade: recalcula colunas automaticamente conforme largura da tela
  const { width: windowWidth } = useWindowDimensions();
  let columns = 5;
  if (windowWidth < 360) columns = 1; // very small phones
  else if (windowWidth < 480) columns = 2; // small phones
  else if (windowWidth < 720) columns = 3; // large phones / small tablets
  else if (windowWidth < 1024) columns = 4; // tablets
  else columns = 5; // desktop / wide

  const horizontalPadding = 12 * 2; // container paddingHorizontal * 2
  const gap = 16; // espaço entre cards
  const cardWidth = Math.max(120, Math.floor((windowWidth - horizontalPadding - gap * (columns - 1)) / columns));

  const handleTroca = (produto: { nome: string; descricao: string; imagem: string }) => {
    setProdutoSelecionado(produto);
    // iniciar fluxo de verificação
    // usar saldo local (localStorage) sem chamar backend
    try {
      const t = localStorage.getItem('trevos');
      setUserTrevos(t ? parseInt(t, 10) : 0);
    } catch (e) {
      setUserTrevos(0);
    }
    // definir custo do item (se o produto tiver propriedade 'custo' use-a)
    const custo = (produto as any).custo ?? COST_PER_ITEM;
    setSelectedCost(custo);
    setFlowStage('check');
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    setProdutoSelecionado(null);
    setFlowStage(null);
    setAddress({ rua: '', numero: '', cidade: '', cep: '' });
    setLoadingSeconds(10);
  };

  const handleConfirmCheck = () => {
    const custo = selectedCost ?? COST_PER_ITEM;
    if (userTrevos >= custo) {
      // seguir para cadastro de endereço
      setFlowStage('address');
    } else {
      setFlowStage('not_enough');
    }
  };

  const handleConfirmAddress = () => {
    // validação simples
    if (!address.rua || !address.cidade || !address.cep) {
      alert('Preencha os campos de endereço.');
      return;
    }
    // Simular processamento local sem backend
    const custo = selectedCost ?? COST_PER_ITEM;
    if (userTrevos < custo) {
      setFlowStage('not_enough');
      return;
    }
    setFlowStage('loading');
    setLoadingSeconds(10);
    const interval = setInterval(() => {
      setLoadingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // decrementar trevos localmente e mostrar sucesso
          const novo = Math.max(0, userTrevos - custo);
          setUserTrevos(novo);
          try { localStorage.setItem('trevos', String(novo)); } catch (e) {}
          setFlowStage('success');
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>ROUPAS DISPONIVEIS</Text>
      </View>
      <View style={styles.grid}>
        {listaProdutos.map((produto, idx) => (
          <View key={idx} style={[styles.card, { width: cardWidth }] }>
            <Image source={{ uri: produto.imagem }} style={[
              styles.imagem,
              { width: Math.max(64, Math.round(cardWidth * 0.7)), height: Math.max(64, Math.round(cardWidth * 0.7)) }
            ]} />
            <Text style={styles.nome}>{produto.nome}</Text>
            <Text style={styles.descricao}>{produto.descricao}</Text>
            <TouchableOpacity style={styles.trocaBtn} onPress={() => handleTroca(produto)}>
              <Text style={styles.trocaBtnText}>Trocar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Modal de fluxo de troca (checar trevos -> endereço -> loading -> success / erro) */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeModal} onPress={fecharModal}>
              <Text style={{ fontSize: 24 }}>&times;</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Troca</Text>

            {flowStage === 'check' && (
              <>
                {produtoSelecionado && (
                  <>
                    <Image source={{ uri: produtoSelecionado.imagem }} style={styles.modalImg} />
                    <Text style={styles.nome}>{produtoSelecionado.nome}</Text>
                    <Text style={styles.descricao}>{produtoSelecionado.descricao}</Text>
                  </>
                )}
                <Text style={{ marginTop: 12 }}>Você tem <Text style={{ fontWeight: 'bold' }}>{userTrevos}</Text> trevos.</Text>
                <Text>Esta troca custa <Text style={{ fontWeight: 'bold' }}>{COST_PER_ITEM}</Text> trevos.</Text>
                <View style={{ flexDirection: 'row', marginTop: 16, gap: 12 }}>
                  <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: '#2E7D32' }]} onPress={handleConfirmCheck}>
                    <Text style={styles.confirmBtnText}>Continuar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: '#aaa' }]} onPress={fecharModal}>
                    <Text style={styles.confirmBtnText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {flowStage === 'not_enough' && (
              <>
                <Text style={{ marginVertical: 12 }}>Você não tem trevos suficientes para realizar essa troca.</Text>
                <Text>Você tem <Text style={{ fontWeight: 'bold' }}>{userTrevos}</Text> e precisa de <Text style={{ fontWeight: 'bold' }}>{COST_PER_ITEM}</Text>.</Text>
                <TouchableOpacity style={[styles.confirmBtn, { marginTop: 16 }]} onPress={fecharModal}>
                  <Text style={styles.confirmBtnText}>Fechar</Text>
                </TouchableOpacity>
              </>
            )}

            {flowStage === 'address' && (
              <>
                <Text style={{ marginBottom: 8 }}>Informe o endereço para envio:</Text>
                <TextInput placeholder="Rua" value={address.rua} onChangeText={t => setAddress(a => ({ ...a, rua: t }))} style={styles.input} />
                <TextInput placeholder="Número" value={address.numero} onChangeText={t => setAddress(a => ({ ...a, numero: t }))} style={styles.input} />
                <TextInput placeholder="Cidade" value={address.cidade} onChangeText={t => setAddress(a => ({ ...a, cidade: t }))} style={styles.input} />
                <TextInput placeholder="CEP" value={address.cep} onChangeText={t => setAddress(a => ({ ...a, cep: t }))} style={styles.input} />
                <TouchableOpacity style={[styles.confirmBtn, { marginTop: 8 }]} onPress={handleConfirmAddress}>
                  <Text style={styles.confirmBtnText}>Confirmar Endereço</Text>
                </TouchableOpacity>
              </>
            )}

            {flowStage === 'loading' && (
              <>
                <Text style={{ marginVertical: 12 }}>Enviando solicitação...</Text>
                <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#2E7D32' }}>{loadingSeconds}s</Text>
              </>
            )}

            {flowStage === 'success' && (
              <>
                <Text style={{ marginVertical: 12, fontWeight: 'bold' }}>Troca solicitada com sucesso!</Text>
                <Text>Estamos processando o envio — o produto será encaminhado em breve.</Text>
                <TouchableOpacity style={[styles.confirmBtn, { marginTop: 16 }]} onPress={fecharModal}>
                  <Text style={styles.confirmBtnText}>Fechar</Text>
                </TouchableOpacity>
              </>
            )}

          </View>
        </View>
      </Modal>
      {/* solicitações em análise removidas */}
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
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    overflow: 'hidden',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  card: {
    backgroundColor: '#eaf9ee',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#c6f7d0',
    shadowColor: '#2E7D32',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  imagem: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#f0fff4',
    borderWidth: 1,
    borderColor: '#bff0c4',
  },
  nome: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#145c2e',
    marginBottom: 4,
    textAlign: 'center',
  },
  descricao: {
    fontSize: 12,
    color: '#386c3a',
    textAlign: 'center',
  },
  trocaBtn: {
    backgroundColor: '#2E7D32',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#43ea7a',
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
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  /* requests UI removed per user request */
});
