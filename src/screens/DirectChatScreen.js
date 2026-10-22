import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar
} from 'react-native';
import { ChevronLeft, User, Heart, BookOpen, Mic, Send, Star, ShieldAlert } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function DirectChatScreen({ navigation, route }) {
  // Retrieve the friend data passed via params (fallback to Manya if none)
  const friend = route?.params?.friend || {
    name: 'Máṉẏȧ',
    avatar: require('../assets/av1.jpg'),
    userId: '10000025'
  };

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'date',
      text: '21 Jun 2026 09:26'
    },
    {
      id: '2',
      type: 'incoming_text',
      text: "We have been friends. Let's chat",
      avatar: friend.avatar
    },
    {
      id: '3',
      type: 'proposal_card',
      title: "I'd like to be your CP",
      desc: "Automatically expire after 24 hours",
      btnText: "View",
      avatar: require('../assets/av1.jpg') // Main User's avatar
    },
    {
      id: '4',
      type: 'success_card',
      title: "We are already CP!",
      desc: "CP gift and Ring have been distributed to Rox",
      btnText: "Go to CP space",
      leftAvatar: require('../assets/av1.jpg'), // Main User's avatar
      rightAvatar: friend.avatar
    },
    {
      id: '5',
      type: 'ring_card',
      title: "I presented you a ring",
      desc: "Go check out your new CP ring space!",
      btnText: "Go to CP space",
      ringImage: 'https://img.icons8.com/color/96/wedding-ring.png'
    }
  ]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage = {
      id: String(Date.now()),
      type: 'outgoing_text',
      text: inputText
    };
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  const renderMessageItem = ({ item }) => {
    switch (item.type) {
      case 'date':
        return (
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{item.text}</Text>
          </View>
        );

      case 'incoming_text':
        return (
          <View style={styles.incomingTextContainer}>
            <Image source={item.avatar} style={styles.chatAvatar} />
            <View style={styles.incomingBubble}>
              <Text style={styles.chatText}>{item.text}</Text>
            </View>
          </View>
        );

      case 'outgoing_text':
        return (
          <View style={styles.outgoingTextContainer}>
            <View style={styles.outgoingBubble}>
              <Text style={styles.outgoingText}>{item.text}</Text>
            </View>
          </View>
        );

      case 'proposal_card':
        return (
          <View style={styles.outgoingCardContainer}>
            <LinearGradient
              colors={['#FFF5F6', '#FFEBEF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.proposalCard}
            >
              <View style={styles.proposalHeaderRow}>
                <View style={styles.heartGraphicCircle}>
                  <Heart color="#FF4F7E" fill="#FF4F7E" size={26} />
                  <Heart color="#FF9AB5" fill="#FF9AB5" size={14} style={styles.miniHeartOverlay} />
                </View>
                <View style={styles.proposalTextContainer}>
                  <Text style={styles.proposalTitle}>{item.title}</Text>
                  <Text style={styles.proposalDesc}>{item.desc}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.viewBtn}
                  onPress={() => navigation.navigate('CPSpaceScreen')}
                >
                  <Text style={styles.viewBtnText}>{item.btnText}</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
            <Image source={item.avatar} style={[styles.chatAvatar, { marginLeft: 8 }]} />
          </View>
        );

      case 'success_card':
        return (
          <View style={styles.incomingCardContainer}>
            <Image source={item.rightAvatar} style={[styles.chatAvatar, { marginRight: 8 }]} />
            <View style={styles.successCard}>
              <View style={styles.avatarOverlapContainer}>
                <Image source={item.leftAvatar} style={styles.overlapAvatarLeft} />
                <View style={styles.overlapHeartBadge}>
                  <Heart color="#FFF" fill="#FF4F7E" size={12} />
                </View>
                <Image source={item.rightAvatar} style={styles.overlapAvatarRight} />
              </View>

              <Text style={styles.successTitle}>{item.title}</Text>
              <Text style={styles.successDesc}>{item.desc}</Text>

              <TouchableOpacity 
                style={styles.successBtn}
                onPress={() => navigation.navigate('CPSpaceScreen')}
              >
                <Text style={styles.successBtnText}>{item.btnText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'ring_card':
        return (
          <View style={styles.outgoingCardContainer}>
            <View style={styles.ringCard}>
              <View style={styles.ringGraphicContainer}>
                <Image source={{ uri: item.ringImage }} style={styles.ringImage} />
                <Text style={styles.ringText}>{item.title}</Text>
              </View>
              <TouchableOpacity 
                style={[styles.successBtn, { backgroundColor: '#F59E0B', marginTop: 12 }]}
                onPress={() => navigation.navigate('CPSpaceScreen')}
              >
                <Text style={styles.successBtnText}>{item.btnText}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ width: 40 }} />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIconBtn}>
          <ChevronLeft color="#1F2937" size={28} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <View style={styles.headerAvatarRow}>
            <Text style={styles.headerParenthesis}>(</Text>
            <Image source={friend.avatar} style={styles.headerAvatar} />
            <Text style={styles.headerParenthesis}>)</Text>
          </View>
          <Text style={styles.headerTitle}>{friend.name}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.headerIconBtn}
          onPress={() => navigation.navigate('UserProfileDetailScreen', { searchedProfile: friend })}
        >
          <User color="#1F2937" size={24} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.chatListContent}
        showsVerticalScrollIndicator={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.voiceBtn}>
            <Mic color="#9CA3AF" size={20} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            placeholder="Say something..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
          />
          
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Send color="#FFFFFF" size={16} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Light gray background matching screenshot
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 12 : 45,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerIconBtn: {
    padding: 6,
  },
  headerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  headerParenthesis: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '300',
    marginHorizontal: 2,
  },
  headerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  chatListContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  dateContainer: {
    alignSelf: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginVertical: 12,
  },
  dateText: {
    color: '#6B7280',
    fontSize: 10,
    fontWeight: '600',
  },
  incomingTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    maxWidth: '80%',
  },
  outgoingTextContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  incomingBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  outgoingBubble: {
    backgroundColor: '#3B82F6', // Blue bubble
    borderRadius: 16,
    borderTopRightRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chatText: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 18,
  },
  outgoingText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 18,
  },
  // Proposal card styles
  outgoingCardContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginBottom: 16,
    alignSelf: 'flex-end',
    width: '90%',
  },
  proposalCard: {
    flex: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    shadowColor: '#FDA4AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  proposalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heartGraphicCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF0F3',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  miniHeartOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 6,
  },
  proposalTextContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 6,
  },
  proposalTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#E11D48',
  },
  proposalDesc: {
    fontSize: 9,
    color: '#9E9E9E',
    marginTop: 2,
  },
  viewBtn: {
    backgroundColor: '#FF4F7E',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  viewBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  // Success card styles
  incomingCardContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    width: '78%',
  },
  successCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarOverlapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  overlapAvatarLeft: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFF',
    zIndex: 1,
  },
  overlapAvatarRight: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFF',
    marginLeft: -10,
  },
  overlapHeartBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FF4F7E',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 2,
    left: '42%',
    bottom: -4,
  },
  successTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  successDesc: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  successBtn: {
    backgroundColor: '#FF4F7E',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#FF4F7E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  successBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Ring card styles
  ringCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  ringGraphicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ringImage: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },
  ringText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  // Bottom Input styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  voiceBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 36,
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#1F2937',
    marginRight: 10,
    paddingVertical: 0,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3B82F6', // Blue send button
    justifyContent: 'center',
    alignItems: 'center',
  },
});
