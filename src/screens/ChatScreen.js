import React, { useState, useEffect } from 'react';
import LuckyFeastGame from '../components/LuckyFeastGame';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert,
  DeviceEventEmitter,
  Modal,
  ScrollView,
  Switch,
  PermissionsAndroid,
  ImageBackground
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Mic,
  MessageCircle,
  Gift,
  Gamepad2,
  Share2,
  Power,
  Settings,
  Armchair,
  Check,
  Smile,
  Mail,
  Send,
  Volume2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  Camera,
  Trash2,
  Image as ImageIcon,
  Music,
  Lock,
  Shield,
  X,
  Video as VideoIcon,
  Mic as MicIcon,
  MicOff,
  Search,
  Headphones,
  Ear
} from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoomList, leaveRoom, addMessage, minimizeRoom, closeMinimizedRoom } from '../store/slices/roomSlice';
import signalRService from '../services/signalRService';
import AgoraService from '../services/AgoraService';
import createAgoraRtcEngine, { 
  ChannelProfileType, 
  ClientRoleType,
  IRtcEngineEx
} from 'react-native-agora';
import { colors } from '../styles/globalStyles';


const { width, height } = Dimensions.get('window');

// Mock Data for Seats
const SEATS = Array(8).fill(null).map((_, i) => ({ id: i + 1, user: null }));

// Mock Data for Chat
const MESSAGES = [
  // { id: 1, user: 'System', text: 'Welcome to GameParty. Please respect each other and chat in a decent manner.', system: true },
  // { id: 2, user: 'System', text: 'Welcome LavaChat LavaChat to the room', system: true },
];

export default function ChatScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const { currentRoom } = useSelector((state) => state.room);
  const { userId, profile } = useSelector((state) => state.auth);

  // Resolve Room ID
  const roomData = route?.params?.roomData;
  const activeRoomId = roomData?.id || currentRoom?.id;

  // Global Chat State (Restored)
  // const messages = useSelector((state) => state.room.messages[activeRoomId] || []);
  const [messages, setMessages] = useState([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showLuckyFeast, setShowLuckyFeast] = useState(false);
  const [activeSettingTab, setActiveSettingTab] = useState(null); // null | 'roomName' | 'roomNotice' | 'welcome' | 'publicScreen' | 'roomType'

  const [inputText, setInputText] = useState('');
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Agora Voice States
  const agoraEngineRef = React.useRef(null); // Use Ref for engine to avoid stale closures
  const userIdRef = React.useRef(userId); // Ref to track current userId without re-binding listeners
  const [isJoined, setIsJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false); // Fix for -17 (Join in Progress)
  const [isMuted, setIsMuted] = useState(true);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [isEngineReady, setEngineReady] = useState(false); // Fix race condition
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [speakingUsers, setSpeakingUsers] = useState(new Set());
  
  // Derived State (Moved to top to fix ReferenceError)
  const displayRoom = roomDetails || roomData || currentRoom;
  const participants = displayRoom?.participants || [];
  const hostId = displayRoom?.createdBy;
  const hostParticipant = participants.find(p => String(p.userId) === String(hostId));
  
  // Track Agora's assigned UID (int) to map it back to our DB User ID (string)
  const agoraUidRef = React.useRef(0); 

  // Keep userIdRef in sync
  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  // Fetch room details function
  const fetchRoomDetails = async () => {
    try {
      const result = await dispatch(fetchRoomList());
      if (fetchRoomList.fulfilled.match(result)) {
        // Find the current room from the list
        const room = result.payload.find(r => r.id === (roomData?.id || currentRoom?.id));
        if (room) {
          setRoomDetails(room);
        }
      }
    } catch (error) {
      console.error('Error fetching room details:', error);
    }
  };

  useEffect(() => {
    // Initial fetch
    const initialFetch = async () => {
      try {
        setLoading(true);
        await fetchRoomDetails();
      } finally {
        setLoading(false);
      }
    };

    if (roomData?.id || currentRoom?.id) {
      initialFetch();

      // Auto-refresh every 5 seconds
      const interval = setInterval(() => {
        fetchRoomDetails();
      }, 5000000);

      // Cleanup interval on unmount
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [roomData?.id, currentRoom?.id, dispatch]);


  useEffect(() => {
    // 1. Force Connect
    const initConnection = async () => {
      console.log("♻️ ChatScreen Mount: Refreshing Connection...");
      await signalRService.startConnection(userId || 1006);
    };
    initConnection();

    console.log("🎧 Registering Persistent Event Listener");
    const lastMsgRef = { text: "", time: 0 };

    const subscription = DeviceEventEmitter.addListener(
      "onSignalRMessage",
      (data) => {
        // 🛑 Self-message check removed for debugging/displaying server echoes
        const currentUserId = userId || 1006;
        
        // Debugging Log
        console.log("📥 SignalR Incoming:", data);

        const now = Date.now();
        
        // 1. Duplicate check (SignalR echo vs Previous SignalR)
        if (data.text === lastMsgRef.text && now - lastMsgRef.time < 1000) {
          console.log("🚫 Duplicate Message Ignored:", data.text);
          return;
        }

        // 2. Duplicate Check (SignalR echo vs Local Optimistic)
        // We set 'messages' in functional scope, but state access inside listener needs careful handling.
        // Assuming optimistic update is fast, user sees it.
        // If exact text and user match recently, we might want to ignore?
        // For now, let's ALLOW duplicates if they are genuine server confirms, 
        // to verify server roundtrip. User complained "local not show".
        // If duplicates annoy, we can uncomment below:
        /*
        setMessages(currentMessages => {
             const existing = currentMessages.find(m => m.text === data.text && String(m.userId) === String(data.userId));
             if (existing && existing.pending) {
                 // Replace pending with confirmed?
                 return currentMessages.map(m => m.id === existing.id ? { ...m, pending: false } : m);
             }
             return [...currentMessages, ...];
        });
        */

        lastMsgRef.text = data.text;
        lastMsgRef.time = now;

        console.log("📩 Event Received in Chat:", data);

        // Refresh room details if user joined
        if (data.text && data.text.toLowerCase().includes("joined")) {
          fetchRoomDetails();
        }

        // Add to Local State
        setMessages(prev => [...prev, {
          id: `${Date.now()}-${Math.random()}`,
          userId: data.userId,
          user: data.userName || data.username || "User",
          text: data.text || data.message,
          system: false
        }]);
      }
    );

    return () => {
      subscription.remove();
      console.log("🔇 Listener Removed");
    };
  }, [activeRoomId, dispatch, userId]);

  // Request Permissions (Audio + Bluetooth for Android 12+)
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
        const permissions = [
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ];

        // Android 12+ requires Bluetooth Connect
        if (Platform.Version >= 31) {
            permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
        }

        try {
            const granted = await PermissionsAndroid.requestMultiple(permissions);
            
            const recordAudioGranted = granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED;
            const bluetoothGranted = Platform.Version >= 31 
                ? granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED
                : true;

            console.log(`🔐 Permissions Check: Mic=${recordAudioGranted}, BT=${bluetoothGranted}`);
            return recordAudioGranted && bluetoothGranted;
        } catch (err) {
            console.warn(err);
            return false;
        }
    }
    return true;
  };

  // Initialize Agora Engine
  useEffect(() => {
    const initAgora = async () => {
      try {
        if (!await requestPermissions()) {
            Alert.alert('Permission Denied', 'Microphone permission is required for voice chat.');
            return;
        }

        const appId = AgoraService.appId || 'a2f31714e8d54faebcf95d9af61a3f4a';
        agoraEngineRef.current = createAgoraRtcEngine();
        const engine = agoraEngineRef.current;
        
        // Enable audio
        engine.enableAudio();
        
        // 🛠️ CONFIG LIKE "InChat" / "GameParty" APP:
        // 1. Force OpenSL ES Driver (Fixes "No Sound" on OnePlus/Xiaomi)
        engine.setParameters('{"che.audio.opensl":true}');
        
        // 2. Use "Live Broadcasting" (Not Communication) for High Quality Music+Voice
        engine.setChannelProfile(ChannelProfileType.ChannelProfileLiveBroadcasting);
        
        // 3. Audio Profile: High Quality (4) + Game Streaming (3)
        // This forces Android to use "Media Volume" (Music) instead of "Call Volume".
        engine.setAudioProfile(4, 3); // 4=MusicHighQuality, 3=GameStreaming

        engine.initialize({ 
            appId,
            channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
        });
        
        // 4. Force Loudspeaker to be the DEFAULT route
        engine.setDefaultAudioRouteToSpeakerphone(true);
        engine.setEnableSpeakerphone(true); // Immediate force
        
        // 5. Volume Normalization (Don't over-boost, allows standard media controls)
        engine.adjustPlaybackSignalVolume(100); 
        engine.adjustRecordingSignalVolume(100);
        
        // Event Handlers - FULL DEBUG SUITE
        engine.registerEventHandler({
          onJoinChannelSuccess: (_connection, uid) => {
            console.log(`✅ [AGORA] Join Success. Channel: ${_connection.channelId}, LocalUID: ${uid}`);
            setIsJoined(true);
            agoraUidRef.current = uid;
            agoraEngineRef.current?.enableAudioVolumeIndication(200, 3, true);
            
            // 🕒 DELAYED SPEAKER ENFORCEMENT (Fix for OnePlus)
            setTimeout(() => {
                console.log("⏰ Forcing Speakerphone (Delayed)...");
                agoraEngineRef.current?.setEnableSpeakerphone(true);
            }, 1000);
          },
          onLeaveChannel: (_connection, stats) => {
             console.log(`👋 [AGORA] Left Channel. Duration: ${stats.duration}s`);
             setIsJoined(false);
          },
          onUserJoined: (_connection, uid) => {
             console.log(`👤 [AGORA] Remote User Joined: ${uid}`);
             setRemoteUsers(prev => [...prev, uid]);
          },
          onUserOffline: (_connection, uid, reason) => {
             console.log(`👋 [AGORA] Remote User Left: ${uid} (Reason: ${reason})`);
             setRemoteUsers(prev => prev.filter(id => id !== uid));
          },

          // 1. CONNECTION HEALTH
          onConnectionStateChanged: (_connection, state, reason) => {
              const states = ['Disconnected', 'Connecting', 'Connected', 'Reconnecting', 'Failed'];
              const reasons = ['None', 'InvalidArg', 'TimedOut', 'Interrupted', 'Banned', 'TooManyCalls', 'TokenExpired'];
              console.log(`🔌 [AGORA] Connection State: ${states[state] || state} (Reason: ${reasons[reason] || reason})`);
          },

          // 2. AUDIO ROUTING (Speaker/Ear/Headset)
          onAudioRoutingChanged: (routing) => {
              // 0=Default, 1=Headset, 2=Earpiece, 3=Speakerphone, 4=External, 5=Bluetooth
              const routes = ['Default', 'Headset', 'Earpiece', 'Speakerphone', 'External', 'Bluetooth'];
              console.log(`🔊 [AGORA] Audio Route Changed to: ${routes[routing] || routing}`);
          },

          // 3. REMOTE USER AUDIO STATE (Mute/Unmute/Decode)
          onUserMuteAudio: (_connection, uid, muted) => {
              console.log(`🙊 [AGORA] User ${uid} is now ${muted ? 'MUTED' : 'UNMUTED'}`);
          },
          onAudioMixingStateChanged: (state, reason) => {
              // 710: State Playing, 711: Paused, 713: Stopped, 714: Failed
              const states = { 710: "Playing", 711: "Paused", 712: "Restart", 713: "Stopped", 714: "Failed" };
              console.log(`🎵 [MUSIC] State: ${states[state] || state} (Reason: ${reason})`);
              if (state === 714) {
                   Alert.alert("Music Error", `Failed to play song. Network/File Error. Code: ${reason}`);
                   setIsPlayingSound(false);
              }
          },
          onRemoteAudioStateChanged: (_connection, uid, state, reason, elapsed) => {
              const states = ['Stopped', 'Starting', 'Decoding', 'Frozen', 'Failed'];
              console.log(`📡 [AGORA] Remote Audio [User ${uid}]: ${states[state] || state} (Reason: ${reason})`);
          },

          // 4. QUALITY STATS (Bitrate / Packet Loss)
          onLocalAudioStats: (_connection, stats) => {
              // Throttle logs: Only log if bitrate > 0 or packet loss > 0
              if (Math.random() < 0.1 || stats.txPacketLossRate > 0) {
                 console.log(`🎙️ [STATS] Local Audio - Sending: ${stats.sentBitrate} kbps | Loss: ${stats.txPacketLossRate}%`);
              }
          },
          onRemoteAudioStats: (_connection, stats) => {
              if (Math.random() < 0.1 || stats.frozenRate > 0) {
                 console.log(`👂 [STATS] Remote Audio [User ${stats.uid}] - Recv: ${stats.receivedBitrate} kbps | Frozen: ${stats.frozenRate}%`);
              }
          },

          // 5. HARDWARE STATE
          onLocalAudioStateChanged: (connection, state, error) => {
             // 0:Stopped, 1:Recording, 2:Encoding, 3:Failed
             console.log(`🎙️ [AGORA] Local Mic State: ${state} (Error: ${error})`);
             if (state === 3) { 
                 Alert.alert("Mic Error", `Mic Failed (Error ${error}). Check System Permissions.`);
             }
          },

          // 6. VOLUME (VAD)
          onAudioVolumeIndication: (_connection, speakers, _totalVolume) => {
             const newSpeakingUsers = new Set();
             speakers.forEach(speaker => {
                const isLocal = speaker.uid === 0 || speaker.uid === agoraUidRef.current;
                const currentId = userIdRef.current || 1006;
                const speakerId = isLocal ? currentId : speaker.uid;
                
                // Show logs if ANY volume detected
                if (speaker.volume > 2) {
                    console.log(`� [VOL] User:${speakerId} (Local:${isLocal}) | Vol:${speaker.volume} | VoiceDetected:${speaker.vad}`);
                }

                if (speaker.volume > 1) { 
                   newSpeakingUsers.add(String(speakerId));
                }
             });
             setSpeakingUsers(newSpeakingUsers);
          },

          // 7. ERRORS
          onError: (errorCode, msg) => {
             console.error(`❌ [AGORA ERROR] Code: ${errorCode} | Msg: ${msg}`);
          },
          onWarning: (warnCode, msg) => {
             console.warn(`⚠️ [AGORA WARN] Code: ${warnCode} | Msg: ${msg}`);
          }
        });



        console.log("✅ Agora Engine Initialized Successfully");
        setEngineReady(true); // Trigger join effect

      } catch (error) {
        console.error('❌ Agora initialization error:', error);
      }
    };

    initAgora();

    return () => {
      if (agoraEngineRef.current) {
        agoraEngineRef.current.leaveChannel();
        agoraEngineRef.current.release();
        agoraEngineRef.current = null;
      }
    };
  }, []);




  // Join Voice Channel
  useEffect(() => {
    const joinVoiceChannel = async () => {
      // Prevent joining if already joined, or joining is in progress, or params missing
      if (!agoraEngineRef.current || !activeRoomId || !userId || isJoined || isJoining) return;

      try {
        setIsJoining(true); // LOCK

        // Get token from backend
        const credentials = await AgoraService.getToken(
          `room_${activeRoomId}`,
          userId,
          1 // Broadcaster/Host
        );
        
        console.log("✅ Agora Token Generated:", credentials);

        // Determine if user is host
        const isHost = String(userId) === String(displayRoom?.createdBy);

        // Determine if user is seated (in participants list)
        // If they are seated, they should be a Broadcaster (can speak)
        const isSeated = displayRoom?.participants?.some(p => String(p.userId) === String(userId));
        
        const shouldBeBroadcaster = isHost || isSeated;

        console.log("🔍 Role Config:", { 
            isHost, 
            isSeated, 
            shouldBeBroadcaster,
            userId 
        });

        const engine = agoraEngineRef.current;
        if (!engine) {
            console.warn("⚠️ Engine became null during join process. Aborting.");
            return;
        }

        // Set client role (Host OR Seated User = Broadcaster)
        engine.setClientRole(
           shouldBeBroadcaster ? ClientRoleType.ClientRoleBroadcaster : ClientRoleType.ClientRoleAudience
        );

        // 🆔 CRITICAL FIX: Ensure UID is an Integer (Not String)
        // If passed as String, Agora assigns a Random ID -> Token Mismatch -> No Audio
        const uidNum = parseInt(userId, 10);
        console.log(`🔌 Joining Channel '${credentials.channelName}' with UID: ${uidNum} (Type: ${typeof uidNum})`);

        // Join channel
        const joinRes = engine.joinChannel(
           credentials.token, 
           credentials.channelName, 
           uidNum, 
           {}
        );
        console.log("📡 Join Channel Result:", joinRes);
        
        if (joinRes === 0) {
            // Success
        } else if (joinRes === -17) {
            console.log("⚠️ Already joining/joined (-17). Ignoring.");
        } else {
            console.warn(`Agora Join Warning: Code ${joinRes}`);
        }

        // Mute logic
        // If Broadcaster (Host or Seated), start unmuted (or respect previous state logic)
        // If Audience, force mute local (though Agora does this anyway)
        if (shouldBeBroadcaster) {
           engine.muteLocalAudioStream(false);
           setIsMuted(false); 
           engine.enableLocalAudio(true); 
        } else {
           engine.muteLocalAudioStream(true);
           setIsMuted(true);
        }
        
        // RE-FORCE SPEAKERPHONE (Just in case OS overrode it)
        engine.setEnableSpeakerphone(true);

      } catch (error) {
        console.error('❌ Error joining voice channel:', error);
        Alert.alert('Voice Error', 'Could not join voice channel');
      } finally {
        setIsJoining(false); // UNLOCK
      }
    };

    // Retry checking if engine is ready
    if (agoraEngineRef.current && activeRoomId && isEngineReady && !isJoined) {
       joinVoiceChannel();
    } else {
       console.log("⏳ Waiting for Engine/Room/User...", { 
           engine: !!agoraEngineRef.current, 
           room: activeRoomId, 
           user: userId,
           ready: isEngineReady,
           joined: isJoined
       });
    }
  }, [activeRoomId, userId, displayRoom?.createdBy, isEngineReady, isJoined]); // Re-run if room changes or engine becomes ready





  // useEffect(() => {
  //   const currentUserId = userId || 1006;

  //   if (signalRService.isConnected()) {

  //     signalRService.onMessageReceived((data) => {

  //       // 🛑 Ignore self message (duplicate)
  //       if (String(data.userId) === String(currentUserId)) {
  //         console.log("⏩ Ignored self message");
  //         return;
  //       }

  //       // Add message to UI
  //       setMessages(prev => [
  //         ...prev,
  //         {
  //           id: Date.now(),
  //           user: data.username,
  //           text: data.message,
  //           timestamp: new Date().toISOString()
  //         }
  //       ]);
  //     });
  //   }
  // }, []);




  const [showExitModal, setShowExitModal] = useState(false);

  // Handle Minimize
  const handleMinimize = () => {
    setShowExitModal(false);
    
    // Save current room state to redux to show floating widget
    dispatch(minimizeRoom(displayRoom));
    
    // Navigate pack (Home/MainTabs)
    navigation.goBack();
  };

  // Handle leave room (Actual Exit)
  const handleExitRoom = async () => {
      setShowExitModal(false);
      try {
        const roomId = displayRoom?.id;
        const currentUserId = userId || 1006;
        
        // Ensure we clear any minimized state if we are exiting fully
        dispatch(closeMinimizedRoom());

        const resultAction = await dispatch(leaveRoom({
          roomId,
          userId: currentUserId,
        }));
        
        if (leaveRoom.fulfilled.match(resultAction)) {
           // Go back to previous screen (usually Home)
           // If we are in a stack, goBack or navigate MainTabs
           navigation.navigate('MainTabs'); 
        } else {
           // Even if API fails, we often want to let user leave UI 
           navigation.navigate('MainTabs');
        }
      } catch (error) {
        console.error("Leave Room Error:", error);
        navigation.navigate('MainTabs');
      }
  };

  // Triggered by Power Button
  const handlePowerPress = () => {
      setShowExitModal(true);
  };




  // Use roomDetails if available, otherwise fall back to roomData or currentRoom
  const handleSend = async () => {
    if (inputText.trim()) {
      const messageText = inputText.trim();
      const currentUserId = userId || 1006;
      const userName = profile?.name || "User";

      // 1. Clear input & Optimistic UI Update (Show immediately)
      setInputText('');
      setSending(true);
      
      // Removed Optimistic Update to prevent duplicates (User requested ONLY server message)

      try {
          // 2. Send via SignalR
          await signalRService.sendMessage(currentUserId, messageText);
          // Success (Implicit)
      } catch (err) {
          console.error("Msg Send Failed:", err);
          Alert.alert("Error", "Message failed to send");
      } finally {
          setSending(false);
      }
    }
  };




  // Toggle Mic (Mute/Unmute)
  const toggleMic = async () => {
    const engine = agoraEngineRef.current;
    if (!engine) {
      Alert.alert('Voice Error', 'Voice engine not initialized');
      return;
    }

    try {
      const newMutedState = !isMuted;
      
      // If UNMUTING, ensure we are a Broadcaster
      if (!newMutedState) {
         console.log("🎤 Unmuting: Setting Role to Broadcaster");
         engine.setClientRole(ClientRoleType.ClientRoleBroadcaster);
      }

      // Apply Mute
      const result = engine.muteLocalAudioStream(newMutedState);
      
      if (result !== 0) {
          console.warn(`⚠️ muteLocalAudioStream returned error: ${result}`);
      } else {
          console.log(`🎤 Mic Toggled: ${newMutedState ? 'MUTED' : 'UNMUTED'} (Success)`);
      }

      setIsMuted(newMutedState);
    } catch (error) {
      console.error('Error toggling mic:', error);
      Alert.alert("Error", "Failed to toggle microphone");
    }
  };

  // Toggle Room Speaker (Mute/Unmute All Remote Audio)
  const toggleSpeaker = async () => {
    const engine = agoraEngineRef.current;
    if (!engine) return;

    try {
      const newMutedState = !isSpeakerMuted;
      engine.muteAllRemoteAudioStreams(newMutedState);
      setIsSpeakerMuted(newMutedState);
      console.log(`🔊 Room Audio Toggled: ${newMutedState ? 'MUTED' : 'UNMUTED'}`);
    } catch (error) {
      console.error('Error toggling speaker:', error);
    }
  };




  // Render Host Banlink Logic Debug
  // Logic: 
  // 1. Is 'hostParticipant' in the speaking set?
  // 2. OR Is strictly the 'hostId' in the speaking set?
  const isHostBlinking = 
      (hostParticipant && speakingUsers.has(String(hostParticipant.userId))) || 
      (hostId && speakingUsers.has(String(hostId)));
  
  if (speakingUsers.size > 0) {
      console.log(`🎨 UI Render Blink Check: Host(${hostId}) Blinking? ${!!isHostBlinking}. Set: ${Array.from(speakingUsers)}`);
  }

  // Filter out host from regular seats (Grid should only show audience/joined users)
  // FIX: Use String() to ensure loose equality (number vs string) doesn't cause duplicates
  const seatParticipants = participants.filter(p => String(p.userId) !== String(hostId) && !p.isSuperSeat);

  if (loading) {
    return (
      <ImageBackground
        source={require('../assets/backgroudn-image.jpg')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/backgroudn-image.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >

          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.roomInfoContainer}>
              <Image
                source={
                  displayRoom?.imagePath
                    ? { uri: displayRoom.imagePath }
                    : require('../assets/av1.jpg')
                }
                style={styles.roomAvatar}
              />
              <View style={{ marginLeft: 4, flexShrink: 1 }}>
                <Text style={styles.roomTitle} numberOfLines={1}>
                  {displayRoom?.title || 'Room'}
                </Text>
                <Text style={styles.roomId}>
                  ID:{displayRoom?.id || '---'}  👤 {displayRoom?.participantCount || 0}
                </Text>
              </View>
              <TouchableOpacity style={styles.followBtn}>
                <Text style={styles.followText}>Chat</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.headerIcons}>
              {String(userId) === String(hostId) && (
                <TouchableOpacity 
                  style={styles.iconBtn}
                  onPress={() => setShowSettingsModal(true)}
                >
                  <Settings size={22} color="#fff" />
                </TouchableOpacity>
              )}


              <TouchableOpacity style={styles.iconBtn} onPress={toggleSpeaker}>
                {isSpeakerMuted ? (
                  <Volume2 size={22} color="rgba(255,255,255,0.4)" />
                ) : (
                  <Volume2 size={22} color="#00FF00" />
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconBtn} onPress={handlePowerPress}>
                <Power size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* HOST SEAT */}
          <View style={styles.hostContainer}>
            <View style={[
                styles.hostWrapper,
                // Check if Host Blink Condition is met
                isHostBlinking && {
                    borderColor: '#00FF00', borderWidth: 2, borderRadius: 50, shadowColor: '#00FF00', shadowRadius: 10, shadowOpacity: 0.8
                }
            ]}>
              <Image
                source={
                  hostParticipant?.userAvatar
                    ? { uri: hostParticipant.userAvatar }
                    : require('../assets/av1.jpg')
                }
                style={styles.hostAvatar}
              />
              {/* Only show Mute Badge if I AM THE HOST. Otherwise I shouldn't see my mute status on host's face. */}
              {String(userId) === String(hostId) && (
                  <View style={[
                    styles.hostBadge,
                    { backgroundColor: isMuted ? '#FF3CAC' : '#00FF00' }
                  ]}>
                    {isMuted ? (
                        <MicOff size={10} color="#fff" />
                    ) : (
                        <Mic size={10} color="#fff" />
                    )}
                  </View>
              )}
            </View>
            <Text style={styles.hostName}>
              {hostParticipant ? hostParticipant.userName : 'Host'}
            </Text>
          </View>
          
          {/* SEATS GRID */}
          <View style={styles.gridContainer}>
            {Array(8).fill(null).map((_, index) => {
              // Logic: Find participant with seatNumber === index + 1
              // If seat allocation is handled by backend, we use seatNumber.
              // If strictly list based, we use seatParticipants[index].
              // User asked for "seatNumber" param.
              const seatNum = index + 1;
              // STRICTLY EXCLUDE HOST from Grid Seats
              const participant = participants.find(p => p.seatNumber === seatNum && String(p.userId) !== String(hostId) && !p.isSuperSeat)
                || seatParticipants[index]; // Fallback to filtered list
              
              const isSpeaking = participant && speakingUsers.has(String(participant.userId));

              return (
                <View key={index + 1} style={styles.seatItem}>
                  <View style={[
                      styles.seatCircle, 
                      isSpeaking && { borderColor: '#00FF00', borderWidth: 2, shadowColor: '#00FF00', shadowRadius: 10, shadowOpacity: 0.8 }
                  ]}>
                    {/* Seat Icon always visible as a base */}
                    <Armchair size={20} color="rgba(255,255,255,0.3)" />

                    {participant && (
                      <Image
                        source={participant.userAvatar ? { uri: participant.userAvatar } : require('../assets/av1.jpg')}
                        style={[styles.seatAvatar, { position: 'absolute' }]}
                      />
                    )}

                    {/* Show Mic Badge ONLY for Local User on their seat */}
                    {/* {participant && String(participant.userId) === String(userId) && (
                        <View style={{
                            position: 'absolute',
                            bottom: -2,
                            right: -2,
                            backgroundColor: isMuted ? '#FF3CAC' : '#00FF00',
                            borderRadius: 8,
                            width: 16,
                            height: 16,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: '#fff',
                            zIndex: 10
                        }}>
                             {isMuted ? <MicOff size={10} color="#fff"/> : <Mic size={10} color="#fff"/>}
                        </View>
                    )} */}
                  </View>
                  <Text style={styles.seatNumber} numberOfLines={1}>
                    {participant ? (participant.userName || 'User') : index + 1}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* CHAT AREA - WHATSAPP STYLE */}
          <View style={styles.chatArea}>
            <FlatList
              data={[...messages].reverse()} // Newest comes first in data array
              inverted // Renders first item at BOTTOM. So Newest = Bottom.
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => {
                const isMe = String(item.userId) === String(userId || 1006);
                const isSystem = item.system;

                if (isSystem) {
                  return (
                    <View style={styles.systemMessageContainer}>
                      <Text style={styles.systemMessageText}>{item.text}</Text>
                    </View>
                  );
                }

                return (
                  <View style={[
                    styles.messageRow,
                    isMe ? styles.messageRowMe : styles.messageRowOther,
                    { alignSelf: 'flex-start' } // Force One-Side Alignment
                  ]}>
                    <Text style={[
                      styles.userName,
                      isMe ? { color: '#E0F2F1' } : { color: '#FFD700' }
                    ]}>
                      {isMe ? 'You' : item.user}
                    </Text>
                    <Text style={styles.messageText}>{item.text}</Text>
                    <Text style={styles.timeText}>
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
            />
          </View>

          {/* BOTTOM BAR */}
          <View style={styles.bottomBar}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Say Hi..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={handleSend}
              />
              <TouchableOpacity
                onPress={handleSend}
                style={[styles.sendBtn, sending && styles.sendBtnDisabled]}
                disabled={sending}
              >
                {sending ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Send size={18} color="#fff" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.bottomIcons}>
              <TouchableOpacity style={styles.actionBtn}>
                <Mail size={24} color="#fff" />
                <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionBtn, isMuted && styles.mutedBtn]} 
                onPress={toggleMic}
              >
                {isMuted ? (
                    <MicOff size={24} color="#FF3CAC" />
                ) : (
                    <Mic size={24} color="#00FF00" />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}><Smile size={24} color="#fff" /></TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => setShowGameModal(true)}>
                  <Gamepad2 size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Gift size={24} color="#FF3CAC" />
              </TouchableOpacity>
            </View>
          </View>

          {/* GAME MODAL */}
          <Modal
            transparent={true}
            visible={showGameModal}
            animationType="slide"
            onRequestClose={() => setShowGameModal(false)}
          >
             <View style={styles.settingsModalOverlay}>
                <TouchableOpacity 
                   style={{ flex: 1 }} 
                   onPress={() => setShowGameModal(false)} 
                   activeOpacity={1}
                />
                <View style={[styles.settingsModalContainer, { paddingHorizontal: 0, paddingBottom: 20 }]}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                        <Text style={styles.gameSectionTitle}>Lucky</Text>
                        <View style={styles.gameGridContainer}>
                            <TouchableOpacity style={styles.gameIconBox}><Text style={styles.gameEmoji}>🎰</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.gameIconBox}><Text style={styles.gameEmoji}>🍬</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.gameIconBox}><Text style={styles.gameEmoji}>🍋</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.gameIconBox}><Text style={styles.gameEmoji}>🏎️</Text></TouchableOpacity>
                            
                            <TouchableOpacity style={styles.gameIconBox}><Text style={styles.gameEmoji}>7️⃣</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.gameIconBox}><Text style={styles.gameEmoji}>🐺</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.gameIconBox} onPress={() => { setShowGameModal(false); setShowLuckyFeast(true); }}>
                              <Text style={styles.gameEmoji}>🦊</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.gameIconBox}><Text style={styles.gameEmoji}>🦅</Text></TouchableOpacity>
                        </View>

                        <Text style={styles.gameSectionTitle}>Social</Text>
                        <View style={styles.gameGridContainer}>
                            <TouchableOpacity style={styles.gameIconBox}><Text style={styles.gameEmoji}>🎮</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.gameIconBox}><Text style={styles.gameEmoji}>🎲</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.gameIconBox}><Text style={styles.gameEmoji}>🃏</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.gameIconBox}><Text style={styles.gameEmoji}>🎱</Text></TouchableOpacity>
                            
                            <TouchableOpacity style={styles.gameIconBox}><Text style={styles.gameEmoji}>🎯</Text></TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
             </View>
          </Modal>

          {/* ROOM SETTINGS MODAL */}
          <Modal
            transparent={true}
            visible={showSettingsModal}
            animationType="slide"
            onRequestClose={() => {
               if (activeSettingTab) setActiveSettingTab(null);
               else setShowSettingsModal(false);
            }}
          >
             <View style={styles.settingsModalOverlay}>
                <TouchableOpacity 
                  style={{flex: 1}} 
                  onPress={() => setShowSettingsModal(false)} 
                />
                <View style={[styles.settingsModalContainer, activeSettingTab === 'publicScreen' ? { height: '30%' } : {}]}>
                   
                   {/* DYNAMIC HEADER */}
                   <View style={styles.settingsHeader}>
                      {activeSettingTab && (
                        <TouchableOpacity onPress={() => setActiveSettingTab(null)} style={{position: 'absolute', left: 20, padding: 5}}>
                           <ChevronLeft size={24} color="#fff" />
                        </TouchableOpacity>
                      )}
                      
                      <Text style={styles.settingsTitle}>
                        {activeSettingTab === 'roomName' ? 'Room Name' : 
                         activeSettingTab === 'roomNotice' ? 'Room Notice' : 
                         activeSettingTab === 'welcome' ? 'Room Welcome Message Setting' :
                         activeSettingTab === 'publicScreen' ? 'Public Screen' :
                         activeSettingTab === 'roomType' ? 'Room Type' :
                         activeSettingTab === 'sensitiveWords' ? 'Sensitive words' :
                         activeSettingTab === 'micMode' ? 'Mic mode' :
                         activeSettingTab === 'wheatMode' ? 'Wheat mode' :
                         activeSettingTab === 'superMic' ? 'Super Mic' :
                         activeSettingTab === 'effectSwitch' ? 'Effect switch' :
                         activeSettingTab === 'music' ? 'Room music' :
                         activeSettingTab === 'lock' ? 'Set password' :
                         activeSettingTab === 'admin' ? 'Administrator(0/5)' :
                         'Room Setting'}
                      </Text>
                   </View>
                   
                   {/* MAIN SETTINGS LIST */}
                   {!activeSettingTab && (
                     <ScrollView contentContainerStyle={styles.settingsScrollContent}>
                        {/* Room Image */}
                        <View style={styles.roomImageSection}>
                            <Image 
                              source={displayRoom?.imagePath ? { uri: displayRoom.imagePath } : require('../assets/av1.jpg')} 
                              style={styles.settingRoomImage}
                            />
                            <TouchableOpacity style={styles.cameraIconBadge}>
                               <Camera size={14} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {/* Inputs - NOW CLICKABLE */}
                        <Text style={styles.settingLabel}>Room Name</Text>
                        <TouchableOpacity style={styles.settingInputBtn} onPress={() => setActiveSettingTab('roomName')}>
                           <Text style={styles.settingInputText}>{displayRoom?.title || 'Testing Room'}</Text>
                        </TouchableOpacity>

                        <Text style={styles.settingLabel}>Room Notice</Text>
                        <TouchableOpacity style={styles.settingInputBtn} onPress={() => setActiveSettingTab('roomNotice')}>
                           <Text style={styles.settingInputText} numberOfLines={1}>{displayRoom?.notice || 'Add your room notice...'}</Text>
                        </TouchableOpacity>

                        {/* Options List */}
                        {[
                          { label: 'Room Welcome Message', key: 'welcome' }, 
                          { label: 'Public screen setting', key: 'publicScreen' }, 
                          { label: 'Sensitive words setting', key: 'sensitiveWords' },
                          { label: 'Room Type', key: 'roomType' },
                          { label: 'Mic mode', key: 'micMode' },
                          { label: 'Wheat mode', key: 'wheatMode' },
                          { label: 'Super Mic', key: 'superMic' },
                          { label: 'Effect switch', key: 'effectSwitch' }
                        ].map((option, index) => (
                          <TouchableOpacity 
                            key={index} 
                            style={styles.settingOptionRow}
                            onPress={() => option.key && setActiveSettingTab(option.key)}
                          >
                             <Text style={styles.settingOptionText}>{option.label}</Text>
                             <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                {option.label === 'Room Type' && <Text style={styles.settingValueText}>Chat</Text>}
                                {option.label === 'Mic mode' && <Text style={styles.settingValueText}>open mode</Text>}
                                {option.label === 'Wheat mode' && <Text style={styles.settingValueText}>9 people</Text>}
                                <ChevronRight size={20} color="rgba(255,255,255,0.5)" />
                             </View>
                          </TouchableOpacity>
                        ))}
                        
                        {/* Bottom Grid Actions */}
                        <View style={styles.settingGrid}>
                            <TouchableOpacity style={styles.settingGridItem}>
                               <View style={styles.settingGridIcon}>
                                  <Trash2 size={24} color="#333" />
                               </View>
                               <Text style={styles.settingGridText}>Clear screen</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.settingGridItem}>
                               <View style={styles.settingGridIcon}>
                                  <ImageIcon size={24} color="#333" />
                               </View>
                               <Text style={styles.settingGridText}>Theme</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.settingGridItem}
                                onPress={() => setActiveSettingTab('music')}
                            >
                               <View style={styles.settingGridIcon}>
                                  <Music size={24} color="#333" />
                               </View>
                               <Text style={styles.settingGridText}>Music</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.settingGridItem}
                                onPress={() => setActiveSettingTab('lock')}
                            >
                               <View style={styles.settingGridIcon}>
                                  <Lock size={24} color="#333" />
                               </View>
                               <Text style={styles.settingGridText}>Lock</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.settingGridItem}
                                onPress={() => setActiveSettingTab('admin')}
                            >
                               <View style={styles.settingGridIcon}>
                                  <Shield size={24} color="#333" />
                               </View>
                               <Text style={styles.settingGridText}>Admin</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={{height: 40}} />
                     </ScrollView>
                   )}

                   {/* SUB-PAGES */}
                   
                   {/* 1. ROOM NAME */}
                   {activeSettingTab === 'roomName' && (
                      <View style={styles.subPageContainer}>
                          <Text style={styles.subPageLabel}>Room Name</Text>
                          <TextInput 
                              style={styles.subPageInput} 
                              value={displayRoom?.title || 'Testing Room'} 
                              placeholder="Room Name"
                              placeholderTextColor="rgba(255,255,255,0.4)"
                          />
                          <TouchableOpacity style={styles.saveBtn} onPress={() => setActiveSettingTab(null)}>
                              <Text style={styles.saveBtnText}>Save</Text>
                          </TouchableOpacity>
                      </View>
                   )}

                   {/* 2. ROOM NOTICE */}
                   {activeSettingTab === 'roomNotice' && (
                      <View style={styles.subPageContainer}>
                          <Text style={styles.subPageLabel}>Room Notice</Text>
                          <TextInput 
                              style={[styles.subPageInput, { height: 100, textAlignVertical: 'top' }]} 
                              value={displayRoom?.notice || ''} 
                              placeholder="Add your room notice..."
                              placeholderTextColor="rgba(255,255,255,0.4)"
                              multiline
                          />
                          <TouchableOpacity style={styles.saveBtn} onPress={() => setActiveSettingTab(null)}>
                              <Text style={styles.saveBtnText}>Save</Text>
                          </TouchableOpacity>
                      </View>
                   )}

                   {/* 3. WELCOME MESSAGE */}
                   {activeSettingTab === 'welcome' && (
                      <View style={styles.subPageContainer}>
                          <Text style={styles.descriptionText}>
                            Set the Room Welcome Message, it will be automatically sent when friends enter your room
                          </Text>
                          <View style={styles.textAreaContainer}>
                              <TextInput 
                                  style={styles.textAreaInput} 
                                  placeholder="What you want to say to the friends who enter your room"
                                  placeholderTextColor="rgba(0,0,0,0.3)"
                                  multiline
                              />
                              <Text style={styles.charCount}>0/500</Text>
                          </View>
                          
                          <TouchableOpacity style={styles.saveBtn} onPress={() => setActiveSettingTab(null)}>
                              <Text style={styles.saveBtnText}>Save</Text>
                          </TouchableOpacity>
                          
                          <Text style={styles.smallNote}>
                             Welcome Message will only be sent when you are in your room
                          </Text>
                      </View>
                   )}

                   {/* 4. PUBLIC SCREEN */}
                   {activeSettingTab === 'publicScreen' && (
                      <View style={styles.actionSheetContainer}>
                          <TouchableOpacity style={styles.actionSheetOption}>
                             <Text style={[styles.actionSheetText, { color: '#FF3CAC' }]}>Open public screen to all users</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.actionSheetOption}>
                             <Text style={styles.actionSheetText}>Close the public screen</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={[styles.actionSheetOption, { borderBottomWidth: 0, marginTop: 10 }]}
                            onPress={() => setActiveSettingTab(null)}
                          >
                             <Text style={styles.actionSheetText}>Cancel</Text>
                          </TouchableOpacity>
                      </View>
                   )}
                   
                   {/* 5. ROOM TYPE */}
                   {activeSettingTab === 'roomType' && (
                      <View style={styles.roomTypeContainer}>
                          <View style={styles.roomTypeRow}>
                              <TouchableOpacity style={styles.roomTypeCard}>
                                  <View style={[styles.roomTypeIcon, { backgroundColor: '#FF9900' }]}>
                                     <MessageCircle size={30} color="#fff" />
                                  </View>
                                  <Text style={styles.roomTypeValue}>Chat</Text>
                              </TouchableOpacity>
                              
                              <TouchableOpacity style={styles.roomTypeCard}>
                                  <View style={[styles.roomTypeIcon, { backgroundColor: '#FF3CAC' }]}>
                                     <VideoIcon size={30} color="#fff" />
                                  </View>
                                  <Text style={styles.roomTypeValue}>Video</Text>
                              </TouchableOpacity>
                              
                              <TouchableOpacity style={styles.roomTypeCard}>
                                  <View style={[styles.roomTypeIcon, { backgroundColor: '#8A2BE2' }]}>
                                     <MicIcon size={30} color="#fff" />
                                  </View>
                                  <Text style={styles.roomTypeValue}>Mic Grab</Text>
                              </TouchableOpacity>
                          </View>
                      </View>
                   )}

                   {/* 6. SENSITIVE WORDS */}
                   {activeSettingTab === 'sensitiveWords' && (
                      <View style={styles.subPageContainer}>
                          <View style={{alignSelf: 'flex-start', marginBottom: 10}}>
                             <Text style={styles.subPageLabel}>Add sensitive words (0/10)</Text>
                             <Text style={styles.descriptionTextLeft}>
                               Public screen messages containing sensitive words will not appear in the room
                             </Text>
                          </View>

                          <View style={styles.inputRow}>
                              <TextInput 
                                  style={styles.flexInput} 
                                  placeholder="Please enter sensitive words"
                                  placeholderTextColor="rgba(0,0,0,0.3)"
                              />
                              <TouchableOpacity style={styles.addBtnSmall}>
                                 <Text style={{color: '#333'}}>Add</Text>
                              </TouchableOpacity>
                          </View>
                          
                          <TouchableOpacity style={styles.saveBtn} onPress={() => setActiveSettingTab(null)}>
                              <Text style={styles.saveBtnText}>Save</Text>
                          </TouchableOpacity>
                          
                          <View style={styles.checkboxRow}>
                              <View style={styles.emptyCircle} />
                              <Text style={styles.checkboxLabel}>
                                 Sensitive words included will not appear in private messages
                              </Text>
                          </View>
                      </View>
                   )}

                   {/* 7. MIC MODE */}
                   {activeSettingTab === 'micMode' && (
                      <View style={styles.actionSheetContainer}>
                          <TouchableOpacity style={styles.selectionCard}>
                             <View style={{flex: 1}}>
                                <Text style={styles.cardTitle}>open mode</Text>
                                <Text style={styles.cardDesc}>Viewers are free to mic and chat</Text>
                             </View>
                             <View style={styles.checkCircleSelected}>
                                 <Check size={14} color="#fff" />
                             </View>
                          </TouchableOpacity>

                          <TouchableOpacity style={[styles.selectionCard, {backgroundColor: '#E1E1FF'}]}>
                             <View style={{flex: 1}}>
                                <Text style={styles.cardTitle}>invite mode</Text>
                                <Text style={styles.cardDesc}>After the application is approved or the audience you invite can chat on the microphone</Text>
                             </View>
                             <View style={styles.checkCircleEmpty} />
                          </TouchableOpacity>
                      </View>
                   )}

                   {/* 8. WHEAT MODE */}
                   {activeSettingTab === 'wheatMode' && (
                      <View style={styles.actionSheetContainer}>
                          {/* Mocking similar UI to Mic Mode based on list */}
                          <TouchableOpacity style={styles.selectionCard}>
                             <View style={{flex: 1}}>
                                <Text style={styles.cardTitle}>9 people</Text>
                             </View>
                             <View style={styles.checkCircleSelected}>
                                 <Check size={14} color="#fff" />
                             </View>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.selectionCard, {backgroundColor: '#E1E1FF'}]}>
                             <View style={{flex: 1}}>
                                <Text style={styles.cardTitle}>Map Room</Text>
                             </View>
                             <View style={styles.checkCircleEmpty} />
                          </TouchableOpacity>
                      </View>
                   )}

                   {/* 9. SUPER MIC */}
                   {activeSettingTab === 'superMic' && (
                      <View style={styles.toggleListContainer}>
                          <View style={styles.toggleRow}>
                             <Text style={styles.toggleLabel}>Super Mic</Text>
                             <Switch value={false} trackColor={{false: '#ccc', true: '#FF3CAC'}} />
                          </View>
                          <View style={styles.toggleRow}>
                             <Text style={styles.toggleLabel}>Deluxe Super Mic</Text>
                             <Switch value={false} trackColor={{false: '#ccc', true: '#FF3CAC'}} />
                          </View>
                      </View>
                   )}

                   {/* 10. EFFECT SWITCH */}
                   {activeSettingTab === 'effectSwitch' && (
                      <View style={styles.toggleListContainer}>
                          <View style={styles.toggleRow}>
                             <Text style={styles.toggleLabel}>Room Curtain</Text>
                             <Switch value={false} trackColor={{false: '#ccc', true: '#FF3CAC'}} />
                          </View>
                      </View>
                   )}
                   
                   {/* 11. MUSIC */}
                   {activeSettingTab === 'music' && (
                      <View style={styles.subPageContainer}>
                          <View style={styles.musicSearchBar}>
                              <Search size={20} color="#ccc" style={{marginRight: 10}} />
                              <TextInput 
                                  style={{flex: 1, color: '#333'}}
                                  placeholder="Search music or sing"
                                  placeholderTextColor="#ccc"
                              />
                          </View>
                          
                          <View style={styles.musicTabs}>
                              <TouchableOpacity style={styles.musicTabActive}>
                                  <Text style={styles.musicTabTextActive}>Playlist</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.musicTab}>
                                  <Text style={styles.musicTabText}>Local music</Text>
                              </TouchableOpacity>
                          </View>
                          
                          <View style={styles.emptyStateContainer}>
                              <View style={styles.emptyIconCircle}>
                                  <Music size={40} color="#333" />
                              </View>
                              <Text style={styles.emptyStateText}>No Music</Text>
                              
                              <TouchableOpacity style={styles.gradientBtn}>
                                  <Text style={styles.saveBtnText}>Add songs now</Text>
                              </TouchableOpacity>
                          </View>
                      </View>
                   )}
                   
                   {/* 12. ADMIN */}
                   {activeSettingTab === 'admin' && (
                      <View style={styles.subPageContainer}>
                          <Text style={styles.descriptionTextLeft}>
                             Administrator rights include: Quiet Mic, Block Mic, Kick People, Invite People, Play music
                          </Text>
                          
                          <View style={styles.emptyStateContainer}>
                              <View style={[styles.emptyIconCircle, {backgroundColor: '#FFEBEE'}]}>
                                  <Shield size={40} color="#FF3CAC" />
                              </View>
                              <Text style={styles.emptyStateText}>No administrator</Text>
                              
                              <TouchableOpacity style={styles.gradientBtn}>
                                  <Text style={styles.saveBtnText}>Add</Text>
                              </TouchableOpacity>
                          </View>
                      </View>
                   )}
                   
                   {/* 13. SET PASSWORD (LOCK) */}
                   {activeSettingTab === 'lock' && (
                      <View style={styles.subPageContainer} >
                          <View style={styles.passwordContainer}>
                              {[0, 1, 2, 3].map((_, i) => (
                                  <View key={i} style={styles.passwordInputBox} />
                              ))}
                          </View>
                          
                           <TouchableOpacity style={styles.gradientBtn}>
                                  <Text style={styles.saveBtnText}>Set password</Text>
                          </TouchableOpacity>
                      </View>
                   )}

                </View>
             </View>
          </Modal>

          {/* EXIT MODAL */}
          <Modal
            transparent={true}
            visible={showExitModal}
            animationType="fade"
            onRequestClose={() => setShowExitModal(false)}
          >
             <TouchableOpacity 
                style={styles.modalOverlay} 
                activeOpacity={1} 
                onPress={() => setShowExitModal(false)}
             >
                <View style={styles.exitModalContainer}>
                   <View style={styles.exitModalContent}>
                      <Text style={styles.exitTitle}>Room Options</Text>
                      
                      <View style={styles.exitButtonsRow}>
                          <TouchableOpacity style={styles.exitOptionBtn} onPress={handleMinimize}>
                              <View style={[styles.exitIconCircle, { backgroundColor: '#FF9900' }]}>
                                  <Minimize2 size={24} color="#fff" />
                              </View>
                              <Text style={styles.exitBtnText}>Minimize</Text>
                          </TouchableOpacity>

                          <TouchableOpacity style={styles.exitOptionBtn} onPress={handleExitRoom}>
                              <View style={[styles.exitIconCircle, { backgroundColor: '#FF3CAC' }]}>
                                  <Power size={24} color="#fff" />
                              </View>
                              <Text style={styles.exitBtnText}>Exit Room</Text>
                          </TouchableOpacity>
                      </View>
                   </View>
                </View>
             </TouchableOpacity>
          </Modal>

          <LuckyFeastGame 
            visible={showLuckyFeast} 
            onClose={() => {
              setShowLuckyFeast(false);
              setShowGameModal(true);
            }} 
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 50,
    marginBottom: 20,
    height: Platform.OS === 'android' ? 80 : 100,
  },
  roomInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 1,
    paddingHorizontal: 1,
    borderRadius: 25,
    paddingRight: 6,
    maxWidth: '70%',
  },
  roomAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 4,
  },
  roomTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  roomId: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
  },
  followBtn: {
    backgroundColor: '#FF9900',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 12,
    marginLeft: 6,
  },
  followText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 20,
  },
  iconBtn: {
    padding: 5,
  },

  /* HOST */
  hostContainer: {
    alignItems: 'center',
    marginBottom: 20,
    height: 110,
  },
  hostWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  hostAvatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
  },
  hostBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF3CAC',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  hostName: {
    color: '#fff',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },

  /* SEATS GRID */
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
    // height: 200, // Removed fixed height to allow expansion based on seats
  },
  seatItem: {
    width: (width - 40) / 4,
    alignItems: 'center',
    marginBottom: 12,
  },
  seatCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  seatAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  seatNumber: {
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
    fontSize: 11,
    textAlign: 'center',
    maxWidth: (width - 40) / 4 - 6,
  },

  /* CHAT AREA WHATSAPP STYLE */
  chatArea: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  messageRow: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 15,
    marginBottom: 8,
  },
  messageRowMe: {
    backgroundColor: '#075E54', // WhatsApp Greenish
    alignSelf: 'flex-end',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 0,
  },
  messageRowOther: {
    backgroundColor: '#202C33', // Dark Grey
    alignSelf: 'flex-start',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 0,
  },
  systemMessageContainer: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255,215,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8
  },
  systemMessageText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: 'bold'
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  userName: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
    alignSelf: 'flex-end',
    marginTop: 2
  },

  /* BOTTOM BAR */
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    paddingVertical: 0,
  },
  sendBtn: {
    padding: 5,
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  bottomIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    padding: 6,
  },
  mutedBtn: {
    backgroundColor: 'rgba(255, 60, 172, 0.2)',
    borderRadius: 20,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF3CAC',
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  
  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-start', // Align to top
    paddingTop: 100, // Adjust based on header height
  },
  exitModalContainer: {
    marginHorizontal: 20,
    backgroundColor: colors.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    padding: 20,
  },
  exitModalContent: {
      alignItems: 'center'
  },
  exitTitle: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 20
  },
  exitButtonsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%'
  },
  exitOptionBtn: {
      alignItems: 'center',
  },
  exitIconCircle: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.5)'
  },
  exitBtnText: {
      fontWeight: '600',
      color: '#fff'
  },

  /* SETTINGS MODAL */
  settingsModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end', // Bottom Sheet behavior
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  settingsModalContainer: {
    backgroundColor: colors.background, // Dark Theme
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '85%',
    paddingTop: 10,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  settingsScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  roomImageSection: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  settingRoomImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#FF9900',
    padding: 4,
    borderRadius: 12,
  },
  settingLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
  },
  settingInput: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#fff',
    height: 45,
    marginBottom: 5,
  },
  // New Styles
  settingInputBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    height: 45,
    marginBottom: 5,
  },
  settingInputText: {
    color: '#fff',
    fontSize: 14,
  },
  settingOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  settingOptionText: {
    color: '#fff',
    fontSize: 15,
  },
  settingValueText: {
    color: 'rgba(255,255,255,0.5)',
    marginRight: 5,
    fontSize: 14,
  },
  
  /* GAME MODAL */
  gameSectionTitle: {
     color: '#ccc',
     fontSize: 14,
     fontWeight: 'bold',
     marginTop: 25,
     marginBottom: 15,
  },
  gameGridContainer: {
     flexDirection: 'row',
     flexWrap: 'wrap',
  },
  gameIconBox: {
     width: '21%',
     aspectRatio: 1,
     backgroundColor: 'rgba(255,255,255,0.08)',
     borderRadius: 15,
     justifyContent: 'center',
     alignItems: 'center',
     marginBottom: 15,
     marginRight: '4%',
  },
  gameEmoji: {
     fontSize: 32,
  },

  /* GRID */
  settingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 20,
  },
  settingGridItem: {
    width: '18%', 
    alignItems: 'center',
    marginBottom: 15,
  },
  settingGridIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#fff', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  settingGridText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    textAlign: 'center',
  },

  /* MUSIC PAGE */
  musicSearchBar: {
     flexDirection: 'row',
     width: '100%',
     backgroundColor: '#fff',
     borderRadius: 20,
     paddingHorizontal: 15,
     alignItems: 'center',
     height: 45,
     marginBottom: 15
  },
  musicTabs: {
     flexDirection: 'row',
     width: '100%',
     borderBottomWidth: 1,
     borderBottomColor: 'rgba(255,255,255,0.1)',
     marginBottom: 30
  },
  musicTabActive: {
     flex: 1,
     alignItems: 'center',
     paddingVertical: 10,
     borderBottomWidth: 2,
     borderBottomColor: '#FF5722' // Active color
  },
  musicTab: {
     flex: 1,
     alignItems: 'center',
     paddingVertical: 10,
  },
  musicTabTextActive: {
     color: '#000', // Or white if dark theme, keeping light due to content bg?
     // Actually modal is dark #2E0249. So text should be white.
     color: '#fff',
     fontWeight: 'bold',
     fontSize: 16
  },
  musicTabText: {
     color: 'rgba(255,255,255,0.5)',
     fontSize: 16
  },
  emptyStateContainer: {
     alignItems: 'center',
     justifyContent: 'center',
     width: '100%',
     marginTop: 40
  },
  emptyIconCircle: {
     width: 100,
     height: 100,
     borderRadius: 50,
     backgroundColor: '#fff', // Or light grey
     justifyContent: 'center',
     alignItems: 'center',
     marginBottom: 20,
     // Add some shadow or illustration vibe?
  },
  emptyStateText: {
     color: 'rgba(255,255,255,0.6)',
     fontSize: 14,
     marginBottom: 30
  },
  gradientBtn: {
     backgroundColor: '#FF3CAC', // Simplify gradient to solid for now or linear gradient if library used
     paddingHorizontal: 40,
     paddingVertical: 12,
     borderRadius: 25,
  },

  /* PASSWORD / LOCK */
  passwordContainer: {
     flexDirection: 'row',
     justifyContent: 'center',
     gap: 15,
     marginBottom: 40,
     marginTop: 40
  },
  passwordInputBox: {
     width: 50,
     height: 50,
     backgroundColor: 'rgba(255,255,255,0.1)',
     borderRadius: 10,
     borderWidth: 1,
     borderColor: 'rgba(255,255,255,0.2)'
  },

  /* SUB PAGES */
  /* INPUT ROW (Sensitive Words) */
  inputRow: {
     flexDirection: 'row',
     width: '100%',
     alignItems: 'center',
     marginBottom: 30
  },
  flexInput: {
     flex: 1,
     backgroundColor: '#F5F5F5',
     borderRadius: 20,
     paddingHorizontal: 20,
     color: '#333',
     height: 50,
     marginRight: 10,
  },
  addBtnSmall: {
     backgroundColor: '#eee',
     paddingHorizontal: 20,
     height: 50,
     borderRadius: 20,
     justifyContent: 'center',
     alignItems: 'center'
  },
  descriptionTextLeft: {
     color: '#ccc',
     fontSize: 12,
     marginBottom: 5,
  },
  checkboxRow: {
     flexDirection: 'row',
     marginTop: 20,
     alignItems: 'center',
     width: '90%'
  },
  emptyCircle: {
     width: 18,
     height: 18,
     borderRadius: 9,
     borderWidth: 1,
     borderColor: '#ccc',
     marginRight: 10
  },
  checkboxLabel: {
     color: '#ccc',
     fontSize: 12,
     flex: 1
  },

  /* SELECTION CARDS (Mic Mode, Wheat Mode) */
  selectionCard: {
     flexDirection: 'row',
     backgroundColor: '#FFE5EC', // Light Pinkish bg for selected
     borderRadius: 15,
     padding: 15,
     alignItems: 'center',
     marginBottom: 10,
  },
  cardTitle: {
     fontSize: 16,
     fontWeight: 'bold',
     color: '#000',
     marginBottom: 4
  },
  cardDesc: {
     fontSize: 12,
     color: '#666',
  },
  checkCircleSelected: {
     width: 20,
     height: 20,
     borderRadius: 10,
     backgroundColor: '#FF5722', // Orange check
     justifyContent: 'center',
     alignItems: 'center'
  },
  checkCircleEmpty: {
     width: 20,
     height: 20,
     borderRadius: 10,
     backgroundColor: '#ddd'
  },

  /* TOGGLE LIST (Super Mic, Effect) */
  toggleListContainer: {
     padding: 20,
  },
  toggleRow: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     marginBottom: 25,
  },
  toggleLabel: {
     fontSize: 16,
     fontWeight: 'bold',
     color: '#fff'
  },


  subPageContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  subPageLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center'
  },
  subPageInput: {
    width: '100%',
    backgroundColor: '#F5F5F5', // Light BG as per screenshot (or keep dark?) User screenshot shows light input on white card, let's mix for dark theme compatibility
    borderRadius: 20, // Rounded
    paddingHorizontal: 20,
    color: '#333',
    height: 50,
    marginBottom: 30,
  },
  saveBtn: {
    backgroundColor: '#FFCC80', // Gradient-ish
    width: '80%',
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionText: {
    color: '#ccc',
    fontSize: 13,
    marginBottom: 20,
    textAlign: 'center'
  },
  textAreaContainer: {
     width: '100%',
     height: 150,
     backgroundColor: '#F5F5F5',
     borderRadius: 15,
     padding: 10,
     marginBottom: 30
  },
  textAreaInput: {
     flex: 1,
     color: '#333',
     textAlignVertical: 'top',
     fontSize: 14,
  },
  charCount: {
     alignSelf: 'flex-end',
     color: '#999',
     fontSize: 12,
  },
  smallNote: {
     color: 'rgba(255,255,255,0.4)',
     fontSize: 11,
     textAlign: 'center',
     marginTop: 10,
  },

  /* ACTION SHEET */
  actionSheetContainer: {
     flex: 1,
     justifyContent: 'flex-end',
     paddingBottom: 20,
  },
  actionSheetOption: {
     backgroundColor: '#fff',
     paddingVertical: 15,
     alignItems: 'center',
     borderBottomWidth: 1,
     borderBottomColor: '#eee',
     borderRadius: 0,
  },
  actionSheetText: {
     fontSize: 16,
     color: '#333',
  },

  /* ROOM TYPE */
  roomTypeContainer: {
      flex: 1,
      justifyContent: 'center', // Center vertically ? Or bottom ? Screenshot shows bottom sheet with types
      paddingBottom: 40,
      justifyContent: 'flex-end'
  },
  roomTypeRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
  },
  roomTypeCard: {
      alignItems: 'center',
  },
  roomTypeIcon: {
      width: 60,
      height: 60,
      borderRadius: 15, 
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
  },
  roomTypeValue: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600'
  }
});
