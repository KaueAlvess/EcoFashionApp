import Toast from '@/components/Toast';
import React from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GerenciarScreen() {
  const [doacoes, setDoacoes] = React.useState<Array<any>>([]);
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState<{ message: string; type?: 'success' | 'error' } | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const resp = await fetch('http://localhost:3001/api/doacoes');
      const data = await resp.json();
      if (resp.ok && data.success) setDoacoes(data.doacoes || []);
      else setDoacoes([]);
    } catch (e) {
      setDoacoes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const handleRemove = async (id: number) => {
    try {
      const resp = await fetch(`http://localhost:3001/api/doacao/${id}`, { method: 'DELETE' });
      const data = await resp.json();
      if (resp.ok && data.success) {
        setToast({ message: 'Removido com sucesso', type: 'success' });
        setDoacoes(prev => prev.filter(d => d.id !== id));
      } else {
        setToast({ message: data.error || 'Erro ao remover', type: 'error' });
      }
    } catch (e) {
      setToast({ message: 'Erro de conexão', type: 'error' });
    }
    setTimeout(() => setToast(null), 1600);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {toast ? <Toast message={toast.message} type={toast.type} /> : null}
      <Text style={styles.title}>Gerenciar Doações (arquivo arquivado)</Text>
      {loading ? <ActivityIndicator size="large" color="#2E7D32" /> : (
        <View style={{ width: '100%', padding: 12 }}>
          {doacoes.length === 0 && <Text>Nenhuma doação encontrada.</Text>}
          {doacoes.map(d => (
            <View key={d.id} style={styles.card}>
              {d.fotoUrl ? <Image source={{ uri: d.fotoUrl }} style={styles.img} /> : null}
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{d.descricao || 'Sem descrição'}</Text>
                <Text style={styles.meta}>Destino: {d.destino} • Estado: {d.estado}</Text>
              </View>
              <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(d.id)}>
                <Text style={styles.removeText}>Remover</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, backgroundColor: '#F5F5F5', minHeight: '100%', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', color: '#2E7D32', marginVertical: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  img: { width: 120, height: 90, borderRadius: 8, marginRight: 12 },
  name: { fontWeight: '700', marginBottom: 4 },
  meta: { color: '#666', fontSize: 12 },
  removeBtn: { backgroundColor: '#B71C1C', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  removeText: { color: '#fff', fontWeight: '700' },
});
