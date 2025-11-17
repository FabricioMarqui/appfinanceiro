import React from 'react';
// Importa componentes básicos do React Native
// TouchableOpacity → botão clicável com efeito de opacidade
// Text → exibir texto
import { TouchableOpacity, Text } from 'react-native';
// aceitando um título, uma cor personalizada e uma função onPress.
export default function CustomButton({ title, color = "#4A90E2", onPress }) {
  return (
    <TouchableOpacity
      // Função chamada quando o botão é pressionado
      onPress={onPress}

      // Estilos visuais do botão
      style={{
        backgroundColor: color,     // Cor do botão (padrão: azul)
        paddingVertical: 14,        // Altura interna
        borderRadius: 12,           // Arredondamento das bordas
        alignItems: 'center',       // Centraliza o texto
                                       
        marginTop: 12,              // Espaçamento superior

        // EFEITO DE SOMBRA (Android + iOS)
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3                // Elevação no Android
      }}

      // Efeito ao clicar (reduz opacidade)
      activeOpacity={0.7}
    >
      
      {/* Texto exibido dentro do botão */}
      <Text
        style={{
          color: "white",          // Texto branco
          fontWeight: "bold",      // Negrito
          fontSize: 16             // Tamanho da fonte
        }}
      >
        {title}
      </Text>

    </TouchableOpacity>
  );
}
