import React, { useState, useRef, useEffect } from 'react';
import { 
    View, 
    Text, 
    Image, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView, 
    Dimensions, 
    StatusBar,
    FlatList
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const ranks = [
    { id: 'viscount', label: 'Viscount', emblem: require('../assets/WhatsApp Image 2026-05-26 at 19.44.42.jpeg'), privilegesCount: 4, hasSpecialBox: false },
    { id: 'count', label: 'Count', emblem: require('../assets/WhatsApp Image 2026-05-26 at 19.44.43.jpeg'), privilegesCount: 8, hasSpecialBox: false },
    { id: 'marquis', label: 'Marquis', emblem: require('../assets/WhatsApp Image 2026-05-26 at 19.44.44.jpeg'), privilegesCount: 10, hasSpecialBox: false },
    { id: 'duke', label: 'Duke', emblem: require('../assets/WhatsApp Image 2026-05-26 at 19.44.45.jpeg'), privilegesCount: 12, hasSpecialBox: false },
    { id: 'king', label: 'King', emblem: require('../assets/WhatsApp Image 2026-05-26 at 19.44.46.jpeg'), privilegesCount: 14, hasSpecialBox: false },
    { id: 'emperor', label: 'Emperor', emblem: require('../assets/WhatsApp Image 2026-05-26 at 19.44.47.jpeg'), privilegesCount: 16, hasSpecialBox: true },
    { id: 'sovereign', label: 'Sovereign', emblem: require('../assets/WhatsApp Image 2026-05-26 at 19.44.48.jpeg'), privilegesCount: 17, hasSpecialBox: true },
    { id: 'omniscient', label: 'Omniscient', emblem: require('../assets/WhatsApp Image 2026-05-26 at 19.44.49.jpeg'), privilegesCount: 18, hasSpecialBox: true },
];

const privilegesGrid = [
    { id: 'badge', title: 'Rank Badge', icon: 'https://img.icons8.com/color/96/warranty.png', subtitle: 'Exclusive Badge' },
    { id: 'gold', title: 'Daily Gold', icon: 'https://img.icons8.com/color/96/coins.png', subtitle: '80000 golds for daily sign-in' },
    { id: 'nickname', title: 'Exclusive nickname', icon: 'https://img.icons8.com/color/96/name-tag.png', subtitle: 'Special color name' },
    { id: 'effects', title: 'Arrival special effects', icon: 'https://img.icons8.com/color/96/magic-wand.png', subtitle: 'Cool entry effect' },
    { id: 'customer', title: 'Exclusive customer service', icon: 'https://img.icons8.com/color/96/headset.png', subtitle: 'Priority support' },
    { id: 'room', title: 'Exclusive room', icon: 'https://img.icons8.com/color/96/room.png', subtitle: 'Create VIP rooms' },
    { id: 'antikick', title: 'Anti-kick protection', icon: 'https://img.icons8.com/color/96/shield.png', subtitle: 'Prevent being kicked out' },
    { id: 'micborder', title: 'Microphone border', icon: 'https://img.icons8.com/color/96/microphone.png', subtitle: 'Glowing mic ring' },
    { id: 'giftbox', title: 'Exclusive gift box', icon: 'https://img.icons8.com/color/96/gift.png', subtitle: 'Access to VIP gifts' },
    { id: 'dynname', title: 'Dynamic nameplate', icon: 'https://img.icons8.com/color/96/label.png', subtitle: 'Dynamic label styling' },
    { id: 'theme', title: 'Profile theme', icon: 'https://img.icons8.com/color/96/paint-brush.png', subtitle: 'Custom profile backdrop' },
    { id: 'pmprotect', title: 'Private message protection', icon: 'https://img.icons8.com/color/96/lock.png', subtitle: 'Block spam messages' },
    { id: 'hideloc', title: 'Hide location', icon: 'https://img.icons8.com/color/96/map-pin.png', subtitle: 'Incognito map status' },
    { id: 'avatars', title: 'Premium avatars', icon: 'https://img.icons8.com/color/96/user.png', subtitle: 'High-quality templates' },
    { id: 'badgeborder', title: 'Special badge border', icon: 'https://img.icons8.com/color/96/diploma.png', subtitle: 'Unique frame outline' },
    { id: 'roombg', title: 'Special room background', icon: 'https://img.icons8.com/color/96/picture.png', subtitle: 'Unlock luxury backgrounds' },
    { id: 'eliteentry', title: 'Elite leaderboard entry', icon: 'https://img.icons8.com/color/96/trophy.png', subtitle: 'Featured top rank' },
    { id: 'sovering', title: 'Sovereign ring effect', icon: 'https://img.icons8.com/color/96/diamond.png', subtitle: 'Ultimate aura ring' }
];

export default function VIPScreen({ navigation }) {
    const [selectedRankIndex, setSelectedRankIndex] = useState(1); // Default to Count
    const flatListRef = useRef(null);
    const tabsScrollViewRef = useRef(null);
    
    const activeRank = ranks[selectedRankIndex];

    const handleTabPress = (idx) => {
        setSelectedRankIndex(idx);
        flatListRef.current?.scrollToIndex({ index: idx, animated: true });
    };

    useEffect(() => {
        // Scroll the top tabs menu to keep the active tab centered
        tabsScrollViewRef.current?.scrollTo({
            x: Math.max(0, selectedRankIndex * 106 - width / 2 + 45),
            animated: true
        });
    }, [selectedRankIndex]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Background Gradient matching the warm dark tone */}
                <LinearGradient 
                    colors={['#30221c', '#15100e', '#110b0a']} 
                    style={styles.bgGradient}
                />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <ChevronLeft color="#fff" size={28} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Aristocracy</Text>
                    <View style={{ width: 28 }} />
                </View>

                {/* Horizontal Scrollable Tabs */}
                <View>
                    <ScrollView 
                        ref={tabsScrollViewRef}
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        contentContainerStyle={styles.tabsContainer}
                    >
                        {ranks.map((rank, idx) => {
                            const isActive = idx === selectedRankIndex;
                            return (
                                <TouchableOpacity 
                                    key={rank.id} 
                                    style={styles.tabBtn}
                                    onPress={() => handleTabPress(idx)}
                                >
                                    <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                                        {rank.label}
                                    </Text>
                                    {isActive && <View style={styles.activeIndicator} />}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Swipable Emblem Carousel */}
                <View style={styles.emblemSection}>
                    <FlatList
                        ref={flatListRef}
                        data={ranks}
                        keyExtractor={(item) => item.id}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        bounces={false}
                        initialScrollIndex={1} // Default to Count (index 1)
                        getItemLayout={(data, index) => (
                            { length: width, offset: width * index, index }
                        )}
                        onMomentumScrollEnd={(e) => {
                            const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
                            setSelectedRankIndex(newIndex);
                        }}
                        renderItem={({ item }) => (
                            <View style={{ width, height: 260, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={styles.emblemGlow} />
                                <Image source={item.emblem} style={styles.emblemIcon} resizeMode="contain" />
                                
                                {/* Podium / Platform graphic representation */}
                                <View style={styles.platformBase}>
                                    <LinearGradient colors={['rgba(255, 215, 0, 0.1)', 'transparent']} style={styles.platformGradient} />
                                    <Text style={styles.rankNameText}>{item.label}</Text>
                                </View>
                            </View>
                        )}
                    />
                </View>

                {/* Divider */}
                <View style={styles.dividerSection}>
                    <LinearGradient colors={['transparent', '#3a2e22', 'transparent']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.dividerLine} />
                    <View style={styles.dividerContent}>
                        <Image source={{ uri: 'https://img.icons8.com/color/48/deciduous-tree.png' }} style={[styles.oliveBranch, { transform: [{ scaleX: -1 }] }]} />
                        <Text style={styles.dividerText}>Exclusive Privileges</Text>
                        <Image source={{ uri: 'https://img.icons8.com/color/48/deciduous-tree.png' }} style={styles.oliveBranch} />
                    </View>
                    <Text style={styles.privilegeCount}>({activeRank.privilegesCount}/18)</Text>
                </View>

                {/* Special Box for higher ranks */}
                {activeRank.hasSpecialBox && (
                    <View style={styles.specialBoxContainer}>
                        <LinearGradient colors={['#29211c', '#1b1411']} style={styles.specialBoxGradient}>
                            <Image source={{ uri: 'https://img.icons8.com/3d-fluency/96/gift.png' }} style={styles.specialBoxImage} />
                            <View style={styles.specialBoxContent}>
                                <Text style={styles.specialBoxTitle}>Friday exclusive golds treasure</Text>
                                <Text style={styles.specialBoxDesc}>You can claim exclusive golds treasure every Friday.</Text>
                            </View>
                        </LinearGradient>
                    </View>
                )}

                {/* Grid of privileges */}
                <View style={styles.gridContainer}>
                    {privilegesGrid.slice(0, activeRank.privilegesCount).map((priv) => (
                        <View key={priv.id} style={styles.gridItem}>
                            <View style={styles.iconCircle}>
                                <Image source={{ uri: priv.icon }} style={styles.gridIcon} />
                            </View>
                            <Text style={styles.gridItemTitle}>{activeRank.label} {priv.id === 'badge' ? 'Badge' : priv.title}</Text>
                            {priv.id === 'gold' && <Text style={styles.gridItemSubtitle}>{priv.subtitle}</Text>}
                        </View>
                    ))}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Sticky Footer */}
            <View style={styles.stickyFooter}>
                <View>
                    <Text style={styles.footerTitle}>Join activities!</Text>
                    <Text style={styles.footerSub}>Weekly Star Activity,etc.</Text>
                </View>
                <TouchableOpacity style={styles.goBtn}>
                    <Text style={styles.goBtnText}>Go</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#110b0a',
    },
    bgGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 600,
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 15,
    },
    backBtn: {
        padding: 5,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    tabsContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    tabBtn: {
        marginRight: 16,
        alignItems: 'center',
        position: 'relative',
        paddingBottom: 8,
        width: 90, // wider width to support long words on one line
    },
    tabText: {
        color: '#716358',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    activeTabText: {
        color: '#f9df9f',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        width: 16,
        height: 3,
        backgroundColor: '#f9df9f',
        borderRadius: 2,
    },
    emblemSection: {
        marginTop: 20,
        marginBottom: 10,
        height: 260,
    },
    emblemGlow: {
        position: 'absolute',
        width: 200,
        height: 200,
        backgroundColor: 'rgba(57, 126, 137, 0.2)', // Bluish glow like Count
        borderRadius: 100,
        top: 0,
    },
    emblemIcon: {
        width: 200,
        height: 200,
        zIndex: 2,
    },
    platformBase: {
        marginTop: -30,
        width: width * 0.8,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    platformGradient: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 60,
        borderTopLeftRadius: 100,
        borderTopRightRadius: 100,
        transform: [{ scaleY: 0.3 }],
    },
    rankNameText: {
        color: '#f9df9f',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 40,
    },
    dividerSection: {
        alignItems: 'center',
        marginVertical: 20,
        paddingHorizontal: 40,
    },
    dividerLine: {
        position: 'absolute',
        top: 15,
        left: 40,
        right: 40,
        height: 1,
    },
    dividerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#110b0a',
        paddingHorizontal: 15,
    },
    oliveBranch: {
        width: 20,
        height: 20,
        tintColor: '#f9df9f',
        marginHorizontal: 8,
    },
    dividerText: {
        color: '#f9df9f',
        fontSize: 13,
        fontWeight: 'bold',
    },
    privilegeCount: {
        color: '#716358',
        fontSize: 10,
        marginTop: 6,
    },
    specialBoxContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    specialBoxGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#3a2e22',
    },
    specialBoxImage: {
        width: 60,
        height: 60,
        marginRight: 15,
    },
    specialBoxContent: {
        flex: 1,
    },
    specialBoxTitle: {
        color: '#f9df9f',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    specialBoxDesc: {
        color: '#d4c5b9',
        fontSize: 11,
        lineHeight: 16,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
    },
    gridItem: {
        width: '50%',
        alignItems: 'center',
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#f9df9f',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: 'rgba(249, 223, 159, 0.05)',
    },
    gridIcon: {
        width: 36,
        height: 36,
    },
    gridItemTitle: {
        color: '#d4c5b9',
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
    },
    gridItemSubtitle: {
        color: '#f9df9f',
        fontSize: 10,
        marginTop: 4,
        textAlign: 'center',
    },
    stickyFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: '#1c1511',
        borderTopWidth: 1,
        borderColor: '#3a2e22',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    footerTitle: {
        color: '#f9df9f',
        fontSize: 14,
        fontWeight: 'bold',
    },
    footerSub: {
        color: '#716358',
        fontSize: 11,
        marginTop: 2,
    },
    goBtn: {
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#f9df9f',
    },
    goBtnText: {
        color: '#f9df9f',
        fontSize: 14,
        fontWeight: '600',
    }
});
