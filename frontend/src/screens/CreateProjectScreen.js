import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import * as Location from 'expo-location';
import MobileFrame from '../components/MobileFrame';
import InputField from '../components/InputField';
import Button from '../components/Button';

export default function CreateProjectScreen() {
  const [projectName, setProjectName] = useState('');
  const [villageId, setVillageId] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const handleGetLocation = async () => {
    setLoadingLocation(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      const msg = 'GPS permission is required for asset geo-tagging.';
      if (Platform.OS === 'web') {
        alert(msg);
      } else {
        Alert.alert('Permission Denied', msg);
      }
      setLoadingLocation(false);
      return;
    }
    let currentPosition = await Location.getCurrentPositionAsync({});
    setLocation(currentPosition.coords);
    setLoadingLocation(false);
  };

  const handleSave = () => {
    const msg = 'Asset entry linked successfully.';
    if (Platform.OS === 'web') {
      alert(msg);
    } else {
      Alert.alert('Saved', msg);
    }
  };

  return (
    <MobileFrame>
      <ScrollView className="bg-slate-50" contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        <View className="mb-6">
          <Text className="text-gov-green text-[10px] font-bold uppercase tracking-[2px]">Asset Configuration</Text>
          <Text className="text-gov-ink text-2xl font-bold">New Project Entry</Text>
        </View>

        <View className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <InputField label="Project Reference Name" value={projectName} onChangeText={setProjectName} placeholder="e.g., Ward-3 Canal Drainage" />
          <InputField label="Target Village Key ID" value={villageId} onChangeText={setVillageId} placeholder="e.g., 102" keyboardType="numeric" />
          <InputField label="Allocated Budget (INR)" value={budget} onChangeText={setBudget} placeholder="e.g., 750000" keyboardType="numeric" />

          <Text className="mb-3 mt-2 text-[10px] font-bold uppercase tracking-[2px] text-slate-400 ml-1">Geo-Tagging Evidence</Text>
          {loadingLocation ? (
            <ActivityIndicator size="small" color="#15803d" style={{ marginVertical: 12 }} />
          ) : location ? (
            <View className="mb-5 rounded-2xl bg-green-50/50 p-4 border border-green-100 items-center">
              <Text className="font-mono text-xs font-bold text-green-700">
                LAT: {location.latitude.toFixed(6)} | LONG: {location.longitude.toFixed(6)}
              </Text>
            </View>
          ) : (
            <View className="mb-5 rounded-2xl bg-red-50/50 p-4 border border-red-100 items-center">
              <Text className="text-xs font-bold text-red-600">GPS Coordinates Required</Text>
            </View>
          )}

          <Button title="Capture GPS Coordinate" onPress={handleGetLocation} color="#475569" icon="my-location" />
          <View className="mt-2">
            <Button title="Authorize Asset Link" onPress={handleSave} color="#15803d" icon="save" />
          </View>
        </View>
      </ScrollView>
    </MobileFrame>
  );
}
