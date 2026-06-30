import React from 'react';
import { View, SafeAreaView, Platform, StyleSheet } from 'react-native';

export default function MobileFrame({ children }) {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webWrapper}>
        <View style={{ flex: 1, width: '100%', maxWidth: 500, alignSelf: 'center', backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 }}>
          {children}
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gov-mist">
      <View className="flex-1">{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    minHeight: '100vh',
    backgroundColor: '#f1f5f9', // bg-gov-mist equivalent
  }
});
