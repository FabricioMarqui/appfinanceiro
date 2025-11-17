import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import GoalsScreen from '../screens/GoalsScreen';
import SummaryScreen from '../screens/SummaryScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Início') iconName = "home";
            if (route.name === 'Transações') iconName = "swap-vertical";
            if (route.name === 'Metas') iconName = "trophy";
            if (route.name === 'Resumo') iconName = "bar-chart";

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "blue",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Início" component={HomeScreen} />
        <Tab.Screen name="Transações" component={TransactionsScreen} />
        <Tab.Screen name="Metas" component={GoalsScreen} />
        <Tab.Screen name="Resumo" component={SummaryScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
