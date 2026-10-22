import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Dimensions, Platform, StatusBar } from 'react-native';
import { ChevronLeft, HelpCircle, Lock, X, Plus } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const BADGE_DESCRIPTIONS = [
    { tier: 'SSS level', value: '2000+', color: '#EF4444', icon: 'https://img.icons8.com/color/256/luxury.png' },
    { tier: 'SS level', value: '1000-1999', color: '#F59E0B', icon: 'https://img.icons8.com/color/256/police-badge.png' },
    { tier: 'S level', value: '500-999', color: '#DC2626', icon: 'https://img.icons8.com/color/256/military-medal.png' },
    { tier: 'A level', value: '50-499', color: '#3B82F6', icon: 'https://img.icons8.com/color/256/star-medal.png' },
    { tier: 'B level', value: '10-49', color: '#10B981', icon: 'https://img.icons8.com/color/256/diploma.png' },
    { tier: 'C level', value: '1-9', color: '#6B7280', icon: 'https://img.icons8.com/color/256/ribbon.png' }
];

const badgesCatalog = {
    Prestige: [
        {
            title: 'Rich Master',
            desc: 'Acquired by reaching rich level Lv10 in the app.',
            icon: 'https://img.icons8.com/fluency/256/dragon.png',
            owned: false,
            value: '3000',
            owner: 'No one owns',
            category: 'Rich (0/1)'
        },
        {
            title: 'Charm Star',
            desc: 'Acquired by receiving 50,000 popularity points.',
            icon: 'https://img.icons8.com/fluency/256/diamond-heart.png',
            owned: false,
            value: '2000',
            owner: 'No one owns',
            category: 'Charm (0/1)'
        }
    ],
    Achievement: [
        {
            title: 'Apex Climber',
            desc: 'Acquired by reaching user Level 50.',
            icon: 'https://img.icons8.com/fluency/256/mountain.png',
            owned: false,
            value: '2500',
            owner: '5 users own',
            category: 'Level Up (0/1)'
        },
        {
            title: 'Ludo Legend',
            desc: 'Acquired by winning 100 Ludo games.',
            icon: 'https://img.icons8.com/fluency/256/gamepad.png',
            owned: false,
            value: '1800',
            owner: '12 users own',
            category: 'Game Master (0/1)'
        }
    ],
    Event: [
        {
            title: 'Spring Festival',
            desc: 'Exclusive badge for participating in the Spring Festival 2026.',
            icon: 'https://img.icons8.com/fluency/256/cherry-blossoms.png',
            owned: false,
            value: '1500',
            owner: '89 users own',
            category: 'Seasonal (0/1)'
        },
        {
            title: '1st Year Member',
            desc: 'Awarded to users who registered in the first year of Lavachat.',
            icon: 'https://img.icons8.com/fluency/256/1st.png',
            owned: true,
            value: '1000',
            owner: '240 users own',
            category: 'Anniversary (0/1)'
        }
    ]
};

const podiumUsers = {
    top1: {
        name: 'దేવత....',
        score: '53970',
        avatar: 'https://img.icons8.com/color/256/ganesha.png',
        badges: [
            'https://img.icons8.com/color/96/police-badge.png',
            'https://img.icons8.com/color/96/royal-crown.png',
            'https://img.icons8.com/color/96/luxury.png',
            'https://img.icons8.com/color/96/star-medal.png'
        ]
    },
    top2: {
        name: 'Sa l ιη ⚡',
        score: '34030',
        avatar: 'https://img.icons8.com/color/256/user-male-circle--v1.png',
        badges: [
            'https://img.icons8.com/color/96/police-badge.png',
            'https://img.icons8.com/color/96/luxury.png',
            'https://img.icons8.com/color/96/star-medal.png'
        ]
    },
    top3: {
        name: 'AHMED 🇧🇩',
        score: '33970',
        avatar: 'https://img.icons8.com/color/256/user-female-circle.png',
        badges: [
            'https://img.icons8.com/color/96/police-badge.png',
            'https://img.icons8.com/color/96/luxury.png'
        ]
    }
};

const rankUsersList = [
    {
        rank: 4,
        name: 'VarunAgency',
        score: '27380',
        avatar: 'https://img.icons8.com/color/256/circled-user-male-skin-type-4.png',
        badges: [
            'https://img.icons8.com/color/96/police-badge.png',
            'https://img.icons8.com/color/96/luxury.png',
            'https://img.icons8.com/color/96/star-medal.png',
            'https://img.icons8.com/color/96/diploma.png'
        ]
    },
    {
        rank: 5,
        name: 'SUMIT',
        score: '26690',
        avatar: 'https://img.icons8.com/color/256/circled-user-male-skin-type-6.png',
        badges: [
            'https://img.icons8.com/color/96/police-badge.png',
            'https://img.icons8.com/color/96/star-medal.png',
            'https://img.icons8.com/color/96/diploma.png'
        ]
    },
    {
        rank: 6,
        name: 'mekes ☸ sella 🕉',
        score: '25730',
        avatar: 'https://img.icons8.com/color/256/circled-user-female-skin-type-4.png',
        badges: [
            'https://img.icons8.com/color/96/police-badge.png',
            'https://img.icons8.com/color/96/star-medal.png'
        ]
    }
];

const ownedBadges = [
    { name: 'SVIP Badge', tier: 'SS', color: '#F59E0B', icon: 'https://img.icons8.com/color/256/police-badge.png' },
    { name: 'SVIP Badge', tier: 'S', color: '#DC2626', icon: 'https://img.icons8.com/color/256/military-medal.png' },
    { name: 'Rich Man', tier: 'A', color: '#3B82F6', icon: 'https://img.icons8.com/color/256/gold-medal.png' },
    { name: 'Coin Badge', tier: 'B', color: '#10B981', icon: 'https://img.icons8.com/color/256/coins.png' }
];

export default function MedalAndTitleScreen() {
    const navigation = useNavigation();
    const [activeTopTab, setActiveTopTab] = useState('Badge');
    const [activeSubTab, setActiveSubTab] = useState('Prestige');
    const [showDescription, setShowDescription] = useState(false);
    const [selectedBadge, setSelectedBadge] = useState(badgesCatalog.Prestige[0]);
    const [activeMineSection, setActiveMineSection] = useState('Badge');
    const [ownedTitles, setOwnedTitles] = useState([
        { id: '1', name: 'Chat King', desc: 'Acquired by active chatting', color: '#F59E0B', icon: '👑', active: true },
        { id: '2', name: 'Lava Star', desc: 'Acquired from SVIP benefits', color: '#EF4444', icon: '⭐', active: false },
        { id: '3', name: 'Top Spender', desc: 'Acquired by gifting gold', color: '#3B82F6', icon: '💎', active: false },
    ]);

    const topTabs = ['Badge', 'Rank', 'Mine'];

    const handleSubTabChange = (tab) => {
        setActiveSubTab(tab);
        setSelectedBadge(badgesCatalog[tab][0]);
    };

    const renderBadgeTab = () => {
        if (showDescription) {
            return (
                <View style={styles.badgeTabContainer}>
                    {/* Header Description Title */}
                    <View style={styles.badgeDescHeader}>
                        <Text style={styles.badgeDescTitle}>Badge Description</Text>
                        <TouchableOpacity onPress={() => setShowDescription(false)} style={styles.closeBtn}>
                            <X color="#E6C27A" size={18} />
                        </TouchableOpacity>
                    </View>

                    {/* Description sections */}
                    <View style={styles.badgeDescSection}>
                        <Text style={styles.descSectionTitle}>Acquisition</Text>
                        <Text style={styles.descSectionText}>
                            You can obtain AUCHO Badges by participating in events, gifting, playing games, and more.
                        </Text>
                    </View>

                    <View style={styles.badgeDescSection}>
                        <Text style={styles.descSectionTitle}>Honor Value</Text>
                        <Text style={styles.descSectionText}>
                            Each medal has a different honor value. The higher the level, the higher the honor value. Among them, medals above level S can be worn on the MIC.
                        </Text>
                    </View>

                    {/* Medal list */}
                    <View style={styles.medalListContainer}>
                        {BADGE_DESCRIPTIONS.map((item, idx) => (
                            <View key={idx} style={styles.medalRowCard}>
                                <View style={styles.medalIconWrapper}>
                                    <Image source={{ uri: item.icon }} style={styles.medalRowIcon} resizeMode="contain" />
                                </View>
                                <View style={styles.medalTextWrapper}>
                                    <Text style={[styles.medalRowTier, { color: item.color }]}>{item.tier}</Text>
                                    <Text style={styles.medalRowValue}>Honor Value: {item.value}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            );
        }

        // Render original Badge UI
        const subTabs = ['Prestige', 'Achievement', 'Event'];
        return (
            <View>
                {/* Main Spotlight Area */}
                <LinearGradient
                    colors={['#1F1610', '#0B0806']}
                    style={styles.spotlightContainer}
                >
                    <View style={styles.largeBadgeWrapper}>
                        <Image
                            source={{ uri: selectedBadge.icon }}
                            style={styles.largeBadgeImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.top1Text}>TOP1</Text>
                    </View>

                    <Text style={styles.mainBadgeTitle}>{selectedBadge.title}</Text>
                    <Text style={styles.mainBadgeDesc}>{selectedBadge.desc}</Text>

                    <View style={styles.lockStatusRow}>
                        <Lock size={10} color="#A08B7D" />
                        <Text style={styles.notOwnedText}>{selectedBadge.owned ? "Owned" : "Not owned"}</Text>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statItemLeft}>
                            <Text style={styles.laurelText}>🌿</Text>
                            <Image source={{ uri: 'https://img.icons8.com/color/96/diamond.png' }} style={styles.tinyStatIcon} />
                            <Text style={styles.statValue}>{selectedBadge.value}</Text>
                            <Text style={styles.laurelText}>🌿</Text>
                        </View>

                        {/* Divider Line */}
                        <View style={styles.statDivider} />

                        <View style={styles.statItemRight}>
                            <Text style={styles.noOneOwnsText}>{selectedBadge.owner}</Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* Sub Navigation Tabs */}
                <View style={styles.subTabsRow}>
                    <View style={styles.subTabsContainer}>
                        {subTabs.map(tab => {
                            const isActive = activeSubTab === tab;
                            return (
                                <TouchableOpacity
                                    key={tab}
                                    onPress={() => handleSubTabChange(tab)}
                                    style={[
                                        styles.subTabBtn,
                                        isActive && styles.activeSubTabBtn
                                    ]}
                                >
                                    {isActive && <Text style={styles.laurelDecorLeft}>🌿</Text>}
                                    <Text style={[
                                        styles.subTabText,
                                        isActive && styles.activeSubTabText
                                    ]}>
                                        {tab}
                                    </Text>
                                    {isActive && <Text style={styles.laurelDecorRight}>🌿</Text>}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Categories List */}
                {badgesCatalog[activeSubTab].map((badge, idx) => (
                    <View key={idx} style={styles.categoryContainer}>
                        <Text style={styles.categoryTitle}>{badge.category}</Text>
                        <View style={styles.gridContainer}>
                            <TouchableOpacity
                                onPress={() => setSelectedBadge(badge)}
                                style={[
                                    styles.badgeCard,
                                    selectedBadge.title === badge.title && styles.activeBadgeCard
                                ]}
                            >
                                <View style={styles.cardLockIconBg}>
                                    <Lock size={10} color={badge.owned ? "#E6C27A" : "#000"} />
                                </View>
                                <Image source={{ uri: badge.icon }} style={styles.cardBadgeImage} />
                                <Text style={styles.cardBadgeTitle}>{badge.title}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
        );
    };

    const renderRankTab = () => {
        return (
            <View style={styles.rankTabContainer}>
                {/* Podium Layout */}
                <View style={styles.podiumContainer}>
                    {/* Top 2 (Left) */}
                    <View style={styles.podiumCol}>
                        <View style={styles.podiumAvatarOuterSilver}>
                            <Image source={{ uri: podiumUsers.top2.avatar }} style={styles.podiumAvatar} />
                        </View>
                        <Text style={styles.podiumRankTagSilver}>TOP 2</Text>
                        <Text style={styles.podiumName} numberOfLines={1}>{podiumUsers.top2.name}</Text>
                        <Text style={styles.podiumScore}>{podiumUsers.top2.score}</Text>

                        <View style={styles.podiumBadgesRow}>
                            {podiumUsers.top2.badges.map((badge, idx) => (
                                <Image key={idx} source={{ uri: badge }} style={styles.podiumTinyBadge} />
                            ))}
                        </View>
                    </View>

                    {/* Top 1 (Center) */}
                    <View style={[styles.podiumCol, styles.podiumCol1]}>
                        {/* Wings backdrop */}
                        <Image
                            source={{ uri: 'https://img.icons8.com/color/256/angel-wings.png' }}
                            style={styles.wingsBackdrop}
                            resizeMode="contain"
                        />
                        <View style={styles.podiumAvatarOuterGold}>
                            <Image source={{ uri: podiumUsers.top1.avatar }} style={styles.podiumAvatarLarge} />
                        </View>
                        <Text style={styles.podiumRankTagGold}>👑 TOP 1 👑</Text>
                        <Text style={styles.podiumNameGold} numberOfLines={1}>{podiumUsers.top1.name}</Text>
                        <Text style={styles.podiumScoreGold}>{podiumUsers.top1.score}</Text>

                        <View style={styles.podiumBadgesRow}>
                            {podiumUsers.top1.badges.map((badge, idx) => (
                                <Image key={idx} source={{ uri: badge }} style={styles.podiumTinyBadge} />
                            ))}
                        </View>
                    </View>

                    {/* Top 3 (Right) */}
                    <View style={styles.podiumCol}>
                        <View style={styles.podiumAvatarOuterBronze}>
                            <Image source={{ uri: podiumUsers.top3.avatar }} style={styles.podiumAvatar} />
                        </View>
                        <Text style={styles.podiumRankTagBronze}>TOP 3</Text>
                        <Text style={styles.podiumName} numberOfLines={1}>{podiumUsers.top3.name}</Text>
                        <Text style={styles.podiumScore}>{podiumUsers.top3.score}</Text>

                        <View style={styles.podiumBadgesRow}>
                            {podiumUsers.top3.badges.map((badge, idx) => (
                                <Image key={idx} source={{ uri: badge }} style={styles.podiumTinyBadge} />
                            ))}
                        </View>
                    </View>
                </View>

                {/* Pedestals Base */}
                <View style={styles.podiumPedestalRow}>
                    <View style={[styles.pedestal, styles.pedestal2]}>
                        <Text style={styles.pedestalNumber}>2</Text>
                    </View>
                    <View style={[styles.pedestal, styles.pedestal1]}>
                        <Text style={styles.pedestalNumberGold}>1</Text>
                    </View>
                    <View style={[styles.pedestal, styles.pedestal3]}>
                        <Text style={styles.pedestalNumber}>3</Text>
                    </View>
                </View>

                {/* Rankings List */}
                <View style={styles.ranksListContainer}>
                    {rankUsersList.map((user) => (
                        <View key={user.rank} style={styles.rankRowCard}>
                            <Text style={styles.rankRowNumber}>{user.rank}</Text>
                            <Image source={{ uri: user.avatar }} style={styles.rankRowAvatar} />

                            <View style={styles.rankRowInfo}>
                                <Text style={styles.rankRowName}>{user.name}</Text>
                                <View style={styles.rankRowBadges}>
                                    {user.badges.map((badge, idx) => (
                                        <Image key={idx} source={{ uri: badge }} style={styles.rankRowTinyBadge} />
                                    ))}
                                </View>
                            </View>

                            <Text style={styles.rankRowScore}>{user.score}</Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    const renderMineTab = () => {
        // Wear slots (10 total slots). Slots 1-4 are occupied.
        const wearSlots = Array.from({ length: 10 }, (_, i) => {
            if (i < ownedBadges.length) return ownedBadges[i];
            return null;
        });

        const activeTitle = ownedTitles.find(t => t.active);

        return (
            <View style={styles.mineTabContainer}>
                {/* Profile Overview Header */}
                <View style={styles.mineHeaderRow}>
                    <View style={styles.mineProfileLeft}>
                        <Image
                            source={{ uri: 'https://img.icons8.com/color/256/circled-user-male-skin-type-6.png' }}
                            style={styles.mineAvatar}
                        />
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Text style={styles.mineProfileName}>VENUS 🛡</Text>
                                {activeTitle && (
                                    <View style={[styles.profileTitleTag, { backgroundColor: activeTitle.color }]}>
                                        <Text style={styles.profileTitleTagText}>{activeTitle.name}</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.mineProfileHonor}>honor value: 590</Text>
                        </View>
                    </View>

                    <View style={styles.mineHeaderStats}>
                        <View style={styles.mineStatPedestal}>
                            <Text style={styles.mineStatLabel}>Number of Badges</Text>
                            <View style={styles.minePedestalBase}>
                                <Text style={styles.minePedestalValue}>4</Text>
                            </View>
                        </View>

                        <View style={styles.mineStatPedestal}>
                            <Text style={styles.mineStatLabel}>Rank</Text>
                            <View style={styles.minePedestalBase}>
                                <Text style={styles.minePedestalValue}>999+</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Badge Wear Card Grid */}
                <View style={styles.badgeWearContainer}>
                    <View style={styles.badgeWearHeader}>
                        <Text style={styles.badgeWearTitle}>Badge Wear (4/10)</Text>
                        <TouchableOpacity>
                            <Text style={styles.badgeWearEdit}>Edit</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.badgeWearGrid}>
                        {wearSlots.map((slot, idx) => (
                            <View key={idx} style={[styles.wearSlot, !slot && styles.wearSlotEmpty]}>
                                {slot ? (
                                    <Image source={{ uri: slot.icon }} style={styles.wearSlotIcon} resizeMode="contain" />
                                ) : (
                                    <Plus color="#E6C27A" size={16} />
                                )}
                            </View>
                        ))}
                    </View>

                    <Text style={[styles.badgeWearTitle, { marginTop: 20, marginBottom: 12 }]}>Room MIC Badge</Text>
                    <View style={[styles.wearSlot, styles.wearSlotEmpty]}>
                        <Plus color="#E6C27A" size={16} />
                    </View>
                </View>

                {/* My Badges or My Titles header with toggle buttons */}
                <View style={styles.myBadgesSection}>
                    <View style={styles.mineTabToggleRow}>
                        <TouchableOpacity 
                            onPress={() => setActiveMineSection('Badge')}
                            style={[styles.mineTabBtnToggle, activeMineSection === 'Badge' && styles.activeMineTabBtnToggle]}
                        >
                            <Text style={[styles.mineTabBtnToggleText, activeMineSection === 'Badge' && styles.activeMineTabBtnToggleTextActive]}>
                                My Badge ({ownedBadges.length})
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.mineToggleDivider}>|</Text>

                        <TouchableOpacity 
                            onPress={() => setActiveMineSection('Title')}
                            style={[styles.mineTabBtnToggle, activeMineSection === 'Title' && styles.activeMineTabBtnToggle]}
                        >
                            <Text style={[styles.mineTabBtnToggleText, activeMineSection === 'Title' && styles.activeMineTabBtnToggleTextActive]}>
                                Title
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {activeMineSection === 'Badge' ? (
                        <View style={styles.myBadgesGrid}>
                            {ownedBadges.map((badge, idx) => (
                                <View key={idx} style={styles.myBadgeCard}>
                                    {/* Corner Tier Badge */}
                                    <View style={[styles.tierCornerBadge, { backgroundColor: badge.color }]}>
                                        <Text style={styles.tierCornerText}>{badge.tier}</Text>
                                    </View>

                                    {/* Centered Badge on Pedestal */}
                                    <Image source={{ uri: badge.icon }} style={styles.myBadgeImage} resizeMode="contain" />
                                    <View style={styles.myBadgePedestal} />

                                    <Text style={styles.myBadgeName}>{badge.name}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.myTitlesList}>
                            {ownedTitles.map((title, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={[styles.titleCard, title.active && styles.activeTitleCard]}
                                    onPress={() => {
                                        setOwnedTitles(prev => prev.map(t => ({
                                            ...t,
                                            active: t.id === title.id ? !t.active : false
                                        })));
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.titleCardLeft}>
                                        <View style={[styles.titleIconBg, { backgroundColor: title.color + '20' }]}>
                                            <Text style={styles.titleIconText}>{title.icon}</Text>
                                        </View>
                                        <View style={styles.titleTextColumn}>
                                            <Text style={[styles.titleName, { color: title.color }]}>{title.name}</Text>
                                            <Text style={styles.titleDesc}>{title.desc}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.titleStatusBadge, title.active && styles.activeTitleStatusBadge]}>
                                        <Text style={[styles.titleStatusText, title.active && styles.activeTitleStatusText]}>
                                            {title.active ? 'Equipped' : 'Use'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0B0806" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <ChevronLeft color="#E6C27A" size={24} />
                </TouchableOpacity>

                <View style={styles.topTabsContainer}>
                    {topTabs.map(tab => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => {
                                setActiveTopTab(tab);
                                if (tab !== 'Badge') setShowDescription(false);
                            }}
                            style={styles.topTabBtn}
                        >
                            <Text style={[
                                styles.topTabText,
                                activeTopTab === tab && styles.activeTopTabText
                            ]}>
                                {tab}
                            </Text>
                            {activeTopTab === tab && <View style={styles.activeTopTabIndicator} />}
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    onPress={() => {
                        if (activeTopTab === 'Badge') {
                            setShowDescription(!showDescription);
                        }
                    }}
                    style={styles.headerBtn}
                >
                    <HelpCircle color="#E6C27A" size={22} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {activeTopTab === 'Badge' && renderBadgeTab()}
                {activeTopTab === 'Rank' && renderRankTab()}
                {activeTopTab === 'Mine' && renderMineTab()}
                <View style={{ height: 50 }} />
            </ScrollView>

            {/* Sticky bottom user rank for Rank tab */}
            {activeTopTab === 'Rank' && (
                <View style={styles.stickyUserRankFooter}>
                    <View style={styles.footerLeft}>
                        <Text style={styles.footerRankNum}>50+</Text>
                        <Image
                            source={{ uri: 'https://img.icons8.com/color/256/circled-user-male-skin-type-6.png' }}
                            style={styles.footerAvatar}
                        />
                        <View>
                            <Text style={styles.footerName}>VENUS 🛡</Text>
                            <Text style={styles.footerHonorValue}>honor value: 590</Text>
                        </View>
                    </View>
                    <Text style={styles.footerScore}>590</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B0806',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 12 : 12,
        paddingBottom: 10,
    },
    headerBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(230, 194, 122, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(230, 194, 122, 0.1)',
    },
    topTabsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 30,
    },
    topTabBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 35,
    },
    topTabText: {
        color: '#6B5A50',
        fontSize: 15,
        fontWeight: 'bold',
    },
    activeTopTabText: {
        color: '#E6C27A',
    },
    activeTopTabIndicator: {
        position: 'absolute',
        bottom: 0,
        width: 20,
        height: 3,
        backgroundColor: '#E6C27A',
        borderRadius: 2,
    },
    scrollContent: {
        paddingBottom: 80,
    },
    badgeTabContainer: {
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    badgeDescHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderColor: 'rgba(230, 194, 122, 0.1)',
        marginBottom: 16,
    },
    badgeDescTitle: {
        color: '#E6C27A',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    closeBtn: {
        padding: 4,
    },
    badgeDescSection: {
        marginBottom: 16,
    },
    descSectionTitle: {
        color: '#E6C27A',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    descSectionText: {
        color: '#A08B7D',
        fontSize: 12,
        lineHeight: 18,
    },
    medalListContainer: {
        marginTop: 10,
        gap: 12,
    },
    medalRowCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(230, 194, 122, 0.1)',
    },
    medalIconWrapper: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 24,
    },
    medalRowIcon: {
        width: 36,
        height: 36,
    },
    medalTextWrapper: {
        marginLeft: 16,
        flex: 1,
    },
    medalRowTier: {
        fontSize: 13,
        fontWeight: '900',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    medalRowValue: {
        color: '#A08B7D',
        fontSize: 11,
        fontWeight: '500',
    },
    rankTabContainer: {
        paddingTop: 10,
    },
    podiumContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        marginTop: 40,
        height: 180,
    },
    podiumCol: {
        alignItems: 'center',
        width: (width - 48) / 3,
        position: 'relative',
    },
    podiumCol1: {
        height: '100%',
        justifyContent: 'flex-end',
        zIndex: 10,
    },
    wingsBackdrop: {
        position: 'absolute',
        top: -20,
        width: 130,
        height: 130,
        opacity: 0.15,
        tintColor: '#E6C27A',
    },
    podiumAvatarOuterGold: {
        width: 68,
        height: 68,
        borderRadius: 34,
        borderWidth: 2,
        borderColor: '#E6C27A',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E140C',
        shadowColor: '#E6C27A',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 6,
    },
    podiumAvatarOuterSilver: {
        width: 58,
        height: 58,
        borderRadius: 29,
        borderWidth: 2,
        borderColor: '#B0B0B0',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1C1C1C',
    },
    podiumAvatarOuterBronze: {
        width: 58,
        height: 58,
        borderRadius: 29,
        borderWidth: 2,
        borderColor: '#CD7F32',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1F1713',
    },
    podiumAvatarLarge: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    podiumAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    podiumRankTagGold: {
        color: '#E6C27A',
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    podiumRankTagSilver: {
        color: '#B0B0B0',
        fontSize: 9,
        fontWeight: 'bold',
        marginTop: 6,
        textTransform: 'uppercase',
    },
    podiumRankTagBronze: {
        color: '#CD7F32',
        fontSize: 9,
        fontWeight: 'bold',
        marginTop: 6,
        textTransform: 'uppercase',
    },
    podiumNameGold: {
        color: '#E6C27A',
        fontSize: 13,
        fontWeight: 'bold',
        marginTop: 2,
    },
    podiumName: {
        color: '#A08B7D',
        fontSize: 11,
        fontWeight: '600',
        marginTop: 2,
    },
    podiumScoreGold: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: 'bold',
        opacity: 0.9,
    },
    podiumScore: {
        color: '#A08B7D',
        fontSize: 10,
    },
    podiumBadgesRow: {
        flexDirection: 'row',
        gap: 3,
        marginTop: 4,
        justifyContent: 'center',
    },
    podiumTinyBadge: {
        width: 14,
        height: 14,
    },
    podiumPedestalRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        marginTop: 10,
        marginBottom: 20,
    },
    pedestal: {
        width: (width - 48) / 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderWidth: 1.5,
    },
    pedestal1: {
        height: 60,
        backgroundColor: '#261C14',
        borderColor: 'rgba(230, 194, 122, 0.4)',
    },
    pedestal2: {
        height: 45,
        backgroundColor: '#1E1E1E',
        borderColor: 'rgba(176, 176, 176, 0.25)',
    },
    pedestal3: {
        height: 38,
        backgroundColor: '#221915',
        borderColor: 'rgba(205, 127, 50, 0.25)',
    },
    pedestalNumberGold: {
        color: '#E6C27A',
        fontSize: 22,
        fontWeight: '900',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowRadius: 3,
    },
    pedestalNumber: {
        color: '#8B7A6A',
        fontSize: 18,
        fontWeight: 'bold',
    },
    ranksListContainer: {
        paddingHorizontal: 16,
        gap: 10,
    },
    rankRowCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#120E0B',
        borderRadius: 14,
        padding: 10,
        borderWidth: 1.2,
        borderColor: 'rgba(230, 194, 122, 0.1)',
    },
    rankRowNumber: {
        color: '#8B7A6A',
        fontSize: 13,
        fontWeight: 'bold',
        width: 24,
        textAlign: 'center',
    },
    rankRowAvatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        marginLeft: 8,
    },
    rankRowInfo: {
        marginLeft: 12,
        flex: 1,
    },
    rankRowName: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    rankRowBadges: {
        flexDirection: 'row',
        gap: 4,
    },
    rankRowTinyBadge: {
        width: 14,
        height: 14,
    },
    rankRowScore: {
        color: '#E6C27A',
        fontSize: 13,
        fontWeight: 'bold',
        marginRight: 6,
    },
    mineTabContainer: {
        paddingTop: 10,
    },
    mineHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    mineProfileLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1.2,
    },
    mineAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: '#E6C27A',
        marginRight: 10,
    },
    mineProfileName: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    mineProfileHonor: {
        color: '#E6C27A',
        fontSize: 10.5,
        marginTop: 2,
    },
    mineHeaderStats: {
        flexDirection: 'row',
        gap: 12,
        flex: 1.8,
        justifyContent: 'flex-end',
    },
    mineStatPedestal: {
        alignItems: 'center',
        width: 76,
    },
    mineStatLabel: {
        color: '#8B7A6A',
        fontSize: 7.5,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    minePedestalBase: {
        backgroundColor: '#1E140C',
        borderWidth: 1.2,
        borderColor: '#E6C27A',
        borderRadius: 6,
        paddingVertical: 3,
        width: '100%',
        alignItems: 'center',
    },
    minePedestalValue: {
        color: '#E6C27A',
        fontSize: 12,
        fontWeight: 'bold',
    },
    badgeWearContainer: {
        backgroundColor: '#120E0B',
        borderRadius: 16,
        marginHorizontal: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: 'rgba(230, 194, 122, 0.08)',
        marginBottom: 20,
    },
    badgeWearHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    badgeWearTitle: {
        color: '#E6C27A',
        fontSize: 13,
        fontWeight: 'bold',
    },
    badgeWearEdit: {
        color: '#8B7A6A',
        fontSize: 12,
        fontWeight: '500',
    },
    badgeWearGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    wearSlot: {
        width: (width - 64 - 40) / 5,
        height: (width - 64 - 40) / 5,
        borderRadius: 10,
        backgroundColor: '#18120E',
        borderWidth: 1,
        borderColor: 'rgba(230, 194, 122, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    wearSlotEmpty: {
        borderColor: 'rgba(230, 194, 122, 0.3)',
        borderStyle: 'dashed',
        backgroundColor: '#0E0B08',
    },
    wearSlotIcon: {
        width: '80%',
        height: '80%',
    },
    myBadgesSection: {
        paddingHorizontal: 16,
        marginTop: 10,
    },
    myBadgesHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    decorLaurel: {
        fontSize: 12,
        color: '#E6C27A',
    },
    myBadgesTitle: {
        color: '#E6C27A',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    myBadgesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    myBadgeCard: {
        width: (width - 48) / 3,
        backgroundColor: '#120E0B',
        borderWidth: 1.2,
        borderColor: 'rgba(230, 194, 122, 0.1)',
        borderRadius: 14,
        padding: 10,
        alignItems: 'center',
        position: 'relative',
        marginBottom: 12,
    },
    tierCornerBadge: {
        position: 'absolute',
        top: 6,
        left: 6,
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 4,
    },
    tierCornerText: {
        color: '#FFF',
        fontSize: 8,
        fontWeight: 'bold',
    },
    myBadgeImage: {
        width: 50,
        height: 50,
        marginTop: 8,
        zIndex: 5,
    },
    myBadgePedestal: {
        width: '80%',
        height: 12,
        backgroundColor: '#261C14',
        borderWidth: 1.2,
        borderColor: '#E6C27A',
        borderRadius: 4,
        marginTop: -6,
        marginBottom: 10,
    },
    myBadgeName: {
        color: '#8B7A6A',
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    stickyUserRankFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1B140F',
        borderTopWidth: 1.5,
        borderTopColor: 'rgba(230, 194, 122, 0.25)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: Platform.OS === 'ios' ? 24 : 12,
        elevation: 10,
    },
    footerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerRankNum: {
        color: '#E6C27A',
        fontSize: 13,
        fontWeight: 'bold',
        width: 28,
    },
    footerAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#E6C27A',
        marginHorizontal: 8,
    },
    footerName: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: 'bold',
    },
    footerHonorValue: {
        color: '#A08B7D',
        fontSize: 10,
        marginTop: 1,
    },
    footerScore: {
        color: '#E6C27A',
        fontSize: 14,
        fontWeight: 'bold',
    },
    spotlightContainer: {
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 30,
    },
    largeBadgeWrapper: {
        width: 220,
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    largeBadgeImage: {
        width: 190,
        height: 190,
        opacity: 0.95,
    },
    top1Text: {
        position: 'absolute',
        bottom: 10,
        color: '#FFD700',
        fontSize: 34,
        fontWeight: '900',
        textShadowColor: 'rgba(255, 69, 0, 0.6)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 4,
        letterSpacing: 1,
    },
    mainBadgeTitle: {
        color: '#E6C27A',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 6,
        letterSpacing: 0.5,
    },
    mainBadgeDesc: {
        color: '#8B7A6A',
        fontSize: 11,
        marginBottom: 10,
    },
    lockStatusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        gap: 4,
    },
    notOwnedText: {
        color: '#A08B7D',
        fontSize: 11,
        fontWeight: '500',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: 0,
        gap: 20,
    },
    statItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1,
    },
    statDivider: {
        width: 1,
        height: 14,
        backgroundColor: '#3F2E23',
    },
    statItemRight: {
        flex: 1,
        alignItems: 'flex-start',
    },
    tinyStatIcon: {
        width: 14,
        height: 14,
        marginHorizontal: 3,
    },
    statValue: {
        color: '#E6C27A',
        fontSize: 12,
        fontWeight: 'bold',
        marginHorizontal: 3,
    },
    laurelText: {
        fontSize: 12,
        color: '#E6C27A',
    },
    noOneOwnsText: {
        color: '#8B7A6A',
        fontSize: 11,
        fontWeight: '500',
    },
    subTabsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 14,
    },
    subTabsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    subTabBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#15110E',
    },
    activeSubTabBtn: {
        borderWidth: 1,
        borderColor: 'rgba(230, 194, 122, 0.4)',
    },
    subTabText: {
        color: '#6B5A50',
        fontSize: 12,
        fontWeight: 'bold',
    },
    activeSubTabText: {
        color: '#E6C27A',
    },
    laurelDecorLeft: {
        fontSize: 10,
        marginRight: 4,
    },
    laurelDecorRight: {
        fontSize: 10,
        marginLeft: 4,
    },
    categoryContainer: {
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    categoryTitle: {
        color: '#E6C27A',
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    badgeCard: {
        width: 115,
        height: 140,
        backgroundColor: '#120E0B',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#2A2015',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    activeBadgeCard: {
        borderColor: '#E6C27A',
        borderWidth: 1.5,
    },
    cardLockIconBg: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardBadgeImage: {
        width: 70,
        height: 70,
        marginBottom: 8,
        opacity: 0.9,
    },
    cardBadgeTitle: {
        color: '#8B7A6A',
        fontSize: 11,
        fontWeight: 'bold',
    },
    profileTitleTag: {
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileTitleTagText: {
        color: '#FFF',
        fontSize: 9,
        fontWeight: 'bold',
    },
    mineTabToggleRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    mineTabBtnToggle: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    mineTabBtnToggleText: {
        color: '#8B7A6A',
        fontSize: 14,
        fontWeight: 'bold',
    },
    activeMineTabBtnToggle: {
        borderBottomWidth: 2,
        borderBottomColor: '#E6C27A',
    },
    mineTabBtnToggleTextActive: {
        color: '#E6C27A',
    },
    mineToggleDivider: {
        color: '#3F2E23',
        fontSize: 14,
    },
    myTitlesList: {
        gap: 10,
    },
    titleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#120E0B',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: 'rgba(230,194,122,0.1)',
    },
    activeTitleCard: {
        borderColor: '#E6C27A',
        backgroundColor: '#18130E',
    },
    titleCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    titleIconBg: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleIconText: {
        fontSize: 18,
    },
    titleTextColumn: {
        justifyContent: 'center',
    },
    titleName: {
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    titleDesc: {
        color: '#8B7A6A',
        fontSize: 11,
    },
    titleStatusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 14,
        backgroundColor: '#261C14',
        borderWidth: 1,
        borderColor: '#E6C27A',
        minWidth: 70,
        alignItems: 'center',
    },
    activeTitleStatusBadge: {
        backgroundColor: '#E6C27A',
    },
    titleStatusText: {
        color: '#E6C27A',
        fontSize: 11,
        fontWeight: 'bold',
    },
    activeTitleStatusText: {
        color: '#120E0B',
    },
});

