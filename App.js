// -----------------------------------------------------------
// Importa o arquivo que contém toda a navegação do app
// O AppNavigator configura as telas e as abas inferiores
// -----------------------------------------------------------
import AppNavigator from './src/navigation/AppNavigator';


// ===========================================================
// 📌 COMPONENTE PRINCIPAL DO APLICATIVO
// ===========================================================
//
// O Expo sempre começa executando o componente App().
// Aqui nós apenas retornamos o AppNavigator,
// que contém toda a estrutura de navegação do aplicativo.
//
// Isso mantém o App.js limpo e organizado.
// ===========================================================
export default function App() {
  return <AppNavigator />;  // Renderiza a navegação
}
