import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ConfiguracoesScreen() {
  const router = useRouter();

  return (
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
      </View>
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