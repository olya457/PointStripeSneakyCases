import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { evidenceCases } from '../data/gameData';
import type { RootStackParamList } from '../navigation/MainNavigator';

export function EvidenceBoardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const bottomSpace = insets.bottom + (height < 760 ? 150 : 170);
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: bottomSpace }}>
      <Text style={styles.eyebrow}>EVIDENCE BOARD</Text>
      <Text style={styles.title}>Pin the timeline</Text>
      <Text style={styles.subtitle}>Pick a case file, then sort every clue onto the board to reconstruct what really happened.</Text>
      {evidenceCases.map((item, index) => <Pressable key={item.id} style={[styles.card, index > 0 && styles.cardLocked]} onPress={() => navigation.navigate('EvidenceDetail', { caseId: item.id })}><View style={[styles.cover, index === 0 ? styles.coverOpen : styles.coverLocked]}><Text style={styles.coverEmoji}>{index === 0 ? '⚓' : index === 1 ? '🎨' : '📒'}</Text><Text style={[styles.coverLabel, index === 0 ? styles.coverLabelPlay : styles.coverLabelLock]}>{index === 0 ? 'PLAY' : 'LOCKED'}</Text></View><View style={styles.cardBody}><View style={styles.tags}><Text style={[styles.tag, item.difficulty === 'Medium' ? styles.tagMedium : styles.tagHard]}>{item.difficulty.toUpperCase()}</Text><Text style={styles.tagMuted}>{item.clueCount} CLUES</Text></View><Text style={[styles.cardTitle, index > 0 && styles.cardTitleLocked]}>{item.title}</Text><Text style={[styles.cardSummary, index > 0 && styles.cardTitleLocked]}>{item.summary}</Text></View></Pressable>)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({container:{flex:1,backgroundColor:'#d2eef9',paddingHorizontal:22},eyebrow:{color:'#0f87b8',fontSize:12,letterSpacing:4,fontWeight:'800',marginBottom:14},title:{color:'#12324a',fontSize:28,fontWeight:'900',marginBottom:12},subtitle:{color:'rgba(28,74,103,0.72)',fontSize:16,lineHeight:28,marginBottom:18},card:{backgroundColor:'#eefaff',borderRadius:24,overflow:'hidden',marginBottom:16,borderWidth:1,borderColor:'rgba(255,194,28,0.20)'},cardLocked:{opacity:0.62},cover:{height:98,padding:18,justifyContent:'space-between',flexDirection:'row',alignItems:'flex-start'},coverOpen:{backgroundColor:'#b7f1ff'},coverLocked:{backgroundColor:'#cdeaff'},coverEmoji:{fontSize:34},coverLabel:{paddingHorizontal:12,paddingVertical:6,borderRadius:12,fontSize:12,fontWeight:'900'},coverLabelPlay:{backgroundColor:'#4ed57b',color:'#13331f'},coverLabelLock:{backgroundColor:'rgba(15,135,184,0.12)',color:'#12324a'},cardBody:{padding:18},tags:{flexDirection:'row',gap:8,marginBottom:12},tag:{paddingHorizontal:10,paddingVertical:6,borderRadius:10,fontSize:12,fontWeight:'800'},tagMedium:{backgroundColor:'#ffc21c',color:'#2b2539'},tagHard:{backgroundColor:'#ff5335',color:'#fff'},tagMuted:{backgroundColor:'rgba(15,135,184,0.12)',color:'#12324a',paddingHorizontal:10,paddingVertical:6,borderRadius:10,fontSize:12,fontWeight:'800'},cardTitle:{color:'#12324a',fontSize:24,fontWeight:'900',marginBottom:10},cardSummary:{color:'rgba(28,74,103,0.72)',fontSize:15,lineHeight:24},cardTitleLocked:{color:'rgba(18,50,74,0.52)'}});
