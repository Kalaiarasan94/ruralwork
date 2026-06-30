import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function KpiCard({ title, value, icon, color = '#3b82f6' }) {
  return (
    <View
      className="my-3 w-full flex-row items-center rounded-2xl bg-white p-5 shadow-sm border border-slate-100"
    >
      <View className="h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 mr-4 shadow-inner" style={{ backgroundColor: `${color}08` }}>
        <MaterialIcons name={icon || "analytics"} size={28} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</Text>
        <Text className="text-2xl font-bold text-gov-ink tracking-tight">{value}</Text>
      </View>
      <View className="bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
         <MaterialIcons name="trending-up" size={12} color="#10b981" />
      </View>
    </View>
  );
}
