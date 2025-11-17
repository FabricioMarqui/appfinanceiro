// Importa React e hooks essenciais
import React, { useState, useEffect } from 'react';

// Componentes do React Native usados na tela
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal
} from 'react-native';

// Botão personalizado usado no app
import CustomButton from '../components/CustomButton';

// Funções para ler e salvar metas no AsyncStorage
import { getMetas, saveMetas } from '../storage/storageService';

export default function GoalsScreen() {

  // Estados do formulário para criar uma nova meta
  const [titulo, setTitulo] = useState('');
  const [valorDesejado, setValorDesejado] = useState('');

  // Lista completa de metas salvas
  const [lista, setLista] = useState([]);

  // Estados do modal (para adicionar progresso)
  const [modalVisible, setModalVisible] = useState(false);
  const [valorProgresso, setValorProgresso] = useState('');
  const [metaSelecionada, setMetaSelecionada] = useState(null);

  // Carregar metas quando a tela abrir
  useEffect(() => {
    carregarMetas();
  }, []);

  // Buscar metas do AsyncStorage
  async function carregarMetas() {
    const dados = await getMetas();
    setLista(dados);
  }

  // Criar nova meta
  async function adicionarMeta() {

    // Validação dos campos
    if (!titulo || !valorDesejado) {
      alert("Preencha todos os campos!");
      return;
    }

    // Converte vírgula para ponto (evita erro de conversão)
    const valorConvertido = Number(valorDesejado.replace(',', '.'));

    if (isNaN(valorConvertido)) {
      alert('Digite um valor válido!');
      return;
    }

    // Objeto da nova meta
    const nova = {
      id: Date.now().toString(),    // ID único
      titulo,                       // Título da meta
      valorDesejado: valorConvertido, // Valor alvo
      progresso: 0                  // Começa em 0
    };

    // Coloca nova meta no topo
    const novaLista = [nova, ...lista];

    // Salva no armazenamento
    await saveMetas(novaLista);

    // Atualiza a lista
    setLista(novaLista);

    // Limpa o formulário
    setTitulo('');
    setValorDesejado('');
  }

  // Abre o modal e define qual meta está sendo editada
  function abrirModal(meta) {
    setMetaSelecionada(meta);
    setValorProgresso('');
    setModalVisible(true);
  }

  // Salvar progresso adicionado à meta
  async function salvarProgresso() {
    const valor = Number(valorProgresso.replace(',', '.'));

    if (isNaN(valor) || valor <= 0) {
      alert("Digite um valor válido!");
      return;
    }

    // Atualiza apenas a meta selecionada
    const novaLista = lista.map(meta => {
      if (meta.id === metaSelecionada.id) {
        return {
          ...meta,
          progresso: meta.progresso + valor // soma o progresso
        };
      }
      return meta;
    });

    await saveMetas(novaLista);
    setLista(novaLista);
    setModalVisible(false); // Fecha modal
  }

  // Remover meta
  async function excluirMeta(id) {
    const novaLista = lista.filter(meta => meta.id !== id);
    await saveMetas(novaLista);
    setLista(novaLista);
  }

  // Renderização de cada item da FlatList
  function renderItem({ item }) {

    // Calcula porcentagem concluída
    const perc = (item.progresso / item.valorDesejado) * 100;

    return (
      <View
        style={{
          padding: 15,
          borderRadius: 10,
          marginBottom: 15,
          backgroundColor: '#e8e8ff', // Azul claro
          borderLeftWidth: 6,
          borderLeftColor: 'blue'
        }}
      >
        {/* Título */}
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          {item.titulo}
        </Text>

        {/* Valor desejado */}
        <Text style={{ fontSize: 16, marginTop: 5 }}>
          Meta: R$ {item.valorDesejado.toFixed(2)}
        </Text>

        {/* Progresso já alcançado */}
        <Text style={{ fontSize: 16, marginTop: 5 }}>
          Guardado: R$ {item.progresso.toFixed(2)}
        </Text>

        {/* Barra de progresso */}
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
            width: `${perc}%`,       // preenchimento baseado no progresso
            backgroundColor: 'blue'
          }} />
        </View>

        <Text style={{ marginTop: 5 }}>
          {perc.toFixed(0)}% concluído
        </Text>

        {/* Botão para abrir o modal e adicionar progresso */}
        <CustomButton
          title="Adicionar Progresso"
          color="#2ECC71"
          onPress={() => abrirModal(item)}
        />

        {/* Botão excluir meta */}
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

      {/* Título da tela */}
      <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Metas</Text>

      {/* Campo título */}
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

      {/* Campo valor desejado */}
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

      {/* Botão adicionar meta */}
      <CustomButton
        title="Adicionar Meta"
        color="#4A90E2"
        onPress={adicionarMeta}
      />

      {/* Lista de metas */}
      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={{ marginTop: 30 }}
      />

      {/* MODAL para adicionar progresso */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)' // Fundo escurecido
        }}>
          <View style={{
            width: '80%',
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10
          }}>

            {/* Título do modal */}
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              Adicionar Progresso
            </Text>

            {/* Campo de valor */}
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

            {/* Botões do modal */}
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
