import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import type { RootStackParamList } from '../navigation/MainNavigator';

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { bestClueCatchScore, currentClueCatchScore, storyProgress, lieProgress, evidenceProgress } = useAppContext();
  const solvedCases = Object.values(storyProgress).filter(value => value === 'solved').length;
  const lieWins = Object.values(lieProgress).filter(Boolean).length;
  const evidenceBoards = Object.values(evidenceProgress).filter(Boolean).length;
  const totalStoryCases = Object.keys(storyProgress).length;
  const totalLieCases = Object.keys(lieProgress).length;
  const totalEvidenceCases = Object.keys(evidenceProgress).length;
  const overallCompleted = solvedCases + lieWins + evidenceBoards;
  const overallTotal = totalStoryCases + totalLieCases + totalEvidenceCases;
  const completionPercent = overallTotal ? Math.round((overallCompleted / overallTotal) * 100) : 0;
  const correctDeductions = totalStoryCases + totalLieCases ? Math.round(((solvedCases + lieWins) / (totalStoryCases + totalLieCases)) * 100) : 0;
  const openTab = (screen: 'Cases' | 'LieDetector' | 'Evidence' | 'ClueCatch' | 'Profile') => navigation.navigate('Tabs', { screen });
  const bottomSpace = insets.bottom + (height < 760 ? 150 : 170);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: bottomSpace }}>
      <View style={styles.header}>
        <Image source={require('../assets/app-logo.png')} style={styles.avatar} />
        <View>
          <Text style={styles.name}>Detective Ray</Text>
          <Text style={styles.rank}>SHARP OBSERVER · LVL 7</Text>
        </View>
      </View>

      <Pressable style={styles.progressCard} onPress={() => openTab('Cases')}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Next: Master Sleuth</Text>
          <Text style={styles.progressLabel}>{completionPercent}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${completionPercent}%` }]} />
        </View>
        <Text style={styles.progressNote}>Overall completion · {completionPercent}% of all case files closed</Text>
      </Pressable>

      <View style={styles.grid}>
        <Pressable style={[styles.statCard, styles.gold]} onPress={() => openTab('Cases')}>
          <Text style={styles.goldNumber}>{solvedCases}</Text>
          <Text style={styles.statText}>Cases Solved</Text>
        </Pressable>
        <Pressable style={[styles.statCard, styles.green]} onPress={() => openTab('Cases')}>
          <Text style={styles.greenNumber}>{correctDeductions}%</Text>
          <Text style={styles.statText}>Correct Deductions</Text>
        </Pressable>
        <Pressable style={[styles.statCard, styles.pink]} onPress={() => openTab('LieDetector')}>
          <Text style={styles.pinkNumber}>{lieWins}</Text>
          <Text style={styles.statText}>Lie Detector Wins</Text>
        </Pressable>
        <Pressable style={[styles.statCard, styles.blue]} onPress={() => openTab('Evidence')}>
          <Text style={styles.blueNumber}>{evidenceBoards}</Text>
          <Text style={styles.statText}>Evidence Boards</Text>
        </Pressable>
        <Pressable style={[styles.statCard, styles.gold]} onPress={() => openTab('ClueCatch')}>
          <Text style={styles.goldNumber}>{bestClueCatchScore.toLocaleString()}</Text>
          <Text style={styles.statText}>Best Clue Catch</Text>
        </Pressable>
        <View style={[styles.statCard, styles.blue]}>
          <Text style={styles.blueNumber}>Lv.7</Text>
          <Text style={styles.statText}>Sharp Observer</Text>
        </View>
      </View>

      <Text style={styles.section}>RECENT ACTIVITY</Text>
      <Pressable style={styles.activityCard} onPress={() => openTab('Cases')}>
        <Text style={styles.activityTitle}>Solved story cases</Text>
        <Text style={styles.activityMeta}>{solvedCases} of {totalStoryCases}</Text>
      </Pressable>
      <Pressable style={styles.activityCard} onPress={() => openTab('LieDetector')}>
        <Text style={styles.activityTitle}>Lie Detector progress</Text>
        <Text style={styles.activityMeta}>{lieWins} of {totalLieCases}</Text>
      </Pressable>
      <Pressable style={styles.activityCard} onPress={() => openTab('ClueCatch')}>
        <Text style={styles.activityTitle}>{currentClueCatchScore > 0 ? 'Latest Clue Catch score' : 'Best Clue Catch score'}</Text>
        <Text style={styles.activityMeta}>{(currentClueCatchScore > 0 ? currentClueCatchScore : bestClueCatchScore).toLocaleString()}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#d2eef9', paddingHorizontal: 22 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 76, height: 76, marginRight: 14 },
  name: { color: '#12324a', fontSize: 22, fontWeight: '900', marginBottom: 6 },
  rank: { color: '#0f87b8', letterSpacing: 3, fontSize: 12 },
  progressCard: { backgroundColor: '#eefaff', borderRadius: 22, padding: 16, marginBottom: 16 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressLabel: { color: '#12324a', fontWeight: '700' },
  progressBar: { height: 10, borderRadius: 999, backgroundColor: 'rgba(18,86,122,0.14)', overflow: 'hidden', marginBottom: 10 },
  progressFill: { height: '100%', backgroundColor: '#ffc21c' },
  progressNote: { color: 'rgba(28,74,103,0.52)', fontSize: 13 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18 },
  statCard: { width: '48.5%', borderRadius: 20, padding: 16, borderWidth: 1 },
  gold: { backgroundColor: '#f7fcff', borderColor: 'rgba(255,194,28,0.26)' },
  green: { backgroundColor: '#eefaff', borderColor: 'rgba(57,208,123,0.26)' },
  pink: { backgroundColor: '#fff1ef', borderColor: 'rgba(255,83,53,0.22)' },
  blue: { backgroundColor: '#eefaff', borderColor: 'rgba(98,168,255,0.22)' },
  goldNumber: { color: '#ffc21c', fontSize: 24, fontWeight: '900', marginBottom: 6 },
  greenNumber: { color: '#169175', fontSize: 24, fontWeight: '900', marginBottom: 6 },
  pinkNumber: { color: '#d96a58', fontSize: 24, fontWeight: '900', marginBottom: 6 },
  blueNumber: { color: '#0f87b8', fontSize: 24, fontWeight: '900', marginBottom: 6 },
  statText: { color: 'rgba(28,74,103,0.7)' },
  section: { color: '#0f87b8', fontSize: 12, letterSpacing: 4, fontWeight: '800', marginBottom: 12 },
  activityCard: { backgroundColor: '#eefaff', borderRadius: 18, padding: 16, marginBottom: 12 },
  activityTitle: { color: '#12324a', fontSize: 16, fontWeight: '700', marginBottom: 6 },
  activityMeta: { color: 'rgba(28,74,103,0.56)' },
});
