import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from '../../components/Toast';
import TrevoTroca from '../../components/TrevoTroca';

export default function ConfiguracoesScreen() {
  const router = useRouter();

  const [quantidadeTrevos, setQuantidadeTrevos] = React.useState(0);
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
      <TrevoTroca quantidade={quantidadeTrevos} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Configurações</Text>
        </View>

        <View style={styles.options}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => router.push('/configuracoes/perfil')}
          >
            <Image source={require('../../assets/images/mobile.png')} style={styles.optionIcon} />
            <Text style={styles.optionText}>Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => router.push('/configuracoes/sobrenos')}
          >
            <Image source={require('../../assets/images/bar.png')} style={styles.optionIcon} />
            <Text style={styles.optionText}>Sobre Nós</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setFeedbackModalVisible(true)}
          >
            <Image source={require('../../assets/images/sobre-nos.png')} style={styles.optionIcon} />
            <Text style={styles.optionText}>Feedbacks</Text>
          </TouchableOpacity>
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