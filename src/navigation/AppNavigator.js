// Importa o React
import React from 'react';

// Importa o container principal de navegação,
// que mantém todo o sistema de rotas funcionando.
import { NavigationContainer } from '@react-navigation/native';

// Importa o sistema de abas inferiores (Bottom Tabs)
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importa ícones do Expo para usar nos botões da barra inferior
import { Ionicons } from '@expo/vector-icons';

// Importa as telas do app
import HomeScreen from '../screens/HomeScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import GoalsScreen from '../screens/GoalsScreen';
import SummaryScreen from '../screens/SummaryScreen';

// Cria o navegador de abas
const Tab = createBottomTabNavigator();


// ========================================================
// 📌 COMPONENTE PRINCIPAL DO SISTEMA DE NAVEGAÇÃO DO APP
// ========================================================
//
// AppNavigator é responsável por controlar todas as telas e
// a navegação entre elas usando abas inferiores (Tabs).
//
export default function AppNavigator() {
  return (
    // NavigationContainer encapsula toda a navegação do app.
    // É obrigatório para qualquer tipo de navegação no React Navigation.
    <NavigationContainer>

      {/* Criação do Tab Navigator */}
      <Tab.Navigator
        // Configurações compartilhadas por TODAS as telas do Tab
        screenOptions={({ route }) => ({
          // Remove o header padrão do React Navigation
          headerShown: false,

          // Ícone que aparece em cada aba inferior
          tabBarIcon: ({ color, size }) => {
            let iconName;

            // Escolhe o ícone de acordo com a rota
            if (route.name === 'Início') iconName = "home";
            if (route.name === 'Transações') iconName = "swap-vertical";
            if (route.name === 'Metas') iconName = "trophy";
            if (route.name === 'Resumo') iconName = "bar-chart";

            // Retorna o ícone da respectiva aba
            return <Ionicons name={iconName} size={size} color={color} />;
          },

          // Cores da Tab Bar
          tabBarActiveTintColor: "blue",   // Cor quando está ativa
          tabBarInactiveTintColor: "gray", // Cor quando está inativa
        })}
      >

        {/* Cada aba do aplicativo */}
        <Tab.Screen name="Início" component={HomeScreen} />
        <Tab.Screen name="Transações" component={TransactionsScreen} />
        <Tab.Screen name="Metas" component={GoalsScreen} />
        <Tab.Screen name="Resumo" component={SummaryScreen} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}
