import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function Button({ title, onPress, color = '#1f5fa8', icon }) {
  return (
    <TouchableOpacity 
      className="my-3 w-full flex-row items-center justify-center rounded-2xl px-6 py-5 shadow-lg shadow-blue-900/20"
      style={{ backgroundColor: color }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon ? (
        <View className="mr-3">
          <MaterialIcons name={icon} size={22} color="#ffffff" />
        </View>
      ) : null}
      <Text className="text-center text-base font-bold text-white tracking-wide">{title}</Text>
    </TouchableOpacity>
  );
}
