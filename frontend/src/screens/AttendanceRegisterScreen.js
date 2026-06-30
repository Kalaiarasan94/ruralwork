import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Platform, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MobileFrame from '../components/MobileFrame';
import { API_ENDPOINTS } from '../config/api';

export default function AttendanceRegisterScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.GET_ATTENDANCE);
      const result = await response.json();
      if (result.status === 'success') {
        setData(result.data);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const downloadExcel = () => {
    if (data.length === 0) {
      Alert.alert('No Data', 'There is no data to export.');
      return;
    }

    // Generate CSV content with full details
    const header = ['ID', 'Worker Name', 'Household ID', 'Aadhaar', 'Mobile', 'Project Name', 'Check-in Time', 'Area Name', 'Latitude', 'Longitude'];
    const rows = data.map(item => [
      item.id,
      item.worker_name,
      item.household_id || 'N/A',
      item.aadhaar_number || 'N/A',
      item.mobile_number || 'N/A',
      item.project_name,
      item.check_in_time,
      item.location_name || 'N/A',
      item.latitude,
      item.longitude
    ]);

    const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");

    if (Platform.OS === 'web') {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Attendance_Register_Detailed_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      Alert.alert('Download', 'Detailed CSV Exported to local storage (Simulated for Native)');
    }
  };

  // Group data by date
  const groupedData = data.reduce((groups, item) => {
    const date = new Date(item.check_in_time).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedData).sort((a, b) => new Date(b) - new Date(a));

  return (
    <MobileFrame>
      <View style={{ flex: 1 }}>
        <View className="bg-gov-navy px-5 pt-4 pb-6 shadow-md">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-blue-200 text-[10px] font-bold uppercase tracking-[2px]">Admin Reports</Text>
              <Text className="text-white text-2xl font-bold">Attendance Register</Text>
            </View>
            <TouchableOpacity onPress={downloadExcel} className="bg-gov-green px-4 py-2 rounded-xl flex-row items-center shadow-lg">
              <MaterialIcons name="file-download" size={20} color="white" />
              <Text className="text-white font-bold ml-1">Export</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#12315f" />
          </View>
        ) : (
          <ScrollView className="bg-slate-50" contentContainerStyle={{ padding: 10 }}>
            {sortedDates.length === 0 ? (
              <View className="p-10 items-center">
                <Text className="text-slate-400 italic">No attendance records found</Text>
              </View>
            ) : (
              sortedDates.map((date) => (
                <View key={date} className="mb-6">
                  <View className="flex-row items-center mb-2 ml-2">
                    <MaterialIcons name="event" size={16} color="#64748b" />
                    <Text className="text-slate-600 font-bold text-sm ml-2">{date}</Text>
                  </View>
                  <View className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <View className="bg-slate-100 flex-row p-3 border-b border-slate-200">
                      <Text className="flex-1 font-bold text-slate-700 text-[10px] uppercase">Worker Details</Text>
                      <Text className="flex-1 font-bold text-slate-700 text-[10px] uppercase text-center">Project</Text>
                      <Text className="flex-1 font-bold text-slate-700 text-[10px] uppercase text-right">Evidence</Text>
                    </View>

                    {groupedData[date].map((item, index) => (
                      <View key={item.id} className={`flex-row p-4 items-center border-b border-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                        <View className="flex-1">
                          <Text className="text-gov-ink font-bold text-sm">{item.worker_name}</Text>
                          <Text className="text-slate-400 text-[9px]">ID: {item.id} • HH: {item.household_id || 'N/A'}</Text>
                          <Text className="text-slate-400 text-[9px]">Aadhaar: {item.aadhaar_number || 'N/A'}</Text>
                        </View>
                        <View className="flex-1 px-2">
                          <Text className="text-slate-600 text-[11px] text-center">{item.project_name}</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-slate-500 text-[10px] text-right font-bold">
                            {new Date(item.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Text>
                          <Text className="text-gov-green text-[8px] text-right">
                            {item.location_name || `${parseFloat(item.latitude).toFixed(4)}, ${parseFloat(item.longitude).toFixed(4)}`}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </View>
    </MobileFrame>
  );
}
