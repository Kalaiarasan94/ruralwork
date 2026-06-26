import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Alert, ActivityIndicator, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import MobileFrame from '../components/MobileFrame';
import InputField from '../components/InputField';
import Button from '../components/Button';
import SuccessModal from '../components/SuccessModal';
import { API_ENDPOINTS } from '../config/api';

export default function AttendanceScreen() {
  const [workerId, setWorkerId] = useState('');
  const [workerName, setWorkerName] = useState('');
  const [workerInitial, setWorkerInitial] = useState('');
  const [projectId, setProjectId] = useState('');
  const [capturedWorkers, setCapturedWorkers] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  
  const resetForm = () => {
    setCapturedWorkers([]);
    setCapturedImage(null);
    setLocation(null);
    setProjectId('');
    setWorkerId('');
    setWorkerName('');
    setWorkerInitial('');
  };

  const handleCapturePhoto = async () => {
    if (cameraRef.current) {
      try {
        setIsCapturing(true);
        
        // Request location permissions
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Permission to access location was denied');
          setIsCapturing(false);
          return;
        }

        // Get current location
        let currentLocation = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = currentLocation.coords;
        
        // Reverse geocode to get area name
        let reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        let areaName = 'Unknown Location';
        if (reverseGeocode.length > 0) {
          const address = reverseGeocode[0];
          areaName = `${address.name || ''} ${address.street || ''}, ${address.city || ''}, ${address.region || ''}`.trim();
          // Clean up commas
          areaName = areaName.replace(/^,|,$/g, '').replace(/,+/g, ',').trim();
        }
        
        setLocation({ latitude, longitude, areaName });

        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          base64: true,
        });
        setCapturedImage(photo.uri);
        setIsCapturing(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to capture photo or location: ' + error.message);
        setIsCapturing(false);
      }
    }
  };

  const handleAddWorker = async () => {
    if (!workerId || !projectId || !workerName) {
      Alert.alert('Required', 'Please enter Worker ID, Name and Project Code.');
      return;
    }

    if (!capturedImage || !location) {
      Alert.alert('Required', 'Please capture a photo with GPS first.');
      return;
    }

    try {
      setIsCapturing(true);
      const response = await fetch(`${API_ENDPOINTS.VERIFY_WORKER}?id=${workerId}`);
      const result = await response.json();

      if (result.status === 'success' && result.exists) {
        const newWorker = {
          id: workerId,
          name: result.data.name, // Use name from DB
          initial: workerInitial,
          projectId: projectId,
          image: capturedImage,
          latitude: location.latitude,
          longitude: location.longitude,
          locationName: location.areaName,
          timestamp: new Date().toLocaleTimeString(),
        };

        setCapturedWorkers([...capturedWorkers, newWorker]);
        setWorkerId(''); // Clear ID for next worker
        setWorkerName(''); // Clear Name for next worker
        setWorkerInitial(''); // Clear Initial for next worker
      } else {
        Alert.alert('Validation Error', `Worker ID ${workerId} is not registered in the system.`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to verify worker ID. Please check your connection.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleRecapture = () => {
    setCapturedImage(null);
    setLocation(null);
  };

  const handleSubmitBatch = async () => {
    if (capturedWorkers.length === 0) {
      Alert.alert('Empty Batch', 'Please capture and add at least one worker.');
      return;
    }

    try {
      setIsCapturing(true); // Reuse loading state for submission
      const response = await fetch(API_ENDPOINTS.SAVE_BATCH_ATTENDANCE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(capturedWorkers),
      });

      const result = await response.json();
      if (result.status === 'success') {
        setModalMessage('Attendance recorded successfully. Total ' + capturedWorkers.length + ' workers registered.');
        setModalVisible(true);
        resetForm();
      } else {
        const msg = result.message || 'Failed to save attendance';
        if (Platform.OS === 'web') {
          alert(msg);
        } else {
          Alert.alert('Error', msg);
        }
      }
    } catch (error) {
      const msg = 'Could not sync with government server: ' + error.message;
      if (Platform.OS === 'web') {
        alert(msg);
      } else {
        Alert.alert('Connection Error', msg);
      }
    } finally {
      setIsCapturing(false);
    }
  };

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 p-5">
        <ActivityIndicator color="#12315f" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <MobileFrame>
        <View className="flex-1 items-center justify-center bg-slate-50 p-8">
          <View className="h-20 w-20 bg-blue-50 rounded-full items-center justify-center mb-6">
            <MaterialIcons name="photo-camera" size={40} color="#1f5fa8" />
          </View>
          <Text className="mb-6 px-4 text-center text-sm font-bold text-gov-ink">Camera access is required for biometric selfie evidence.</Text>
          <Button title="Grant Camera Access" onPress={requestPermission} color="#1f5fa8" icon="lock-open" />
        </View>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      <ScrollView className="bg-slate-50" contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        <View className="mb-6 flex-row justify-between items-center">
          <View>
            <Text className="text-gov-saffron text-[10px] font-bold uppercase tracking-[2px]">Worksite Biometrics</Text>
            <Text className="text-gov-ink text-2xl font-bold">Mark Attendance</Text>
          </View>
          <View className="bg-gov-saffron/10 px-4 py-2 rounded-2xl border border-gov-saffron/20">
            <Text className="text-gov-saffron font-bold text-lg">{capturedWorkers.length}</Text>
            <Text className="text-gov-saffron text-[8px] font-bold uppercase">In Batch</Text>
          </View>
        </View>

        <View className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <InputField label="Project Code" value={projectId} onChangeText={setProjectId} placeholder="e.g., 12" keyboardType="numeric" />
          
          <Text className="mb-3 mt-2 text-[10px] font-bold uppercase tracking-[2px] text-slate-400 ml-1">Live Photo Evidence</Text>
          <View className="mb-4 h-64 w-full overflow-hidden rounded-3xl bg-black shadow-inner relative">
            {!capturedImage ? (
              <CameraView style={{ flex: 1 }} facing="front" ref={cameraRef} />
            ) : (
              <Image source={{ uri: capturedImage }} style={{ flex: 1 }} />
            )}
            {isCapturing && (
              <View className="absolute inset-0 items-center justify-center bg-black/50">
                <ActivityIndicator color="#ffffff" />
              </View>
            )}
          </View>

          {!capturedImage ? (
            <Button title="Capture Photo" onPress={handleCapturePhoto} color="#12315f" icon="camera-alt" />
          ) : (
            <Button title="Recapture Photo" onPress={handleRecapture} color="#475569" icon="refresh" />
          )}

          <View className="mt-6 pt-6 border-t border-slate-100">
            <Text className="mb-4 text-gov-ink font-bold text-sm">Add Workers to this Capture</Text>
            <View className="flex-row gap-2">
              <View className="flex-1">
                <InputField label="Worker Name" value={workerName} onChangeText={setWorkerName} placeholder="Name" />
              </View>
              <View className="w-20">
                <InputField label="Initial" value={workerInitial} onChangeText={setWorkerInitial} placeholder="M" maxLength={2} />
              </View>
            </View>
            <InputField label="Worker ID" value={workerId} onChangeText={setWorkerId} placeholder="Enter ID (e.g., 401)" keyboardType="numeric" />
            <Button title="Add to Batch" onPress={handleAddWorker} color="#d97706" icon="person-add" />
          </View>
          
          {capturedWorkers.length > 0 && (
            <View className="mt-4 pt-4 border-t border-slate-100">
               <Button title={`Submit All (${capturedWorkers.length})`} onPress={handleSubmitBatch} color="#15803d" icon="verified-user" />
            </View>
          )}
        </View>

        {capturedWorkers.length > 0 && (
          <View className="mt-8">
            <Text className="text-gov-ink font-bold text-lg mb-4 ml-1">Captured in this Session</Text>
            {capturedWorkers.map((worker, index) => (
              <View key={index} className="bg-white rounded-2xl p-4 mb-3 flex-row items-center border border-slate-100 shadow-sm">
                <View className="h-10 w-10 rounded-full bg-slate-50 items-center justify-center mr-3">
                  <MaterialIcons name="person" size={20} color="#64748b" />
                </View>
                <View className="flex-1">
                  <Text className="text-gov-ink font-bold text-sm">
                    {worker.name} {worker.initial ? `(${worker.initial})` : ''}
                  </Text>
                  <Text className="text-slate-400 text-[10px]">ID: {worker.id} • Project: {worker.projectId} • {worker.timestamp}</Text>
                </View>
                <TouchableOpacity onPress={() => {
                  const newList = [...capturedWorkers];
                  newList.splice(index, 1);
                  setCapturedWorkers(newList);
                }}>
                  <MaterialIcons name="delete-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            )).reverse()}
          </View>
        )}

        <SuccessModal 
          visible={modalVisible} 
          message={modalMessage} 
          onClose={() => setModalVisible(false)} 
        />
      </ScrollView>
    </MobileFrame>
  );
}
