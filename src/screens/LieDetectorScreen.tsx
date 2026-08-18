import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { lieCases } from '../data/gameData';
import type { RootStackParamList } from '../navigation/MainNavigator';

export function LieDetectorScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const bottomSpace = insets.bottom + (height < 760 ? 150 : 170);
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: bottomSpace }}>
      <Text style={styles.eyebrow}>LIE DETECTOR</Text>
      <Text style={styles.title}>Who&apos;s telling the truth?</Text>
      <Text style={styles.subtitle}>Read every statement, weigh it against the evidence, and expose the liar.</Text>
      {lieCases.map(item => (
        <Pressable key={item.id} style={styles.card} onPress={() => navigation.navigate('LieDetail', { caseId: item.id })}>
          <View style={[styles.iconWrap, item.difficulty === 'Hard' && styles.iconWrapHard]}><Text style={styles.icon}>⊘</Text></View>
          <View style={{ flex: 1 }}>
            <View style={styles.tagRow}>
              <Text style={[styles.tag, item.difficulty === 'Easy' && styles.tagEasy, item.difficulty === 'Hard' && styles.tagHard]}>{item.difficulty.toUpperCase()}</Text>
              <Text style={styles.tagMute}>{item.liarCount}</Text>
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.summary}</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({container:{flex:1,backgroundColor:'#101f61',paddingHorizontal:22},eyebrow:{color:'#ff6a57',fontSize:12,letterSpacing:4,fontWeight:'800',marginBottom:14},title:{color:'#f4f7ff',fontSize:28,lineHeight:36,fontWeight:'900',marginBottom:12},subtitle:{color:'rgba(232,237,255,0.72)',fontSize:16,lineHeight:28,marginBottom:18},card:{flexDirection:'row',alignItems:'center',backgroundColor:'#203273',borderRadius:22,padding:16,marginBottom:16,borderWidth:1,borderColor:'rgba(255, 98, 87, 0.24)'},iconWrap:{width:56,height:56,borderRadius:16,backgroundColor:'#5a43bf',alignItems:'center',justifyContent:'center',marginRight:14},iconWrapHard:{backgroundColor:'#84312d'},icon:{color:'#fff',fontSize:28,fontWeight:'900'},tagRow:{flexDirection:'row',gap:8,marginBottom:10},tag:{backgroundColor:'#ffc21c',color:'#27253a',paddingHorizontal:10,paddingVertical:5,borderRadius:10,fontSize:12,fontWeight:'800'},tagEasy:{backgroundColor:'#4ed57b',color:'#13301e'},tagHard:{backgroundColor:'#ff5335',color:'#fff'},tagMute:{backgroundColor:'rgba(255,255,255,0.14)',color:'#f1f4ff',paddingHorizontal:10,paddingVertical:5,borderRadius:10,fontSize:12,fontWeight:'700'},cardTitle:{color:'#f2f5ff',fontSize:22,fontWeight:'900',marginBottom:6},cardSubtitle:{color:'rgba(231,236,255,0.68)',fontSize:15},arrow:{color:'#ff9b44',fontSize:28,marginLeft:12}});
