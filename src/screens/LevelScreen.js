import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Platform,
  Modal,
  ActivityIndicator
} from 'react-native';
import { ChevronLeft, HelpCircle, CheckCircle, ChevronRight, MessageSquare, Gamepad2 } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import apiService from '../services/apiService';

const { width } = Dimensions.get('window');
const defaultAvatar = require('../assets/av1.jpg');

const ImageWithLoader = ({ uri, style }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={[{ justifyContent: 'center', alignItems: 'center' }, style]}>
      {isLoading && (
        <ActivityIndicator size="small" color="#FCD34D" style={{ position: 'absolute' }} />
      )}
      <Image 
        source={{ uri }} 
        style={style} 
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)} 
      />
    </View>
  );
};

export default function LevelScreen({ navigation }) {
  const profile = useSelector((state) => state.auth.profile);
  const userId = useSelector((state) => state.auth.userId);
  const [activeTab, setActiveTab] = useState('Honor'); // 'Honor' or 'Rewards'
  const [activeRewardTab, setActiveRewardTab] = useState('Lv.1-Lv.9'); // Level range selector
  const [modalVisible, setModalVisible] = useState(false);
  const [levelData, setLevelData] = useState(null);
  const [loading, setLoading] = useState(true);

  const userName = profile?.displayName || profile?.name || 'VENUS 👑';
  
  let avatarSource = defaultAvatar;
  const avatarUrl = profile?.avatarUrl || profile?.profilePictureUrl;
  if (avatarUrl) {
      avatarSource = {
          uri: avatarUrl.startsWith('http') 
              ? avatarUrl 
              : `https://landing.hostingsky.in${avatarUrl}`
      };
  }

  useEffect(() => {
    const fetchLevelData = async () => {
        if (!userId) return;
        try {
            const res = await apiService.get(`api/UserLevel/user/${userId}`);
            if (res?.status && res?.data) {
                setLevelData(res.data);
            }
        } catch (error) {
            console.log("Error fetching Level data:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchLevelData();
  }, [userId]);



  // Reward level ranges
  const rewardTabs = ['Lv.1-Lv.9', 'Lv.10-Lv.19', 'Lv.20-Lv.29', 'Lv.30-Lv.39', 'Lv.40-Lv.49', 'Lv.100-Lv.109'];

  // Rewards list data based on active range
  const rewardsList = {
    'Lv.1-Lv.9': [
      { level: 'Level 1 Reward', items: [{ name: 'Coin x500', icon: 'https://img.icons8.com/color/96/coins.png' }], received: true },
      { level: 'Level 2 Reward', items: [{ name: 'Coin x600', icon: 'https://img.icons8.com/color/96/coins.png' }], received: true },
      { level: 'Level 3 Reward', items: [{ name: 'Coin x800', icon: 'https://img.icons8.com/color/96/coins.png' }, { name: 'Diamond x300', icon: 'https://img.icons8.com/color/96/diamond.png' }], received: true },
      { level: 'Level 4 Reward', items: [{ name: 'Coin x1000', icon: 'https://img.icons8.com/color/96/coins.png' }, { name: 'Diamond x600', icon: 'https://img.icons8.com/color/96/diamond.png' }], received: true },
      { level: 'Level 5 Reward', items: [{ name: 'Coin x1200', icon: 'https://img.icons8.com/color/96/coins.png' }, { name: 'Diamond x900', icon: 'https://img.icons8.com/color/96/diamond.png' }], received: true },
    ],
    'Lv.100-Lv.109': [
      { level: 'Level 108 Reward', items: [{ name: 'Coin x12000', icon: 'https://img.icons8.com/color/96/coins.png' }, { name: 'Diamond x180000', icon: 'https://img.icons8.com/color/96/diamond.png' }, { name: 'Dynamic Theme', icon: 'https://img.icons8.com/color/96/room.png' }], received: true },
      { level: 'Level 109 Reward', items: [{ name: 'Coin x12000', icon: 'https://img.icons8.com/color/96/coins.png' }, { name: 'Diamond x180000', icon: 'https://img.icons8.com/color/96/diamond.png' }], received: true },
      { level: 'Level 110 Reward', items: [{ name: 'Coin x12000', icon: 'https://img.icons8.com/color/96/coins.png' }, { name: 'Diamond x180000', icon: 'https://img.icons8.com/color/96/diamond.png' }], received: true },
    ]
  };

  const currentRewards = rewardsList[activeRewardTab] || rewardsList['Lv.1-Lv.9'];

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
        <ChevronLeft color="#fff" size={28} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Level</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.headerIcon}>
        <HelpCircle color="#E5A920" size={26} />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
      return (
          <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F0D0C' }]}>
              <ActivityIndicator size="large" color="#e6a978" />
          </View>
      );
  }

  const currentLevel = levelData?.currentLevel || 0;
  const nextLevel = levelData?.nextLevelInfo?.levelNumber || (currentLevel + 1);
  const expToNextLevel = levelData?.expToNextLevel || 0;
  // Make sure progress is between 0 and 100
  const progressPercent = Math.min(Math.max((levelData?.expProgressPercentage || 0), 0), 100);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={['#1F1612', '#140E0A', '#080504']} style={StyleSheet.absoluteFillObject} />

      <SafeAreaView style={{ flex: 1 }}>
        {renderHeader()}

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Top Golden Level Card */}
          <LinearGradient colors={['#FCD34D', '#D97706']} style={styles.topCard}>
            <View style={styles.cardLeft}>
              <Text style={styles.userName} numberOfLines={1}>{userName}</Text>
              <Text style={styles.levelValue}>LV.{currentLevel}</Text>

              {/* Level Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                </View>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressLabelText}>Lv.{currentLevel}</Text>
                  <Text style={styles.progressLabelText}>Lv.{nextLevel}</Text>
                </View>
              </View>
              <Text style={styles.expNeededText}>need {expToNextLevel.toLocaleString()} EXP to reach the next level</Text>
            </View>

            {/* Avatar Frame on the Right */}
            <View style={styles.cardRight}>
              <View style={styles.avatarFrameContainer}>
                {levelData?.frameInfo?.frameImagePath ? (
                   <Image source={{ uri: `https://landing.hostingsky.in/${levelData.frameInfo.frameImagePath}` }} style={styles.crownFrameIcon} />
                ) : (
                   <Image source={{ uri: 'https://img.icons8.com/color/96/crown.png' }} style={styles.crownFrameIcon} />
                )}
                <Image source={avatarSource} style={styles.avatarImage} />
                <View style={styles.frameDecoration}>
                  <Text style={styles.frameText}>LV.{currentLevel}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* Main Switcher Tabs (Honor / Rewards) */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'Honor' && styles.activeTabButton]}
              onPress={() => setActiveTab('Honor')}
            >
              <Text style={[styles.tabText, activeTab === 'Honor' && styles.activeTabText]}>Honor</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'Rewards' && styles.activeTabButton]}
              onPress={() => setActiveTab('Rewards')}
            >
              <Text style={[styles.tabText, activeTab === 'Rewards' && styles.activeTabText]}>Rewards</Text>
            </TouchableOpacity>
          </View>

          {/* Dynamic Content Views */}
          {activeTab === 'Honor' ? (
            <View style={styles.honorSection}>
              <View style={styles.subTabContent}>
                
                {/* Medals Section */}
                <View style={styles.subTitleBadge}>
                  <Text style={styles.subTitleBadgeText}>Honor medal</Text>
                </View>
                <Text style={styles.infoText}>For high level users, only the current highest-level resources are retained.</Text>
                <View style={styles.medalsGrid}>
                  {(levelData?.allMedals || []).map((medal, index) => {
                    const borderColors = ['#C0C0C0', '#4E9EFF', '#FFD700', '#00FFFF', '#FF4500'];
                    const borderColor = borderColors[index % borderColors.length];
                    
                    const imgUrl = medal.medalImagePath 
                      ? (medal.medalImagePath.startsWith('http') ? medal.medalImagePath : `https://landing.hostingsky.in/${medal.medalImagePath.startsWith('/') ? medal.medalImagePath.substring(1) : medal.medalImagePath}`)
                      : null;

                    return (
                      <View key={medal.medalId} style={styles.medalCard}>
                        <View style={[styles.medalIconBorder, { borderColor }]}>
                          {imgUrl ? (
                            <ImageWithLoader uri={imgUrl} style={styles.medalIcon} />
                          ) : null}
                        </View>
                        <LinearGradient colors={['#D97706', '#92400E']} style={styles.medalLevelBadge}>
                          <Text style={styles.medalLevelText}>LV.{medal.requiredLevel}</Text>
                        </LinearGradient>
                        <Text style={styles.medalName}>{medal.medalName}</Text>
                      </View>
                    );
                  })}
                </View>

                {/* Frames Section */}
                <View style={[styles.subTitleBadge, { marginTop: 30 }]}>
                  <Text style={styles.subTitleBadgeText}>Avatar Frame</Text>
                </View>
                <Text style={styles.infoText}>Reaching higher levels will unlock premium frame items.</Text>
                <View style={styles.medalsGrid}>
                  {(levelData?.allFrames || []).map((frame, index) => {
                    const borderColors = ['#C0C0C0', '#4E9EFF', '#FFD700', '#00FFFF', '#FF4500'];
                    const borderColor = borderColors[index % borderColors.length];
                    
                    const imgUrl = frame.frameImagePath 
                      ? (frame.frameImagePath.startsWith('http') ? frame.frameImagePath : `https://landing.hostingsky.in/${frame.frameImagePath.startsWith('/') ? frame.frameImagePath.substring(1) : frame.frameImagePath}`)
                      : null;

                    return (
                      <View key={frame.frameId} style={styles.medalCard}>
                        <View style={[styles.medalIconBorder, { borderColor }]}>
                          {imgUrl ? (
                            <ImageWithLoader uri={imgUrl} style={styles.medalIcon} />
                          ) : null}
                        </View>
                        <LinearGradient colors={['#D97706', '#92400E']} style={styles.medalLevelBadge}>
                          <Text style={styles.medalLevelText}>{frame.requiredLevel ? `LV.${frame.requiredLevel}` : 'LV.MAX'}</Text>
                        </LinearGradient>
                        <Text style={styles.medalName}>{frame.frameName}</Text>
                      </View>
                    );
                  })}
                </View>

              </View>
            </View>
          ) : (
            <View style={styles.rewardsSection}>
              {/* Horizontal Scroll of Level Ranges */}
              <View style={styles.rangeScrollContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rangeScrollContent}>
                  {rewardTabs.map((range) => {
                    const isSelected = activeRewardTab === range;
                    return (
                      <TouchableOpacity
                        key={range}
                        style={[styles.rangeTab, isSelected && styles.activeRangeTab]}
                        onPress={() => setActiveRewardTab(range)}
                      >
                        <Text style={[styles.rangeTabText, isSelected && styles.activeRangeTabText]}>{range}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Rewards List */}
              <View style={styles.rewardsListContainer}>
                {currentRewards.map((reward, index) => (
                  <View key={index} style={styles.rewardCard}>
                    <View style={styles.rewardCardHeader}>
                      <Text style={styles.rewardLevelTitle}>{reward.level}</Text>
                      {reward.received && (
                        <View style={styles.receivedBadge}>
                          <CheckCircle color="#10B981" size={14} />
                          <Text style={styles.receivedText}>Received</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.rewardItemsGrid}>
                      {reward.items.map((item, idx) => (
                        <LinearGradient
                          key={idx}
                          colors={['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.01)']}
                          style={styles.rewardItemCard}
                        >
                          <Image source={{ uri: item.icon }} style={styles.rewardItemIcon} />
                          <Text style={styles.rewardItemName}>{item.name}</Text>
                        </LinearGradient>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

        </ScrollView>
      </SafeAreaView>

      {/* Rules Modal: "How to upgrade?" */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>How to upgrade?</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseBtnText}>Close</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScrollContent} showsVerticalScrollIndicator={false}>

              {/* Play Games Section */}
              <LinearGradient colors={['#2D1F17', '#1F1510']} style={styles.rulesCard}>
                <View style={styles.rulesCardHeader}>
                  <Gamepad2 color="#FFB300" size={24} />
                  <View style={styles.rulesTitleWrapper}>
                    <Text style={styles.rulesCardTitle}>Play Games</Text>
                    <Text style={styles.rulesLimitText}>Daily limit EXP+5000</Text>
                  </View>
                </View>

                <View style={styles.rulesDivider} />

                <View style={styles.rulesList}>
                  <View style={styles.ruleItem}>
                    <Text style={styles.ruleText}>One piece reaches the end point</Text>
                    <Text style={styles.ruleExp}>EXP+50</Text>
                  </View>
                  <View style={styles.ruleItem}>
                    <Text style={styles.ruleText}>Kill 1 piece</Text>
                    <Text style={styles.ruleExp}>EXP+20</Text>
                  </View>
                  <View style={styles.ruleItem}>
                    <Text style={styles.ruleText}>Game Victory</Text>
                    <Text style={styles.ruleExp}>EXP+100</Text>
                  </View>
                  <View style={styles.ruleItem}>
                    <Text style={styles.ruleText}>10000 gold coins and above double experience</Text>
                    <Text style={styles.ruleExpHighlight}>Double</Text>
                  </View>
                  <View style={styles.ruleItem}>
                    <Text style={styles.ruleText}>Every time you recharge 50000 gold coins</Text>
                    <Text style={styles.ruleExp}>EXP+50</Text>
                  </View>
                  <View style={styles.ruleItem}>
                    <Text style={styles.ruleText}>[Carrom] Every goal</Text>
                    <Text style={styles.ruleExp}>EXP+3</Text>
                  </View>
                  <View style={styles.ruleItem}>
                    <Text style={styles.ruleText}>[UMO] Every time I shout UMO</Text>
                    <Text style={styles.ruleExp}>EXP+10</Text>
                  </View>
                </View>
              </LinearGradient>

              {/* Chat Room Section */}
              <LinearGradient colors={['#2D1F17', '#1F1510']} style={[styles.rulesCard, { marginTop: 16 }]}>
                <View style={styles.rulesCardHeader}>
                  <MessageSquare color="#FFB300" size={24} />
                  <View style={styles.rulesTitleWrapper}>
                    <Text style={styles.rulesCardTitle}>Chat Room</Text>
                    <Text style={styles.rulesLimitText}>Daily limit EXP+15000</Text>
                  </View>
                </View>

                <View style={styles.rulesDivider} />

                <View style={styles.rulesList}>
                  <View style={styles.ruleItem}>
                    <Text style={styles.ruleText}>Entering the room for the first time every day</Text>
                    <Text style={styles.ruleExp}>EXP+10</Text>
                  </View>
                  <View style={styles.ruleItem}>
                    <Text style={styles.ruleText}>Share a room for the first time every day</Text>
                    <Text style={styles.ruleExp}>EXP+20</Text>
                  </View>
                  <View style={styles.ruleItem}>
                    <Text style={styles.ruleText}>Every 20000 blue diamond gift given</Text>
                    <Text style={styles.ruleExp}>EXP+10</Text>
                  </View>
                  <View style={styles.ruleItem}>
                    <Text style={styles.ruleText}>Every 20000 blue diamonds recharged</Text>
                    <Text style={styles.ruleExp}>EXP+50</Text>
                  </View>
                  <View style={styles.ruleItem}>
                    <Text style={styles.ruleText}>Every 20000 blue diamond gifts received</Text>
                    <Text style={styles.ruleExp}>EXP+5</Text>
                  </View>
                </View>
              </LinearGradient>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 50,
  },
  headerIcon: {
    padding: 4,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
    textShadowColor: 'rgba(255, 215, 0, 0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  topCard: {
    borderRadius: 20,
    marginHorizontal: 16,
    padding: 18,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  cardLeft: {
    flex: 1.3,
  },
  userName: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  levelValue: {
    color: '#FFF',
    fontSize: 32,
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
    fontWeight: '900',
    marginTop: 6,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 3,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressLabelText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    fontWeight: '700',
  },
  expNeededText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 10,
  },
  cardRight: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarFrameContainer: {
    position: 'relative',
    width: 95,
    height: 95,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crownFrameIcon: {
    position: 'absolute',
    top: -24,
    width: 105,
    height: 105,
    zIndex: 10,
  },
  avatarImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  frameDecoration: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 1.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
    zIndex: 11,
  },
  frameText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 24,
    padding: 4,
    marginHorizontal: 16,
    marginTop: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTabButton: {
    backgroundColor: '#D97706',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  tabText: {
    color: '#A0A0AB',
    fontSize: 15,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFF',
    fontWeight: '800',
  },
  subTabsContainer: {
    marginTop: 20,
  },
  subTabsScrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  subTabItem: {
    alignItems: 'center',
    width: 65,
  },
  subTabIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  activeSubTabIconWrapper: {
    borderColor: '#D97706',
    backgroundColor: 'rgba(217, 119, 6, 0.12)',
  },
  subTabIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  subTabText: {
    color: '#8A8A93',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  activeSubTabText: {
    color: '#D97706',
    fontWeight: '800',
  },
  subTabContent: {
    paddingHorizontal: 16,
    marginTop: 25,
  },
  subTitleBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(217, 119, 6, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.3)',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 16,
  },
  subTitleBadgeText: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  infoText: {
    color: '#8A8A93',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 16,
  },
  medalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  medalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 14,
    width: (width - 48) / 2, // 2 columns
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  medalIconBorder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    marginBottom: 10,
  },
  medalIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  medalLevelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 2.5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFF',
    marginBottom: 8,
  },
  medalLevelText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
  },
  medalName: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  idsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  idCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 14,
    width: (width - 48) / 3, // 3 columns
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  idIcon: {
    width: 36,
    height: 36,
    marginBottom: 8,
  },
  idDigits: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  sidsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  sidCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 14,
    width: (width - 48) / 3, // 3 columns
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  sidIcon: {
    width: 36,
    height: 36,
    marginBottom: 8,
  },
  sidDigits: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyGrid: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyGridText: {
    color: '#8A8A93',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 20,
  },
  rangeScrollContainer: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  rangeScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
  },
  rangeTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  activeRangeTab: {
    backgroundColor: 'rgba(217, 119, 6, 0.15)',
    borderColor: '#D97706',
  },
  rangeTabText: {
    color: '#A0A0AB',
    fontSize: 12,
    fontWeight: '600',
  },
  activeRangeTabText: {
    color: '#FFF',
    fontWeight: '800',
  },
  rewardsListContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  rewardCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  rewardCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
    paddingBottom: 8,
  },
  rewardLevelTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  receivedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  receivedText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },
  rewardItemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  rewardItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: (width - 60) / 2, // 2 columns
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  rewardItemIcon: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  rewardItemName: {
    color: '#A0A0AB',
    fontSize: 11,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E1612',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  modalCloseBtnText: {
    color: '#D97706',
    fontSize: 15,
    fontWeight: '700',
  },
  modalScrollContent: {
    padding: 20,
  },
  rulesCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  rulesCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rulesTitleWrapper: {
    marginLeft: 12,
  },
  rulesCardTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  rulesLimitText: {
    color: '#A0A0AB',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  rulesDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 14,
  },
  rulesList: {
    gap: 12,
  },
  ruleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ruleText: {
    color: '#D4D4D8',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
  },
  ruleExp: {
    color: '#A0A0AB',
    fontSize: 12,
    fontWeight: '700',
  },
  ruleExpHighlight: {
    color: '#FFB300',
    fontSize: 12,
    fontWeight: '800',
  }
});
