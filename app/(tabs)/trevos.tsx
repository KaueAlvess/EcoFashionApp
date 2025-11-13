import storage from '@/utils/storage';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TrevosScreen() {
  const [trevosDisponiveis, setTrevosDisponiveis] = React.useState<number>(0);
  const [trevosUsados] = React.useState<number>(0);

  // tabela de valores padrão para doações (classe de peça -> trevos)
  const tabelaValores: Record<string, number> = {
    'Camiseta (bom estado)': 5,
    'Moletom (bom estado)': 6,
    'Calça/Jeans (bom estado)': 6,
    'Casaco/Jaqueta (bom estado)': 7,
    'Vestido (bom estado)': 6,
    'Blusa (bom estado)': 5,
    'Camiseta (rasgada / ruim)': 2,
    'Peça pequena (acessório)': 1,
  };

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const t = await storage.getItem('trevos');
        if (!mounted) return;
        setTrevosDisponiveis(t ? parseInt(t, 10) : 0);
      } catch (e) {
        if (!mounted) return;
        setTrevosDisponiveis(0);
      }
    })();

    const cb = (k: string, v: string | null) => {
      if (k === 'trevos') setTrevosDisponiveis(v ? parseInt(v, 10) : 0);
    };
    try { storage.addChangeListener(cb); } catch (e) {}
    return () => { mounted = false; try { storage.removeChangeListener(cb); } catch (e) {} };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Image source={require('../../assets/images/trevo.png')} style={styles.heroIcon} />
        <Text style={styles.heroNumber}>{trevosDisponiveis}</Text>
      </View>

      <Text style={styles.sectionTitle}>Quanto vale cada peça (em trevos)</Text>
      <View style={styles.table}>
        {Object.entries(tabelaValores).map(([label, val]) => (
          <View key={label} style={styles.row}>
            <Text style={styles.rowLabel}>{label}</Text>
            <View style={styles.rowValuePill}>
              <Image source={require('../../assets/images/trevo.png')} style={styles.rowIcon} />
              <Text style={styles.rowValue}>{val}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.refreshBtn} onPress={async () => {
        try { const t = await storage.getItem('trevos'); setTrevosDisponiveis(t ? parseInt(t,10) : 0); } catch (e) {}
      }}>
        <Text style={styles.refreshText}>Atualizar saldo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 24, paddingHorizontal: 16, backgroundColor: '#F5F5F5', alignItems: 'center' },
  hero: { width: '100%', alignItems: 'center', marginBottom: 18, paddingVertical: 24, backgroundColor: '#eaf7ef', borderRadius: 12 },
  heroIcon: { width: 84, height: 84, tintColor: '#2E7D32', marginBottom: 8 },
  heroNumber: { fontSize: 36, fontWeight: '900', color: '#145c2e' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#2E7D32', alignSelf: 'flex-start', marginLeft: 8, marginBottom: 8 },
  table: { width: '100%', backgroundColor: '#fff', borderRadius: 12, padding: 12, elevation: 3 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f7f2' },
  rowLabel: { color: '#2f6b3a', fontWeight: '700' },
  rowValuePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e9fcec', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  rowIcon: { width: 16, height: 16, marginRight: 8, tintColor: '#2E7D32' },
  rowValue: { fontWeight: '800', color: '#145c2e' },
  refreshBtn: { marginTop: 18, backgroundColor: '#2E7D32', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
  refreshText: { color: '#fff', fontWeight: '800' },
});
