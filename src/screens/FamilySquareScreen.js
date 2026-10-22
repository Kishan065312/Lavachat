import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, StatusBar, Platform, Alert } from 'react-native';
import { ChevronLeft, ChevronRight, Trophy, Users, Star, Award, Shield } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const RANKINGS = [
    {
        rank: 1,
        name: 'VIP ✦',
        badge: 'TOP 1 VIP',
        score: '14821',
        bannerColor: ['#FBBF24', '#78350F'],
        frameColor: '#F59E0B',
        avatars: [
            'https://randomuser.me/api/portraits/women/44.jpg',
            'https://randomuser.me/api/portraits/men/32.jpg',
            'https://randomuser.me/api/portraits/women/12.jpg'
        ],
        familyLogo: '👑'
    },
    {
        rank: 2,
        name: 'Al-Amal ⚝',
        badge: 'TOP 2',
        score: '5605',
        bannerColor: ['#3B82F6', '#1E3A8A'],
        frameColor: '#2563EB',
        avatars: [
            'https://randomuser.me/api/portraits/men/85.jpg',
            'https://randomuser.me/api/portraits/women/67.jpg',
            'https://randomuser.me/api/portraits/men/22.jpg'
        ],
        familyLogo: '🦅'
    },
    {
        rank: 3,
        name: 'Al-Malouk ⚔',
        badge: 'TOP 3',
        score: '5415',
        bannerColor: ['#10B981', '#064E3B'],
        frameColor: '#059669',
        avatars: [
            'https://randomuser.me/api/portraits/women/60.jpg',
            'https://randomuser.me/api/portraits/men/71.jpg',
            'https://randomuser.me/api/portraits/women/33.jpg'
        ],
        familyLogo: '🦁'
    },
    {
        rank: 4,
        name: 'Al-Shuyukh',
        score: '5082',
        badge: 'Top 4',
        avatars: [
            'https://randomuser.me/api/portraits/men/11.jpg',
            'https://randomuser.me/api/portraits/women/8.jpg',
            'https://randomuser.me/api/portraits/men/3.jpg'
        ],
        familyLogo: '🔱'
    },
    {
        rank: 5,
        name: 'LOVE ZINDAGI',
        score: '4797',
        badge: 'Top 5',
        avatars: [
            'https://randomuser.me/api/portraits/women/77.jpg',
            'https://randomuser.me/api/portraits/men/50.jpg',
            'https://randomuser.me/api/portraits/women/2.jpg'
        ],
        familyLogo: '🌌'
    }
];

export default function FamilySquareScreen() {
    const navigation = useNavigation();
    const [activeHeaderTab, setActiveHeaderTab] = useState('square'); // 'my' or 'square'
    const [timeFilter, setTimeFilter] = useState('Day'); // 'Day', 'Weekly', 'Month'

    const handleApply = (familyName) => {
        Alert.alert("Success", `Applied to join ${familyName}!`);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Header Navigation with Custom Slider Tabs */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <ChevronLeft color="#FFFFFF" size={24} />
                </TouchableOpacity>

                <View style={styles.headerTabContainer}>
                    <TouchableOpacity 
                        style={styles.headerTabItem} 
                        onPress={() => setActiveHeaderTab('my')}
                        activeOpacity={0.9}
                    >
                        {activeHeaderTab === 'my' ? (
                            <LinearGradient 
                                colors={['#F59E0B', '#D97706']} 
                                style={styles.headerTabGradient}
                            >
                                <Text style={styles.headerTabTextActive}>My family</Text>
                            </LinearGradient>
                        ) : (
                            <Text style={styles.headerTabTextInactive}>My family</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.headerTabItem} 
                        onPress={() => setActiveHeaderTab('square')}
                        activeOpacity={0.9}
                    >
                        {activeHeaderTab === 'square' ? (
                            <LinearGradient 
                                colors={['#F59E0B', '#D97706']} 
                                style={styles.headerTabGradient}
                            >
                                <Text style={styles.headerTabTextActive}>Family square</Text>
                            </LinearGradient>
                        ) : (
                            <Text style={styles.headerTabTextInactive}>Family square</Text>
                        )}
                    </TouchableOpacity>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {activeHeaderTab === 'square' ? (
                    <>
                        {/* Grand Trophy Branding Header Area */}
                        <View style={styles.brandHeaderContainer}>
                            {/* <ImageBackgroundGradient /> */}

                            {/* Left Dragon Shield (Representing the fire dragon) */}
                            {/* <View style={styles.dragonLeft}>
                                <Text style={{ fontSize: 24 }}>🔥</Text>
                            </View> */}

                            {/* Center Giant Gold Trophy */}
                            <View style={styles.trophyWrapper}>
                                <Trophy color="#FBBF24" fill="#F59E0B" size={54} />
                                <View style={styles.trophyStarGlow}>
                                    <Star color="#FFE600" fill="#FFE600" size={14} />
                                </View>
                            </View>

                            {/* Right Dragon Shield (Representing the frost dragon) */}
                            {/* <View style={styles.dragonRight}>
                                <Text style={{ fontSize: 24 }}>❄️</Text>
                            </View> */}

                            {/* Ranking Title Text Ribbon */}
                            <View style={styles.ribbonContainer}>
                                <Text style={styles.ribbonText}>Family Ranking</Text>
                            </View>
                        </View>

                        {/* Filter Time Segment selector */}
                        <View style={styles.filterRow}>
                            <TouchableOpacity 
                                style={[styles.filterBtn, timeFilter === 'Day' && styles.filterBtnActive]} 
                                onPress={() => setTimeFilter('Day')}
                            >
                                {timeFilter === 'Day' ? (
                                    <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.filterBtnGradient}>
                                        <Text style={styles.filterBtnTextActive}>Day</Text>
                                    </LinearGradient>
                                ) : (
                                    <Text style={styles.filterBtnText}>Day</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.filterBtn, timeFilter === 'Weekly' && styles.filterBtnActive]} 
                                onPress={() => setTimeFilter('Weekly')}
                            >
                                {timeFilter === 'Weekly' ? (
                                    <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.filterBtnGradient}>
                                        <Text style={styles.filterBtnTextActive}>Weekly</Text>
                                    </LinearGradient>
                                ) : (
                                    <Text style={styles.filterBtnText}>Weekly</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.filterBtn, timeFilter === 'Month' && styles.filterBtnActive]} 
                                onPress={() => setTimeFilter('Month')}
                            >
                                {timeFilter === 'Month' ? (
                                    <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.filterBtnGradient}>
                                        <Text style={styles.filterBtnTextActive}>Month</Text>
                                    </LinearGradient>
                                ) : (
                                    <Text style={styles.filterBtnText}>Month</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Date Navigation switch */}
                        <View style={styles.dateSelectorRow}>
                            <TouchableOpacity>
                                <ChevronLeft color="#D97706" size={20} />
                            </TouchableOpacity>
                            <Text style={styles.dateText}>2026.06.30</Text>
                            <TouchableOpacity>
                                <ChevronRight color="#D97706" size={20} />
                            </TouchableOpacity>
                        </View>

                        {/* Rank Listings */}
                        <View style={styles.rankingsListContainer}>
                            {RANKINGS.map((item, index) => {
                                const isTop3 = item.rank <= 3;
                                return (
                                    <View key={item.rank} style={[
                                        styles.rankCard,
                                        isTop3 && { borderColor: item.frameColor, borderWidth: 1.5 },
                                        item.rank === 1 && styles.rankCardGold,
                                        item.rank === 2 && styles.rankCardBlue,
                                        item.rank === 3 && styles.rankCardGreen,
                                    ]}>
                                        {/* Left Rank Number/Medal Badge */}
                                        <View style={styles.rankNumCol}>
                                            {item.rank === 1 && <Text style={styles.rankBadgeText1}>🥇</Text>}
                                            {item.rank === 2 && <Text style={styles.rankBadgeText2}>🥈</Text>}
                                            {item.rank === 3 && <Text style={styles.rankBadgeText3}>🥉</Text>}
                                            {item.rank > 3 && <Text style={styles.rankNumberText}>{item.rank}</Text>}
                                        </View>

                                        {/* Family Frame Logo */}
                                        <View style={[styles.familyLogoFrame, isTop3 && { borderColor: item.frameColor }]}>
                                            <View style={styles.familyLogoCircle}>
                                                <Text style={styles.familyEmoji}>{item.familyLogo}</Text>
                                            </View>
                                            {isTop3 && (
                                                <View style={[styles.familyFrameLabel, { backgroundColor: item.frameColor }]}>
                                                    <Text style={styles.frameLabelText}>{item.badge}</Text>
                                                </View>
                                            )}
                                        </View>

                                        {/* Center Info Name & Avatars */}
                                        <View style={styles.familyInfoCol}>
                                            <Text style={styles.familyName}>{item.name}</Text>
                                            
                                            {/* Member Avatars Stack */}
                                            <View style={styles.avatarsRow}>
                                                {item.avatars.map((url, i) => (
                                                    <Image 
                                                        key={i} 
                                                        source={{ uri: url }} 
                                                        style={[styles.memberAvatar, { marginLeft: i > 0 ? -10 : 0 }]} 
                                                    />
                                                ))}
                                                <ChevronRight color="#9ca3af" size={14} style={{ marginLeft: 4 }} />
                                            </View>
                                        </View>

                                        {/* Right Coin Score */}
                                        <View style={styles.scoreCol}>
                                            <View style={styles.coinBadge}>
                                                <Text style={styles.coinIcon}>🪙</Text>
                                            </View>
                                            <Text style={styles.scoreText}>x{item.score}</Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </>
                ) : (
                    /* My Family Tab content */
                    <View style={styles.myFamilyContainer}>
                        {/* Banner Card */}
                        <View style={styles.myFamilyNoClanCard}>
                            <LinearGradient colors={['#1E1B2A', '#13111C']} style={styles.myFamilyNoClanGradient}>
                                <View style={styles.myFamilyShieldWrapper}>
                                    <View style={styles.shieldGoldOuter}>
                                        <Shield color="#FBBF24" fill="#FBBF24" size={40} />
                                    </View>
                                </View>
                                
                                <Text style={styles.myFamilyTitle}>Not Joined Any Family Yet</Text>
                                <Text style={styles.myFamilyDesc}>
                                    Create your own clan to lead the square or search active families to apply.
                                </Text>

                                <View style={styles.myFamilyActionsRow}>
                                    <TouchableOpacity style={styles.myFamilyOutlineBtn} onPress={() => Alert.alert("Create Family", "Coming soon!")}>
                                        <Text style={styles.myFamilyOutlineBtnText}>Create Family</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.myFamilySolidBtn} onPress={() => handleApply('VIP Family')}>
                                        <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.solidBtnGradient}>
                                            <Text style={styles.myFamilySolidBtnText}>Quick Join</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>
                        </View>

                        {/* Recommended Clans Section */}
                        <Text style={styles.clansSectionTitle}>Recommended Families</Text>

                        <View style={styles.recClansList}>
                            {/* Family 1 */}
                            <View style={styles.recClanCard}>
                                <View style={styles.recClanLeft}>
                                    <View style={styles.recClanBadge}>
                                        <Text style={{ fontSize: 20 }}>🦅</Text>
                                    </View>
                                    <View style={{ marginLeft: 12 }}>
                                        <Text style={styles.recClanName}>Al-Maroof Family</Text>
                                        <Text style={styles.recClanPower}>Lv. 4 • Power: 45K</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.recClanApplyBtn} onPress={() => handleApply('Al-Maroof Family')}>
                                    <Text style={styles.recClanApplyText}>Apply</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Family 2 */}
                            <View style={styles.recClanCard}>
                                <View style={styles.recClanLeft}>
                                    <View style={styles.recClanBadge}>
                                        <Text style={{ fontSize: 20 }}>🦁</Text>
                                    </View>
                                    <View style={{ marginLeft: 12 }}>
                                        <Text style={styles.recClanName}>The Kings Guard</Text>
                                        <Text style={styles.recClanPower}>Lv. 5 • Power: 82K</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.recClanApplyBtn} onPress={() => handleApply('The Kings Guard')}>
                                    <Text style={styles.recClanApplyText}>Apply</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Family 3 */}
                            <View style={styles.recClanCard}>
                                <View style={styles.recClanLeft}>
                                    <View style={styles.recClanBadge}>
                                        <Text style={{ fontSize: 20 }}>🔥</Text>
                                    </View>
                                    <View style={{ marginLeft: 12 }}>
                                        <Text style={styles.recClanName}>Phoenix Knights</Text>
                                        <Text style={styles.recClanPower}>Lv. 3 • Power: 24K</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.recClanApplyBtn} onPress={() => handleApply('Phoenix Knights')}>
                                    <Text style={styles.recClanApplyText}>Apply</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Bottom Bar Selector Button */}
            <View style={styles.bottomBarContainer}>
                <TouchableOpacity style={styles.footerJoinBtn}>
                    <LinearGradient colors={['#855239', '#57311D']} style={styles.footerJoinBtnGradient}>
                        <Text style={styles.footerJoinBtnText}>Not joining the family</Text>
                        <Text style={styles.footerJoinChevron}>▼</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// Background Visual Helper Component
const ImageBackgroundGradient = () => (
    <View style={StyleSheet.absoluteFill}>
        <LinearGradient
            colors={['#1E152A', '#0D0814']}
            style={{ flex: 1 }}
        />
        <View style={styles.glowSpotlight} />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0611',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 44 : 50,
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: '#0F0D13',
    },
    backBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTabContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(245, 158, 11, 0.15)',
        borderRadius: 20,
        width: 230,
        height: 38,
        padding: 2,
    },
    headerTabItem: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        overflow: 'hidden',
    },
    headerTabGradient: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
    },
    headerTabTextActive: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: 'bold',
    },
    headerTabTextInactive: {
        color: '#9CA3AF',
        fontSize: 13,
        fontWeight: '600',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    brandHeaderContainer: {
        height: 180,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    glowSpotlight: {
        position: 'absolute',
        top: -100,
        alignSelf: 'center',
        width: width,
        height: width,
        borderRadius: width / 2,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        transform: [{ scaleY: 0.5 }],
    },
    dragonLeft: {
        position: 'absolute',
        left: 20,
        top: 35,
        width: 50,
        height: 50,
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        borderWidth: 1.5,
        borderColor: '#DC2626',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ rotate: '-15deg' }],
    },
    dragonRight: {
        position: 'absolute',
        right: 20,
        top: 35,
        width: 50,
        height: 50,
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        borderWidth: 1.5,
        borderColor: '#2563EB',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ rotate: '15deg' }],
    },
    trophyWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2,
        top: -10,
    },
    trophyStarGlow: {
        position: 'absolute',
        top: -10,
    },
    ribbonContainer: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: '#78350F',
        borderWidth: 2,
        borderColor: '#F59E0B',
        borderRadius: 6,
        paddingHorizontal: 24,
        paddingVertical: 6,
        shadowColor: '#F59E0B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 6,
        zIndex: 5,
    },
    ribbonText: {
        color: '#FCD34D',
        fontWeight: 'bold',
        fontSize: 15,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        paddingHorizontal: 16,
    },
    filterBtn: {
        flex: 1,
        height: 38,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#78350F',
        backgroundColor: '#1E1510',
        marginHorizontal: 4,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    filterBtnActive: {
        borderColor: '#FBBF24',
        borderWidth: 1.5,
    },
    filterBtnGradient: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterBtnText: {
        color: '#D97706',
        fontSize: 13,
        fontWeight: 'bold',
    },
    filterBtnTextActive: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: 'bold',
    },
    dateSelectorRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 12,
    },
    dateText: {
        color: '#F59E0B',
        fontWeight: 'bold',
        fontSize: 13,
        marginHorizontal: 10,
    },
    rankingsListContainer: {
        paddingHorizontal: 16,
    },
    rankCard: {
        backgroundColor: '#16131F',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.04)',
    },
    rankCardGold: {
        backgroundColor: '#271F14',
    },
    rankCardBlue: {
        backgroundColor: '#111827',
    },
    rankCardGreen: {
        backgroundColor: '#062F24',
    },
    rankNumCol: {
        width: 32,
        alignItems: 'center',
        marginRight: 6,
    },
    rankBadgeText1: {
        fontSize: 22,
    },
    rankBadgeText2: {
        fontSize: 22,
    },
    rankBadgeText3: {
        fontSize: 22,
    },
    rankNumberText: {
        color: '#9CA3AF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    familyLogoFrame: {
        width: 44,
        height: 44,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#4B5563',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginRight: 12,
        backgroundColor: '#111015',
    },
    familyLogoCircle: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    familyEmoji: {
        fontSize: 20,
    },
    familyFrameLabel: {
        position: 'absolute',
        bottom: -5,
        borderRadius: 4,
        paddingHorizontal: 3,
        paddingVertical: 1.5,
        alignSelf: 'center',
    },
    frameLabelText: {
        color: '#FFFFFF',
        fontSize: 7,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    familyInfoCol: {
        flex: 1,
        justifyContent: 'center',
    },
    familyName: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    avatarsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    memberAvatar: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 1.5,
        borderColor: '#16131F',
    },
    scoreCol: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    coinBadge: {
        marginRight: 4,
    },
    coinIcon: {
        fontSize: 14,
    },
    scoreText: {
        color: '#FBBF24',
        fontSize: 14,
        fontWeight: 'bold',
    },
    bottomBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#0F0D13',
        borderTopWidth: 1.5,
        borderTopColor: '#78350F',
        padding: 12,
    },
    footerJoinBtn: {
        height: 44,
        borderRadius: 8,
        overflow: 'hidden',
    },
    footerJoinBtnGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    footerJoinBtnText: {
        color: '#FCD34D',
        fontWeight: 'bold',
        fontSize: 14,
        marginRight: 6,
    },
    footerJoinChevron: {
        color: '#FCD34D',
        fontSize: 10,
    },
    
    /* My Family Tab Styles */
    myFamilyContainer: {
        padding: 16,
    },
    myFamilyNoClanCard: {
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: '#78350F',
        marginBottom: 20,
    },
    myFamilyNoClanGradient: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    myFamilyShieldWrapper: {
        marginBottom: 12,
    },
    shieldGoldOuter: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(245, 158, 11, 0.12)',
        borderWidth: 1.5,
        borderColor: '#F59E0B',
        alignItems: 'center',
        justifyContent: 'center',
    },
    myFamilyTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    myFamilyDesc: {
        color: '#9CA3AF',
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    myFamilyActionsRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    myFamilyOutlineBtn: {
        flex: 1,
        height: 40,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#F59E0B',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        backgroundColor: 'transparent',
    },
    myFamilyOutlineBtnText: {
        color: '#F59E0B',
        fontSize: 13,
        fontWeight: 'bold',
    },
    myFamilySolidBtn: {
        flex: 1,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        marginLeft: 8,
    },
    solidBtnGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    myFamilySolidBtnText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: 'bold',
    },
    clansSectionTitle: {
        color: '#F59E0B',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    recClansList: {
        marginTop: 4,
    },
    recClanCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#16131F',
        borderRadius: 12,
        padding: 12,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.04)',
    },
    recClanLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recClanBadge: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#271F14',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#78350F',
    },
    recClanName: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    recClanPower: {
        color: '#9CA3AF',
        fontSize: 11,
        marginTop: 4,
    },
    recClanApplyBtn: {
        backgroundColor: '#78350F',
        borderWidth: 1,
        borderColor: '#F59E0B',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 5,
    },
    recClanApplyText: {
        color: '#FCD34D',
        fontSize: 11,
        fontWeight: 'bold',
    }
});
