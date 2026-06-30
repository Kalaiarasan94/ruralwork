import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, Platform, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MobileFrame from '../components/MobileFrame';
import InputField from '../components/InputField';
import Button from '../components/Button';
import GrievanceCard from '../components/GrievanceCard';
import { API_ENDPOINTS } from '../config/api';

export default function GrievanceScreen() {
  const [complainantName, setComplainantName] = useState('');
  const [complaintText, setComplaintText] = useState('');
  const [loading, setLoading] = useState(false);
  const [grievances, setGrievances] = useState([]);

  const fetchGrievances = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_GRIEVANCES);
      const result = await response.json();
      if (result.status === 'success') {
        setGrievances(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch grievances:', error);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleSubmit = async () => {
    if (!complainantName || !complaintText) {
      const msg = 'Please enter name and grievance details.';
      if (Platform.OS === 'web') {
        alert(msg);
      } else {
        Alert.alert('Required', msg);
      }
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.LODGE_GRIEVANCE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complainant_name: complainantName,
          complaint_text: complaintText,
        }),
      });
      const result = await response.json();
      if (result.status === 'success') {
        const msg = 'Grievance submitted successfully.';
        if (Platform.OS === 'web') {
          alert(msg);
        } else {
          Alert.alert('Success', msg);
        }
        setComplainantName('');
        setComplaintText('');
        fetchGrievances();
      } else {
        const msg = result.message || 'Submission failed';
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
      <FlatList
        className="bg-slate-50"
        data={grievances}
        keyExtractor={(item) => item.complaint_id.toString()}
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        ListHeaderComponent={
          <View>
            <View className="mb-6">
              <Text className="text-red-600 text-[10px] font-bold uppercase tracking-[2px]">Social Audit Registry</Text>
              <Text className="text-gov-ink text-2xl font-bold">Public Accountability</Text>
            </View>

            <View className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
               <Text className="text-gov-ink font-bold text-base mb-4">File Official Grievance</Text>
               <InputField label="Complainant Full Identity" value={complainantName} onChangeText={setComplainantName} placeholder="Enter full name as per ID" />
               <InputField label="Grievance / Complaint Details" value={complaintText} onChangeText={setComplaintText} placeholder="Describe the issue in detail" multiline />
               {loading ? (
                 <ActivityIndicator size="small" color="#b91c1c" style={{ marginVertical: 10 }} />
               ) : (
                 <Button title="Submit Grievance" onPress={handleSubmit} color="#b91c1c" icon="gavel" />
               )}
            </View>

            <View className="flex-row items-center mb-4 ml-1">
               <MaterialIcons name="history" size={18} color="#64748b" />
               <Text className="text-gov-ink font-bold text-base ml-2">Recent Records</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => <GrievanceCard name={item.complainant_name} text={item.complaint_text} status={item.status} date={item.created_at} />}
      />
    </MobileFrame>
  );
}
