// Importações principais do React e hooks
import React, { useState, useEffect } from 'react';

// Componentes visuais do React Native
import {
  View,
  Text,
  TextInput,
  FlatList,
  Modal
} from 'react-native';

// Importa o seletor de opções (Picker)
import { Picker } from '@react-native-picker/picker';

// Biblioteca para manipular datas
import dayjs from 'dayjs';

// Botão customizado criado no projeto
import CustomButton from '../components/CustomButton';

// Funções que leem e salvam no AsyncStorage
import { getTransacoes, saveTransacoes } from '../storage/storageService';

export default function TransactionsScreen() {

  // Estados dos campos do formulário
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('receita'); // "receita" ou "despesa"

  // Lista completa de transações armazenadas
  const [lista, setLista] = useState([]);

  // Filtro mensal (opção "todos" mostra tudo)
  const [mesSelecionado, setMesSelecionado] = useState("todos");

  // Controle do modal de edição
  const [modalEditar, setModalEditar] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Carrega os dados do AsyncStorage quando a tela abre
  useEffect(() => {
    carregar();
  }, []);

  // Função que busca as transações gravadas
  async function carregar() {
    const dados = await getTransacoes();
    setLista(dados);
  }

  // Adicionar uma nova transação
  async function adicionarTransacao() {

    // Validação simples
    if (!descricao || !valor) return alert("Preencha tudo!");

    // Converte vírgula para ponto, se necessário
    const valorConvertido = Number(valor.replace(",", "."));

    // Monta o objeto da nova transação
    const nova = {
      id: Date.now().toString(),     // ID único baseado no tempo
      descricao,                     // Texto
      valor: valorConvertido,        // Número
      tipo,                          // receita / despesa
      data: new Date().toISOString() // Data atual
    };

    // Coloca no topo da lista
    const novaLista = [nova, ...lista];

    // Salva no armazenamento
    await saveTransacoes(novaLista);

    // Atualiza a lista na tela
    setLista(novaLista);

    // Limpa os campos
    setDescricao('');
    setValor('');
  }

  // Remover uma transação pelo ID
  async function excluirTransacao(id) {
    const novaLista = lista.filter(item => item.id !== id);
    await saveTransacoes(novaLista);
    setLista(novaLista);
  }

  // Abrir modal e preencher os campos com a transação selecionada
  function abrirEdicao(item) {
    setEditItem(item);
    setDescricao(item.descricao);
    setValor(String(item.valor));
    setTipo(item.tipo);
    setModalEditar(true);
  }

  // Salvar alterações feitas no modal de edição
  async function salvarEdicao() {
    const valorConvertido = Number(valor.replace(",", "."));

    // Substitui só o item editado na lista
    const novaLista = lista.map(item =>
      item.id === editItem.id
        ? { ...item, descricao, valor: valorConvertido, tipo }
        : item
    );

    await saveTransacoes(novaLista);
    setLista(novaLista);
    setModalEditar(false);
  }

  // Agrupar transações por mês (ex: Janeiro 2025)
  function agruparPorMes(transacoes) {
    const grupos = {};

    transacoes.forEach(item => {

      // Formata a data no padrão "Mês Ano"
      const mes = dayjs(item.data).format("MMMM YYYY");

      // Se ainda não existe um grupo para esse mês, cria
      if (!grupos[mes]) grupos[mes] = [];

      // Coloca a transação dentro do grupo do mês
      grupos[mes].push(item);
    });

    // Transforma o objeto em array para usar no FlatList
    return Object.keys(grupos).map(mes => ({ mes, dados: grupos[mes] }));
  }

  // Lista todos os meses que existem na base
  const mesesDisponiveis = Array.from(
    new Set(lista.map(item => dayjs(item.data).format("MMMM YYYY")))
  );

  // Filtrar a lista com base no mês selecionado
  const listaFiltrada =
    mesSelecionado === "todos"
      ? lista
      : lista.filter(t => dayjs(t.data).format("MMMM YYYY") === mesSelecionado);

  // Agrupa por mês já filtrado
  const listaAgrupada = agruparPorMes(listaFiltrada);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Título */}
      <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Transações</Text>

      {/* FILTRO MENSAL */}
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

      {/* Input descrição */}
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

      {/* Input valor */}
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

      {/* Botões de seleção de tipo */}
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

      {/* Botão para adicionar */}
      <CustomButton
        title="Adicionar"
        color="#4A90E2"
        onPress={adicionarTransacao}
      />

      {/* LISTA AGRUPADA POR MÊS */}
      <FlatList
        data={listaAgrupada}
        keyExtractor={(item) => item.mes}
        renderItem={({ item }) => (
          <View style={{ marginTop: 25 }}>

            {/* Título do mês */}
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
              📅 {item.mes}
            </Text>

            {/* Transações daquele mês */}
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
                {/* Descrição */}
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                  {t.descricao}
                </Text>

                {/* Valor */}
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: 16,
                    color: t.tipo === "receita" ? "green" : "red"
                  }}
                >
                  {t.tipo === "receita" ? "+ " : "- "}
                  R$ {t.valor.toFixed(2)}
                </Text>

                {/* Botões editar e excluir */}
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

      {/* MODAL DE EDIÇÃO */}
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

            {/* Título */}
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Editar Transação
            </Text>

            {/* Campos de edição */}
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

            {/* Botões de receita ou despesa */}
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

            {/* Salvar e cancelar */}
            <CustomButton title="Salvar" color="#4A90E2" onPress={salvarEdicao} />
            <CustomButton title="Cancelar" color="#E74C3C" onPress={() => setModalEditar(false)} />

          </View>
        </View>
      </Modal>
    </View>
  );
}
