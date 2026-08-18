import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { storyCases } from '../data/gameData';
import type { RootStackParamList } from '../navigation/MainNavigator';

export function CasesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { storyProgress } = useAppContext();
  const [tab, setTab] = useState<'sneaky' | 'mine'>('sneaky');
  const [currentIndex, setCurrentIndex] = useState(0);
  const bottomSpace = insets.bottom + (height < 760 ? 188 : 208);

  const currentCase = storyCases[currentIndex];
  const solvedCases = useMemo(() => storyCases.filter(item => storyProgress[item.id] === 'solved'), [storyProgress]);
  const progressCases = useMemo(() => storyCases.filter(item => storyProgress[item.id] === 'inProgress'), [storyProgress]);
  const goPrev = () => setCurrentIndex(prev => (prev === 0 ? storyCases.length - 1 : prev - 1));
  const goNext = () => setCurrentIndex(prev => (prev === storyCases.length - 1 ? 0 : prev + 1));

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + 14, paddingBottom: bottomSpace }}>
      <View style={styles.header}>
        <Image source={require('../assets/app-logo.png')} style={styles.headerIcon} />
        <View>
          <Text style={styles.headerBrand}>SNEAKY CASES</Text>
          <Text style={styles.headerTitle}>Case Database</Text>
        </View>
      </View>

      <View style={styles.switch}>
        <Pressable style={[styles.switchItem, tab === 'sneaky' && styles.switchActive]} onPress={() => setTab('sneaky')}>
          <Text style={[styles.switchText, tab === 'sneaky' && styles.switchTextActive]}>Sneaky Cases</Text>
        </Pressable>
        <Pressable style={[styles.switchItem, tab === 'mine' && styles.switchActive]} onPress={() => setTab('mine')}>
          <Text style={[styles.switchText, tab === 'mine' && styles.switchTextActive]}>My Cases</Text>
        </Pressable>
      </View>

      {tab === 'sneaky' ? (
        <>
          <View style={styles.caseCard}>
            <View style={styles.badgeRow}>
              <Text style={styles.caseBadge}>CASE {currentCase.number}</Text>
              <Pressable style={styles.shareButton}>
                <Text style={styles.shareButtonText}>⤴</Text>
              </Pressable>
            </View>
            <Image source={currentCase.image} style={styles.caseImage} resizeMode="contain" />
            <Text style={styles.difficulty}>{currentCase.difficulty}</Text>
            <Text style={styles.caseTitle}>{currentCase.title}</Text>
            <Text style={styles.caseSummary}>{currentCase.summary}</Text>
            <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('CaseDetail', { caseId: currentCase.id })}>
              <Text style={styles.primaryButtonText}>Investigate →</Text>
            </Pressable>
          </View>

          <View style={styles.carouselRow}>
            <Pressable style={styles.arrow} onPress={goPrev}><Text style={styles.arrowText}>‹</Text></Pressable>
            <View style={styles.pageDots}>
              {storyCases.map((item, index) => <Pressable key={item.id} onPress={() => setCurrentIndex(index)} style={[styles.pageDot, index === currentIndex && styles.pageDotActive]} />)}
            </View>
            <Pressable style={styles.arrow} onPress={goNext}><Text style={styles.arrowText}>›</Text></Pressable>
          </View>
        </>
      ) : (
        <View>
          <Text style={styles.sectionLabel}>SOLVED CASES · {solvedCases.length}</Text>
          {solvedCases.map(item => (
            <Pressable key={item.id} style={styles.recordCard} onPress={() => navigation.navigate('CaseDetail', { caseId: item.id })}>
              <Image source={item.image} style={styles.recordIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.recordTitle}>{item.title}</Text>
                <Text style={styles.recordSubtitle}>CASE {item.number} · Closed</Text>
              </View>
              <Text style={styles.recordCheck}>✓</Text>
            </Pressable>
          ))}

          <Text style={[styles.sectionLabel, { color: '#ffc21c', marginTop: 22 }]}>STILL THINKING · {progressCases.length}</Text>
          {progressCases.length ? progressCases.map(item => (
            <Pressable key={item.id} style={[styles.recordCard, styles.recordCardWarn]} onPress={() => navigation.navigate('CaseDetail', { caseId: item.id })}>
              <Image source={item.image} style={styles.recordIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.recordTitle}>{item.title}</Text>
                <Text style={styles.recordSubtitle}>CASE {item.number} · In progress</Text>
              </View>
              <Text style={styles.recordWarn}>Reopen ›</Text>
            </Pressable>
          )) : (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>📂</Text>
              <Text style={styles.emptyTitle}>No case files yet</Text>
              <Text style={styles.emptyText}>Open a case from Sneaky Cases to start your record.</Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({container:{flex:1,backgroundColor:'#101f61'},header:{flexDirection:'row',alignItems:'center',paddingHorizontal:22,marginBottom:18},headerIcon:{width:44,height:44,marginRight:12},headerBrand:{color:'#ffc21c',fontSize:11,letterSpacing:3,fontWeight:'800'},headerTitle:{color:'#f3f6ff',fontSize:18,fontWeight:'900'},switch:{flexDirection:'row',marginHorizontal:22,backgroundColor:'#203273',borderRadius:18,padding:4,marginBottom:22},switchItem:{flex:1,height:40,borderRadius:14,alignItems:'center',justifyContent:'center'},switchActive:{backgroundColor:'#ffc21c'},switchText:{color:'rgba(230,235,255,0.68)',fontSize:16,fontWeight:'700'},switchTextActive:{color:'#20253b'},caseCard:{marginHorizontal:22,borderRadius:28,padding:18,backgroundColor:'#243b8e',borderWidth:1,borderColor:'rgba(255,255,255,0.08)'},badgeRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},caseBadge:{color:'#f3f6ff',backgroundColor:'#162863',paddingHorizontal:12,paddingVertical:8,borderRadius:12,fontSize:12,letterSpacing:2,fontWeight:'800'},shareButton:{width:32,height:32,borderRadius:12,backgroundColor:'#162863',alignItems:'center',justifyContent:'center'},shareButtonText:{color:'#eef2ff'},caseImage:{width:'100%',height:220,marginTop:8,marginBottom:8},difficulty:{alignSelf:'flex-start',backgroundColor:'#f14c42',color:'#fff',paddingHorizontal:10,paddingVertical:4,borderRadius:10,fontSize:12,fontWeight:'800',marginBottom:10},caseTitle:{color:'#f2f5ff',fontSize:26,fontWeight:'900',marginBottom:8},caseSummary:{color:'rgba(233,238,255,0.8)',fontSize:15,lineHeight:24,marginBottom:18},primaryButton:{height:54,borderRadius:18,backgroundColor:'#ffc21c',alignItems:'center',justifyContent:'center'},primaryButtonText:{color:'#1f2230',fontSize:18,fontWeight:'800'},carouselRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:22,marginTop:20,marginBottom:22,paddingHorizontal:22},arrow:{width:48,height:48,borderRadius:16,backgroundColor:'#172964',alignItems:'center',justifyContent:'center'},arrowText:{color:'#dbe3ff',fontSize:26},pageDots:{flexDirection:'row',gap:6},pageDot:{width:6,height:6,borderRadius:3,backgroundColor:'rgba(255,255,255,0.18)'},pageDotActive:{backgroundColor:'#ffc21c',width:18},sectionLabel:{color:'#39d07b',fontSize:12,letterSpacing:3,paddingHorizontal:22,marginBottom:14,fontWeight:'800'},recordCard:{marginHorizontal:22,borderRadius:20,padding:14,backgroundColor:'#173676',borderWidth:1,borderColor:'rgba(57,208,123,0.35)',flexDirection:'row',alignItems:'center',marginBottom:14},recordCardWarn:{borderColor:'rgba(255,194,28,0.32)'},recordIcon:{width:54,height:54,borderRadius:16,marginRight:14},recordTitle:{color:'#f0f4ff',fontSize:17,fontWeight:'800',marginBottom:4},recordSubtitle:{color:'rgba(232,238,255,0.66)',fontSize:14},recordCheck:{color:'#39d07b',fontSize:22,fontWeight:'900'},recordWarn:{color:'#ffc21c',fontSize:15,fontWeight:'800'},emptyWrap:{alignItems:'center',justifyContent:'center',paddingHorizontal:36,paddingTop:60},emptyIcon:{fontSize:56,marginBottom:12},emptyTitle:{color:'#f1f4ff',fontSize:28,fontWeight:'900',marginBottom:12},emptyText:{color:'rgba(231,237,255,0.68)',fontSize:16,lineHeight:28,textAlign:'center'}});
