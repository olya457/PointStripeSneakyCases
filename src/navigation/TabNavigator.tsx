import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CasesScreen } from '../screens/CasesScreen';
import { LieDetectorScreen } from '../screens/LieDetectorScreen';
import { EvidenceBoardScreen } from '../screens/EvidenceBoardScreen';
import { ClueCatchIntroScreen } from '../screens/ClueCatchIntroScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

export type TabParamList = {
  Cases: undefined;
  LieDetector: undefined;
  Evidence: undefined;
  ClueCatch: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const icons: Record<keyof TabParamList, string> = {
  Cases: '📁',
  LieDetector: '💬',
  Evidence: '🕵️',
  ClueCatch: '🔎',
  Profile: '🧍',
};

export function TabNavigator() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const compact = height < 760;
  const narrow = width < 390;
  const tabBarHeight = compact ? 68 : 76;
  const bottomOffset = Math.max(insets.bottom + (compact ? 10 : 12), 20);
  const sideOffset = narrow ? 14 : 18;
  const radius = compact ? 24 : 28;
  const iconWrapSize = compact ? 40 : 44;
  const iconSize = compact ? 20 : 22;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [
          styles.tabBar,
          {
            left: sideOffset,
            right: sideOffset,
            bottom: bottomOffset,
            height: tabBarHeight,
            borderRadius: radius,
            paddingTop: compact ? 6 : 8,
            paddingBottom: compact ? 6 : 8,
          },
        ],
        tabBarItemStyle: [styles.tabItem, { paddingVertical: compact ? 4 : 6 }],
        tabBarIcon: ({ focused }) => (
          <AnimatedTabIcon
            icon={icons[route.name as keyof TabParamList]}
            focused={focused}
            size={iconWrapSize}
            iconSize={iconSize}
            compact={compact}
          />
        ),
      })}
    >
      <Tab.Screen name="Cases" component={CasesScreen} />
      <Tab.Screen name="LieDetector" component={LieDetectorScreen} />
      <Tab.Screen name="Evidence" component={EvidenceBoardScreen} />
      <Tab.Screen name="ClueCatch" component={ClueCatchIntroScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AnimatedTabIcon({ icon, focused, size, iconSize, compact }: { icon: string; focused: boolean; size: number; iconSize: number; compact: boolean }) {
  const progress = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(progress, {
        toValue: focused ? 1 : 0,
        friction: focused ? 6 : 8,
        tension: focused ? 120 : 90,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused, progress]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, compact ? -5 : -7],
  });

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, compact ? 1.14 : 1.18],
  });

  const glowScale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  const glowOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const pillScaleX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, compact ? 1.25 : 1.32],
  });

  return (
    <View style={styles.iconScene}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.glow,
          {
            width: compact ? 34 : 38,
            height: compact ? 12 : 14,
            opacity: glowOpacity,
            transform: [{ scaleX: glowScale }, { scaleY: glowScale }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.iconWrap,
          {
            width: size,
            height: size,
            borderRadius: compact ? 14 : 16,
            transform: [{ translateY }, { scaleX: pillScaleX }],
          },
          focused && styles.iconWrapActive,
        ]}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Text style={[styles.icon, { fontSize: iconSize }, focused && styles.iconActive]}>{icon}</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: '#172a6f',
    borderWidth: 1,
    borderColor: 'rgba(255, 194, 28, 0.35)',
    elevation: 0,
  },
  tabItem: {
    justifyContent: 'center',
  },
  iconScene: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    bottom: 2,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 194, 28, 0.38)',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: 'rgba(255, 194, 28, 0.22)',
    shadowColor: '#ffc21c',
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
  },
  icon: {
    opacity: 0.55,
  },
  iconActive: {
    opacity: 1,
  },
});
