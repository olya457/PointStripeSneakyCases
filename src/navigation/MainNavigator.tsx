import React from 'react';
import { NavigationContainer, type NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppContext } from '../context/AppContext';
import { LoadingScreen } from '../screens/LoadingScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { TabNavigator, type TabParamList } from './TabNavigator';
import { CaseDetailScreen } from '../screens/CaseDetailScreen';
import { LieDetailScreen } from '../screens/LieDetailScreen';
import { EvidenceDetailScreen } from '../screens/EvidenceDetailScreen';
import { ClueCatchGameScreen } from '../screens/ClueCatchGameScreen';
import { ClueCatchResultScreen } from '../screens/ClueCatchResultScreen';

export type RootStackParamList = {
  Loading: undefined;
  Onboarding: undefined;
  Tabs: NavigatorScreenParams<TabParamList>;
  CaseDetail: { caseId: string };
  LieDetail: { caseId: string };
  EvidenceDetail: { caseId: string };
  ClueCatchGame: undefined;
  ClueCatchResult: { score: number; mistakes: number; evidence: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function MainNavigator() {
  const { finishedOnboarding } = useAppContext();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {!finishedOnboarding ? (
          <>
            <Stack.Screen name="Loading" component={LoadingScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          </>
        ) : null}
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="CaseDetail" component={CaseDetailScreen} />
        <Stack.Screen name="LieDetail" component={LieDetailScreen} />
        <Stack.Screen name="EvidenceDetail" component={EvidenceDetailScreen} />
        <Stack.Screen name="ClueCatchGame" component={ClueCatchGameScreen} />
        <Stack.Screen name="ClueCatchResult" component={ClueCatchResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
