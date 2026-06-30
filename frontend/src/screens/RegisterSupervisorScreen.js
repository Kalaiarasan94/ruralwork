import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MobileFrame from '../components/MobileFrame';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { API_ENDPOINTS } from '../config/api';

export default function RegisterSupervisorScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [worksiteId, setWorksiteId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !password || !name) {
      const msg = 'Please enter Name, Username and Password.';
      if (Platform.OS === 'web') {
        alert(msg);
      } else {
        Alert.alert('Required', msg);
      }
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.REGISTER_SUPERVISOR, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password, worksite_id: worksiteId }),
      });
      const result = await response.json();
      if (result.status === 'success') {
        const msg = 'Field Supervisor registered successfully.';
        if (Platform.OS === 'web') {
          alert(msg);
          navigation.goBack();
        } else {
          Alert.alert('Success', msg, [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]);
        }
      } else {
        const msg = result.message || 'Registration failed';
        if (Platform.OS === 'web') {
          alert(msg);
        } else {
          Alert.alert('Error', msg);
        }
      }
    } catch (error) {
      const msg = 'Connection failed: ' + error.message;
      if (Platform.OS === 'web') {
        alert(msg);
      } else {
        Alert.alert('Error', msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileFrame>
      <ScrollView className="bg-slate-50" contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        <View className="mb-6">
          <Text className="text-gov-navy text-[10px] font-bold uppercase tracking-[2px]">District Admin Console</Text>
          <Text className="text-gov-ink text-2xl font-bold">Supervisor Registration</Text>
        </View>

        <View className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <InputField 
            label="Full Name of Supervisor" 
            value={name} 
            onChangeText={setName} 
            placeholder="Official Name" 
            icon="person-outline"
          />
          <InputField 
            label="Username (Login ID)" 
            value={username} 
            onChangeText={setUsername} 
            placeholder="supervisor_name" 
            autoCapitalize="none" 
            icon="badge"
          />
          <InputField 
            label="Security Password" 
            value={password} 
            onChangeText={setPassword} 
            placeholder="••••••••" 
            secureTextEntry 
            icon="lock-outline"
          />
          <InputField 
            label="Default Worksite ID (Optional)" 
            value={worksiteId} 
            onChangeText={setWorksiteId} 
            placeholder="e.g., WS-102" 
            icon="location-on"
          />

          <View className="mt-6">
            <Button 
              title={loading ? "Processing..." : "Register Field Personnel"} 
              onPress={handleRegister} 
              color="#12315f" 
              icon="person-add" 
            />
          </View>
        </View>
        
        <View className="mt-8 bg-blue-50 p-4 rounded-2xl border border-blue-100">
           <View className="flex-row items-center mb-1">
              <MaterialIcons name="security" size={16} color="#1e40af" />
              <Text className="text-blue-900 font-bold text-sm ml-2">Security Note</Text>
           </View>
           <Text className="text-blue-800 text-[10px] leading-4">New supervisors will be able to mark attendance and enrol workers immediately after registration.</Text>
        </View>
      </ScrollView>
    </MobileFrame>
  );
}
