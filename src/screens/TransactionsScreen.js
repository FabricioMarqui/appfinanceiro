import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Modal
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import dayjs from 'dayjs';
import CustomButton from '../components/CustomButton';
import { getTransacoes, saveTransacoes } from '../storage/storageService';

export default function TransactionsScreen() {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('receita');
  const [lista, setLista] = useState([]);

  // FILTRO SOMENTE MENSAL
  const [mesSelecionado, setMesSelecionado] = useState("todos");

  // MODAL
  const [modalEditar, setModalEditar] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const dados = await getTransacoes();
    setLista(dados);
  }

  async function adicionarTransacao() {
    if (!descricao || !valor) return alert("Preencha tudo!");

    const valorConvertido = Number(valor.replace(",", "."));

    const nova = {
      id: Date.now().toString(),
      descricao,
      valor: valorConvertido,
      tipo,
      data: new Date().toISOString()
    };

    const novaLista = [nova, ...lista];
    await saveTransacoes(novaLista);
    setLista(novaLista);

    setDescricao('');
    setValor('');
  }

  async function excluirTransacao(id) {
    const novaLista = lista.filter(item => item.id !== id);
    await saveTransacoes(novaLista);
    setLista(novaLista);
  }

  function abrirEdicao(item) {
    setEditItem(item);
    setDescricao(item.descricao);
    setValor(String(item.valor));
    setTipo(item.tipo);
    setModalEditar(true);
  }

  async function salvarEdicao() {
    const valorConvertido = Number(valor.replace(",", "."));

    const novaLista = lista.map(item =>
      item.id === editItem.id
        ? { ...item, descricao, valor: valorConvertido, tipo }
        : item
    );

    await saveTransacoes(novaLista);
    setLista(novaLista);
    setModalEditar(false);
  }

  // AGRUPAR POR MÊS
  function agruparPorMes(transacoes) {
    const grupos = {};
    transacoes.forEach(item => {
      const mes = dayjs(item.data).format("MMMM YYYY");
      if (!grupos[mes]) grupos[mes] = [];
      grupos[mes].push(item);
    });
    return Object.keys(grupos).map(mes => ({ mes, dados: grupos[mes] }));
  }

  // LISTA DE MESES EXISTENTES
  const mesesDisponiveis = Array.from(
    new Set(lista.map(item => dayjs(item.data).format("MMMM YYYY")))
  );

  // FILTRO MENSAL
  const listaFiltrada =
    mesSelecionado === "todos"
      ? lista
      : lista.filter(t => dayjs(t.data).format("MMMM YYYY") === mesSelecionado);

  const listaAgrupada = agruparPorMes(listaFiltrada);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Transações</Text>

      {/* PICKER MENSAL */}
      <Text style={{ fontSize: 18, marginTop: 15 }}>Filtrar por mês</Text>
      <Picker
        selectedValue={mesSelecionado}
        onValueChange={setMesSelecionado}
        style={{ backgroundColor: "#f0f0f0", marginTop: 10, borderRadius: 10 }}
      >
        <Picker.Item label="Todos os meses" value="todos" />
        {mesesDisponiveis.map(mes => (
          <Picker.Item key={mes} label={mes} value={mes} />
        ))}
      </Picker>

      {/* Inputs */}
      <TextInput
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        style={{
          borderWidth: 1,
          marginTop: 15,
          padding: 10,
          borderRadius: 8
        }}
      />

      <TextInput
        placeholder="Valor"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          marginTop: 15,
          padding: 10,
          borderRadius: 8
        }}
      />

      {/* Botões tipo */}
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
        <CustomButton
          title="Receita"
          color="#2ECC71"
          onPress={() => setTipo('receita')}
        />
        <CustomButton
          title="Despesa"
          color="#E74C3C"
          onPress={() => setTipo('despesa')}
        />
      </View>

      <CustomButton
        title="Adicionar"
        color="#4A90E2"
        onPress={adicionarTransacao}
      />

      {/* LISTA AGRUPADA */}
      <FlatList
        data={listaAgrupada}
        keyExtractor={(item) => item.mes}
        renderItem={({ item }) => (
          <View style={{ marginTop: 25 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
              📅 {item.mes}
            </Text>

            {item.dados.map(t => (
              <View
                key={t.id}
                style={{
                  padding: 12,
                  marginTop: 10,
                  borderRadius: 10,
                  backgroundColor: t.tipo === "receita" ? "#E8FFE8" : "#FFE8E8",
                  borderLeftWidth: 6,
                  borderLeftColor: t.tipo === "receita" ? "green" : "red"
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                  {t.descricao}
                </Text>

                <Text style={{
                  marginTop: 5,
                  fontSize: 16,
                  color: t.tipo === "receita" ? "green" : "red"
                }}>
                  {t.tipo === "receita" ? "+ " : "- "}
                  R$ {t.valor.toFixed(2)}
                </Text>

                <View style={{ flexDirection: "row", marginTop: 10, gap: 10 }}>
                  <CustomButton
                    title="Editar"
                    color="#F1C40F"
                    onPress={() => abrirEdicao(t)}
                  />

                  <CustomButton
                    title="Excluir"
                    color="#E74C3C"
                    onPress={() => excluirTransacao(t.id)}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      />

      {/* MODAL */}
      <Modal visible={modalEditar} transparent animationType="fade">
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)"
        }}>
          <View style={{
            width: "80%",
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10
          }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Editar Transação
            </Text>

            <TextInput
              placeholder="Descrição"
              value={descricao}
              onChangeText={setDescricao}
              style={{
                borderWidth: 1,
                marginTop: 15,
                padding: 10,
                borderRadius: 8
              }}
            />

            <TextInput
              placeholder="Valor"
              value={valor}
              onChangeText={setValor}
              keyboardType="numeric"
              style={{
                borderWidth: 1,
                marginTop: 15,
                padding: 10,
                borderRadius: 8
              }}
            />

            <View style={{ flexDirection: "row", marginTop: 15, gap: 10 }}>
              <CustomButton
                title="Receita"
                color="#2ECC71"
                onPress={() => setTipo('receita')}
              />

              <CustomButton
                title="Despesa"
                color="#E74C3C"
                onPress={() => setTipo('despesa')}
              />
            </View>

            <CustomButton title="Salvar" color="#4A90E2" onPress={salvarEdicao} />
            <CustomButton title="Cancelar" color="#E74C3C" onPress={() => setModalEditar(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
