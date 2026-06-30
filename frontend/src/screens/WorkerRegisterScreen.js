import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MobileFrame from '../components/MobileFrame';
import InputField from '../components/InputField';
import Button from '../components/Button';
import SuccessModal from '../components/SuccessModal';
import { API_ENDPOINTS } from '../config/api';

export default function WorkerRegisterScreen() {
  const [workerId, setWorkerId] = useState('');
  const [householdId, setHouseholdId] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleRegister = async () => {
    if (!workerId || !name) {
      if (Platform.OS === 'web') {
        alert('Required: Please enter Worker ID and Name.');
      } else {
        Alert.alert('Required', 'Please enter Worker ID and Name.');
      }
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.REGISTER_WORKER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: workerId,
          name: name,
          household_id: householdId,
          aadhaar_number: aadhaarNumber,
          mobile_number: mobileNumber
        }),
      });
      const result = await response.json();
      if (result.status === 'success') {
        setModalMessage('Worker enrolled successfully. Approval pending from district administration.');
        setModalVisible(true);
        setWorkerId('');
        setName('');
        setHouseholdId('');
        setAadhaarNumber('');
        setMobileNumber('');
      } else {
        const msg = result.message || 'Enrollment failed';
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
          <Text className="text-gov-blue text-[10px] font-bold uppercase tracking-[2px]">Household Registry</Text>
          <Text className="text-gov-ink text-2xl font-bold">Worker Enrolment</Text>
        </View>

        <View className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <InputField label="Assigned Worker ID" value={workerId} onChangeText={setWorkerId} placeholder="e.g., 401" keyboardType="numeric" />
          <InputField label="Household Family Group ID" value={householdId} onChangeText={setHouseholdId} placeholder="e.g., HH-9021" />
          <InputField label="Full Registered Name" value={name} onChangeText={setName} placeholder="As printed on ID card" />
          <InputField label="12-Digit Aadhaar Number" value={aadhaarNumber} onChangeText={setAadhaarNumber} placeholder="0000 0000 0000" keyboardType="numeric" maxLength={12} />
          <InputField label="Registered Mobile Number" value={mobileNumber} onChangeText={setMobileNumber} placeholder="10-digit mobile number" keyboardType="phone-pad" maxLength={10} />

          <View className="mt-4">
            <Button title={loading ? "Enrolling..." : "Submit for Approval"} onPress={handleRegister} color="#1f5fa8" icon="how-to-reg" />
          </View>
        </View>
        
        <View className="mt-6 flex-row items-center justify-center">
           <MaterialIcons name="verified" size={14} color="#64748b" />
           <Text className="text-slate-400 text-[10px] ml-1 font-bold uppercase tracking-widest">Secure Government Portal</Text>
        </View>

        <SuccessModal 
          visible={modalVisible} 
          message={modalMessage} 
          onClose={() => setModalVisible(false)} 
        />
      </ScrollView>
    </MobileFrame>
  );
}
