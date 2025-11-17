// Importa o AsyncStorage, que funciona como o "banco de dados" local do app.
// Ele salva informações diretamente no celular do usuário.
import AsyncStorage from '@react-native-async-storage/async-storage';


// ======================================================
// 🔵 FUNÇÃO GENÉRICA PARA SALVAR QUALQUER LISTA NO STORAGE
// ======================================================
//
// saveData(key, data)
// → key  = nome da chave a ser salva (ex: "transacoes", "metas")
// → data = qualquer dado (normalmente uma lista)
//
// A função transforma o dado em JSON e salva no AsyncStorage.
//
export async function saveData(key, data) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.log("Erro ao salvar", key, error);
  }
}



// A função busca o item no AsyncStorage, converte JSON → array
// e retorna uma lista. Caso não exista, retorna lista vazia.
export async function loadData(key) {
  try {
    const json = await AsyncStorage.getItem(key);

    // Se existir, retorna convertido
    return json ? JSON.parse(json) : [];

  } catch (error) {
    console.log("Erro ao carregar", key, error);
    return [];
  }
}


// clearKey(key) → apaga SOMENTE os dados de uma chave, como "metas".
export async function clearKey(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log("Erro ao limpar", key, error);
  }
}


//clearAll() → apaga TUDO que o app salvou no AsyncStorage.
// É como "resetar" o app.

export async function clearAll() {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.log("Erro ao limpar tudo", error);
  }
}


// Aqui criamos funções especializadas para "Transações" e "Metas".


/*  TRANSACOES  --------------------------------------- */

// Busca todas as transações
export async function getTransacoes() {
  return await loadData('transacoes');
}

// Salva lista de transações
export async function saveTransacoes(lista) {
  return await saveData('transacoes', lista);
}



/*  METAS  -------------------------------------------- */

// Busca todas as metas
export async function getMetas() {
  return await loadData('metas');
}

// Salva lista de metas
export async function saveMetas(lista) {
  return await saveData('metas', lista);
}
