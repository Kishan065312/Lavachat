import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  Keyboard
} from 'react-native';
import { ChevronLeft, Search, User2, MessageCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import apiService from '../services/apiService';
import { verticalScale, scale, moderateScale } from 'react-native-size-matters';
import { colors } from '../styles/globalStyles';

export default function SearchScreen() {
  const navigation = useNavigation();
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    if (!searchId.trim()) {
      Alert.alert('Error', 'Please enter a Profile ID');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setResult(null);

    try {
      console.log(`🔍 Searching for Profile ID: ${searchId}...`);
      const response = await apiService.get(`api/User/${searchId}/searchProfile`);
      console.log("✅ Search Result:", JSON.stringify(response, null, 2));

      const profileData = response.data || response;
      if (profileData && profileData.id) {
        setResult(profileData);
      } else {
        Alert.alert('Not Found', 'No user found with this ID');
      }
    } catch (error) {
      console.error("❌ Search Error:", error);
      Alert.alert('Error', 'Failed to search profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToProfile = () => {
    if (result) {
      navigation.navigate('UserProfileDetailScreen', {
        searchedProfile: result
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={colors.text} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search User</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* INPUT BOX */}
        <View style={styles.searchBoxContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Profile ID (e.g. 10000029)"
            placeholderTextColor="#aaa"
            value={searchId}
            onChangeText={setSearchId}
            keyboardType="default"
            onSubmitEditing={handleSearch}
            autoFocus={true}
          />
          <TouchableOpacity 
            style={styles.searchIconBtn} 
            onPress={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Search color={colors.primary} size={24} />
            )}
          </TouchableOpacity>
        </View>

        {/* RESULTS AREA */}
        <View style={styles.resultArea}>
          {loading && !result && (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.infoText}>Searching...</Text>
            </View>
          )}

          {!loading && !result && !searchId && (
            <View style={styles.centerBox}>
              <Search color={colors.textDim} size={80} />
              <Text style={styles.infoText}>Enter an ID to find users</Text>
            </View>
          )}

          {result && (
            <TouchableOpacity 
              style={styles.profileCard} 
              activeOpacity={0.8}
              onPress={navigateToProfile}
            >
              <Image 
                source={result.profilePictureUrl ? { uri: result.profilePictureUrl } : require('../assets/av1.jpg')} 
                style={styles.avatar} 
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{result.name || "Unknown User"}</Text>
                <Text style={styles.profileIdText}>ID: {result.profileId || result.id}</Text>
                {/* {result.isRoomParticipant && (
                  <View style={styles.liveBadge}>
                    <Text style={styles.liveText}>In Room</Text>
                  </View>
                )} */}
              </View>
              <ChevronLeft color="#aaa" size={24} style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    height: verticalScale(60),
    marginTop: verticalScale(10),
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
  },
  searchBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: moderateScale(30),
    paddingHorizontal: scale(15),
    borderWidth: 1,
    borderColor: colors.border,
    height: verticalScale(50),
  },
  input: {
    flex: 1,
    height: '100%',
    color: colors.text,
    fontSize: moderateScale(15),
    paddingLeft: scale(5),
  },
  searchIconBtn: {
    padding: scale(5),
  },
  resultArea: {
    flex: 1,
    marginTop: verticalScale(30),
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
  infoText: {
    color: colors.primary,
    fontSize: moderateScale(14),
    marginTop: verticalScale(15),
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: scale(15),
    borderRadius: moderateScale(15),
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    borderWidth: 2,
    borderColor: colors.primary,
  },
  profileInfo: {
    flex: 1,
    marginLeft: scale(15),
  },
  profileName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: colors.text,
  },
  profileIdText: {
    fontSize: moderateScale(13),
    color: colors.primary,
    marginTop: verticalScale(4),
  },
  liveBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#00E5FF',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(10),
    marginTop: verticalScale(6),
  },
  liveText: {
    color: '#000',
    fontSize: moderateScale(10),
    fontWeight: 'bold',
  }
});
