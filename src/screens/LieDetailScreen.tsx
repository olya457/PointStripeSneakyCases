import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppContext } from '../context/AppContext';
import { lieCases } from '../data/gameData';
import type { RootStackParamList } from '../navigation/MainNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'LieDetail'>;

export function LieDetailScreen({ navigation, route }: Props) {
  const item = useMemo(() => lieCases.find(entry => entry.id === route.params.caseId)!, [route.params.caseId]);
  const insets = useSafeAreaInsets();
  const { setLieSolved } = useAppContext();
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const expected = item.suspects.filter(s => !s.truthful).map(s => s.code);
  const correct = selected.length === expected.length && selected.every(code => expected.includes(code));

  const toggle = (code: string) => setSelected(prev => (prev.includes(code) ? prev.filter(entry => entry !== code) : [...prev, code]));

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 90 }}>
      <Pressable style={styles.back} onPress={() => navigation.goBack()}><Text style={styles.backText}>‹ Back</Text></Pressable>
      <View style={styles.row}>
        <Text style={[styles.label, item.difficulty === 'Easy' && styles.labelEasy, item.difficulty === 'Hard' && styles.labelHard]}>{item.difficulty.toUpperCase()}</Text>
        <Text style={styles.labelMuted}>{item.liarCount}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.box}><Text style={styles.summary}>{item.summary.replace(' · Open', '')}</Text></View>
      <Text style={styles.section}>KNOWN EVIDENCE</Text>
      {item.evidence.map(entry => <View key={entry} style={styles.fact}><Text style={styles.factArrow}>›</Text><Text style={styles.factText}>{entry}</Text></View>)}
      <Text style={styles.sectionAlt}>WHO IS LYING?</Text>
      <Text style={styles.hint}>Tap the character whose statement breaks against the facts.</Text>
      {item.suspects.map(suspect => {
        const chosen = selected.includes(suspect.code);
        const showGood = submitted && !suspect.truthful;
        const showBad = submitted && chosen && suspect.truthful;
        return (
          <Pressable key={suspect.code} style={[styles.suspectCard, chosen && styles.suspectCardSelected, showGood && styles.suspectCardGood, showBad && styles.suspectCardBad]} onPress={() => toggle(suspect.code)}>
            <View style={styles.code}><Text style={styles.codeText}>{suspect.code}</Text></View>
            <View style={{ flex: 1 }}>
              <View style={styles.suspectTop}>
                <View><Text style={styles.suspectName}>{suspect.name}</Text><Text style={styles.suspectRole}>{suspect.role}</Text></View>
                {submitted ? <Text style={[styles.truthTag, suspect.truthful ? styles.truthTagGood : styles.truthTagBad]}>{suspect.truthful ? 'TRUTH' : 'LIAR'}</Text> : null}
              </View>
              <Text style={styles.statement}>{`"${suspect.statement}"`}</Text>
            </View>
          </Pressable>
        );
      })}
      {submitted ? <View style={[styles.result, correct ? styles.resultGood : styles.resultBad]}><Text style={[styles.resultTitle, correct ? styles.resultTextGood : styles.resultTextBad]}>{correct ? '✓ Correct Accusation!' : '✕ Wrong Suspect'}</Text><Text style={styles.resultBody}>{item.explanation}</Text><Pressable style={styles.doneButton} onPress={() => { if (correct) setLieSolved(item.id); navigation.goBack(); }}><Text style={styles.doneButtonText}>Back to Cases</Text></Pressable></View> : <Pressable style={[styles.accuseButton, selected.length === 0 && styles.accuseButtonDisabled]} disabled={selected.length === 0} onPress={() => setSubmitted(true)}><Text style={styles.accuseButtonText}>Accuse Suspect</Text></Pressable>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({container:{flex:1,backgroundColor:'#dff6ff',paddingHorizontal:22},back:{alignSelf:'flex-start',backgroundColor:'#b9e8fb',paddingHorizontal:14,paddingVertical:10,borderRadius:18,marginBottom:14},backText:{color:'#12324a',fontWeight:'700'},row:{flexDirection:'row',gap:10,marginBottom:12},label:{backgroundColor:'#ffc21c',color:'#29273a',paddingHorizontal:10,paddingVertical:6,borderRadius:10,fontSize:12,fontWeight:'800'},labelEasy:{backgroundColor:'#4ed57b',color:'#18311f'},labelHard:{backgroundColor:'#ff5335',color:'#fff'},labelMuted:{backgroundColor:'rgba(15,135,184,0.12)',color:'#12324a',paddingHorizontal:10,paddingVertical:6,borderRadius:10,fontSize:12,fontWeight:'800'},title:{color:'#12324a',fontSize:26,fontWeight:'900',marginBottom:14},box:{backgroundColor:'#eefaff',borderRadius:22,padding:16,marginBottom:18},summary:{color:'#12324a',fontSize:16,lineHeight:30},section:{color:'#169175',fontSize:12,letterSpacing:3,fontWeight:'800',marginBottom:12},sectionAlt:{color:'#d98532',fontSize:12,letterSpacing:3,fontWeight:'800',marginBottom:10,marginTop:6},hint:{color:'rgba(28,74,103,0.68)',marginBottom:14},fact:{flexDirection:'row',backgroundColor:'#eefaff',borderRadius:16,padding:14,borderLeftWidth:3,borderLeftColor:'#44dc82',marginBottom:12},factArrow:{color:'#44dc82',marginRight:10,fontSize:18},factText:{flex:1,color:'#12324a',fontSize:15,lineHeight:26},suspectCard:{flexDirection:'row',backgroundColor:'#eefaff',borderRadius:18,padding:14,borderWidth:1,borderColor:'rgba(18,86,122,0.08)',marginBottom:14},suspectCardSelected:{borderColor:'#ffc21c'},suspectCardGood:{borderColor:'#ff5335',backgroundColor:'#fff1ef'},suspectCardBad:{borderColor:'#39d07b',backgroundColor:'#eefaff'},code:{width:42,height:42,borderRadius:12,backgroundColor:'#b9e8fb',alignItems:'center',justifyContent:'center',marginRight:12},codeText:{color:'#12324a',fontWeight:'900'},suspectTop:{flexDirection:'row',justifyContent:'space-between',marginBottom:8},suspectName:{color:'#12324a',fontSize:18,fontWeight:'800'},suspectRole:{color:'rgba(28,74,103,0.56)',fontSize:13},truthTag:{fontSize:12,fontWeight:'900'},truthTagGood:{color:'#169175'},truthTagBad:{color:'#d96a58'},statement:{color:'#12324a',fontSize:16,lineHeight:28},accuseButton:{height:56,borderRadius:18,backgroundColor:'#ffc21c',alignItems:'center',justifyContent:'center'},accuseButtonDisabled:{opacity:0.45},accuseButtonText:{color:'#1e2236',fontSize:18,fontWeight:'800'},result:{borderRadius:22,padding:18,borderWidth:1,marginTop:4},resultGood:{backgroundColor:'#eefaff',borderColor:'rgba(57,208,123,0.35)'},resultBad:{backgroundColor:'#fff1ef',borderColor:'rgba(255,83,53,0.28)'},resultTitle:{fontSize:20,fontWeight:'900',marginBottom:12},resultTextGood:{color:'#169175'},resultTextBad:{color:'#d96a58'},resultBody:{color:'#12324a',fontSize:16,lineHeight:30,marginBottom:18},doneButton:{height:50,borderRadius:16,borderWidth:1,borderColor:'rgba(15,135,184,0.2)',alignItems:'center',justifyContent:'center'},doneButtonText:{color:'#12324a',fontSize:17,fontWeight:'800'}});
