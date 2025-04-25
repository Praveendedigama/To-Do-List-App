import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://img.icons8.com/color/96/000000/todo-list.png' }}
          style={styles.logo}
        />
        <Text style={styles.title}>Welcome to To-Do List</Text>
        <Text style={styles.subtitle}>Plan your day with a smile 😊</Text>
      </View>
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('Tasks')}
        activeOpacity={0.8}
      >
        <Icon name="arrow-right-circle" size={28} color="#fff" />
        <Text style={styles.buttonText}>Start Organizing</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    color: '#3B3B98',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#778beb',
    marginBottom: 0,
    textAlign: 'center',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B3B98',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 32,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 12,
  },
});