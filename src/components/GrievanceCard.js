import React from 'react';
import { View, Text } from 'react-native';

export default function GrievanceCard({ name, text, status, date }) {
  const getStatusConfig = (currentStatus) => {
    switch (currentStatus) {
      case 'Resolved': return { bg: '#dcfce7', text: '#15803d' };
      case 'Under Investigation': return { bg: '#fef9c3', text: '#a16207' };
      default: return { bg: '#fee2e2', text: '#b91c1c' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <View className="my-3 w-full rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="h-8 w-8 rounded-full bg-slate-50 items-center justify-center mr-2 border border-slate-100">
             <Text className="text-gov-navy font-bold text-xs">{name.charAt(0)}</Text>
          </View>
          <Text className="text-gov-ink font-bold text-sm">{name}</Text>
        </View>
        <View className="rounded-full px-3 py-1" style={{ backgroundColor: config.bg }}>
          <Text className="text-[10px] font-bold uppercase" style={{ color: config.text }}>{status}</Text>
        </View>
      </View>
      <Text className="mb-4 text-xs leading-5 text-slate-500">{text}</Text>
      <View className="flex-row items-center justify-between pt-3 border-t border-slate-50">
        <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Grievance Ref #00{Math.floor(Math.random() * 99)}</Text>
        <Text className="text-[10px] font-bold text-slate-400">
          {new Date(date).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
}
