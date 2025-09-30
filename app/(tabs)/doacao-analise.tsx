import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function DoacaoAnaliseScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doação em análise</Text>
      <Text style={styles.text}>Sua doação está sendo analisada pela equipe EcoFashion. Em breve você receberá uma resposta!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    color: '#444',
    textAlign: 'center',
  },
});
