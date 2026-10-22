import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import { X, HelpCircle, Volume2, Plus } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const FOOD_ITEMS = [
  { id: 'lemon', label: '🍋', multiplier: 5, pos: 'TC' },
  { id: 'apple', label: '🍎', multiplier: 5, pos: 'TR' },
  { id: 'fish', label: '🐟', multiplier: 10, pos: 'RC' },
  { id: 'chicken', label: '🍗', multiplier: 15, pos: 'BR' },
  { id: 'pizza', label: '🍕', multiplier: 25, pos: 'BC' },
  { id: 'burger', label: '🍔', multiplier: 45, pos: 'BL' },
  { id: 'mango', label: '🥭', multiplier: 5, pos: 'LC' },
  { id: 'strawberry', label: '🍓', multiplier: 5, pos: 'TL' },
];

const getPosStyle = (pos) => {
  switch(pos) {
    case 'TC': return { left: '39%', top: '1%', transform: [{ rotate: '0deg' }] };
    case 'TR': return { left: '65.8%', top: '12.2%', transform: [{ rotate: '45deg' }] };
    case 'RC': return { left: '77%', top: '39%', transform: [{ rotate: '0deg' }] };
    case 'BR': return { left: '65.8%', top: '65.8%', transform: [{ rotate: '45deg' }] };
    case 'BC': return { left: '39%', top: '77%', transform: [{ rotate: '0deg' }] };
    case 'BL': return { left: '12.2%', top: '65.8%', transform: [{ rotate: '-45deg' }] };
    case 'LC': return { left: '1%', top: '39%', transform: [{ rotate: '0deg' }] };
    case 'TL': return { left: '12.2%', top: '12.2%', transform: [{ rotate: '-45deg' }] };
    default: return {};
  }
};

const STAKES = [
  { label: '1K', value: 1000, color: '#4CAF50' },   // Green
  { label: '10K', value: 10000, color: '#2196F3' },  // Blue
  { label: '50K', value: 50000, color: '#FF9800' },  // Orange
  { label: '100K', value: 100000, color: '#F44336' }, // Red
  { label: '200K', value: 200000, color: '#9C27B0' }, // Purple
  { label: '500K', value: 500000, color: '#FFC107' }, // Gold
];

export default function LuckyFeastGame({ visible, onClose }) {
  // Game States
  const [balance, setBalance] = useState(702712);
  const [todaysWin, setTodaysWin] = useState(0);
  
  // betting (25s), processing (10s), result (5s)
  const [gameState, setGameState] = useState('betting'); 
  const [timeLeft, setTimeLeft] = useState(25);
  
  const [userBets, setUserBets] = useState({});
  const [selectedStake, setSelectedStake] = useState('1K');
  const [highlightIndex, setHighlightIndex] = useState(null);
  const [history, setHistory] = useState(['🍓', '🍔', '🥭', '🍓', '🍎', '🍋', '🥭', '🍎']);
  const [popupData, setPopupData] = useState({ visible: false, type: 'win', amount: 0, label: '' });
  
  const spinInterval = useRef(null);
  const cycleTimer = useRef(null);

  useEffect(() => {
    if (!visible) return;

    cycleTimer.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 1) return prevTime - 1;

        setGameState((prevState) => {
          if (prevState === 'betting') {
            startSpinning();
            return 'processing';
          }
          if (prevState === 'processing') {
            return 'result';
          }
          if (prevState === 'result') {
            setUserBets({});
            setHighlightIndex(null);
            setPopupData(prev => ({...prev, visible: false}));
            return 'betting';
          }
        });

        if (gameState === 'betting') return 10;
        if (gameState === 'processing') return 5;
        if (gameState === 'result') return 25;
        
        return 0;
      });
    }, 1000);

    return () => clearInterval(cycleTimer.current);
  }, [visible, gameState]);

  useEffect(() => {
    if (gameState === 'result') {
      if (spinInterval.current) clearInterval(spinInterval.current);
      const winnerIndex = Math.floor(Math.random() * FOOD_ITEMS.length);
      setHighlightIndex(winnerIndex);
      calculatePayout(winnerIndex);
    }
  }, [gameState]);

  const placeBet = (foodId) => {
    if (gameState !== 'betting') {
      Alert.alert('Betting Closed', 'You cannot place bets right now. Please wait for the next round.');
      return;
    }
    const stakeObj = STAKES.find(s => s.label === selectedStake);
    const amount = stakeObj ? stakeObj.value : 1000;
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      setUserBets(prev => ({
        ...prev,
        [foodId]: (prev[foodId] || 0) + amount
      }));
    } else {
      Alert.alert('Insufficient Balance', 'You do not have enough coins.');
    }
  };

  const placeCategoryBet = (category) => {
    if (gameState !== 'betting') {
      Alert.alert('Betting Closed', 'You cannot place bets right now.');
      return;
    }
    
    const fruitItems = ['strawberry', 'lemon', 'mango', 'apple'];
    const pizzaItems = ['chicken', 'fish', 'burger', 'pizza'];
    const items = category === 'fruit' ? fruitItems : pizzaItems;
    
    const stakeObj = STAKES.find(s => s.label === selectedStake);
    const amount = stakeObj ? stakeObj.value : 1000;
    const totalCost = amount * 4; 

    if (balance >= totalCost) {
      setBalance(prev => prev - totalCost);
      setUserBets(prev => {
        const newBets = { ...prev };
        items.forEach(id => {
          newBets[id] = (newBets[id] || 0) + amount;
        });
        return newBets;
      });
    } else {
      Alert.alert('Insufficient Balance', 'You need ' + totalCost + ' coins for this category bet.');
    }
  };

  const startSpinning = () => {
    let currentIdx = 0;
    spinInterval.current = setInterval(() => {
      setHighlightIndex(currentIdx % FOOD_ITEMS.length);
      currentIdx++;
    }, 150);
  };

  const calculatePayout = (winnerIdx) => {
    const winner = FOOD_ITEMS[winnerIdx];
    const betAmount = userBets[winner.id] || 0;
    const hasBets = Object.keys(userBets).length > 0;

    if (betAmount > 0) {
      const winAmount = betAmount * winner.multiplier;
      setBalance(prev => prev + winAmount);
      setTodaysWin(prev => prev + winAmount);
      setPopupData({ visible: true, type: 'win', amount: winAmount, winnerItem: winner });
    } else if (hasBets) {
      const betItems = Object.keys(userBets).map(id => FOOD_ITEMS.find(f => f.id === id));
      setPopupData({ visible: true, type: 'loss', amount: 0, winnerItem: winner, betItems });
    }
    
    setHistory(prev => {
      const newHistory = [winner.label, ...prev];
      if (newHistory.length > 8) newHistory.pop();
      return newHistory;
    });
  };

  const handleClose = () => {
    if (cycleTimer.current) clearInterval(cycleTimer.current);
    if (spinInterval.current) clearInterval(spinInterval.current);
    onClose();
  };

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <TouchableOpacity style={{ flex: 1 }} onPress={handleClose} activeOpacity={1} />
      <View style={styles.app}>
        
        <ScrollView contentContainerStyle={{ paddingBottom: 0 }} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.wallet}>
              <Text style={styles.walletText}>🪙 {balance}</Text>
              <TouchableOpacity style={styles.plusBtn}>
                <Plus size={14} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.nav}>
              <TouchableOpacity style={styles.navBtn}><Volume2 size={16} color="#FFD700" /></TouchableOpacity>
              <TouchableOpacity style={styles.navBtn}><HelpCircle size={16} color="#FFD700" /></TouchableOpacity>
              <TouchableOpacity style={styles.navBtn} onPress={handleClose}><X size={16} color="#FFD700" /></TouchableOpacity>
            </View>
          </View>

          {/* Logo */}
          <View style={styles.logo}>
            <Text style={styles.logoText}>Lucky Feast</Text>
          </View>

          {/* Arena / Wheel */}
          <View style={styles.arena}>
            <View style={styles.center}>
              <View style={styles.mascotRing} />
              <Text style={styles.mascotText}>🦊</Text>
              <View style={styles.timerRibbon}>
                <Text style={styles.timerRibbonTitle}>
                  {gameState === 'betting' ? 'Bet Time' : (gameState === 'processing' ? 'Spinning' : 'Result')}
                </Text>
                <Text style={styles.timerRibbonTime}>{timeLeft}s</Text>
              </View>
            </View>
            
            {FOOD_ITEMS.map((item, index) => {
              const posStyle = getPosStyle(item.pos);
              const isHighlighted = highlightIndex === index;
              const isWinner = gameState === 'result' && isHighlighted;
              const betAmount = userBets[item.id] || 0;

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  onPress={() => placeBet(item.id)}
                  style={[
                    styles.food,
                    posStyle,
                    isHighlighted && styles.foodActive,
                    isWinner && styles.foodWinner
                  ]}
                >
                  <View style={styles.foodImgContainer}>
                    <Text style={styles.foodImg}>{item.label}</Text>
                    <Text style={styles.foodMultiplier}>x{item.multiplier}</Text>
                  </View>
                  {betAmount > 0 && (
                    <View style={styles.foodBetBadge}>
                       <Text style={styles.foodBetText}>{(betAmount / 1000)}K</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Categories & Win Banner */}
          <View style={styles.categoryRow}>
            <TouchableOpacity style={styles.categoryButton} onPress={() => placeCategoryBet('fruit')}>
              <Text style={styles.categoryButtonText}>🍎 Fruit</Text>
            </TouchableOpacity>
            <Text style={styles.roundText}>ROUND 1</Text>
            <TouchableOpacity style={styles.categoryButton} onPress={() => placeCategoryBet('pizza')}>
               <Text style={styles.categoryButtonText}>🍕 Pizza</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.winBanner}>
             <Text style={styles.winBannerText}>TODAY'S WIN  <Text style={styles.winBannerValue}>{todaysWin}</Text></Text>
          </View>

          {/* Bet Panel */}
          <View style={styles.betPanel}>
            <Text style={styles.message}>
              {gameState === 'betting' ? 'Choose an amount -> Tap a food to place your bet' : 'Waiting for result...'}
            </Text>
            <View style={styles.chips}>
              {STAKES.map((stake) => {
                const isSelected = selectedStake === stake.label;
                return (
                  <TouchableOpacity 
                      key={stake.label} 
                      style={[
                        styles.chip, 
                        { backgroundColor: stake.color },
                        isSelected && styles.chipSelected
                      ]}
                      onPress={() => setSelectedStake(stake.label)}
                      disabled={gameState !== 'betting'}
                  >
                      <View style={styles.chipInner}>
                        <Text style={styles.chipText}>{stake.label}</Text>
                      </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Result History */}
          <View style={styles.historyPanel}>
             <View style={styles.historyRow}>
                {history.map((emoji, idx) => (
                  <View key={idx} style={styles.historyTile}>
                     {idx === 0 && <Text style={styles.newBadge}>New</Text>}
                     <Text style={styles.historyEmoji}>{emoji}</Text>
                  </View>
                ))}
             </View>
          </View>

          {/* Result Popup */}
          {popupData.visible && (
            <View style={styles.popupOverlay}>
              <View style={styles.popupContainer}>
                 <View style={[styles.popupBanner, popupData.type === 'loss' ? styles.popupBannerLoss : {}]}>
                   <Text style={styles.popupTitle}>
                     {popupData.type === 'win' ? 'CONGRATULATIONS!' : 'BETTER LUCK NEXT TIME'}
                   </Text>
                   
                   <View style={[styles.popupSubContainer, popupData.type === 'loss' ? { backgroundColor: '#424242', borderColor: '#FFF' } : {}]}>
                     <Text style={[styles.popupSubText, popupData.type === 'loss' ? { color: '#FFF' } : {}]}>
                       {popupData.type === 'win' ? "YOU'VE WON" : "YOU LOST"}
                     </Text>
                   </View>

                   {popupData.type === 'win' ? (
                     <>
                       <View style={styles.winnerIconContainer}>
                         <Text style={styles.winnerIconLabel}>{popupData.winnerItem?.label}</Text>
                       </View>
                       <Text style={styles.popupAmount}>{popupData.amount}</Text>
                     </>
                   ) : (
                     <View style={styles.lossMatchupContainer}>
                       <View style={styles.lossSide}>
                         <Text style={styles.lossLabel}>You Bet:</Text>
                         <View style={styles.lossIconsRow}>
                           {popupData.betItems?.map(item => (
                             <Text key={item?.id} style={styles.lossIconSmall}>{item?.label}</Text>
                           ))}
                         </View>
                       </View>
                       <Text style={styles.lossVs}>VS</Text>
                       <View style={styles.lossSide}>
                         <Text style={styles.lossLabel}>Winner:</Text>
                         <Text style={styles.lossIconLarge}>{popupData.winnerItem?.label}</Text>
                       </View>
                     </View>
                   )}
                   
                   <TouchableOpacity 
                     style={styles.popupCloseBtn} 
                     onPress={() => setPopupData({ ...popupData, visible: false })}
                   >
                     <Text style={styles.popupCloseText}>
                       {popupData.type === 'win' ? 'COLLECT' : 'CLOSE'}
                     </Text>
                   </TouchableOpacity>
                 </View>
              </View>
            </View>
          )}

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 60, // Sits exactly on top of the ChatScreen bottom bar
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 1000,
  },
  app: {
    maxHeight: '80%',
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    borderWidth: 2,
    borderColor: '#FFD700',
    borderBottomWidth: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#12051b',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 32,
    marginBottom: 5,
    zIndex: 2,
  },
  wallet: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    paddingHorizontal: 8,
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 20,
    backgroundColor: '#300842',
  },
  walletText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  plusBtn: {
    width: 20,
    height: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nav: {
    flexDirection: 'row',
    gap: 8,
  },
  navBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#300842',
    borderWidth: 1.5,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  logoText: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: '900',
    textShadowColor: '#FF4500',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  arena: {
    width: '90%',
    aspectRatio: 1,
    alignSelf: 'center',
    position: 'relative',
    marginBottom: 5,
    marginTop: 2,
  },
  center: {
    position: 'absolute',
    top: '25%', 
    left: '25%',
    width: '50%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  mascotRing: {
    position: 'absolute',
    width: '80%',
    height: '80%',
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#FFD700',
    backgroundColor: '#40104d',
  },
  mascotText: {
    fontSize: 50,
    zIndex: 2,
    marginTop: -10,
  },
  timerRibbon: {
    position: 'absolute',
    bottom: '5%',
    backgroundColor: '#D32F2F',
    paddingHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
    alignItems: 'center',
    zIndex: 3,
  },
  timerRibbonTitle: {
    fontSize: 9,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  timerRibbonTime: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '900',
  },
  food: {
    position: 'absolute',
    width: '22%', 
    aspectRatio: 1,
    borderWidth: 1.5,
    borderColor: '#FFD700',
    borderRadius: 12,
    backgroundColor: '#2E083B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  foodActive: {
    borderColor: '#00FFFF',
    shadowColor: '#00FFFF',
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  foodWinner: {
    backgroundColor: '#4CAF50',
    borderColor: '#FFF',
  },
  foodImgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodImg: {
    fontSize: 26,
  },
  foodMultiplier: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 2,
  },
  foodBetBadge: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: '#8B0000',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  foodBetText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFF',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 4,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#300842',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  categoryButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  roundText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
  },
  winBanner: {
    backgroundColor: '#210530',
    alignSelf: 'center',
    paddingHorizontal: 30,
    paddingVertical: 4,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFD700',
    marginBottom: 4,
    width: '85%',
    alignItems: 'center',
  },
  winBannerText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  winBannerValue: {
    color: '#FFD700',
    fontSize: 14,
  },
  betPanel: {
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 15,
    backgroundColor: '#1E052D',
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 0,
  },
  message: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 10,
    marginBottom: 4,
  },
  chips: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  chip: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
  },
  chipInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    borderColor: '#FFD700',
    borderWidth: 3,
    transform: [{scale: 1.15}],
  },
  chipText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  historyPanel: {
    backgroundColor: '#1E052D',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFD700',
    padding: 8,
    marginTop: 3,
    marginBottom:3
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyTile: {
    width: 32,
    height: 32,
    backgroundColor: '#30005A',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyEmoji: {
    fontSize: 16,
  },
  newBadge: {
    position: 'absolute',
    top: -5,
    left: -5,
    backgroundColor: '#FF0000',
    color: '#FFF',
    fontSize: 8,
    paddingHorizontal: 2,
    borderRadius: 4,
    zIndex: 1,
  },
  popupOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: width * 0.85,
    alignItems: 'center',
  },
  popupBanner: {
    backgroundColor: '#D32F2F', 
    width: '100%',
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#FFD700', 
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  popupBannerLoss: {
    backgroundColor: '#303030', 
    borderColor: '#757575',
    shadowColor: '#000',
  },
  popupTitle: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '900',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    marginBottom: 15,
    textAlign: 'center',
  },
  popupSubContainer: {
    backgroundColor: '#2E7D32', 
    paddingHorizontal: 25,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFD700',
    marginBottom: 15,
  },
  popupSubText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '900',
  },
  popupAmount: {
    color: '#FFD700',
    fontSize: 50,
    fontWeight: '900',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 20,
  },
  winnerIconContainer: {
    backgroundColor: '#300842',
    padding: 10,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFD700',
    marginBottom: 10,
  },
  winnerIconLabel: {
    fontSize: 40,
  },
  lossMatchupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 25,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#555',
  },
  lossSide: {
    flex: 1,
    alignItems: 'center',
  },
  lossLabel: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  lossIconsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 90,
  },
  lossIconSmall: {
    fontSize: 22,
    margin: 2,
  },
  lossVs: {
    color: '#FF4500',
    fontSize: 20,
    fontWeight: '900',
    marginHorizontal: 5,
  },
  lossIconLarge: {
    fontSize: 36,
  },
  popupCloseBtn: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  popupCloseText: {
    color: '#D32F2F',
    fontSize: 18,
    fontWeight: '900',
  },
});
