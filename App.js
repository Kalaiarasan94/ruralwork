import React from 'react';
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import AdminLoginScreen from './src/screens/AdminLoginScreen';
import FieldSupervisorLoginScreen from './src/screens/FieldSupervisorLoginScreen';
import AdminPanelScreen from './src/screens/AdminPanelScreen';
import SupervisorPanelScreen from './src/screens/SupervisorPanelScreen';
import RegisterSupervisorScreen from './src/screens/RegisterSupervisorScreen';
import WorkerRegisterScreen from './src/screens/WorkerRegisterScreen';
import CreateProjectScreen from './src/screens/CreateProjectScreen';
import AttendanceScreen from './src/screens/AttendanceScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import GrievanceScreen from './src/screens/GrievanceScreen';
import AttendanceRegisterScreen from './src/screens/AttendanceRegisterScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#12315f' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: '700', fontSize: 16 },
          headerTitleAlign: 'center',
          contentStyle: { backgroundColor: '#eef4f8' }
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} options={{ title: 'Admin Secure Login' }} />
        <Stack.Screen name="SupervisorLogin" component={FieldSupervisorLoginScreen} options={{ title: 'Field Supervisor Login' }} />
        <Stack.Screen name="AdminPanel" component={AdminPanelScreen} options={{ title: 'District Admin Panel' }} />
        <Stack.Screen name="RegisterSupervisor" component={RegisterSupervisorScreen} options={{ title: 'Supervisor Registration' }} />
        <Stack.Screen name="SupervisorPanel" component={SupervisorPanelScreen} options={{ title: 'Field Supervisor Console' }} />
        <Stack.Screen name="WorkerRegister" component={WorkerRegisterScreen} options={{ title: 'Worker Enrolment' }} />
        <Stack.Screen name="CreateProject" component={CreateProjectScreen} options={{ title: 'Asset Configuration' }} />
        <Stack.Screen name="Attendance" component={AttendanceScreen} options={{ title: 'Worksite Biometrics' }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'MIS Analytics Monitor' }} />
        <Stack.Screen name="Grievance" component={GrievanceScreen} options={{ title: 'Social Audit Logging' }} />
        <Stack.Screen name="AttendanceRegister" component={AttendanceRegisterScreen} options={{ title: 'Attendance Register' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
