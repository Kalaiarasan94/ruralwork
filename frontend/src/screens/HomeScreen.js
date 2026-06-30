import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MobileFrame from '../components/MobileFrame';
import BannerSlideshow from '../components/BannerSlideshow';

const roleCards = [
  {
    title: 'Field Supervisor',
    subtitle: 'Attendance, GPS evidence, worker support',
    icon: 'engineering',
    route: 'SupervisorLogin',
    color: '#15803d',
  },
  {
    title: 'Admin Panel',
    subtitle: 'Approvals, MIS, assets, grievance review',
    icon: 'admin-panel-settings',
    route: 'AdminLogin',
    color: '#12315f',
  },
];

export default function HomeScreen({ navigation }) {
  return (
    <MobileFrame>
      <ScrollView className="bg-white" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-gov-navy px-5 pt-4 pb-6">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View>
                <Text className="text-white font-bold text-lg tracking-tight">VB-G RAM-G</Text>
                <Text className="text-blue-100 text-[10px] font-semibold uppercase">Rural Works Governance Portal</Text>
              </View>
            </View>
            <View className="bg-amber-500 px-2 py-1 rounded">
              <Text className="text-white text-[10px] font-bold">OFFICIAL</Text>
            </View>
          </View>
        </View>

        <BannerSlideshow />

        <View className="px-5 -mt-8">
          <View className="bg-white rounded-xl shadow-lg p-5 flex-row justify-between border border-gov-line">
            <View className="items-center">
              <Text className="text-gov-navy font-bold text-xl">250</Text>
              <Text className="text-slate-500 text-[10px] uppercase font-bold">Projects</Text>
            </View>
            <View className="h-full w-[1px] bg-slate-200" />
            <View className="items-center">
              <Text className="text-gov-navy font-bold text-xl">12.5K</Text>
              <Text className="text-slate-500 text-[10px] uppercase font-bold">Workers</Text>
            </View>
            <View className="h-full w-[1px] bg-slate-200" />
            <View className="items-center">
              <Text className="text-gov-navy font-bold text-xl">91%</Text>
              <Text className="text-slate-500 text-[10px] uppercase font-bold">Payments</Text>
            </View>
          </View>
        </View>

        <View className="px-5 mt-6 mb-8">
          <Text className="text-gov-ink font-bold text-lg mb-4">Secure Access Gateway</Text>
          
          {roleCards.map((item) => (
            <TouchableOpacity
              key={item.title}
              className="mb-4 flex-row items-center bg-white rounded-xl border border-gov-line p-5 shadow-sm overflow-hidden"
              onPress={() => navigation.navigate(item.route)}
              activeOpacity={0.7}
            >
              <View 
                className="absolute left-0 top-0 bottom-0 w-1" 
                style={{ backgroundColor: item.color }} 
              />
              <View className="mr-4 h-14 w-14 items-center justify-center rounded-full bg-slate-50">
                <MaterialIcons name={item.icon} size={30} color={item.color} />
              </View>
              <View className="flex-1">
                <Text className="text-gov-ink font-bold text-base">{item.title}</Text>
                <Text className="text-slate-500 text-xs mt-1 leading-4">{item.subtitle}</Text>
              </View>
              <MaterialIcons name="arrow-forward-ios" size={16} color="#cbd5e1" />
            </TouchableOpacity>
          ))}

          <View className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
            <View className="flex-row items-center mb-2">
              <MaterialIcons name="info" size={18} color="#1e40af" />
              <Text className="ml-2 text-blue-900 font-bold text-sm">Citizen Information</Text>
            </View>
            <Text className="text-blue-800 text-xs leading-5">
              This platform provides end-to-end monitoring of rural development works. Authorized personnel can access biometric attendance, asset tracking, and MIS reports.
            </Text>
          </View>
        </View>
        
        <View className="bg-slate-50 py-6 items-center border-t border-slate-200">
          <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Government of India</Text>
          <Text className="text-slate-400 text-[10px] mt-1">© 2026 Ministry of Rural Development</Text>
        </View>
      </ScrollView>
    </MobileFrame>
  );
}
