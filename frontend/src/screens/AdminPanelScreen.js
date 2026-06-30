import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Pressable, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MobileFrame from '../components/MobileFrame';
import KpiCard from '../components/KpiCard';
import { API_ENDPOINTS } from '../config/api';

const adminActions = [
  { title: 'Approve Worker Registration', subtitle: 'Verify household, Aadhaar, and bank details', icon: 'how-to-reg', route: 'WorkerRegister', color: '#1f5fa8' },
  { title: 'Register Field Supervisor', subtitle: 'Onboard new official with secure credentials', icon: 'person-add', route: 'RegisterSupervisor', color: '#12315f' },
  { title: 'Create Asset / Project', subtitle: 'Register work type, village, budget, and GPS point', icon: 'domain-add', route: 'CreateProject', color: '#15803d' },
  { title: 'Attendance Register', subtitle: 'Review and download worksite attendance', icon: 'assignment', route: 'AttendanceRegister', color: '#0ea5e9' },
  { title: 'MIS Reports', subtitle: 'Review employment days, funds, and assets', icon: 'insights', route: 'Dashboard', color: '#d97706' },
  { title: 'Social Audit Register', subtitle: 'Inspect grievances and resolution status', icon: 'policy', route: 'Grievance', color: '#b91c1c' },
];

export default function AdminPanelScreen({ navigation }) {
  const [stats, setStats] = useState({
    registered_workers: 0,
    active_projects: 0,
    completed_assets: 0,
    total_funds_utilized: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.DASHBOARD);
      const result = await response.json();
      if (result.status === 'success') {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      Alert.alert('Error', 'Could not fetch dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  return (
    <MobileFrame>
      <ScrollView 
        style={{ flex: 1 }} 
        className="bg-slate-50" 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} color="#12315f" />
        }
      >
        <View className="bg-gov-navy px-5 pt-4 pb-12 rounded-b-[40px] shadow-lg">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-blue-200 text-[10px] font-bold uppercase tracking-[2px]">District Admin Console</Text>
              <Text className="text-white text-2xl font-bold">Welcome, Administrator</Text>
            </View>
            <TouchableOpacity className="h-10 w-10 bg-white/10 rounded-full items-center justify-center">
              <MaterialIcons name="notifications-none" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-3">
             <View className="flex-1 bg-white/10 rounded-2xl p-4 border border-white/10">
                <Text className="text-blue-100 text-[10px] font-bold uppercase">Pending Tasks</Text>
                <Text className="text-white text-2xl font-bold mt-1">24</Text>
             </View>
             <View className="flex-1 bg-white/10 rounded-2xl p-4 border border-white/10">
                <Text className="text-blue-100 text-[10px] font-bold uppercase">DBT Sync</Text>
                <Text className="text-green-400 text-2xl font-bold mt-1">91%</Text>
             </View>
          </View>
        </View>

        {loading && !refreshing ? (
          <View className="py-10">
            <ActivityIndicator size="large" color="#12315f" />
          </View>
        ) : (
          <View className="px-5 mt-4">
            <KpiCard title="Registered Workers" value={stats.registered_workers.toLocaleString()} icon="people" color="#1f5fa8" />
            <KpiCard title="Active Projects" value={stats.active_projects.toString()} icon="construction" color="#d97706" />
            <KpiCard title="Assets Completed" value={stats.completed_assets.toString()} icon="task-alt" color="#15803d" />
          </View>
        )}

        <View className="px-5 mt-6">
          <Text className="text-gov-ink font-bold text-lg mb-4 ml-1">Administrative Workbench</Text>
          <View className="flex-row flex-wrap justify-between w-full">
            {adminActions.map((item) => (
              <TouchableOpacity
                key={item.title}
                className="w-[48%] mb-4 bg-white rounded-3xl p-5 shadow-sm border border-slate-100 items-center z-50"
                onPress={() => navigation.navigate(item.route)}
                activeOpacity={0.7}
              >
                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 mb-3" style={{ backgroundColor: `${item.color}08` }}>
                  <MaterialIcons name={item.icon} size={28} color={item.color} />
                </View>
                <Text className="text-gov-ink font-bold text-xs text-center leading-4">{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View className="px-5 mt-4">
           <View className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex-row items-center">
              <View className="h-10 w-10 rounded-full bg-amber-100 items-center justify-center mr-3">
                 <MaterialIcons name="security" size={20} color="#b45309" />
              </View>
              <View className="flex-1">
                 <Text className="text-amber-900 font-bold text-sm">Security Audit Active</Text>
                 <Text className="text-amber-700 text-[10px]">All administrative actions are being logged with timestamp and IP address.</Text>
              </View>
           </View>
        </View>
      </ScrollView>
    </MobileFrame>
  );
}
