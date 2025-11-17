import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import dayjs from "dayjs";

import { getTransacoes } from "../storage/storageService";

export default function SummaryScreen() {
  const [lista, setLista] = useState([]);
  const [mesSelecionado, setMesSelecionado] = useState("todos");

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const dados = await getTransacoes();
    setLista(dados);
  }

  // Lista de meses disponíveis
  const mesesDisponiveis = Array.from(
    new Set(lista.map(t => dayjs(t.data).format("MMMM YYYY")))
  );

  // FILTRAR por mês
  const listaFiltrada =
    mesSelecionado === "todos"
      ? lista
      : lista.filter(t => dayjs(t.data).format("MMMM YYYY") === mesSelecionado);

  // SOMATÓRIO
  const totalReceitas = listaFiltrada
    .filter(t => t.tipo === "receita")
    .reduce((acc, t) => acc + t.valor, 0);

  const totalDespesas = listaFiltrada
    .filter(t => t.tipo === "despesa")
    .reduce((acc, t) => acc + t.valor, 0);

  const saldo = totalReceitas - totalDespesas;

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: 'white' }}>

      <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Resumo Geral</Text>

      {/* PICKER MENSAL */}
      <Text style={{ fontSize: 18, marginTop: 15 }}>Filtrar por mês</Text>

      <Picker
        selectedValue={mesSelecionado}
        onValueChange={setMesSelecionado}
        style={{
          backgroundColor: "#f0f0f0",
          marginTop: 10,
          borderRadius: 10
        }}
      >
        <Picker.Item label="Todos os meses" value="todos" />

        {mesesDisponiveis.map(mes => (
          <Picker.Item key={mes} label={mes} value={mes} />
        ))}
      </Picker>

      {/* Receitas */}
      <View style={{
        marginTop: 20,
        padding: 25,
        borderRadius: 15,
        backgroundColor: '#E8FFE8'
      }}>
        <Text style={{ fontSize: 18, color: 'green' }}>Total de Receitas</Text>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'green' }}>
          R$ {totalReceitas.toFixed(2)}
        </Text>
      </View>

      {/* Despesas */}
      <View style={{
        marginTop: 20,
        padding: 25,
        borderRadius: 15,
        backgroundBackgroundColor: '#FFE8E8',
        backgroundColor: '#FFE8E8'
      }}>
        <Text style={{ fontSize: 18, color: 'red' }}>Total de Despesas</Text>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'red' }}>
          R$ {totalDespesas.toFixed(2)}
        </Text>
      </View>

      {/* Saldo */}
      <View style={{
        marginTop: 20,
        padding: 25,
        borderRadius: 15,
        backgroundColor: '#E8E8FF'
      }}>
        <Text style={{ fontSize: 18, color: saldo >= 0 ? 'green' : 'red' }}>
          Saldo Atual
        </Text>

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
