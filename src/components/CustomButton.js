import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export default function CustomButton({ title, color = "#4A90E2", onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: color,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 12,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3
      }}
      activeOpacity={0.7}
    >
      <Text style={{
        color: "white",
        fontWeight: "bold",
        fontSize: 16
      }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
