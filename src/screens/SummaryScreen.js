// Importa React e os hooks useState/useEffect
import React, { useEffect, useState } from 'react';

// Componentes visuais do React Native
import { View, Text, ScrollView } from 'react-native';

// Picker para selecionar o mês
import { Picker } from '@react-native-picker/picker';

// Biblioteca para formatar datas
import dayjs from "dayjs";

// Função que busca todas as transações do AsyncStorage
import { getTransacoes } from "../storage/storageService";

export default function SummaryScreen() {

  // Lista completa de transações carregada do AsyncStorage
  const [lista, setLista] = useState([]);

  // Mês selecionado no filtro (“todos” mostra tudo)
  const [mesSelecionado, setMesSelecionado] = useState("todos");

  // Executa apenas ao abrir a tela
  useEffect(() => {
    carregar();
  }, []);

  // Função que carrega as transações salvas no dispositivo
  async function carregar() {
    const dados = await getTransacoes();
    setLista(dados);
  }

  // Gera um array com todos os meses existentes nas transações
  // Ex.: ["Janeiro 2025", "Fevereiro 2025", ...]
  const mesesDisponiveis = Array.from(
    new Set(lista.map(t => dayjs(t.data).format("MMMM YYYY")))
  );

  // Filtra a lista de acordo com o mês selecionado no Picker
  const listaFiltrada =
    mesSelecionado === "todos"
      ? lista
      : lista.filter(t => dayjs(t.data).format("MMMM YYYY") === mesSelecionado);

  // Calcula total de receitas do mês filtrado
  const totalReceitas = listaFiltrada
    .filter(t => t.tipo === "receita")
    .reduce((acc, t) => acc + t.valor, 0);

  // Calcula total de despesas do mês filtrado
  const totalDespesas = listaFiltrada
    .filter(t => t.tipo === "despesa")
    .reduce((acc, t) => acc + t.valor, 0);

  // Calcula o saldo geral (receitas – despesas)
  const saldo = totalReceitas - totalDespesas;

  return (
    // ScrollView permite rolagem e padding deixa margem interna bonita
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: 'white' }}>

      {/* Título da página */}
      <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Resumo Geral</Text>

      {/* Filtro mensal com Picker */}
      <Text style={{ fontSize: 18, marginTop: 15 }}>Filtrar por mês</Text>

      <Picker
        selectedValue={mesSelecionado}
        onValueChange={setMesSelecionado} // altera estado quando o usuário troca o mês
        style={{
          backgroundColor: "#f0f0f0",
          marginTop: 10,
          borderRadius: 10
        }}
      >
        {/* Opção inicial para mostrar tudo */}
        <Picker.Item label="Todos os meses" value="todos" />

        {/* Lista dinamicamente os meses encontrados nas transações */}
        {mesesDisponiveis.map(mes => (
          <Picker.Item key={mes} label={mes} value={mes} />
        ))}
      </Picker>

      {/* CARD - Total de Receitas */}
      <View style={{
        marginTop: 20,
        padding: 25,
        borderRadius: 15,
        backgroundColor: '#E8FFE8' // verde claro
      }}>
        <Text style={{ fontSize: 18, color: 'green' }}>Total de Receitas</Text>

        {/* Exibe o valor formatado */}
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'green' }}>
          R$ {totalReceitas.toFixed(2)}
        </Text>
      </View>

      {/* CARD - Total de Despesas */}
      <View style={{
        marginTop: 20,
        padding: 25,
        borderRadius: 15,
        backgroundColor: '#FFE8E8' // vermelho claro
      }}>
        <Text style={{ fontSize: 18, color: 'red' }}>Total de Despesas</Text>

        <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'red' }}>
          R$ {totalDespesas.toFixed(2)}
        </Text>
      </View>

      {/* CARD - Saldo Mensal */}
      <View style={{
        marginTop: 20,
        padding: 25,
        borderRadius: 15,
        backgroundColor: '#E8E8FF' // azul claro
      }}>
        <Text style={{ fontSize: 18, color: saldo >= 0 ? 'green' : 'red' }}>
          Saldo Atual
        </Text>

        {/* Saldo recebe cor positiva quando >= 0 */}
        <Text style={{
          fontSize: 32,
          fontWeight: 'bold',
          color: saldo >= 0 ? 'green' : 'red'
        }}>
          R$ {saldo.toFixed(2)}
        </Text>
      </View>

    </ScrollView>
  );
}
