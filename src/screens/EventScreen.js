import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import { globalStyles, colors } from '../styles/globalStyles';

const { width } = Dimensions.get('window');

const DUMMY_EVENTS = [
  {
    id: '1',
    title: 'Recharge Star',
    time: '2026/05/01 - 2026/06/01',
    image: require('../assets/banner_1.jpeg'),
  },
  {
    id: '2',
    title: 'Monthly Consumption',
    time: '2026/05/01 - 2026/06/01',
    image: require('../assets/banner_2.png'),
  },
  {
    id: '3',
    title: 'Zodiac Rhythm',
    time: '2026/05/03 - 2026/05/14',
    image: require('../assets/banner.png'),
  },
  {
    id: '4',
    title: 'Recharge Bonus Event',
    time: '2026/04/24 - 2027/05/31',
    image: require('../assets/banner_1.jpeg'),
  },
];

export default function EventScreen() {
  const [activeTab, setActiveTab] = useState('Hot');

  const renderEvent = ({ item }) => (
    <View style={styles.eventCard}>
      <Image source={item.image} style={styles.eventImage} />
      <View style={styles.timeOverlay}>
        <Text style={styles.timeText}>Event time: {item.time}</Text>
      </View>
    </View>
  );

  return (
    <View style={[globalStyles.screen, { paddingTop: 40 }]}>
      {/* <Text style={styles.headerTitle}> Events</Text> */}

      {/* Tabs */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 40, marginBottom: 20 }}>
        <TouchableOpacity style={{ alignItems: 'center', position: 'relative' }} onPress={() => setActiveTab('Hot')}>
          <Text style={[styles.tabText, activeTab === 'Hot' && styles.tabTextActive, { fontSize: activeTab === 'Hot' ? 22 : 16 }]}>Event</Text>
          {activeTab === 'Hot' && <View style={{ position: 'absolute', bottom: -8, height: 3, width: 20, backgroundColor: colors.primary, borderRadius: 1.5 }} />}
        </TouchableOpacity>

        <TouchableOpacity style={{ alignItems: 'center', position: 'relative' }} onPress={() => setActiveTab('Room')}>
          <Text style={[styles.tabText, activeTab === 'Room' && styles.tabTextActive, { fontSize: activeTab === 'Room' ? 22 : 16 }]}>Activity</Text>
          {activeTab === 'Room' && <View style={{ position: 'absolute', bottom: -8, height: 3, width: 20, backgroundColor: colors.primary, borderRadius: 1.5 }} />}
        </TouchableOpacity>
      </View>

      <FlatList
        data={DUMMY_EVENTS}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  tabButton: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: colors.textDim,
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  eventCard: {
    width: '100%',
    height: 130, // Increased height to prevent cropping
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    backgroundColor: colors.card,
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
  },
  eventImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch', // Changed to stretch to fit the card without cropping
  },
  timeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  timeText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '500',
  }
});