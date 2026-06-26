import React, { useState, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const images = [
  require('../../assets/gov-banner.png'),
  require('../../assets/banner_rural_1.jpg'),
  require('../../assets/banner_rural_2.jfif'),
];

export default function BackgroundSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      // Transition
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.8,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ]).start(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        slideAnim.setValue(0);
      });
    }, 6000);

    return () => clearInterval(timer);
  }, [slideAnim, fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={images[currentIndex]}
        style={[
          styles.image,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }, { scale: 1.1 }],
          },
        ]}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  image: {
    width: '110%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 49, 95, 0.45)', // Gov navy overlay
  },
});
