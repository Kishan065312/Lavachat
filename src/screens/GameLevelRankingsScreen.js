import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Image, 
  Dimensions, 
  StatusBar, 
  Platform 
} from 'react-native';
import { ChevronLeft, Calendar } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const defaultAvatar = require('../assets/av1.jpg');

export default function GameLevelRankingsScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('Game');
  const tabs = ['Top Party', 'Top Gifters', 'Top Star', 'Game'];

  const rankingData = [
    { rank: 4, name: 'Deep', country: '🇮🇳', avatar: 'https://img.icons8.com/color/96/user-male-circle.png', score: '450,210' },
    { rank: 5, name: 'Princess', country: '🇮🇳', avatar: 'https://img.icons8.com/color/96/girl.png', score: '380,940' },
    { rank: 6, name: 'Kundan Jaat', country: '🇮🇳', avatar: 'https://img.icons8.com/color/96/user-female-circle.png', score: '320,150' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={['#1a0606', '#2b0c0c', '#0f0404']} style={StyleSheet.absoluteFillObject} />
      
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
            <ChevronLeft color="#fff" size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rankings</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Calendar color="#fff" size={22} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Premium Pill Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => {
            const isSelected = selectedTab === tab;
            return (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tab, isSelected && styles.activeTab]}
                onPress={() => setSelectedTab(tab)}
              >
                {tab === 'Game' && <Image source={{uri: 'https://img.icons8.com/color/48/fire-element.png'}} style={styles.tabIcon} />}
                <Text style={[styles.tabText, isSelected && styles.activeTabText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Professional 3D Podium Section */}
          <View style={styles.podiumSection}>
            
            {/* 2nd Place (Left Column) */}
            <View style={styles.podiumColumn}>
              <View style={styles.avatarContainer}>
                <Image 
                  source={{uri: 'https://img.icons8.com/color/96/user-female-circle.png'}} 
                  defaultSource={defaultAvatar}
                  style={[styles.avatar, { borderColor: '#C0C0C0' }]} 
                />
                <LinearGradient colors={['#C0C0C0', '#7E7E7E']} style={styles.podiumBadge}>
                  <Text style={styles.podiumBadgeText}>2</Text>
                </LinearGradient>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>NOOR</Text>
              <View style={styles.podiumValueRow}>
                <Image source={{uri: 'https://img.icons8.com/color/48/fire-element.png'}} style={styles.fireIcon} />
                <Text style={styles.podiumValue}>850k</Text>
              </View>
              {/* Pedestal block */}
              <LinearGradient 
                colors={['rgba(192, 192, 192, 0.25)', 'rgba(192, 192, 192, 0.03)']} 
                style={[styles.pedestal, { height: 75, borderColor: 'rgba(192, 192, 192, 0.4)' }]} 
              />
            </View>

            {/* 1st Place (Center Column) */}
            <View style={[styles.podiumColumn, styles.firstPlaceColumn]}>
              <Image source={{uri: 'https://img.icons8.com/color/96/crown.png'}} style={styles.podiumCrown} />
              <View style={styles.avatarContainer}>
                <Image 
                  source={{uri: 'https://img.icons8.com/color/96/user-male-circle.png'}} 
                  defaultSource={defaultAvatar}
                  style={[styles.avatar, styles.firstPlaceAvatar]} 
                />
                <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.podiumBadge}>
                  <Text style={styles.podiumBadgeText}>1</Text>
                </LinearGradient>
              </View>
              <Text style={[styles.podiumName, styles.firstPlaceName]} numberOfLines={1}>MAHI</Text>
              <View style={styles.podiumValueRow}>
                <Image source={{uri: 'https://img.icons8.com/color/48/fire-element.png'}} style={styles.fireIcon} />
                <Text style={styles.podiumValue}>1.2M</Text>
              </View>
              {/* Pedestal block */}
              <LinearGradient 
                colors={['rgba(255, 215, 0, 0.35)', 'rgba(255, 215, 0, 0.03)']} 
                style={[styles.pedestal, { height: 105, borderColor: 'rgba(255, 215, 0, 0.5)' }]} 
              />
            </View>

            {/* 3rd Place (Right Column) */}
            <View style={styles.podiumColumn}>
              <View style={styles.avatarContainer}>
                <Image 
                  source={{uri: 'https://img.icons8.com/color/96/boy.png'}} 
                  defaultSource={defaultAvatar}
                  style={[styles.avatar, { borderColor: '#CD7F32' }]} 
                />
                <LinearGradient colors={['#CD7F32', '#8C5220']} style={styles.podiumBadge}>
                  <Text style={styles.podiumBadgeText}>3</Text>
                </LinearGradient>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>uday</Text>
              <View style={styles.podiumValueRow}>
                <Image source={{uri: 'https://img.icons8.com/color/48/fire-element.png'}} style={styles.fireIcon} />
                <Text style={styles.podiumValue}>620k</Text>
              </View>
              {/* Pedestal block */}
              <LinearGradient 
                colors={['rgba(205, 127, 50, 0.25)', 'rgba(205, 127, 50, 0.03)']} 
                style={[styles.pedestal, { height: 55, borderColor: 'rgba(205, 127, 50, 0.4)' }]} 
              />
            </View>

          </View>

          {/* Premium Glassmorphic Ranking List */}
          <View style={styles.rankingList}>
            {rankingData.map((item) => (
              <LinearGradient 
                key={item.rank}
                colors={['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.02)']} 
                style={styles.rankingCard}
              >
                <View style={styles.rankLeft}>
                  <Text style={styles.rankNumber}>{item.rank}</Text>
                  <Image 
                    source={{uri: item.avatar}} 
                    defaultSource={defaultAvatar}
                    style={styles.listAvatar} 
                  />
                  <Text style={styles.listFlag}>{item.country}</Text>
                  <Text style={styles.listName}>{item.name}</Text>
                </View>
                
                <View style={styles.rankRight}>
                  <Image source={{uri: 'https://img.icons8.com/color/48/fire-element.png'}} style={styles.fireIconList} />
                  <Text style={styles.scoreText}>{item.score}</Text>
                </View>
              </LinearGradient>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Bottom Sticky User Rank */}
      <View style={styles.bottomBar}>
        <View style={styles.rankLeft}>
          <Text style={styles.rankNumberBottom}>--</Text>
          <Image 
            source={{uri: 'https://img.icons8.com/color/96/user-male-circle.png'}} 
            defaultSource={defaultAvatar}
            style={styles.listAvatar} 
          />
          <Text style={styles.listNameBottom}>VEN 🌍 S</Text>
        </View>
        
        <View style={styles.rankRight}>
          <Image source={{uri: 'https://img.icons8.com/color/48/fire-element.png'}} style={styles.fireIconList} />
          <Text style={styles.scoreTextBottom}>245,600</Text>
        </View>
      </View>
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
    fontSize: 22,
    fontWeight: '800',
    textShadowColor: 'rgba(255, 215, 0, 0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 24,
    padding: 4,
    marginHorizontal: 16,
    marginTop: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  tabIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  tabText: {
    color: '#A0A0AB',
    fontSize: 13,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFD700',
    fontWeight: '800',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  podiumSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 35,
    paddingHorizontal: 16,
  },
  podiumColumn: {
    flex: 1,
    alignItems: 'center',
  },
  firstPlaceColumn: {
    zIndex: 10,
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    borderWidth: 2,
  },
  firstPlaceAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  podiumCrown: {
    width: 38,
    height: 38,
    marginBottom: -8,
    zIndex: 11,
  },
  podiumBadge: {
    position: 'absolute',
    bottom: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  podiumBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
  },
  podiumName: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'center',
    width: '90%',
  },
  firstPlaceName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFD700',
  },
  podiumValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  fireIcon: {
    width: 12,
    height: 12,
    marginRight: 3,
  },
  podiumValue: {
    color: '#FFB300',
    fontSize: 11,
    fontWeight: '800',
  },
  pedestal: {
    width: '90%',
    borderRadius: 12,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  rankingList: {
    paddingHorizontal: 16,
    marginTop: 25,
  },
  rankingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  rankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankNumber: {
    color: '#A0A0AB',
    fontSize: 16,
    fontWeight: '800',
    width: 28,
  },
  listAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  listFlag: {
    fontSize: 16,
    marginRight: 8,
  },
  listName: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  rankRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fireIconList: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
  scoreText: {
    color: '#FFB300',
    fontSize: 13,
    fontWeight: '800',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(26, 6, 6, 0.98)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 14,
  },
  rankNumberBottom: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    width: 35,
  },
  listNameBottom: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  scoreTextBottom: {
    color: '#FFD700',
    fontSize: 15,
    fontWeight: '800',
  }
});
