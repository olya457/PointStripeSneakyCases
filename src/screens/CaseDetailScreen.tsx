import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppContext } from '../context/AppContext';
import { storyCases } from '../data/gameData';
import type { RootStackParamList } from '../navigation/MainNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'CaseDetail'>;

export function CaseDetailScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { storyProgress, markStoryInProgress, markStorySolved, closeStoryCase } = useAppContext();
  const item = useMemo(() => storyCases.find(entry => entry.id === route.params.caseId)!, [route.params.caseId]);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = selected === item.correctAnswer;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 90 }}>
      <Pressable style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>‹ Back</Text>
      </Pressable>
      <View style={styles.tags}>
        <Text style={styles.caseTag}>CASE {item.number}</Text>
        <Text style={[styles.levelTag, item.difficulty === 'Hard' && styles.levelHard]}>{item.difficulty.toUpperCase()}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.panel}>
        <Text style={styles.section}>THE SITUATION</Text>
        <Text style={styles.body}>{item.situation}</Text>
      </View>
      <Text style={styles.sectionTitle}>CHARACTERS INVOLVED</Text>
      {item.characters.map(person => (
        <View key={person.code} style={styles.personCard}>
          <View style={styles.personCode}><Text style={styles.personCodeText}>{person.code}</Text></View>
          <View>
            <Text style={styles.personName}>{person.name}</Text>
            <Text style={styles.personRole}>{person.role}</Text>
          </View>
        </View>
      ))}
      <Text style={styles.sectionTitle}>IMPORTANT FACTS</Text>
      {item.facts.map(fact => (
        <View key={fact} style={styles.factCard}>
          <Text style={styles.factArrow}>›</Text>
          <Text style={styles.factText}>{fact}</Text>
        </View>
      ))}
      <Text style={styles.sectionTitle}>CLUES ON THE BOARD</Text>
      <View style={styles.chips}>
        {item.clues.map(clue => (
          <View key={clue} style={styles.chip}>
            <View style={styles.dot} />
            <Text style={styles.chipText}>{clue}</Text>
          </View>
        ))}
      </View>
      <View style={styles.questionCard}>
        <Text style={styles.section}>FINAL QUESTION</Text>
        <Text style={styles.question}>{item.question}</Text>
      </View>
      {item.answers.map((answer, index) => {
        const chosen = selected === index;
        const good = submitted && index === item.correctAnswer;
        const bad = submitted && chosen && !isCorrect;
        return (
          <Pressable
            key={answer}
            style={[styles.answerCard, chosen && styles.answerSelected, good && styles.answerGood, bad && styles.answerBad]}
            onPress={() => {
              setSelected(index);
              markStoryInProgress(item.id);
            }}
          >
            <View style={[styles.answerBadge, chosen && styles.answerBadgeActive, good && styles.answerBadgeGood, bad && styles.answerBadgeBad]}>
              <Text style={styles.answerBadgeText}>{String.fromCharCode(65 + index)}</Text>
            </View>
            <Text style={styles.answerText}>{answer}</Text>
            {good ? <Text style={styles.markGood}>✓</Text> : null}
            {bad ? <Text style={styles.markBad}>✕</Text> : null}
          </Pressable>
        );
      })}
      {submitted ? (
        <View style={[styles.resultBox, isCorrect ? styles.resultGood : styles.resultBad]}>
          <Text style={[styles.resultTitle, isCorrect ? styles.goodText : styles.badText]}>{isCorrect ? '✓ Case Cracked!' : '✕ Deduction Failed'}</Text>
          <Text style={styles.resultBody}>
            {isCorrect
              ? 'The locked room, the draft, and the muddy heel print all point to the hidden passage behind the costume rack. Elena staged her disappearance and slipped out with her instrument.'
              : 'The fake timeline hides the real theft window. The evidence points away from the obvious suspect and back toward the one with motive and access.'}
          </Text>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => {
              if (isCorrect) {
                markStorySolved(item.id);
              } else {
                closeStoryCase(item.id);
              }
              navigation.goBack();
            }}
          >
            <Text style={styles.secondaryText}>Close Case File</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable style={[styles.submitButton, selected === null && styles.submitDisabled]} disabled={selected === null} onPress={() => {
          if (selected === null) return;
          setSubmitted(true);
          if (selected === item.correctAnswer) markStorySolved(item.id);
        }}>
          <Text style={styles.submitText}>Submit Deduction</Text>
        </Pressable>
      )}
      <Text style={styles.footerState}>Current status: {storyProgress[item.id]}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({container:{flex:1,backgroundColor:'#dff6ff',paddingHorizontal:22},back:{alignSelf:'flex-start',backgroundColor:'#b9e8fb',paddingHorizontal:14,paddingVertical:10,borderRadius:18,marginBottom:16},backText:{color:'#12324a',fontSize:15,fontWeight:'700'},tags:{flexDirection:'row',gap:10,marginBottom:12},caseTag:{backgroundColor:'#ffc21c',color:'#1d2237',paddingHorizontal:10,paddingVertical:6,borderRadius:10,fontSize:12,letterSpacing:2,fontWeight:'800'},levelTag:{backgroundColor:'#ffd55d',color:'#493a00',paddingHorizontal:10,paddingVertical:6,borderRadius:10,fontSize:12,fontWeight:'800'},levelHard:{backgroundColor:'#ff5335',color:'#fff'},title:{color:'#12324a',fontSize:28,lineHeight:34,fontWeight:'900',marginBottom:16},panel:{backgroundColor:'#eefaff',borderRadius:22,padding:18,borderWidth:1,borderColor:'rgba(18,86,122,0.08)',marginBottom:18},section:{color:'#0f87b8',fontSize:12,letterSpacing:3,fontWeight:'800',marginBottom:10},body:{color:'#12324a',fontSize:15,lineHeight:32},sectionTitle:{color:'#169175',fontSize:12,letterSpacing:3,fontWeight:'800',marginBottom:14,marginTop:6},personCard:{flexDirection:'row',alignItems:'center',backgroundColor:'#eefaff',borderRadius:18,padding:14,marginBottom:12,borderWidth:1,borderColor:'rgba(18,86,122,0.08)'},personCode:{width:44,height:44,borderRadius:12,backgroundColor:'#b9e8fb',alignItems:'center',justifyContent:'center',marginRight:12},personCodeText:{color:'#12324a',fontWeight:'900'},personName:{color:'#12324a',fontSize:18,fontWeight:'800'},personRole:{color:'rgba(28,74,103,0.62)',fontSize:14},factCard:{flexDirection:'row',backgroundColor:'#eefaff',borderRadius:16,padding:14,marginBottom:12,borderLeftWidth:3,borderLeftColor:'#39d07b'},factArrow:{color:'#39d07b',fontSize:18,marginRight:10},factText:{flex:1,color:'#12324a',fontSize:15,lineHeight:28},chips:{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:18},chip:{flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'rgba(255,194,28,0.45)',borderRadius:14,paddingHorizontal:12,paddingVertical:10,backgroundColor:'#f7fcff'},chipText:{color:'#12324a'},dot:{width:8,height:8,borderRadius:4,backgroundColor:'#ff5138',marginRight:8},questionCard:{backgroundColor:'#eefaff',borderRadius:22,padding:18,marginBottom:14,borderWidth:1,borderColor:'rgba(255,194,28,0.26)'},question:{color:'#12324a',fontSize:18,lineHeight:28,fontWeight:'800'},answerCard:{flexDirection:'row',alignItems:'center',backgroundColor:'#eefaff',borderRadius:18,padding:16,marginBottom:12,borderWidth:1,borderColor:'rgba(18,86,122,0.08)'},answerSelected:{borderColor:'#ffc21c'},answerGood:{borderColor:'#39d07b',backgroundColor:'#eefaff'},answerBad:{borderColor:'#ff5335',backgroundColor:'#fff1ef'},answerBadge:{width:32,height:32,borderRadius:10,backgroundColor:'#b9e8fb',alignItems:'center',justifyContent:'center',marginRight:12},answerBadgeActive:{backgroundColor:'#ffc21c'},answerBadgeGood:{backgroundColor:'#39d07b'},answerBadgeBad:{backgroundColor:'#ff5335'},answerBadgeText:{color:'#101f61',fontWeight:'900'},answerText:{flex:1,color:'#12324a',fontSize:16,lineHeight:24},markGood:{color:'#39d07b',fontSize:22,fontWeight:'900'},markBad:{color:'#d96a58',fontSize:22,fontWeight:'900'},submitButton:{marginTop:8,height:58,borderRadius:18,backgroundColor:'#ffc21c',alignItems:'center',justifyContent:'center'},submitDisabled:{opacity:0.45},submitText:{color:'#1d2235',fontSize:18,fontWeight:'800'},resultBox:{borderRadius:22,padding:18,marginTop:12,borderWidth:1},resultGood:{backgroundColor:'#eefaff',borderColor:'rgba(57,208,123,0.38)'},resultBad:{backgroundColor:'#fff1ef',borderColor:'rgba(255,83,53,0.30)'},resultTitle:{fontSize:20,fontWeight:'900',marginBottom:12},goodText:{color:'#169175'},badText:{color:'#d96a58'},resultBody:{color:'#12324a',fontSize:16,lineHeight:30,marginBottom:18},secondaryButton:{height:54,borderRadius:16,borderWidth:1,borderColor:'rgba(15,135,184,0.2)',alignItems:'center',justifyContent:'center'},secondaryText:{color:'#12324a',fontSize:17,fontWeight:'800'},footerState:{color:'rgba(28,74,103,0.54)',marginTop:16,textAlign:'center'}});
