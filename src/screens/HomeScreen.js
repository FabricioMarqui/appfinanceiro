// Importa React e hooks
import React, { useEffect, useState } from 'react';

// Componentes básicos do React Native
import { View, Text, Button, TouchableOpacity } from 'react-native';

// AsyncStorage para buscar os dados salvos
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ícones do Expo (usados nos botões)
import { Ionicons } from '@expo/vector-icons';

// Recebe "navigation" para permitir troca de telas
export default function HomeScreen({ navigation }) {

  // Estado para guardar o saldo atual
  const [saldo, setSaldo] = useState(0);

  // Executa ao carregar a tela
  useEffect(() => {
    calcularSaldo(); // Calcula saldo ao abrir

    // Recalcula saldo quando a Home voltar ao foco
    const unsubscribe = navigation.addListener('focus', calcularSaldo);

    // Remove listener quando sair da tela
    return unsubscribe;
  }, []);

  // Função que calcula o saldo atual baseado nas transações salvas
  async function calcularSaldo() {
    // Busca dados salvos no AsyncStorage
    const dados = await AsyncStorage.getItem('transacoes');

    // Se existir, transforma JSON em array; se não, retorna array vazio
    const lista = dados ? JSON.parse(dados) : [];

    // Soma receitas
    const receitas = lista
      .filter(t => t.tipo === 'receita')
      .reduce((soma, t) => soma + t.valor, 0);

    // Soma despesas
    const despesas = lista
      .filter(t => t.tipo === 'despesa')
      .reduce((soma, t) => soma + t.valor, 0);

    // Saldo = Receitas – Despesas
    setSaldo(receitas - despesas);
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>

      {/* Título da aplicação */}
      <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Appfinanceiro</Text>

      {/* Mostra saldo atual em destaque */}
      <Text style={{ fontSize: 22, marginTop: 20 }}>
        Saldo Atual: R$ {saldo.toFixed(2)}
      </Text>

      {/* Menu de navegação com botões estilizados */}
      <View style={{ marginTop: 40, gap: 20 }}>

        {/* Botão para ir às transações */}
        <TouchableOpacity
          style={{ padding: 20, backgroundColor: '#e0e0e0', borderRadius: 10 }}
          onPress={() => navigation.navigate('Transações')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="swap-vertical" size={24} style={{ marginRight: 10 }} />
            <Text style={{ fontSize: 18 }}>Transações</Text>
          </View>
        </TouchableOpacity>

        {/* Botão para a tela de metas */}
        <TouchableOpacity
          style={{ padding: 20, backgroundColor: '#e0e0e0', borderRadius: 10 }}
          onPress={() => navigation.navigate('Metas')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="trophy" size={24} style={{ marginRight: 10 }} />
            <Text style={{ fontSize: 18 }}>Metas</Text>
          </View>
        </TouchableOpacity>

        {/* Botão para a tela de resumo */}
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
