import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TrevosScreen() {
  // Exemplo: valores fixos, pode ser dinâmico depois
  const trevosDisponiveis = 5;
  const trevosUsados = 2;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Trevos</Text>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Trevos disponíveis:</Text>
        <Text style={styles.value}>{trevosDisponiveis}</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Trevos usados:</Text>
        <Text style={styles.value}>{trevosUsados}</Text>
      </View>
      {/* Anotação: Página de trevos criada para mostrar saldo e uso */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    width: 220,
    alignItems: 'center',
    elevation: 2,
  },
  label: {
    fontSize: 18,
    color: '#388E3C',
    marginBottom: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#009E60',
  },
});
