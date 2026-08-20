import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/MainNavigator';

export function ClueCatchIntroScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const bottomSpace = insets.bottom + (height < 760 ? 200 : 220);
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: bottomSpace }}>
      <Image source={require('../assets/clue-catch-hero.png')} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>CLUE CATCH</Text>
      <Text style={styles.subtitle}>Evidence rains down over the city. Catch the real clues, dodge the junk, and beat your record.</Text>
      <View style={styles.row}><View style={[styles.tipCard, styles.tipCardGood]}><Text style={styles.tipTitleGood}>CATCH</Text><Text style={styles.tipText}>Prints · Keys · Notes · Folders</Text></View><View style={[styles.tipCard, styles.tipCardBad]}><Text style={styles.tipTitleBad}>AVOID</Text><Text style={styles.tipText}>Junk mail · Traps · Static</Text></View></View>
      <Pressable style={styles.startButton} onPress={() => navigation.navigate('ClueCatchGame')}><Text style={styles.startButtonText}>Start Game</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({container:{flex:1,backgroundColor:'#d2eef9',paddingHorizontal:22},image:{width:'100%',height:360,marginBottom:8},title:{color:'#12324a',fontSize:28,fontWeight:'900',textAlign:'center',marginBottom:16},subtitle:{color:'rgba(28,74,103,0.78)',fontSize:16,lineHeight:30,textAlign:'center',marginBottom:22},row:{flexDirection:'row',gap:10,marginBottom:22},tipCard:{flex:1,borderRadius:20,padding:16,borderWidth:1},tipCardGood:{backgroundColor:'#eefaff',borderColor:'rgba(57,208,123,0.32)'},tipCardBad:{backgroundColor:'#fff1ef',borderColor:'rgba(255,83,53,0.24)'},tipTitleGood:{color:'#169175',fontSize:18,fontWeight:'900',textAlign:'center',marginBottom:10},tipTitleBad:{color:'#d96a58',fontSize:18,fontWeight:'900',textAlign:'center',marginBottom:10},tipText:{color:'#12324a',textAlign:'center',lineHeight:24},startButton:{height:58,borderRadius:18,backgroundColor:'#ffc21c',alignItems:'center',justifyContent:'center'},startButtonText:{color:'#1c2235',fontSize:18,fontWeight:'800'}});
