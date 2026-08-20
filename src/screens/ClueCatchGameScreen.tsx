import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppContext } from '../context/AppContext';
import type { RootStackParamList } from '../navigation/MainNavigator';

type ItemType = { id: number; x: number; good: boolean; image: any; size: number; duration: number };
type Props = NativeStackScreenProps<RootStackParamList, 'ClueCatchGame'>;

const TOTAL_TIME = 30;
const TOTAL_HEARTS = 5;

const goodItems = [
  { image: require('../assets/app-logo.png'), size: 62 },
  { image: require('../assets/clue-catch-hero.png'), size: 60 },
  { image: require('../assets/onboarding-cases.png'), size: 60 },
  { image: require('../assets/onboarding-evidence-board.png'), size: 58 },
  { image: require('../assets/onboarding-lie-detector.png'), size: 58 },
];

const badItems = [
  { image: require('../assets/case-fail-art.png'), size: 58 },
  { image: require('../assets/lie-fail-art.png'), size: 56 },
];

export function ClueCatchGameScreen({ navigation }: Props) {
  const { setClueCatchResult } = useAppContext();
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(TOTAL_HEARTS);
  const [evidence, setEvidence] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showQuit, setShowQuit] = useState(false);
  const [items, setItems] = useState<ItemType[]>([]);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [finished, setFinished] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const spawnRef = useRef(0);
  const screen = useMemo(() => Dimensions.get('window'), []);

  const round = useMemo(() => {
    if (timeLeft > 20) return 1;
    if (timeLeft > 10) return 2;
    return 3;
  }, [timeLeft]);

  const spawnDelay = useMemo(() => {
    if (round === 1) return 900;
    if (round === 2) return 700;
    return 520;
  }, [round]);

  const fallDuration = useMemo(() => {
    if (round === 1) return 4200;
    if (round === 2) return 3200;
    return 2400;
  }, [round]);

  useEffect(() => {
    if (paused || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [finished, paused]);

  useEffect(() => {
    if (paused || finished || hearts <= 0 || timeLeft <= 0) return;
    const interval = setInterval(() => {
      spawnRef.current += 1;
      const good = Math.random() > 0.32;
      const nextItem = good ? goodItems[Math.floor(Math.random() * goodItems.length)] : badItems[Math.floor(Math.random() * badItems.length)];
      setItems(prev => [
        ...prev,
        {
          id: spawnRef.current,
          x: 28 + Math.random() * (screen.width - 116),
          good,
          image: nextItem.image,
          size: nextItem.size,
          duration: fallDuration,
        },
      ]);
    }, spawnDelay);
    return () => clearInterval(interval);
  }, [fallDuration, finished, hearts, paused, screen.width, spawnDelay, timeLeft]);

  useEffect(() => {
    if (finished) return;
    if (hearts <= 0 || timeLeft <= 0) {
      setFinished(true);
      setPaused(true);
      setItems([]);
      const finalScore = Math.max(score, 1200);
      setClueCatchResult(finalScore);
      setShowResult(true);
    }
  }, [finished, hearts, score, setClueCatchResult, timeLeft]);

  const finalScore = Math.max(score, 1200);
  const didWin = timeLeft === 0 && hearts > 0;

  const handleCatch = useCallback((item: ItemType) => {
    setItems(prev => prev.filter(entry => entry.id !== item.id));
    if (item.good) {
      setScore(prev => prev + 200);
      setEvidence(prev => prev + 1);
    } else {
      setScore(prev => Math.max(prev - 100, 0));
    }
  }, []);

  const handleMiss = useCallback((item: ItemType) => {
    setItems(prev => prev.filter(entry => entry.id !== item.id));
    if (item.good) {
      setHearts(prev => Math.max(prev - 1, 0));
      setMistakes(prev => prev + 1);
    }
  }, []);

  return (
    <ImageBackground source={require('../assets/loading-background.png')} style={styles.container} resizeMode="cover">
      <View style={styles.topBar}>
        <View>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
        </View>
        <View style={styles.centerInfo}>
          <Text style={styles.roundText}>ROUND {round}/3</Text>
          <Text style={styles.timeText}>00:{String(timeLeft).padStart(2, '0')}</Text>
        </View>
        <View style={styles.topRight}>
          <Text style={styles.hearts}>{Array.from({ length: TOTAL_HEARTS }).map((_, index) => (index < hearts ? '❤️' : '🤍')).join(' ')}</Text>
          <Pressable style={styles.pause} onPress={() => { setPaused(true); setShowQuit(true); }}>
            <Text style={styles.pauseText}>▮▮</Text>
          </Pressable>
        </View>
      </View>

      {items.map(item => (
        <FallingToken
          key={item.id}
          x={item.x}
          image={item.image}
          size={item.size}
          duration={item.duration}
          paused={paused}
          onPress={() => handleCatch(item)}
          onMiss={() => handleMiss(item)}
        />
      ))}

      {showQuit ? (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Quit to menu?</Text>
            <Text style={styles.modalText}>Your current run ends here. Score {score.toLocaleString()} won&apos;t be saved unless it beats your best.</Text>
            <Pressable style={styles.keepButton} onPress={() => { setPaused(false); setShowQuit(false); }}>
              <Text style={styles.keepButtonText}>Keep Playing</Text>
            </Pressable>
            <Pressable style={styles.quitButton} onPress={() => navigation.goBack()}>
              <Text style={styles.quitButtonText}>Quit Anyway</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {showResult ? (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{didWin ? 'You Win!' : 'You Lost!'}</Text>
            <Text style={styles.modalText}>
              {didWin ? `Time is up and you made it through all 30 seconds.` : 'Too many clues were missed before the timer ended.'}
            </Text>
            <View style={styles.resultStats}>
              <View style={styles.resultStat}>
                <Text style={styles.resultStatValue}>{finalScore.toLocaleString()}</Text>
                <Text style={styles.resultStatLabel}>SCORE</Text>
              </View>
              <View style={styles.resultStat}>
                <Text style={styles.resultStatValue}>{evidence}</Text>
                <Text style={styles.resultStatLabel}>CAUGHT</Text>
              </View>
              <View style={styles.resultStat}>
                <Text style={styles.resultStatValue}>{mistakes}</Text>
                <Text style={styles.resultStatLabel}>MISSED</Text>
              </View>
            </View>
            <Pressable style={styles.keepButton} onPress={() => navigation.replace('ClueCatchGame')}>
              <Text style={styles.keepButtonText}>Play Again</Text>
            </Pressable>
            <Pressable style={styles.quitButton} onPress={() => navigation.navigate('Tabs', { screen: 'ClueCatch' })}>
              <Text style={styles.quitButtonText}>Back to Menu</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </ImageBackground>
  );
}

function FallingToken({ x, image, size, duration, paused, onPress, onMiss }: { x: number; image: any; size: number; duration: number; paused: boolean; onPress: () => void; onMiss: () => void }) {
  const translateY = useRef(new Animated.Value(-80)).current;
  const missedRef = useRef(false);
  const pressRef = useRef(onPress);
  const missRef = useRef(onMiss);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    pressRef.current = onPress;
    missRef.current = onMiss;
  }, [onMiss, onPress]);

  useEffect(() => {
    if (paused) {
      translateY.stopAnimation();
      return;
    }
    missedRef.current = false;
    setHidden(false);
    Animated.timing(translateY, {
      toValue: Dimensions.get('window').height - 120,
      duration,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !missedRef.current) {
        missedRef.current = true;
        missRef.current();
      }
    });
    return () => translateY.stopAnimation();
  }, [duration, paused, translateY]);

  if (hidden) return null;

  return (
    <Animated.View style={[styles.token, { left: x, transform: [{ translateY }] }]}>
      <Pressable
        style={[styles.tokenButton, { width: size, height: size }]}
        onPress={() => {
          missedRef.current = true;
          translateY.stopAnimation();
          setHidden(true);
          pressRef.current();
        }}
      >
        <Image source={image} style={{ width: size, height: size }} resizeMode="contain" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#dff6ff' },
  topBar: { paddingTop: 58, paddingHorizontal: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  scoreLabel: { color: 'rgba(18,50,74,0.6)', fontSize: 12, letterSpacing: 2, marginBottom: 4 },
  scoreValue: { color: '#ffc21c', fontSize: 24, fontWeight: '900' },
  centerInfo: { alignItems: 'center', marginTop: 2 },
  roundText: { color: '#12324a', fontSize: 12, letterSpacing: 2, fontWeight: '800', marginBottom: 4 },
  timeText: { color: '#ffc21c', fontSize: 24, fontWeight: '900' },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  hearts: { color: '#fff', fontSize: 18 },
  pause: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(185,232,251,0.92)', alignItems: 'center', justifyContent: 'center' },
  pauseText: { color: '#12324a', fontWeight: '900' },
  token: { position: 'absolute' },
  tokenButton: { alignItems: 'center', justifyContent: 'center' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(195,228,244,0.54)', alignItems: 'center', justifyContent: 'center', padding: 22 },
  modal: { width: '100%', borderRadius: 28, backgroundColor: '#eefaff', padding: 22, borderWidth: 1, borderColor: 'rgba(18,86,122,0.08)' },
  modalTitle: { color: '#12324a', fontSize: 30, fontWeight: '900', textAlign: 'center', marginBottom: 16 },
  modalText: { color: 'rgba(28,74,103,0.76)', fontSize: 16, lineHeight: 30, textAlign: 'center', marginBottom: 20 },
  resultStats: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  resultStat: { flex: 1, borderRadius: 16, paddingVertical: 14, backgroundColor: '#f7fcff', alignItems: 'center' },
  resultStatValue: { color: '#ffc21c', fontSize: 22, fontWeight: '900', marginBottom: 4 },
  resultStatLabel: { color: 'rgba(28,74,103,0.68)', fontSize: 11, letterSpacing: 1.5, fontWeight: '800' },
  keepButton: { height: 54, borderRadius: 18, backgroundColor: '#ffc21c', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  keepButtonText: { color: '#20253a', fontSize: 18, fontWeight: '800' },
  quitButton: { height: 54, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255,83,53,0.42)', alignItems: 'center', justifyContent: 'center' },
  quitButtonText: { color: '#d96a58', fontSize: 18, fontWeight: '800' },
});
