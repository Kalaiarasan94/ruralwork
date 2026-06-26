import React, { useState, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Image, Text } from 'react-native';

const bannerImages = [
  require('../../assets/gov-banner.png'),
  require('../../assets/banner_rural_1.jpg'),
  require('../../assets/banner_rural_2.jfif'),
];

export default function BannerSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={bannerImages[currentIndex]}
        style={[styles.image, { opacity: fadeAnim }]}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text className="text-white font-extrabold text-2xl text-center shadow-lg">Empowering Rural India</Text>
        <Text className="text-white/90 text-sm mt-2 text-center font-medium">Transparency in Governance & Asset Management</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 224,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
