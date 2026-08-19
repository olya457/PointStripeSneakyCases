import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { onboardingSlides } from '../data/gameData';

export function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const { setFinishedOnboarding } = useAppContext();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const imageTranslateY = useRef(new Animated.Value(48)).current;
  const imageScale = useRef(new Animated.Value(0.88)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateX = useRef(new Animated.Value(80)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;
  const footerTranslateY = useRef(new Animated.Value(36)).current;

  useEffect(() => {
    imageOpacity.setValue(0);
    imageTranslateY.setValue(48);
    imageScale.setValue(0.88);
    textOpacity.setValue(0);
    textTranslateX.setValue(80);
    footerOpacity.setValue(0);
    footerTranslateY.setValue(36);

    Animated.parallel([
      Animated.parallel([
        Animated.timing(imageOpacity, {
          toValue: 1,
          duration: 520,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(imageTranslateY, {
          toValue: 0,
          duration: 760,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(imageScale, {
          toValue: 1,
          duration: 760,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.delay(130),
        Animated.parallel([
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 520,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(textTranslateX, {
            toValue: 0,
            duration: 700,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.sequence([
        Animated.delay(220),
        Animated.parallel([
          Animated.timing(footerOpacity, {
            toValue: 1,
            duration: 460,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(footerTranslateY, {
            toValue: 0,
            duration: 620,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, [footerOpacity, footerTranslateY, imageOpacity, imageScale, imageTranslateY, index, textOpacity, textTranslateX]);

  const onMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  const scrollToSlide = (nextIndex: number) => {
    listRef.current?.scrollToOffset({
      offset: width * nextIndex,
      animated: true,
    });
    setIndex(nextIndex);
  };

  const next = () => {
    if (index === onboardingSlides.length - 1) {
      setFinishedOnboarding(true);
      return;
    }
    scrollToSlide(index + 1);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.skip} onPress={() => setFinishedOnboarding(true)}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>
      <FlatList
        ref={listRef}
        data={onboardingSlides}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        bounces={false}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, itemIndex) => ({
          length: width,
          offset: width * itemIndex,
          index: itemIndex,
        })}
        onMomentumScrollEnd={onMomentumEnd}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Text style={styles.file}>{item.fileLabel}</Text>
            <Animated.View
              style={{
                width: '100%',
                alignItems: 'center',
                opacity: imageOpacity,
                transform: [{ translateY: imageTranslateY }, { scale: imageScale }],
              }}
            >
              <Image source={item.image} style={styles.image} resizeMode="contain" />
            </Animated.View>
            <Animated.View
              style={{
                opacity: textOpacity,
                transform: [{ translateX: textTranslateX }],
              }}
            >
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </Animated.View>
          </View>
        )}
      />
      <Animated.View
        style={[
          styles.footer,
          {
            opacity: footerOpacity,
            transform: [{ translateY: footerTranslateY }],
          },
        ]}
      >
        <View style={styles.dots}>
          {onboardingSlides.map((item, dotIndex) => (
            <View key={item.id} style={[styles.dot, dotIndex === index && styles.dotActive]} />
          ))}
        </View>
        <View style={styles.actionRow}>
          {index > 0 ? (
            <Pressable
              style={styles.backButton}
              onPress={() => {
                scrollToSlide(index - 1);
              }}
            >
              <Text style={styles.backButtonText}>‹</Text>
            </Pressable>
          ) : null}
          <Pressable style={styles.nextButton} onPress={next}>
            <Text style={styles.nextButtonText}>{index === onboardingSlides.length - 1 ? 'Get Started' : 'Next'}</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d2eef9',
  },
  skip: {
    position: 'absolute',
    top: 74,
    right: 22,
    zIndex: 2,
  },
  skipText: {
    color: 'rgba(18, 50, 74, 0.58)',
    fontSize: 16,
  },
  slide: {
    flex: 1,
    paddingTop: 76,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  file: {
    alignSelf: 'flex-start',
    color: '#0f87b8',
    fontSize: 13,
    letterSpacing: 3.4,
    fontWeight: '800',
  },
  image: {
    width: '88%',
    height: 340,
    marginTop: 14,
    marginBottom: 24,
  },
  title: {
    color: '#12324a',
    fontSize: 30,
    lineHeight: 36,
    textAlign: 'center',
    fontWeight: '900',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  description: {
    color: 'rgba(28, 74, 103, 0.78)',
    fontSize: 15,
    lineHeight: 30,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 58,
    paddingHorizontal: 22,
    paddingBottom: 0,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(18, 86, 122, 0.22)',
  },
  dotActive: {
    width: 22,
    backgroundColor: '#ffc21c',
  },
  actionRow: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(15,135,184,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#12324a',
    fontSize: 28,
    fontWeight: '700',
  },
  nextButton: {
    width: '74%',
    height: 56,
    borderRadius: 18,
    backgroundColor: '#ffc21c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#1c1d2c',
    fontSize: 18,
    fontWeight: '800',
  },
});
