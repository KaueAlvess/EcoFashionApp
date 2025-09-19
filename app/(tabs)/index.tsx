import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.logoTitle}>EcoFashion</Text>
      </View>

      <View style={styles.introSection}>
        <Text style={styles.introTitle}>Bem-vindo à EcoFashion</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transforme seu estilo e ajude as pessoas que precisam</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/explore')}
        >
          <Text style={styles.buttonText}>Nossos produtos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Doe Roupas e Ganhe Benefícios! 🍀</Text>
        <Text style={styles.sectionText}>
          Transforme suas roupas usadas em descontos para compras em nossa loja. Contribua para um futuro mais verde e estiloso!
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/doacao')}
        >
          <Text style={styles.buttonText}>Faça sua doação</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🤔 Perguntas recorrentes:</Text>
        <View style={styles.faqItem}>
          <Text style={styles.faqTitle}>O que eu ganho doando?</Text>
          <Text style={styles.faqText}>
            Ao optar por doar dentro da loja, você ganha promoções e benefícios, ajudamos a reduzir o impacto ambiental e o desperdício de recursos naturais.
          </Text>
        </View>
        <View style={styles.faqItem}>
          <Text style={styles.faqTitle}>Para onde vai suas doações?</Text>
          <Text style={styles.faqText}>
            Ao doar suas doações vão ser redirecionadas para uma das suas escolhas, sendo ela para a própria instituição ou para algum tipo de organização.
          </Text>
        </View>
        <View style={styles.faqItem}>
          <Text style={styles.faqTitle}>No que isso pode ajudar na sociedade?</Text>
          <Text style={styles.faqText}>
            Suas doações vão para pessoas que realmente precisam, e também ajudam projetos como: Campanha do casaco e outros.
          </Text>
        </View>
      </View>

      <Text style={styles.footer}>&copy; EcoFashion - Moda Sustentável</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 4,
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  introSection: {
    marginBottom: 18,
    alignItems: 'center',
  },
  introTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#388E3C',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  faqItem: {
    marginBottom: 10,
    alignItems: 'flex-start',
    width: '100%',
  },
  faqTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#388E3C',
    marginBottom: 2,
  },
  faqText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 2,
  },
  footer: {
    marginTop: 32,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});