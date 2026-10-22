import React, { useState, useRef } from 'react';
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
  FlatList,
} from 'react-native';
import { ChevronLeft, HelpCircle, CheckCircle, ChevronRight, Award, Flame } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');
const defaultAvatar = require('../assets/av1.jpg');

export default function InfluenceScreen({ navigation }) {
  const profile = useSelector((state) => state.auth.profile);
  const [selectedLevel, setSelectedLevel] = useState(1); // Active level in carousel (1 to 9)
  const [rulesModalVisible, setRulesModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [leaderboardModalVisible, setLeaderboardModalVisible] = useState(false);
  const flatListRef = useRef(null);

  const userName = profile?.displayName || profile?.name || 'Amayra';
  const myInfluence = 2100;

  const levelsList = Array.from({ length: 9 }, (_, i) => i + 1);

  const handleLevelChange = (lvl) => {
    setSelectedLevel(lvl);
    flatListRef.current?.scrollToIndex({ index: lvl - 1, animated: true });
  };

  // Level configuration
  const levelsData = {
    1: {
      req: 10000,
      badge: 'https://img.icons8.com/color/256/silver-medal.png',
      cardColors: ['#4F46E5', '#31108F'],
      benefits: [
        { id: 'logo', title: 'Level logo', icon: 'https://img.icons8.com/color/256/silver-medal.png' }
      ]
    },
    2: {
      req: 50000,
      badge: 'https://img.icons8.com/color/256/bronze-medal.png',
      cardColors: ['#EA580C', '#8E2100'],
      benefits: [
        { id: 'logo', title: 'Level logo', icon: 'https://img.icons8.com/color/256/bronze-medal.png' },
        { id: 'headwear', title: 'Exclusive Headwear', icon: 'https://img.icons8.com/color/96/crown.png' }
      ]
    },
    3: {
      req: 200000,
      badge: 'https://img.icons8.com/color/256/medal.png',
      cardColors: ['#0891B2', '#0A4A62'],
      benefits: [
        { id: 'logo', title: 'Level logo', icon: 'https://img.icons8.com/color/256/medal.png' },
        { id: 'headwear', title: 'Exclusive Headwear', icon: 'https://img.icons8.com/color/96/crown.png' }
      ]
    },
    4: {
      req: 800000,
      badge: 'https://img.icons8.com/color/256/gold-medal.png',
      cardColors: ['#0D9488', '#07524A'],
      benefits: [
        { id: 'logo', title: 'Level logo', icon: 'https://img.icons8.com/color/256/gold-medal.png' },
        { id: 'headwear', title: 'Exclusive Headwear', icon: 'https://img.icons8.com/color/96/crown.png' },
        { id: 'chatbar', title: 'Room Chatbar', icon: 'https://img.icons8.com/color/96/chat-bubble.png' }
      ]
    },
    5: {
      req: 2000000,
      badge: 'https://img.icons8.com/color/256/star-medal.png',
      cardColors: ['#DB2777', '#7C0D42'],
      benefits: [
        { id: 'logo', title: 'Level logo', icon: 'https://img.icons8.com/color/256/star-medal.png' },
        { id: 'headwear', title: 'Exclusive Headwear', icon: 'https://img.icons8.com/color/96/crown.png' },
        { id: 'chatbar', title: 'Room Chatbar', icon: 'https://img.icons8.com/color/96/chat-bubble.png' },
        { id: 'entry', title: 'Entry Effect', icon: 'https://img.icons8.com/color/96/magic-wand.png' }
      ]
    },
    6: {
      req: 5000000,
      badge: 'https://img.icons8.com/color/256/award.png',
      cardColors: ['#E11D48', '#880C25'],
      benefits: [
        { id: 'logo', title: 'Level logo', icon: 'https://img.icons8.com/color/256/award.png' },
        { id: 'headwear', title: 'Exclusive Headwear', icon: 'https://img.icons8.com/color/96/crown.png' },
        { id: 'chatbar', title: 'Room Chatbar', icon: 'https://img.icons8.com/color/96/chat-bubble.png' },
        { id: 'entry', title: 'Entry Effect', icon: 'https://img.icons8.com/color/96/magic-wand.png' }
      ]
    },
    7: {
      req: 12000000,
      badge: 'https://img.icons8.com/color/256/warranty.png',
      cardColors: ['#4F46E5', '#1E1B4B'],
      benefits: [
        { id: 'logo', title: 'Level logo', icon: 'https://img.icons8.com/color/256/warranty.png' },
        { id: 'headwear', title: 'Exclusive Headwear', icon: 'https://img.icons8.com/color/96/crown.png' },
        { id: 'chatbar', title: 'Room Chatbar', icon: 'https://img.icons8.com/color/96/chat-bubble.png' },
        { id: 'entry', title: 'Entry Effect', icon: 'https://img.icons8.com/color/96/magic-wand.png' },
        { id: 'banner', title: 'Upgrade Banner', icon: 'https://img.icons8.com/color/96/scroll.png' }
      ]
    },
    8: {
      req: 25000000,
      badge: 'https://img.icons8.com/color/256/crown.png',
      cardColors: ['#059669', '#1A4D2E'],
      benefits: [
        { id: 'logo', title: 'Level logo', icon: 'https://img.icons8.com/color/256/crown.png' },
        { id: 'headwear', title: 'Exclusive Headwear', icon: 'https://img.icons8.com/color/96/crown.png' },
        { id: 'chatbar', title: 'Room Chatbar', icon: 'https://img.icons8.com/color/96/chat-bubble.png' },
        { id: 'entry', title: 'Entry Effect', icon: 'https://img.icons8.com/color/96/magic-wand.png' },
        { id: 'banner', title: 'Upgrade Banner', icon: 'https://img.icons8.com/color/96/scroll.png' }
      ]
    },
    9: {
      req: 40000000,
      badge: 'https://img.icons8.com/color/256/trophy.png',
      cardColors: ['#EAB308', '#854D0E'],
      benefits: [
        { id: 'logo', title: 'Level logo', icon: 'https://img.icons8.com/color/256/trophy.png' },
        { id: 'headwear', title: 'Exclusive Headwear', icon: 'https://img.icons8.com/color/96/crown.png' },
        { id: 'chatbar', title: 'Room Chatbar', icon: 'https://img.icons8.com/color/96/chat-bubble.png' },
        { id: 'entry', title: 'Entry Effect', icon: 'https://img.icons8.com/color/96/magic-wand.png' },
        { id: 'banner', title: 'Upgrade Banner', icon: 'https://img.icons8.com/color/96/scroll.png' },
        { id: 'ranking', title: 'Celebrity Ranking qualifications', icon: 'https://img.icons8.com/color/96/podium.png' }
      ]
    }
  };

  const activeLevel = levelsData[selectedLevel];
  const remainingPoints = Math.max(0, activeLevel.req - myInfluence);

  // Leaderboard lists
  const leaderboardList = [
    { rank: 1, name: 'Venus 👑', points: 9842000, avatar: 'https://img.icons8.com/color/96/popular-topic.png' },
    { rank: 2, name: 'Amayra', points: 8410000, avatar: 'https://img.icons8.com/color/96/werewolf.png' },
    { rank: 3, name: 'Rahul', points: 7150000, avatar: 'https://img.icons8.com/color/96/wolf.png' },
    { rank: 4, name: 'Venom', points: 6200000, avatar: 'https://img.icons8.com/color/96/lion.png' },
    { rank: 5, name: 'Devil', points: 5890000, avatar: 'https://img.icons8.com/color/96/arctic-fox.png' },
  ];

  // Point records
  const influenceRecords = [
    { id: 'rec1', source: 'Gifting in Room #4020', change: '+50', date: '2026-06-13 12:45' },
    { id: 'rec2', source: 'UMO Game Victory', change: '+100', date: '2026-06-13 11:20' },
    { id: 'rec3', source: 'Recharge coins bonus', change: '+1500', date: '2026-06-13 09:10' },
    { id: 'rec4', source: 'Daily room check-in', change: '+450', date: '2026-06-13 08:00' },
  ];

  const handlePrevLevel = () => {
    if (selectedLevel > 1) {
      handleLevelChange(selectedLevel - 1);
    }
  };

  const handleNextLevel = () => {
    if (selectedLevel < 9) {
      handleLevelChange(selectedLevel + 1);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
        <ChevronLeft color="#fff" size={28} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Influence</Text>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity onPress={() => setLeaderboardModalVisible(true)} style={styles.headerIcon}>
          <Image source={{ uri: 'https://img.icons8.com/color/96/trophy.png' }} style={styles.headerBadgeIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRulesModalVisible(true)} style={styles.headerIcon}>
          <HelpCircle color="#E5A920" size={26} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={['#18181B', '#09090B', '#020202']} style={StyleSheet.absoluteFillObject} />

      <SafeAreaView style={{ flex: 1 }}>
        {renderHeader()}

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Badge Carousel Section */}
          <View style={styles.carouselContainer}>
            <FlatList
              ref={flatListRef}
              data={levelsList}
              keyExtractor={(item) => item.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              bounces={false}
              getItemLayout={(data, index) => (
                { length: width, offset: width * index, index }
              )}
              onMomentumScrollEnd={(e) => {
                const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
                setSelectedLevel(newIndex + 1);
              }}
              renderItem={({ item }) => {
                const idx = item; // 1 to 9
                return (
                  <View style={{ width, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Left Badge Preview */}
                    {idx > 1 ? (
                      <TouchableOpacity onPress={() => handleLevelChange(idx - 1)} style={styles.sideBadgeWrapper}>
                        <Image source={{ uri: levelsData[idx - 1].badge }} style={styles.sideBadge} />
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.sideBadgeWrapper} />
                    )}

                    {/* Active Central Badge */}
                    <View style={styles.activeBadgeContainer}>
                      <Image source={{ uri: levelsData[idx].badge }} style={styles.activeBadge} />
                    </View>

                    {/* Right Badge Preview */}
                    {idx < 9 ? (
                      <TouchableOpacity onPress={() => handleLevelChange(idx + 1)} style={styles.sideBadgeWrapper}>
                        <Image source={{ uri: levelsData[idx + 1].badge }} style={styles.sideBadge} />
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.sideBadgeWrapper} />
                    )}
                  </View>
                );
              }}
            />

            {/* Arch path decoration with Svg */}
            <View style={styles.svgArcWrapper}>
              <Svg width={width - 80} height={40} viewBox="0 0 300 40">
                <Path d="M 10 10 Q 150 35 290 10" fill="none" stroke="#D97706" strokeWidth="2" opacity="0.3" />
                {/* Dots on path representing levels */}
                {[...Array(9)].map((_, index) => {
                  const idx = index + 1;
                  const ratio = index / 8;
                  const x = 10 + ratio * 280;
                  // Quad bezier curve calculation: y = (1-t)^2 * y0 + 2(1-t)t * y1 + t^2 * y2
                  const t = ratio;
                  const y = (1 - t) * (1 - t) * 10 + 2 * (1 - t) * t * 35 + t * t * 10;
                  const isActive = idx === selectedLevel;

                  return (
                    <G key={idx} onPress={() => handleLevelChange(idx)}>
                      <Circle
                        cx={x}
                        cy={y}
                        r={isActive ? 6 : 4}
                        fill={isActive ? '#F59E0B' : '#52525B'}
                      />
                      <Circle
                        cx={x}
                        cy={y}
                        r={16}
                        fill="transparent"
                      />
                    </G>
                  );
                })}
              </Svg>
            </View>
          </View>

          {/* Active Level Card */}
          <LinearGradient colors={activeLevel.cardColors} style={styles.statusCard}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.levelNameWrapper}>
                <Text style={styles.levelTitleText}>Lv.{selectedLevel}</Text>
                <View style={styles.lockedBadge}>
                  <Text style={styles.lockedBadgeText}>Locked</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setHistoryModalVisible(true)} style={styles.recordButton}>
                <Text style={styles.recordButtonText}>Record </Text>
                <ChevronRight color="#FFF" size={12} />
              </TouchableOpacity>
            </View>

            <View style={styles.progressRow}>
              <Text style={styles.progressText}>My influence: <Text style={styles.progressBoldValue}>{myInfluence}</Text></Text>
            </View>

            <Text style={styles.requirementDescText}>
              <Text style={styles.highlightText}>{remainingPoints}</Text> more influence required to upgrade to levelLv.{selectedLevel}
            </Text>
          </LinearGradient>

          {/* Level Benefits Subtitle Banner */}
          <View style={styles.benefitsTitleContainer}>
            <LinearGradient colors={['#3F2E23', '#2B1C13']} style={styles.benefitsTitleWrapper}>
              <Text style={styles.benefitsTitleText}>Level Benefits</Text>
            </LinearGradient>
          </View>

          {/* Benefits Grid */}
          <View style={styles.benefitsGrid}>
            {activeLevel.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItemCard}>
                <View style={styles.benefitIconFrame}>
                  <Image source={{ uri: benefit.icon }} style={styles.benefitIcon} />
                </View>
                <Text style={styles.benefitItemText} numberOfLines={2}>{benefit.title}</Text>
              </View>
            ))}
          </View>

          {/* How to Upgrade Table Section */}
          <View style={styles.upgradeSection}>
            <Text style={styles.upgradeSectionTitle}>How to upgrade?</Text>

            <View style={styles.tableCard}>
              {/* Row 1: Gifting */}
              <View style={styles.tableRow}>
                <View style={[styles.tableCellLeft, styles.cellPadding]}>
                  <Text style={styles.cellTitleText}>Gifting</Text>
                </View>
                <View style={[styles.tableCellRight, styles.cellPadding]}>
                  <Text style={styles.cellDescText}>10 coins = 1 influence (maximum 15000 influence per day)</Text>
                </View>
              </View>

              {/* Row 2: Game */}
              <View style={[styles.tableRow, styles.rowBorderTop]}>
                <View style={[styles.tableCellLeft, styles.cellPadding]}>
                  <Text style={styles.cellTitleText}>Game</Text>
                </View>
                <View style={[styles.tableCellRight, styles.cellPadding]}>
                  <Text style={styles.cellDescText}>10 coins = 1 influence (maximum 15000 influence per day)</Text>
                </View>
              </View>

              {/* Row 3: Room Activity */}
              <View style={[styles.tableRow, styles.rowBorderTop]}>
                <View style={[styles.tableCellLeft, styles.cellPadding]}>
                  <Text style={styles.cellTitleText}>Room Activity</Text>
                </View>
                <View style={[styles.tableCellRight, styles.cellPadding]}>
                  <Text style={styles.cellDescText}>Staying in a room for 1 min = 2 influence (maximum 1000 per day)</Text>
                </View>
              </View>

              {/* Row 4: Recharge */}
              <View style={[styles.tableRow, styles.rowBorderTop]}>
                <View style={[styles.tableCellLeft, styles.cellPadding]}>
                  <Text style={styles.cellTitleText}>Recharge</Text>
                </View>
                <View style={[styles.tableCellRight, styles.cellPadding]}>
                  <Text style={styles.cellDescText}>10 coins recharged = 5 influence (no daily limit)</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>

      {/* Rules Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={rulesModalVisible}
        onRequestClose={() => setRulesModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>How to upgrade?</Text>
              <TouchableOpacity onPress={() => setRulesModalVisible(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              <LinearGradient colors={['#271E1A', '#1C1410']} style={styles.rulesCard}>
                <Text style={styles.ruleIntroTitle}>Influence Progression Rules</Text>
                <Text style={styles.ruleIntroText}>
                  Influence points reflect your active presence and support in the chat room ecosystem. Unlocking higher levels grants you premium exclusive entries, badges, and VIP qualifications.
                </Text>
                <View style={styles.rulesDivider} />
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>Gifts sent to room hosts or friends earn 1 point of Influence per 10 coins spent.</Text>
                </View>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>Game victories or entries within the room app earn point conversions similarly.</Text>
                </View>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>Staying active inside room chats counts up to 1000 Influence points every day.</Text>
                </View>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>No limits apply to recharges; every 10 coins recharged instantly grants 5 Influence points.</Text>
                </View>
              </LinearGradient>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* History Records Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={historyModalVisible}
        onRequestClose={() => setHistoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Influence History</Text>
              <TouchableOpacity onPress={() => setHistoryModalVisible(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              {influenceRecords.map((item) => (
                <View key={item.id} style={styles.recordCard}>
                  <View>
                    <Text style={styles.recordSourceText}>{item.source}</Text>
                    <Text style={styles.recordDateText}>{item.date}</Text>
                  </View>
                  <Text style={styles.recordChangeText}>{item.change}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Leaderboard Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={leaderboardModalVisible}
        onRequestClose={() => setLeaderboardModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Influence Leaderboard</Text>
              <TouchableOpacity onPress={() => setLeaderboardModalVisible(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              {leaderboardList.map((user, idx) => (
                <View key={idx} style={styles.leaderboardRow}>
                  <View style={styles.leaderboardRankWrapper}>
                    {user.rank <= 3 ? (
                      <Image
                        source={{ uri: `https://img.icons8.com/color/48/${user.rank === 1 ? 'gold' : user.rank === 2 ? 'silver' : 'bronze'}-medal.png` }}
                        style={styles.rankMedalIcon}
                      />
                    ) : (
                      <Text style={styles.rankNumberText}>{user.rank}</Text>
                    )}
                  </View>
                  <Image source={{ uri: user.avatar }} style={styles.leaderboardAvatar} />
                  <Text style={styles.leaderboardNameText} numberOfLines={1}>{user.name}</Text>
                  <View style={styles.leaderboardScoreWrapper}>
                    <Flame color="#F59E0B" size={14} />
                    <Text style={styles.leaderboardScoreText}>{user.points.toLocaleString()}</Text>
                  </View>
                </View>
              ))}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBadgeIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  carouselContainer: {
    alignItems: 'center',
    marginTop: 20,
    position: 'relative',
    height: 190,
  },
  carouselBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    zIndex: 12,
  },
  sideBadgeWrapper: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.35,
  },
  sideBadge: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  activeBadgeContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
  },
  activeBadge: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
  },
  svgArcWrapper: {
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
  },
  statusCard: {
    borderRadius: 20,
    marginHorizontal: 16,
    padding: 18,
    marginTop: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelNameWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelTitleText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '900',
  },
  lockedBadge: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  lockedBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  recordButtonText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  progressRow: {
    marginTop: 10,
  },
  progressText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '500',
  },
  progressBoldValue: {
    fontWeight: '900',
    color: '#FFF',
  },
  requirementDescText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 10,
    lineHeight: 16,
  },
  highlightText: {
    color: '#FCD34D',
    fontWeight: '800',
  },
  benefitsTitleContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 16,
  },
  benefitsTitleWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#D97706',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  benefitsTitleText: {
    color: '#FBBF24',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
  },
  benefitItemCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    width: (width - 44) / 2, // 2 columns
    padding: 14,
    alignItems: 'center',
  },
  benefitIconFrame: {
    width: 68,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 34,
    marginBottom: 8,
  },
  benefitIcon: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },
  benefitItemText: {
    color: '#D4D4D8',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 14,
  },
  upgradeSection: {
    marginTop: 30,
    paddingHorizontal: 16,
  },
  upgradeSectionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  tableCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
  },
  rowBorderTop: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  tableCellLeft: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.01)',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.05)',
  },
  tableCellRight: {
    flex: 2.5,
    justifyContent: 'center',
  },
  cellPadding: {
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  cellTitleText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  cellDescText: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#18181B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '75%',
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
  ruleIntroTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
  },
  ruleIntroText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
  rulesDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 14,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
    marginTop: 6,
    marginRight: 10,
  },
  bulletText: {
    color: '#E4E4E7',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    lineHeight: 18,
  },
  recordCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  recordSourceText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  recordDateText: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
  },
  recordChangeText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '900',
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  leaderboardRankWrapper: {
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankMedalIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  rankNumberText: {
    color: '#A1A1AA',
    fontSize: 14,
    fontWeight: '800',
  },
  leaderboardAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginLeft: 10,
  },
  leaderboardNameText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 12,
    flex: 1,
  },
  leaderboardScoreWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  leaderboardScoreText: {
    color: '#F59E0B',
    fontSize: 13,
    fontWeight: '800',
  },
});
