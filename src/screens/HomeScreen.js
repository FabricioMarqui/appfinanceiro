import React, { useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    calcularSaldo();
    const unsubscribe = navigation.addListener('focus', calcularSaldo);
    return unsubscribe;
  }, [])

  async function calcularSaldo() {
    const dados = await AsyncStorage.getItem('transacoes');
    const lista = dados ? JSON.parse(dados) : [];

    const receitas = lista
      .filter(t => t.tipo === 'receita')
      .reduce((soma, t) => soma + t.valor, 0);

    const despesas = lista
      .filter(t => t.tipo === 'despesa')
      .reduce((soma, t) => soma + t.valor, 0);

    setSaldo(receitas - despesas);
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Appfinanceiro</Text>
      <Text style={{ fontSize: 22, marginTop: 20 }}>
        Saldo Atual: R$ {saldo.toFixed(2)}
      </Text>

      <View style={{ marginTop: 40, gap: 20 }}>
        <TouchableOpacity
          style={{ padding: 20, backgroundColor: '#e0e0e0', borderRadius: 10 }}
          onPress={() => navigation.navigate('Transações')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="swap-vertical" size={24} style={{ marginRight: 10 }} />
            <Text style={{ fontSize: 18 }}>Transações</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ padding: 20, backgroundColor: '#e0e0e0', borderRadius: 10 }}
          onPress={() => navigation.navigate('Metas')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="trophy" size={24} style={{ marginRight: 10 }} />
            <Text style={{ fontSize: 18 }}>Metas</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ padding: 20, backgroundColor: '#e0e0e0', borderRadius: 10 }}
          onPress={() => navigation.navigate('Resumo')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="bar-chart" size={24} style={{ marginRight: 10 }} />
            <Text style={{ fontSize: 18 }}>Resumo</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
