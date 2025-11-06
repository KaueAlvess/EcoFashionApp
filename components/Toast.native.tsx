import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Toast({ message, type }: { message: string; type?: 'success' | 'error' }) {
  if (!message) return null;
  return (
    <View style={[styles.container, type === 'error' ? styles.error : styles.success]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    paddingHorizontal: 16,
  },
  success: {
    backgroundColor: '#43ea7a',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  error: {
    backgroundColor: '#ff5252',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
