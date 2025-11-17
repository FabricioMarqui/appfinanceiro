import AsyncStorage from '@react-native-async-storage/async-storage';

// ----------------------
// 🔵 SALVAR QUALQUER LISTA
// ----------------------
export async function saveData(key, data) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.log("Erro ao salvar", key, error);
  }
}

// ----------------------
// 🔵 CARREGAR QUALQUER LISTA
// ----------------------
export async function loadData(key) {
  try {
    const json = await AsyncStorage.getItem(key);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.log("Erro ao carregar", key, error);
    return [];
  }
}

// ----------------------
// 🔵 LIMPAR UMA CHAVE
// ----------------------
export async function clearKey(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log("Erro ao limpar", key, error);
  }
}

// ----------------------
// 🔵 LIMPAR TODO O STORAGE
// ----------------------
export async function clearAll() {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.log("Erro ao limpar tudo", error);
  }
}

// ----------------------
// 🔵 FUNÇÕES ESPECÍFICAS PARA O APP
// ----------------------

/*  TRANSACOES  --------------------------------------- */
export async function getTransacoes() {
  return await loadData('transacoes');
}

export async function saveTransacoes(lista) {
  return await saveData('transacoes', lista);
}

/*  METAS  -------------------------------------------- */
export async function getMetas() {
  return await loadData('metas');
}

export async function saveMetas(lista) {
  return await saveData('metas', lista);
}
