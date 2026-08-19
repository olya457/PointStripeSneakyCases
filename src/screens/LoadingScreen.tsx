import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/MainNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Loading'>;

export function LoadingScreen({ navigation }: Props) {
  const progress = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.52)).current;
  const logoTranslateX = useRef(new Animated.Value(48)).current;
  const logoTranslateY = useRef(new Animated.Value(-120)).current;
  const textTranslateX = useRef(new Animated.Value(180)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const brandTranslateX = useRef(new Animated.Value(140)).current;
  const brandOpacity = useRef(new Animated.Value(0)).current;
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const listener = progress.addListener(({ value }) => {
      setPercent(Math.round(value * 100));
    });

    Animated.parallel([
      Animated.timing(progress, {
        toValue: 1,
        duration: 4000,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.parallel([
          Animated.timing(logoRotate, {
            toValue: 1,
            duration: 1700,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(logoScale, {
            toValue: 1,
            duration: 1500,
            easing: Easing.out(Easing.back(1.5)),
            useNativeDriver: true,
          }),
          Animated.timing(logoTranslateX, {
            toValue: 0,
            duration: 1500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(logoTranslateY, {
            toValue: 0,
            duration: 1500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.loop(
          Animated.sequence([
            Animated.timing(logoScale, { toValue: 1.03, duration: 900, useNativeDriver: true }),
            Animated.timing(logoScale, { toValue: 1, duration: 900, useNativeDriver: true }),
          ]),
        ),
      ]),
      Animated.sequence([
        Animated.delay(450),
        Animated.parallel([
          Animated.timing(brandTranslateX, {
            toValue: 0,
            duration: 900,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(brandOpacity, {
            toValue: 1,
            duration: 700,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.sequence([
        Animated.delay(620),
        Animated.parallel([
          Animated.timing(textTranslateX, {
            toValue: 0,
            duration: 1000,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();

    const timer = setTimeout(() => navigation.replace('Onboarding'), 4000);
    return () => {
      progress.removeListener(listener);
      clearTimeout(timer);
    };
  }, [brandOpacity, brandTranslateX, logoRotate, logoScale, logoTranslateX, logoTranslateY, navigation, progress, textOpacity, textTranslateX]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 280],
  });

  const spin = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-240deg', '0deg'],
  });

  return (
    <ImageBackground source={require('../assets/loading-background.png')} style={styles.container} resizeMode="cover">
      <View style={styles.overlay} />
      <Animated.View
        style={[
          styles.logoWrap,
          {
            transform: [
              { translateX: logoTranslateX },
              { translateY: logoTranslateY },
              { rotate: spin },
              { scale: logoScale },
            ],
          },
        ]}
      >
        <Image source={require('../assets/app-logo.png')} style={styles.logo} resizeMode="contain" />
      </Animated.View>
      <Animated.Text
        style={[
          styles.brand,
          {
            opacity: brandOpacity,
            transform: [{ translateX: brandTranslateX }],
          },
        ]}
      >
        POINT STRIPE
      </Animated.Text>
      <Animated.Text
        style={[
          styles.title,
          {
            opacity: textOpacity,
            transform: [{ translateX: textTranslateX }],
          },
        ]}
      >
        CASE WHISPER
      </Animated.Text>
      <View style={styles.bar}>
        <Animated.View style={[styles.fill, { width }]} />
      </View>
      <View style={styles.row}>
        <Text style={styles.caption}>DUSTING FOR PRINTS…</Text>
        <Text style={styles.caption}>{percent}%</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(204, 236, 255, 0.48)',
  },
  logoWrap: {
    marginBottom: 26,
  },
  logo: {
    width: 194,
    height: 194,
  },
  brand: {
    color: '#0f6e95',
    fontSize: 13,
    letterSpacing: 5,
    marginBottom: 16,
    fontWeight: '700',
  },
  title: {
    color: '#12324a',
    fontSize: 42,
    lineHeight: 46,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 46,
  },
  bar: {
    width: 280,
    height: 8,
    backgroundColor: 'rgba(18, 86, 122, 0.14)',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 14,
  },
  fill: {
    height: '100%',
    backgroundColor: '#ffc21c',
    borderRadius: 999,
  },
  row: {
    width: 280,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  caption: {
    color: 'rgba(18, 50, 74, 0.72)',
    fontSize: 12,
    letterSpacing: 2,
  },
});
