import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { 
  MessageCircle, 
  ShieldCheck, 
  Flame,
  Gift,
  Users,
  Camera,
  Gamepad2,
  Mic,
  Heart,
  ClipboardCheck,
  Star,
  ChevronRight
} from 'lucide-react-native';
import { globalStyles, colors } from '../styles/globalStyles';

const { width } = Dimensions.get('window');

const MESSAGES_DATA = [
  {
    id: '1',
    name: '༺𝓥𝓮𝓷𝓸𝓶 ༻',
    avatar: require('../assets/av1.jpg'),
    gender: 'male',
    country: '🇮🇳',
    userId: '100723529',
    badge: null,
  },
  {
    id: '2',
    name: 'HÄRŞH',
    avatar: require('../assets/av1.jpg'),
    gender: 'male',
    country: '🇮🇳',
    userId: '103405998',
    badge: null,
  },
  {
    id: '3',
    name: '⚡DANGER⚡',
    avatar: require('../assets/av1.jpg'),
    gender: 'male',
    country: '🇮🇳',
    userId: '6666',
    badge: { type: 'vip', text: 'SVIP 5', level: 'ID 6666' },
  },
  {
    id: '4',
    name: 'M R PATEL',
    avatar: require('../assets/av1.jpg'),
    gender: 'male',
    country: '🇮🇳',
    userId: '102853266',
    badge: null,
  },
  {
    id: '5',
    name: '"Dario;;',
    avatar: require('../assets/av1.jpg'),
    gender: 'male',
    country: '🇮🇳',
    userId: '100383556',
    badge: null,
  },
  {
    id: '6',
    name: 'Øffi¢iAł JAss',
    avatar: require('../assets/av1.jpg'),
    gender: 'male',
    country: '🇮🇳',
    userId: '110011',
    badge: { type: 'official', text: 'Official', level: 'ID 110011' },
    isOfficial: true,
  },
  {
    id: '7',
    name: '†○R† HİL🔥',
    avatar: require('../assets/av1.jpg'),
    gender: 'male',
    country: '🇮🇳',
    userId: '1300',
    badge: { type: 'vip', text: 'SVIP 3', level: 'ID 1300' },
  },
  {
    id: '8',
    name: '🤫STUPID⚡',
    avatar: require('../assets/av1.jpg'),
    gender: 'male',
    country: '🇮🇳',
    userId: '10011',
    badge: { type: 'vip', text: 'SVIP 2', level: 'ID 10011' },
  },
];

const OFFICIAL_ACHO_DATA = [
  { id: 'oa1', name: 'Official', isOfficialAcho: true, iconColors: ['#FF9500', '#FF5E3A'], iconName: ShieldCheck },
  { id: 'oa2', name: 'Reward Notification', isOfficialAcho: true, iconColors: ['#F2C94C', '#F2994A'], iconName: Gift },
  { id: 'oa3', name: 'Friends Request', isOfficialAcho: true, iconColors: ['#2F80ED', '#56CCF2'], iconName: Users },
  { id: 'oa4', name: 'moments Notificatio', isOfficialAcho: true, iconColors: ['#B06AB3', '#4568DC'], iconName: Camera },
  { id: 'oa5', name: 'Game', isOfficialAcho: true, iconColors: ['#f12711', '#f5af19'], iconName: Gamepad2 },
  { id: 'oa6', name: 'Room', isOfficialAcho: true, iconColors: ['#00C9FF', '#92FE9D'], iconName: Mic },
  { id: 'oa7', name: 'Relationship', isOfficialAcho: true, iconColors: ['#FF416C', '#FF4B2B'], iconName: Heart },
  { id: 'oa8', name: 'Review', isOfficialAcho: true, iconColors: ['#22c55e', '#16a34a'], iconName: ClipboardCheck },
  { id: 'oa9', name: 'commendation', isOfficialAcho: true, iconColors: ['#eab308', '#f59e0b'], iconName: Star },
];

export default function MessageListScreen() {
  const [activeTab, setActiveTab] = useState('Message');
  const navigation = useNavigation();

  const renderItem = ({ item }) => {
    if (item.isOfficialAcho) {
      const IconComp = item.iconName;
      return (
        <TouchableOpacity style={[styles.card, { padding: 10, marginBottom: 8, borderRadius: 12 }]}>
          <LinearGradient
            colors={item.iconColors}
            style={{ width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          >
            <IconComp color="#fff" size={18} />
          </LinearGradient>
          <View style={styles.infoContainer}>
            <Text style={[styles.name, { fontSize: 14, maxWidth: '100%' }]}>{item.name}</Text>
          </View>
          <ChevronRight color={colors.textDim} size={16} />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity 
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('DirectChatScreen', { friend: item })}
      >
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.avatarRing}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        >
          <Image source={item.avatar} style={styles.avatar} />
        </LinearGradient>
        
        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <View style={styles.dot} />
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            {/* Gender Icon */}
            <LinearGradient colors={['#00C9FF', '#92FE9D']} style={styles.genderIcon} start={{x:0, y:0}} end={{x:1, y:0}}>
              <Text style={{ fontSize: 9, color: '#000', fontWeight: 'bold' }}>♂</Text>
            </LinearGradient>
            <Text style={styles.flag}>{item.country}</Text>
            {item.isOfficial && (
              <LinearGradient colors={['#FF9500', '#FF5E3A']} style={styles.officialBadge} start={{x:0, y:0}} end={{x:1, y:0}}>
                <ShieldCheck color="#fff" size={10} />
                <Text style={styles.officialText}>Official</Text>
              </LinearGradient>
            )}
          </View>

          {item.badge ? (
            <LinearGradient 
              colors={item.badge.type === 'official' ? ['#FFA100', '#FF5500'] : ['#FFD700', '#FF8C00']} 
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.idBadge}
            >
              <Text style={styles.idBadgeText}>{item.badge.level}</Text>
            </LinearGradient>
          ) : (
            <Text style={styles.userIdText}>ID {item.userId}</Text>
          )}
        </View>

        <TouchableOpacity 
          style={styles.chatButton}
          onPress={() => navigation.navigate('DirectChatScreen', { friend: item })}
        >
          <LinearGradient
            colors={['rgba(0, 255, 204, 0.2)', 'rgba(0, 255, 204, 0.05)']}
            style={styles.chatIconWrapper}
          >
            <MessageCircle size={20} color={colors.primary} />
          </LinearGradient>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Segmented Control */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 30 }}>
          <TouchableOpacity style={{ alignItems: 'center', position: 'relative' }} onPress={() => setActiveTab('Friends')}>
            <Text style={[styles.segmentText, activeTab === 'Friends' && styles.activeSegmentText, { fontSize: activeTab === 'Friends' ? 22 : 16 }]}>Friends</Text>
            {activeTab === 'Friends' && <View style={{ position: 'absolute', bottom: -8, height: 3, width: 20, backgroundColor: colors.primary, borderRadius: 1.5 }} />}
          </TouchableOpacity>
          
          <TouchableOpacity style={{ alignItems: 'center', position: 'relative' }} onPress={() => setActiveTab('Message')}>
            <View style={{ flexDirection: 'row', position: 'relative' }}>
              <Text style={[styles.segmentText, activeTab === 'Message' && styles.activeSegmentText, { fontSize: activeTab === 'Message' ? 22 : 16 }]}>Message</Text>
              <View style={styles.redDot} />
            </View>
            {activeTab === 'Message' && <View style={{ position: 'absolute', bottom: -8, height: 3, width: 20, backgroundColor: colors.primary, borderRadius: 1.5 }} />}
          </TouchableOpacity>
          
          <TouchableOpacity style={{ alignItems: 'center', position: 'relative' }} onPress={() => setActiveTab('Official Acho')}>
            <Text style={[styles.segmentText, activeTab === 'Official Acho' && styles.activeSegmentText, { fontSize: activeTab === 'Official Acho' ? 22 : 16 }]}>Official Acho</Text>
            {activeTab === 'Official Acho' && <View style={{ position: 'absolute', bottom: -8, height: 3, width: 20, backgroundColor: colors.primary, borderRadius: 1.5 }} />}
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={activeTab === 'Official Acho' ? OFFICIAL_ACHO_DATA : MESSAGES_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Lavachat Dark background
  },
  header: {
    paddingHorizontal: 15,
    paddingTop: 45, // Add some top padding to clear status bar if needed
    paddingBottom: 20,
  },
  segmentControl: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segmentBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  activeSegmentBtn: {
    backgroundColor: 'rgba(0, 255, 204, 0.15)', // Neon active state
  },
  segmentText: {
    color: colors.textDim,
    fontWeight: 'bold',
  },
  activeSegmentText: {
    color: colors.primary, // Neon green text
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
    position: 'absolute',
    top: 0,
    right: -8,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  avatarRing: {
    padding: 2,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: colors.card,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary, // Lavachat Neon Green
    marginRight: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    maxWidth: width * 0.35,
  },
  genderIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  flag: {
    fontSize: 13,
    marginLeft: 6,
  },
  officialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  officialText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  idBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  idBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  userIdText: {
    color: colors.textDim,
    fontSize: 13,
    fontWeight: '600',
  },
  chatButton: {
    padding: 5,
  },
  chatIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
