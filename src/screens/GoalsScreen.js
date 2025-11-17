import React, { useState, useEffect } from 'react';
import { PieChart } from "react-native-chart-kit";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal
} from 'react-native';

import CustomButton from '../components/CustomButton';
import { getMetas, saveMetas } from '../storage/storageService';

export default function GoalsScreen() {

  const [titulo, setTitulo] = useState('');
  const [valorDesejado, setValorDesejado] = useState('');
  const [lista, setLista] = useState([]);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [valorProgresso, setValorProgresso] = useState('');
  const [metaSelecionada, setMetaSelecionada] = useState(null);

  useEffect(() => {
    carregarMetas();
  }, []);

  async function carregarMetas() {
    const dados = await getMetas();
    setLista(dados);
  }

  async function adicionarMeta() {
    if (!titulo || !valorDesejado) {
      alert("Preencha todos os campos!");
      return;
    }

    const valorConvertido = Number(valorDesejado.replace(',', '.'));

    if (isNaN(valorConvertido)) {
      alert('Digite um valor válido!');
      return;
    }

    const nova = {
      id: Date.now().toString(),
      titulo,
      valorDesejado: valorConvertido,
      progresso: 0
    };

    const novaLista = [nova, ...lista];
    await saveMetas(novaLista);
    setLista(novaLista);

    setTitulo('');
    setValorDesejado('');
  }

  function abrirModal(meta) {
    setMetaSelecionada(meta);
    setValorProgresso('');
    setModalVisible(true);
  }

  async function salvarProgresso() {
    const valor = Number(valorProgresso.replace(',', '.'));

    if (isNaN(valor) || valor <= 0) {
      alert("Digite um valor válido!");
      return;
    }

    const novaLista = lista.map(meta => {
      if (meta.id === metaSelecionada.id) {
        return {
          ...meta,
          progresso: meta.progresso + valor
        };
      }
      return meta;
    });

    await saveMetas(novaLista);
    setLista(novaLista);
    setModalVisible(false);
  }

  async function excluirMeta(id) {
    const novaLista = lista.filter(meta => meta.id !== id);
    await saveMetas(novaLista);
    setLista(novaLista);
  }

  function renderItem({ item }) {
    const perc = (item.progresso / item.valorDesejado) * 100;

    return (
      <View
        style={{
          padding: 15,
          borderRadius: 10,
          marginBottom: 15,
          backgroundColor: '#e8e8ff',
          borderLeftWidth: 6,
          borderLeftColor: 'blue'
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          {item.titulo}
        </Text>

        <Text style={{ fontSize: 16, marginTop: 5 }}>
          Meta: R$ {item.valorDesejado.toFixed(2)}
        </Text>

        <Text style={{ fontSize: 16, marginTop: 5 }}>
          Guardado: R$ {item.progresso.toFixed(2)}
        </Text>

        {/* Progress bar */}
        <View style={{
          marginTop: 10,
          height: 15,
          width: '100%',
          backgroundColor: '#ddd',
          borderRadius: 10,
          overflow: 'hidden'
        }}>
          <View style={{
            height: '100%',
            width: `${perc}%`,
            backgroundColor: 'blue'
          }} />
        </View>

        <Text style={{ marginTop: 5 }}>
          {perc.toFixed(0)}% concluído
        </Text>

        <CustomButton
          title="Adicionar Progresso"
          color="#2ECC71"
          onPress={() => abrirModal(item)}
        />

        <CustomButton
          title="Excluir"
          color="#E74C3C"
          onPress={() => excluirMeta(item.id)}
        />

      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Metas</Text>

      <TextInput
        placeholder="Título da meta"
        value={titulo}
        onChangeText={setTitulo}
        style={{
          borderWidth: 1,
          marginTop: 15,
          padding: 10,
          borderRadius: 8
        }}
      />

      <TextInput
        placeholder="Valor desejado"
        value={valorDesejado}
        onChangeText={setValorDesejado}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          marginTop: 15,
          padding: 10,
          borderRadius: 8
        }}
      />

      <CustomButton
        title="Adicionar Meta"
        color="#4A90E2"
        onPress={adicionarMeta}
      />

      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={{ marginTop: 30 }}
      />

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <View style={{
            width: '80%',
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10
          }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              Adicionar Progresso
            </Text>

            <TextInput
              placeholder="Valor"
              value={valorProgresso}
              onChangeText={setValorProgresso}
              keyboardType="numeric"
              style={{
                borderWidth: 1,
                marginTop: 15,
                padding: 10,
                borderRadius: 8
              }}
            />

            <CustomButton
              title="Salvar"
              color="#2ECC71"
              onPress={salvarProgresso}
            />

            <CustomButton
              title="Cancelar"
              color="#E74C3C"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>

    </View>
  );
}
