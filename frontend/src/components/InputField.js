import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function InputField({ label, value, onChangeText, placeholder, icon, keyboardType = 'default', ...props }) {
  return (
    <View className="mb-5 w-full">
      <Text className="mb-2 text-[10px] font-bold uppercase tracking-[2px] text-slate-400 ml-1">{label}</Text>
      <View style={styles.inputContainer} className="bg-slate-50/50 border border-slate-100 focus:border-gov-blue">
        {icon && (
          <MaterialIcons name={icon} size={20} color="#94a3b8" style={styles.icon} />
        )}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#cbd5e1"
          keyboardType={keyboardType}
          autoCorrect={false}
          {...props}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#172033',
  },
});
