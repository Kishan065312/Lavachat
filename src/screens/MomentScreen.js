import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { MoreVertical, MessageCircle, Heart, Share, Gift, Hash } from 'lucide-react-native';
import { globalStyles, colors } from '../styles/globalStyles';

const { width } = Dimensions.get('window');

const DUMMY_POSTS = [
  {
    id: '1',
    user: {
      name: 'shanaya',
      avatar: require('../assets/av1.jpg'),
      time: '2 h ago',
      level: 'LV.4',
      vip: 'SVIP 1',
    },
    topic: 'Good Vibe',
    text: 'Main chanchal hu thodi\npar\nWo sabar rakhata hai\nWo shaq nii karta\nBas mere achche bure ki khabar rakhata hai\nAur main har vakt apni harkto se pareshan karti rahti hu ...',
    image: require('../assets/grid1.jpg'),
    stats: {
      shares: 0,
      comments: 22,
      likes: 26,
      gifts: '755.64K'
    }
  },
  {
    id: '2',
    user: {
      name: 'NightRider',
      avatar: require('../assets/av1.jpg'),
      time: '5 h ago',
      level: 'LV.28',
      vip: 'SVIP 2',
    },
    topic: 'Gaming Life',
    text: 'Late night sessions with the squad! 🎮🔥',
    image: require('../assets/banner_1.jpeg'),
    stats: {
      shares: 5,
      comments: 14,
      likes: 89,
      gifts: '12K'
    }
  }
];

export default function MomentScreen() {
  const [activeTab, setActiveTab] = useState('Trending');
  
  const TABS = ['Follow', 'Trending', 'Topic'];

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <Image source={item.user.avatar} style={styles.avatar} />
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{item.user.name}</Text>
            {/* Badges */}
            <View style={styles.vipBadge}>
              <Text style={styles.badgeText}>{item.user.vip}</Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.badgeText}>{item.user.level}</Text>
            </View>
          </View>
          <Text style={styles.timeText}>{item.user.time} • 🌎</Text>
        </View>
        
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followText}>Follow</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={{ padding: 5 }}>
          <MoreVertical color={colors.textDim} size={20} />
        </TouchableOpacity>
      </View>

      {/* Topic Pill */}
      {item.topic && (
        <View style={styles.topicPill}>
          <Hash color={colors.primary} size={12} />
          <Text style={styles.topicText}>{item.topic} {'>'}</Text>
        </View>
      )}

      {/* Post Content */}
      <Text style={styles.postText}>
        {item.text}
        <Text style={styles.moreText}> More</Text>
      </Text>

      {/* Post Image */}
      {item.image && (
        <Image source={item.image} style={styles.postImage} />
      )}

      {/* Post Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn}>
          <Share color={colors.textDim} size={20} />
        </TouchableOpacity>
        
        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.actionBtn}>
            <MessageCircle color={colors.textDim} size={20} />
            <Text style={styles.actionText}>{item.stats.comments}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionBtn}>
            <Heart color={colors.textDim} size={20} />
            <Text style={styles.actionText}>{item.stats.likes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionBtn}>
            <Gift color={colors.textDim} size={20} />
            <Text style={styles.actionText}>{item.stats.gifts}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={globalStyles.screen}>
      {/* Top Tabs */}
      <View style={styles.topTabs}>
        {TABS.map(tab => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabButton}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={DUMMY_POSTS}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={() => (
          <View style={styles.bannerContainer}>
            <Image 
              source={require('../assets/banner_2.png')} 
              style={styles.bannerImage} 
            />
          </View>
        )}
        renderItem={renderPost}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  tabButton: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: colors.textDim,
    fontWeight: '600',
  },
  tabTextActive: {
    fontSize: 22,
    color: '#00C9FF',
    fontWeight: 'bold',
  },
  activeIndicator: {
    marginTop: 4,
    width: 20,
    height: 3,
    backgroundColor: '#00C9FF',
    borderRadius: 2,
  },
  bannerContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  bannerImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    resizeMode: 'contain',
    backgroundColor: '#0A0A0A',
  },
  postCard: {
    backgroundColor: colors.card,
    marginBottom: 10,
    padding: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  userName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 6,
  },
  vipBadge: {
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    borderWidth: 0.5,
    borderColor: '#FF9800',
  },
  levelBadge: {
    backgroundColor: 'rgba(233, 30, 99, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#E91E63',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  timeText: {
    color: colors.textDim,
    fontSize: 11,
  },
  followButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    marginRight: 10,
  },
  followText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  topicPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 204, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  topicText: {
    color: colors.primary,
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  postText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  moreText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  postImage: {
    width: width,
    height: width * 0.8,
    marginLeft: -15,
    marginBottom: 15,
    resizeMode: 'contain',
    backgroundColor: '#0A0A0A',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: colors.textDim,
    fontSize: 12,
    marginLeft: 5,
    fontWeight: '500',
  }
});
