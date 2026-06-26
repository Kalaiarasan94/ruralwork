import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MobileFrame from '../components/MobileFrame';
import InputField from '../components/InputField';
import Button from '../components/Button';
import BackgroundSlideshow from '../components/BackgroundSlideshow';
import { API_ENDPOINTS } from '../config/api';

export default function FieldSupervisorLoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Required: Please enter username and password.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: 'supervisor' }),
      });
      const result = await response.json();
      if (result.status === 'success') {
        navigation.replace('SupervisorPanel');
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (error) {
      alert('Connection error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileFrame>
      <View style={{ flex: 1, minHeight: '100%', position: 'relative' }}>
        <BackgroundSlideshow />
        
        {/* Top Navigation */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 40, justifyContent: 'center', zIndex: 10 }}>
          <View className="items-center mb-10">
            <Text className="text-white font-extrabold text-3xl shadow-lg">VB-G RAM-G</Text>
            <View className="h-[2px] w-12 bg-gov-green mt-2 mb-2" />
            <Text className="text-blue-100 text-xs font-bold uppercase tracking-[3px]">Field Personnel Access</Text>
          </View>

          <View className="bg-white/95 rounded-3xl p-8 shadow-2xl border border-white/30">
            <View className="flex-row items-center mb-8">
              <View className="mr-4 h-14 w-14 items-center justify-center rounded-2xl bg-gov-green shadow-md">
                <MaterialIcons name="engineering" size={30} color="#ffffff" />
              </View>
              <View>
                <Text className="text-gov-green font-bold text-2xl">Field Login</Text>
                <Text className="text-slate-500 text-xs mt-1">Worksite data synchronization</Text>
              </View>
            </View>

            <InputField 
              label="Username" 
              value={username} 
              onChangeText={setUsername} 
              placeholder="Supervisor Username" 
              autoCapitalize="none" 
              icon="person-outline"
            />
            <InputField 
              label="Password" 
              value={password} 
              onChangeText={setPassword} 
              placeholder="••••••••" 
              secureTextEntry 
              icon="lock-outline"
            />

            <View className="mt-6">
              <Button 
                title={loading ? "Verifying..." : "Sync & Start Duty"} 
                onPress={handleLogin} 
                color="#15803d" 
                icon={loading ? "sync" : "gps-fixed"} 
              />
            </View>
          </View>

          <View className="mt-12 items-center">
             <View className="flex-row items-center mb-1">
                <MaterialIcons name="location-on" size={14} color="#fca5a5" />
                <Text className="text-white/80 text-[10px] font-bold uppercase tracking-[4px] ml-1">Geo-Fenced Authentication</Text>
             </View>
            <Text className="text-white/50 text-[10px]">Active GPS required for attendance validation</Text>
          </View>
        </View>
      </View>
    </MobileFrame>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 100,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
