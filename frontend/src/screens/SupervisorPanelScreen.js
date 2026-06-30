import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MobileFrame from '../components/MobileFrame';

const fieldActions = [
  { title: 'Mark Attendance', subtitle: 'Selfie, GPS, date, and time evidence', icon: 'add-a-photo', route: 'Attendance', color: '#d97706' },
  { title: 'Update Asset Progress', subtitle: 'Before, during, after worksite tracking', icon: 'add-location-alt', route: 'CreateProject', color: '#15803d' },
  { title: 'Register Worker', subtitle: 'Household and worker enrolment support', icon: 'person-add-alt-1', route: 'WorkerRegister', color: '#1f5fa8' },
  { title: 'File Grievance', subtitle: 'Capture complaint for social audit review', icon: 'record-voice-over', route: 'Grievance', color: '#b91c1c' },
];

export default function SupervisorPanelScreen({ navigation }) {
  return (
    <MobileFrame>
      <ScrollView style={{ flex: 1 }} className="bg-slate-50" contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
        <View className="bg-gov-green px-5 pt-4 pb-12 rounded-b-[40px] shadow-lg">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-green-100 text-[10px] font-bold uppercase tracking-[2px]">Field Supervisor Console</Text>
              <Text className="text-white text-2xl font-bold">Worksite WS-102</Text>
            </View>
            <TouchableOpacity className="h-10 w-10 bg-white/10 rounded-full items-center justify-center">
              <MaterialIcons name="sync" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-3">
             <View className="flex-1 bg-white/10 rounded-2xl p-4 border border-white/10">
                <Text className="text-green-100 text-[10px] font-bold uppercase">Present Today</Text>
                <Text className="text-white text-2xl font-bold mt-1">68</Text>
             </View>
             <View className="flex-1 bg-white/10 rounded-2xl p-4 border border-white/10">
                <Text className="text-green-100 text-[10px] font-bold uppercase">Status</Text>
                <Text className="text-white text-lg font-bold mt-1 italic">On-Duty</Text>
             </View>
          </View>
        </View>

        <View className="px-5 mt-8">
          <Text className="text-gov-ink font-bold text-lg mb-4 ml-1">Field Operations</Text>
          <View className="w-full">
            {fieldActions.map((item) => (
              <TouchableOpacity
                key={item.title}
                className="w-full mb-4 flex-row items-center bg-white rounded-3xl p-5 shadow-sm border border-slate-100 z-50"
                onPress={() => navigation.navigate(item.route)}
                activeOpacity={0.7}
              >
                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 mr-4" style={{ backgroundColor: `${item.color}08` }}>
                  <MaterialIcons name={item.icon} size={28} color={item.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-gov-ink font-bold text-base">{item.title}</Text>
                  <Text className="text-slate-400 text-xs mt-1">{item.subtitle}</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={14} color="#cbd5e1" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="px-5 mt-4">
           <View className="bg-sky-50 border border-sky-100 rounded-2xl p-4 flex-row items-center">
              <View className="h-10 w-10 rounded-full bg-sky-100 items-center justify-center mr-3">
                 <MaterialIcons name="cloud-done" size={20} color="#0369a1" />
              </View>
              <View className="flex-1">
                 <Text className="text-sky-900 font-bold text-sm">Offline Mode Ready</Text>
                 <Text className="text-sky-700 text-[10px]">Your captures will be saved locally and synced automatically when online.</Text>
              </View>
           </View>
        </View>
      </ScrollView>
    </MobileFrame>
  );
}
