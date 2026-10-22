import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  StatusBar, 
  Platform 
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function GameLevelRulesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={['#1a1a24', '#0f0f15', '#000000']} style={StyleSheet.absoluteFillObject} />
      
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
            <ChevronLeft color="#fff" size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rules</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>1.Game level</Text>
          <Text style={styles.paragraph}>
            The game level is divided into 6 levels. The game levels determined by your game points in the last 30 days Game points are obtained by playing on designated games (
            <Text style={styles.highlightText}>Lucky fruit, Greedy Pro, Jackpot, Teen Patti, Fruit party, Greedy Box, Jackpot slot, Lucky 77</Text>
            ). playing 1 Diamond = 1 game points.
          </Text>
          <Text style={styles.paragraph}>
            Each level enjoys different level privileges. The higher the level, the more privileges.
          </Text>

          <Text style={styles.sectionTitle}>2.Game level upgrade rules</Text>
          <Text style={styles.paragraph}>
            Each game level is valid for 30 days. When your game points reach the corresponding upgrade value, your game level will be upgraded immediately, and points returning to 0. After upgrading, the level is valid for 30 days from the day of upgrade.
          </Text>

          <Text style={styles.sectionTitle}>3.Game level maintain and downgrade rules Each game level is valid for 30 days.</Text>
          <Text style={styles.paragraph}>
            During this period, if your game points do not reach the maintain value of the current level (the maintain value is the lower level of your current level ), your game level will be down graded after the validity period.
          </Text>

          <Text style={styles.sectionTitle}>4.Rewards:</Text>
          <Text style={styles.paragraph}>
            Blue Diamond: Different levels have corresponding coin return ratios and daily maximum Blue Diamond return amounts;
          </Text>
          <Text style={styles.paragraph}>
            Gifts: Different levels have different lucky package gifts, the more you play, the more gifts you get After each day, you can unlock the rewards the next day. If you don't claim them, the rewards will disappear.
          </Text>
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
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
    padding: 24,
    paddingBottom: 60,
  },
  sectionTitle: {
    color: '#FFD700',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 25,
    marginBottom: 12,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(255, 215, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  paragraph: {
    color: '#D1D1D6',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 10,
    fontWeight: '500',
  },
  highlightText: {
    color: '#FF9800', // Rich orange color
    fontWeight: '700',
  }
});
