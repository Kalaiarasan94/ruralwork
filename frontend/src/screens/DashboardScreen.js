import React, { useState } from 'react';
import { Text, ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MobileFrame from '../components/MobileFrame';
import KpiCard from '../components/KpiCard';

export default function DashboardScreen() {
  const [stats] = useState({
    registered_workers: 1420,
    active_projects: 18,
    completed_assets: 47,
    total_funds_utilized: '4850000.00',
  });

  return (
    <MobileFrame>
      <ScrollView className="bg-slate-50" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="bg-gov-navy px-5 pt-4 pb-12 rounded-b-[40px] shadow-lg">
          <View className="mb-6">
            <Text className="text-blue-200 text-[10px] font-bold uppercase tracking-[2px]">Executive MIS Analytics</Text>
            <Text className="text-white text-2xl font-bold">Project Performance</Text>
          </View>
        </View>

        <View className="px-5 -mt-6">
          <KpiCard title="Registered Workers" value={stats.registered_workers.toLocaleString('en-IN')} icon="people" color="#1f5fa8" />
          <KpiCard title="Active Worksites" value={stats.active_projects.toString()} icon="assignment" color="#d97706" />
          <KpiCard title="Completed Assets" value={stats.completed_assets.toString()} icon="task-alt" color="#15803d" />
          <KpiCard title="Total Outlay" value={`₹${parseFloat(stats.total_funds_utilized).toLocaleString('en-IN')}`} icon="payments" color="#b91c1c" />
        </View>

        <View className="px-5 mt-6">
           <View className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <Text className="text-gov-ink font-bold text-base mb-4">Regional Distribution</Text>
              <View className="h-40 bg-slate-50 rounded-2xl items-center justify-center border border-dashed border-slate-200">
                 <MaterialIcons name="map" size={40} color="#cbd5e1" />
                 <Text className="text-slate-400 text-xs mt-2">Geographic data loading...</Text>
              </View>
           </View>
        </View>
      </ScrollView>
    </MobileFrame>
  );
}
