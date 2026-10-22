import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Image, 
  StatusBar, 
  Platform 
} from 'react-native';
import { ChevronLeft, CheckCircle2 } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function RewardRecordScreen({ navigation }) {
  const records = [
    { id: 1, date: '2026.06.09 02:01:45', diamonds: '2,661,189', items: '4' },
    { id: 2, date: '2026.06.08 02:01:49', diamonds: '3,600,000', items: '4' },
    { id: 3, date: '2026.06.07 02:01:49', diamonds: '3,600,000', items: '4' },
    { id: 4, date: '2026.06.06 02:01:41', diamonds: '570,686', items: '1' },
    { id: 5, date: '2026.06.05 02:01:20', diamonds: '67,770', items: null },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={['#1a1a24', '#0f0f15', '#000000']} style={StyleSheet.absoluteFillObject} />
      
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
            <ChevronLeft color="#fff" size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reward Record</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {records.map((record) => (
            <View key={record.id} style={styles.recordCard}>
              {/* Stacked header to prevent text overlapping/collision on narrow screens */}
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleContainer}>
                  <CheckCircle2 color="#00E676" size={16} />
                  <Text style={styles.cardTitle}>Diamond rewards received</Text>
                </View>
                <Text style={styles.dateText}>{record.date}</Text>
              </View>

              <View style={styles.rewardItems}>
                <View style={styles.rewardItem}>
                  <Image source={{uri: 'https://img.icons8.com/color/96/diamond.png'}} style={styles.rewardIcon} />
                  <Text style={styles.rewardCount}>x{record.diamonds}</Text>
                </View>
                {record.items && (
                  <View style={styles.rewardItem}>
                    <Image source={{uri: 'https://img.icons8.com/color/96/volcano.png'}} style={styles.rewardIcon} />
                    <Text style={styles.rewardCount}>x{record.items}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
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
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  recordCard: {
    backgroundColor: '#1E1E28',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    paddingBottom: 10,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  dateText: {
    color: '#8A8A93',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 24, // Indent to align with text rather than checkmark icon
  },
  rewardItems: {
    flexDirection: 'row',
    gap: 24,
  },
  rewardItem: {
    alignItems: 'center',
  },
  rewardIcon: {
    width: 45,
    height: 45,
    marginBottom: 8,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rewardCount: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  }
});
