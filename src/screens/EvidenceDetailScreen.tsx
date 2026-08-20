import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppContext } from '../context/AppContext';
import { evidenceCases } from '../data/gameData';
import type { RootStackParamList } from '../navigation/MainNavigator';

type BucketKey = 'before' | 'during' | 'after';
type Props = NativeStackScreenProps<RootStackParamList, 'EvidenceDetail'>;

export function EvidenceDetailScreen({ navigation, route }: Props) {
  const item = useMemo(() => evidenceCases.find(entry => entry.id === route.params.caseId)!, [route.params.caseId]);
  const { setEvidenceSolved } = useAppContext();
  const insets = useSafeAreaInsets();
  const allClues = useMemo(() => [...item.before, ...item.during, ...item.after], [item]);
  const [unsorted, setUnsorted] = useState(allClues);
  const [selected, setSelected] = useState<string | null>(null);
  const [before, setBefore] = useState<string[]>([]);
  const [during, setDuring] = useState<string[]>([]);
  const [after, setAfter] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const completedCount = before.length + during.length + after.length;
  const isSolved = before.length === item.before.length && during.length === item.during.length && after.length === item.after.length && before.every(entry => item.before.includes(entry)) && during.every(entry => item.during.includes(entry)) && after.every(entry => item.after.includes(entry));
  const resetBoard = () => {
    setUnsorted(allClues);
    setBefore([]);
    setDuring([]);
    setAfter([]);
    setSelected(null);
    setChecked(false);
  };
  const pin = (bucket: BucketKey) => {
    if (!selected) return;
    setUnsorted(prev => prev.filter(entry => entry !== selected));
    if (bucket === 'before') setBefore(prev => [...prev, selected]);
    if (bucket === 'during') setDuring(prev => [...prev, selected]);
    if (bucket === 'after') setAfter(prev => [...prev, selected]);
    setSelected(null);
    setChecked(false);
  };
  const unpin = (bucket: BucketKey, clue: string) => {
    if (bucket === 'before') setBefore(prev => prev.filter(entry => entry !== clue));
    if (bucket === 'during') setDuring(prev => prev.filter(entry => entry !== clue));
    if (bucket === 'after') setAfter(prev => prev.filter(entry => entry !== clue));
    setUnsorted(prev => [...prev, clue]);
    setSelected(clue);
    setChecked(false);
  };
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 90 }}>
      <Pressable style={styles.back} onPress={() => navigation.goBack()}><Text style={styles.backText}>‹ Back</Text></Pressable>
      <View style={styles.headerRow}><View><Text style={styles.eyebrow}>EVIDENCE BOARD</Text><Text style={styles.title}>{item.title}</Text></View><Pressable style={styles.reset} onPress={resetBoard}><Text style={styles.resetText}>Reset</Text></Pressable></View>
      <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${(completedCount / allClues.length) * 100}%` }]} /></View>
      <Text style={styles.progressText}>{completedCount}/{allClues.length}</Text>
      <View style={styles.introBox}><Text style={styles.introText}>{item.intro}</Text></View>
      <Text style={styles.section}>UNSORTED CLUES · tap a clue to pick it up</Text>
      <View style={styles.unsortedWrap}>{unsorted.length ? unsorted.map(clue => <Pressable key={clue} style={[styles.clue, selected === clue && styles.clueSelected]} onPress={() => setSelected(clue)}><View style={styles.redDot} /><Text style={styles.clueText}>{clue}</Text></Pressable>) : <Text style={styles.emptyText}>All clues pinned. Check your board →</Text>}</View>
      <Pressable style={[styles.bucket, selected && styles.bucketActive]} onPress={() => pin('before')}><Text style={styles.bucketTitle}>BEFORE <Text style={styles.bucketSub}>lead-up</Text></Text>{before.length ? before.map(entry => <Pressable key={entry} style={styles.bucketClue} onPress={() => unpin('before', entry)}><Text style={styles.bucketItem}>✓ {entry}</Text></Pressable>) : <Text style={styles.bucketPlaceholder}>Drop clues here</Text>}</Pressable>
      <Pressable style={[styles.bucket, selected && styles.bucketActive]} onPress={() => pin('during')}><Text style={styles.bucketTitle}>DURING <Text style={styles.bucketSub}>the break-in</Text></Text>{during.length ? during.map(entry => <Pressable key={entry} style={styles.bucketClue} onPress={() => unpin('during', entry)}><Text style={styles.bucketItem}>✓ {entry}</Text></Pressable>) : <Text style={styles.bucketPlaceholder}>Drop clues here</Text>}</Pressable>
      <Pressable style={[styles.bucket, selected && styles.bucketActive]} onPress={() => pin('after')}><Text style={styles.bucketTitle}>AFTER <Text style={styles.bucketSub}>the getaway</Text></Text>{after.length ? after.map(entry => <Pressable key={entry} style={styles.bucketClue} onPress={() => unpin('after', entry)}><Text style={styles.bucketItem}>✓ {entry}</Text></Pressable>) : <Text style={styles.bucketPlaceholder}>Drop clues here</Text>}</Pressable>
      <Pressable style={[styles.checkButton, completedCount !== allClues.length && styles.checkButtonDisabled]} disabled={completedCount !== allClues.length} onPress={() => { setChecked(true); if (isSolved) setEvidenceSolved(item.id); }}><Text style={styles.checkButtonText}>{completedCount !== allClues.length ? `Check Answer (place all ${allClues.length} first)` : checked && !isSolved ? 'Check Again' : 'Check Answer'}</Text></Pressable>
      {checked ? <View style={[styles.result, isSolved ? styles.resultGood : styles.resultBad]}><Text style={[styles.resultTitle, isSolved ? styles.resultTitleGood : styles.resultTitleBad]}>{isSolved ? '✓ Board Solved!' : 'Not quite, detective'}</Text><Text style={styles.resultBody}>{isSolved ? 'The timeline clicks into place. The thief arrived first, forced entry during the break-in, then slipped away leaving the final traces behind.' : 'A few clues are pinned to the wrong moment. Tap a pinned clue to pull it back out, rearrange the board, and check again.'}</Text>{!isSolved ? <Pressable style={styles.retryButton} onPress={resetBoard}><Text style={styles.retryButtonText}>Reset and Try Again</Text></Pressable> : null}</View> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({container:{flex:1,backgroundColor:'#dff6ff',paddingHorizontal:22},back:{alignSelf:'flex-start',backgroundColor:'#b9e8fb',paddingHorizontal:14,paddingVertical:10,borderRadius:18,marginBottom:14},backText:{color:'#12324a',fontWeight:'700'},headerRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:12},eyebrow:{color:'#0f87b8',fontSize:12,letterSpacing:4,fontWeight:'800',marginBottom:8},title:{color:'#12324a',fontSize:26,fontWeight:'900'},reset:{width:68,height:38,borderRadius:18,borderWidth:1,borderColor:'rgba(15,135,184,0.18)',alignItems:'center',justifyContent:'center'},resetText:{color:'#12324a',fontWeight:'700'},progressBar:{height:8,borderRadius:999,backgroundColor:'rgba(18,86,122,0.14)',overflow:'hidden',marginBottom:8},progressFill:{height:'100%',backgroundColor:'#ffc21c'},progressText:{color:'#d39700',alignSelf:'flex-end',marginBottom:14,fontWeight:'800'},introBox:{backgroundColor:'#eefaff',borderRadius:18,padding:16,marginBottom:18},introText:{color:'#12324a',fontSize:15,lineHeight:28},section:{color:'rgba(28,74,103,0.58)',fontSize:12,letterSpacing:3,fontWeight:'800',marginBottom:12},unsortedWrap:{borderRadius:20,borderWidth:1,borderStyle:'dashed',borderColor:'rgba(15,135,184,0.16)',padding:12,marginBottom:16},clue:{flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'rgba(255,194,28,0.42)',borderRadius:14,paddingHorizontal:12,paddingVertical:12,marginBottom:10,backgroundColor:'#f7fcff'},clueSelected:{backgroundColor:'rgba(255,194,28,0.12)'},redDot:{width:10,height:10,borderRadius:5,backgroundColor:'#ff5335',marginRight:10},clueText:{color:'#12324a',fontSize:16},emptyText:{color:'rgba(28,74,103,0.62)',fontSize:15,lineHeight:24},bucket:{backgroundColor:'#eefaff',borderRadius:18,padding:16,marginBottom:14,borderWidth:1,borderColor:'rgba(18,86,122,0.08)'},bucketActive:{borderColor:'#ffc21c'},bucketTitle:{color:'#12324a',fontSize:18,fontWeight:'900',marginBottom:10},bucketSub:{color:'rgba(28,74,103,0.42)',fontSize:14,fontWeight:'500'},bucketClue:{paddingVertical:2},bucketItem:{color:'#169175',fontSize:16,lineHeight:28,marginBottom:4},bucketPlaceholder:{color:'rgba(28,74,103,0.46)'},checkButton:{height:58,borderRadius:18,backgroundColor:'#ffc21c',alignItems:'center',justifyContent:'center',marginTop:4},checkButtonDisabled:{backgroundColor:'#9dc7d9'},checkButtonText:{color:'#1e2338',fontSize:18,fontWeight:'800'},result:{borderRadius:22,padding:18,marginTop:14,borderWidth:1},resultGood:{backgroundColor:'#eefaff',borderColor:'rgba(57,208,123,0.35)'},resultBad:{backgroundColor:'#fff1ef',borderColor:'rgba(255,83,53,0.28)'},resultTitle:{fontSize:20,fontWeight:'900',marginBottom:10},resultTitleGood:{color:'#169175'},resultTitleBad:{color:'#d96a58'},resultBody:{color:'#12324a',fontSize:16,lineHeight:28},retryButton:{marginTop:16,height:50,borderRadius:16,borderWidth:1,borderColor:'rgba(15,135,184,0.18)',alignItems:'center',justifyContent:'center',backgroundColor:'#f7fcff'},retryButtonText:{color:'#12324a',fontSize:16,fontWeight:'800'}});
