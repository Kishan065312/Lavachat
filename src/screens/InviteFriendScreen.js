import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Dimensions, Platform, StatusBar, Modal } from 'react-native';
import { ChevronLeft, RefreshCw, Share2, Download, Edit3, HelpCircle, X, ChevronRight } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const coinsRankings = [
    { id: 1, name: 'Allzy²', revenue: '2,060,962,736', avatar: 'https://img.icons8.com/color/256/user-male-circle--v1.png' },
    { id: 2, name: 'Murshid', revenue: '1,895,516,119', avatar: 'https://img.icons8.com/color/256/crown.png' },
    { id: 3, name: 'zy', revenue: '1,688,964,524', avatar: 'https://img.icons8.com/color/256/circled-user-female-skin-type-1-2.png' },
    { id: 4, name: 'alzy¹', revenue: '1,651,133,456', avatar: 'https://img.icons8.com/color/256/circled-user-male-skin-type-1-2.png' },
    { id: 5, name: 'كفن', revenue: '1,554,171,078', avatar: 'https://img.icons8.com/color/256/circled-v.png' },
];

const usdRankings = [
    { id: 1, name: 'Allzy²', revenue: '$101.50', avatar: 'https://img.icons8.com/color/256/user-male-circle--v1.png' },
    { id: 2, name: 'FBL·alzy', revenue: '$101.50', avatar: 'https://img.icons8.com/color/256/crown.png' },
    { id: 3, name: 'zy', revenue: '$88.50', avatar: 'https://img.icons8.com/color/256/circled-user-female-skin-type-1-2.png' },
    { id: 4, name: 'allzy4', revenue: '$66.50', avatar: 'https://img.icons8.com/color/256/circled-user-male-skin-type-1-2.png' },
];

const levelRequirements = [
    { lv: 1, req: '10,800,000', reward: '$0.5' },
    { lv: 2, req: '28,800,000', reward: '$1.5' },
    { lv: 3, req: '72,000,000', reward: '$2' },
    { lv: 4, req: '162,000,000', reward: '$3' },
    { lv: 5, req: '342,000,000', reward: '$6.5' },
    { lv: 6, req: '612,000,000', reward: '$11' },
    { lv: 7, req: '1,062,000,000', reward: '$17' },
    { lv: 8, req: '1,710,000,000', reward: '$25' },
];

export default function InviteFriendScreen() {
    const navigation = useNavigation();

    // Global State
    const [activeTopTab, setActiveTopTab] = useState('USD');
    const [rulesModalVisible, setRulesModalVisible] = useState(false);

    // Coins Tab State
    const [activeCoinsRankingTab, setActiveCoinsRankingTab] = useState('Revenue Rankings');

    // USD Tab State
    const [activeLevelTab, setActiveLevelTab] = useState('Next level');
    const [activeUSDRankingTab, setActiveUSDRankingTab] = useState('Rankings this period');
    const [activeUSDRankingSubTab, setActiveUSDRankingSubTab] = useState('Global');

    const renderCoinsTab = () => (
        <>
            {/* Banner Area */}
            <View style={styles.bannerContainer}>
                <Image source={{ uri: 'https://img.icons8.com/color/256/gift--v1.png' }} style={styles.bannerImage} />
                <View style={styles.bannerTextWrapper}>
                    <Text style={styles.bannerSubtitle}>Invite users to recharge</Text>
                    <Text style={styles.bannerTitle}>Earn monthly <Text style={styles.bannerTitleHighlight}>1600$</Text></Text>
                </View>
                <View style={styles.countdownContainer}>
                    <Text style={styles.countdownLabel}>Task reset countdown</Text>
                    <View style={styles.timeWrapper}>
                        <View style={styles.timeBox}><Text style={styles.timeBoxText}>00</Text></View><Text style={styles.timeText}> d </Text>
                        <View style={styles.timeBox}><Text style={styles.timeBoxText}>22</Text></View><Text style={styles.timeText}> Hour </Text>
                        <View style={styles.timeBox}><Text style={styles.timeBoxText}>15</Text></View><Text style={styles.timeText}> Min </Text>
                        <View style={styles.timeBox}><Text style={styles.timeBoxText}>33</Text></View><Text style={styles.timeText}> Sec </Text>
                    </View>
                </View>
                <View style={styles.marqueeContainer}>
                    <Text style={styles.marqueeText}>🎉 Allzy² has accumulated 2060962736 coins</Text>
                </View>
            </View>

            {/* Total Reward Card */}
            <View style={styles.card}>
                <View style={styles.cardHeaderRow}>
                    <View style={styles.lvBadge}><Text style={styles.lvText}>V Lv.0</Text></View>
                    <View style={{ marginLeft: 12 }}>
                        <Text style={styles.cardTitle}>Total Reward</Text>
                        <Text style={styles.rewardAmount}>$0</Text>
                    </View>
                </View>
                <Text style={styles.infoText}>After the event ends, the remaining rewards ≥ $5 can be withdrawn; if {'<'} $5, it will be automatically converted to coins.</Text>
                <Text style={styles.cardSubTitleCenter}>Coins recharged by friends</Text>
                <TouchableOpacity style={styles.inviteBtnLarge}>
                    <LinearGradient colors={['#E6C27A', '#D4AF37']} style={styles.inviteBtnGradient}>
                        <Text style={styles.inviteBtnText}>Invite users</Text>
                        <Share2 color="#000" size={16} style={{ marginLeft: 8 }} />
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* My Revenue Card */}
            <View style={styles.card}>
                <View style={styles.ribbonLabel}><Text style={styles.ribbonText}>My Revenue</Text></View>
                <View style={styles.revenueGrid}>
                    <View style={styles.revenueItem}>
                        <Text style={styles.revenueValue}>0</Text>
                        <Text style={styles.revenueLabel}>Total Revenue</Text>
                    </View>
                    <View style={styles.revenueDivider} />
                    <View style={styles.revenueItem}>
                        <Text style={styles.revenueValue}>0</Text>
                        <Text style={styles.revenueLabel}>Revenue Today</Text>
                    </View>
                </View>
                <View style={[styles.revenueGrid, { marginTop: 15 }]}>
                    <View style={styles.revenueItem}>
                        <Text style={styles.revenueValue}>0</Text>
                        <Text style={styles.revenueLabel}>Total Invitation</Text>
                    </View>
                    <View style={styles.revenueDivider} />
                    <View style={styles.revenueItem}>
                        <Text style={styles.revenueValue}>0</Text>
                        <Text style={styles.revenueLabel}>Invitation Today</Text>
                    </View>
                </View>
                <TouchableOpacity><Text style={styles.moreText}>(more {'>'})</Text></TouchableOpacity>
            </View>

            {/* Step 1 */}
            <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}><Text style={styles.stepNum}>1.</Text> Every time your friend tops up, you get a commission</Text>
                <View style={styles.stepBoxRow}>
                    <View style={styles.stepBox}>
                        <Image source={{ uri: 'https://img.icons8.com/color/48/stack-of-coins.png' }} style={styles.stepIcon} />
                        <Text style={styles.stepHighlight}>x5%</Text>
                        <Text style={styles.stepSubText}>recharge amount</Text>
                    </View>
                    <Text style={styles.plusSign}>+</Text>
                    <View style={styles.stepBox}>
                        <Image source={{ uri: 'https://img.icons8.com/color/48/stack-of-coins.png' }} style={styles.stepIcon} />
                        <Text style={styles.stepHighlight}>x648000</Text>
                        <Text style={styles.stepSubText}>First recharge reward</Text>
                    </View>
                </View>
            </View>

            {/* Step 2 */}
            <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}><Text style={styles.stepNum}>2.</Text> When your friend spend coins, you will get commission</Text>
                <View style={styles.stepBoxRow}>
                    <View style={styles.stepBox}>
                        <Image source={{ uri: 'https://img.icons8.com/color/48/gift.png' }} style={styles.stepIcon} />
                        <Text style={styles.stepHighlight}>x1%</Text>
                        <Text style={styles.stepSubText}>Gift amount</Text>
                    </View>
                    <Text style={styles.plusSign}>+</Text>
                    <View style={styles.stepBox}>
                        <Image source={{ uri: 'https://img.icons8.com/color/48/game-controller.png' }} style={styles.stepIcon} />
                        <Text style={styles.stepHighlight}>x20</Text>
                        <Text style={styles.stepSubText}>Every time you spend 100,000 coins</Text>
                    </View>
                </View>
            </View>

            {/* Step 3 (Tree Diagram) */}
            <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}><Text style={styles.stepNum}>3.</Text> When a friend gets commission, you can get another 10%</Text>
                <View style={styles.centerStepBox}>
                    <Image source={{ uri: 'https://img.icons8.com/color/48/star.png' }} style={styles.stepIcon} />
                    <Text style={styles.stepHighlight}>x10%</Text>
                </View>

                <View style={styles.treeContainer}>
                    <Text style={styles.treeTitle}>Example</Text>
                    <View style={styles.treeNodeRow}>
                        <View style={styles.treeTextColLeft}>
                            <Text style={styles.treeDescText}>You can get 10% of B's commission: 🪙 500</Text>
                        </View>
                        <View style={styles.treeNodeCenter}>
                            <View style={styles.nodeCircleA}><Text style={styles.nodeCircleText}>V</Text></View>
                        </View>
                        <View style={styles.treeTextColRight}>
                            <Text style={styles.treeDescTextRight}>You invite B</Text>
                        </View>
                    </View>
                    <View style={styles.treeLine} />
                    <View style={styles.treeNodeRow}>
                        <View style={styles.treeTextColLeft}>
                            <Text style={styles.treeDescText}>B get 1% commission: 🪙 5,000</Text>
                        </View>
                        <View style={styles.treeNodeCenter}>
                            <Image source={{ uri: 'https://img.icons8.com/color/48/user-male-circle--v1.png' }} style={styles.nodeAvatar} />
                            <View style={styles.nodeBadge}><Text style={styles.nodeBadgeText}>B</Text></View>
                        </View>
                        <View style={styles.treeTextColRight}>
                            <Text style={styles.treeDescTextRight}>B invite C</Text>
                        </View>
                    </View>
                    <View style={styles.treeLine} />
                    <View style={styles.treeNodeRow}>
                        <View style={styles.treeTextColLeft}>
                            <Text style={styles.treeDescText}>C send gifts or spend coin 🪙 500,000</Text>
                        </View>
                        <View style={styles.treeNodeCenter}>
                            <Image source={{ uri: 'https://img.icons8.com/color/48/circled-user-female-skin-type-1-2.png' }} style={styles.nodeAvatar} />
                            <View style={styles.nodeBadge}><Text style={styles.nodeBadgeText}>C</Text></View>
                        </View>
                        <View style={styles.treeTextColRight}></View>
                    </View>
                </View>
            </View>

            {/* Step 4 */}
            <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}><Text style={styles.stepNum}>4.</Text> When your friends register through your link, you can get</Text>
                <View style={styles.centerStepBox}>
                    <Image source={{ uri: 'https://img.icons8.com/color/48/star.png' }} style={styles.stepIcon} />
                    <Text style={styles.stepHighlight}>x15000</Text>
                </View>
                <Text style={styles.infoTextCenter}>* You can get reward no matter anyone fill in your invite code</Text>

                <View style={styles.guideStepsRow}>
                    <View style={styles.guideStep}>
                        <View style={styles.guideIconWrapper}><Share2 color="#E6C27A" size={20} /></View>
                        <Text style={styles.guideText}>Share the invite link/code with friends</Text>
                    </View>
                    <Text style={styles.guideArrow}>▶</Text>
                    <View style={styles.guideStep}>
                        <View style={styles.guideIconWrapper}><Download color="#E6C27A" size={20} /></View>
                        <Text style={styles.guideText}>Friends download and install Lavachat</Text>
                    </View>
                    <Text style={styles.guideArrow}>▶</Text>
                    <View style={styles.guideStep}>
                        <View style={styles.guideIconWrapper}><Edit3 color="#E6C27A" size={20} /></View>
                        <Text style={styles.guideText}>Fill in the invite code after registration</Text>
                    </View>
                </View>

                <Text style={styles.infoTextCenter}>Friends register through the invite link will be identified as the user you invited, no need to fill the invite code.</Text>

                <View style={styles.inviteCodeBox}>
                    <Text style={styles.inviteCodeLabel}>My invite code: <Text style={styles.inviteCodeValue}>D17W3S</Text></Text>
                    <TouchableOpacity style={styles.copyBtn}>
                        <Text style={styles.copyBtnText}>Copy</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.statementArea}>
                    <Text style={styles.statementTitle}>statement</Text>
                    <Text style={styles.statementText}>① Your friend must be a new user (one device or one account can only participate once), then you can get reward.</Text>
                    <Text style={styles.statementText}>② Register through your invite link or fill in invite code in 24 hours after registration make a valid invited user. 24 hours after user registration, user cannot be invited.</Text>
                    <Text style={styles.statementText}>③ If it is found that user have any rule-breaking operation like using bugs, Lavachat team has the right to carry on the punishment.</Text>
                </View>
            </View>

            {/* Rankings Tab Area (Coins) */}
            <View style={styles.rankingSection}>
                <View style={styles.rankingTabs}>
                    {['Gameplay guide', 'Revenue Rankings'].map(tab => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveCoinsRankingTab(tab)}
                            style={[styles.rankingTab, activeCoinsRankingTab === tab && styles.activeRankingTab]}
                        >
                            <Text style={[styles.rankingTabText, activeCoinsRankingTab === tab && styles.activeRankingTabText]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.rankingListHeader}>
                    <Text style={styles.rankingListHeaderText}>User</Text>
                    <Text style={styles.rankingListHeaderText}>Revenue</Text>
                </View>

                {coinsRankings.map((user, index) => (
                    <View key={user.id} style={styles.rankingRow}>
                        <View style={styles.rankingUserCol}>
                            <Text style={styles.rankingIndex}>{index + 1}</Text>
                            <Image source={{ uri: user.avatar }} style={styles.rankingAvatar} />
                            <Text style={styles.rankingName}>{user.name}</Text>
                        </View>
                        <View style={styles.rankingRevenueCol}>
                            <Image source={{ uri: 'https://img.icons8.com/fluency/48/coin.png' }} style={styles.coinIconSmall} />
                            <Text style={styles.rankingRevenueText}>{user.revenue}</Text>
                        </View>
                    </View>
                ))}
                <View style={{ height: 100 }} />
            </View>
        </>
    );

    const renderUSDTab = () => (
        <>
            {/* Banner Area (USD Variant) */}
            <View style={styles.bannerContainer}>
                <Image source={{ uri: 'https://img.icons8.com/color/256/gift--v1.png' }} style={styles.bannerImage} />
                <View style={styles.bannerTextWrapper}>
                    <Text style={styles.bannerSubtitle}>Invite users to recharge</Text>
                    <Text style={styles.bannerTitle}>Earn monthly <Text style={styles.bannerTitleHighlight}>1600$</Text></Text>
                </View>
                <View style={styles.countdownContainer}>
                    <Text style={styles.countdownLabel}>Task reset countdown</Text>
                    <View style={styles.timeWrapper}>
                        <View style={styles.timeBox}><Text style={styles.timeBoxText}>00</Text></View><Text style={styles.timeText}> d </Text>
                        <View style={styles.timeBox}><Text style={styles.timeBoxText}>22</Text></View><Text style={styles.timeText}> Hour </Text>
                        <View style={styles.timeBox}><Text style={styles.timeBoxText}>15</Text></View><Text style={styles.timeText}> Min </Text>
                        <View style={styles.timeBox}><Text style={styles.timeBoxText}>06</Text></View><Text style={styles.timeText}> Sec </Text>
                    </View>
                </View>
                <View style={styles.marqueeContainer}>
                    <Text style={styles.marqueeText}>🎉 IRFAN reached Lv.5! Accumulated 13.50 USD</Text>
                </View>
            </View>

            {/* Total Reward Card */}
            <View style={styles.card}>
                <View style={styles.cardHeaderRow}>
                    <View style={styles.lvBadge}><Text style={styles.lvText}>V Lv.0</Text></View>
                    <View style={{ marginLeft: 12 }}>
                        <Text style={styles.cardTitle}>Total Reward</Text>
                        <Text style={styles.rewardAmount}>$0</Text>
                    </View>
                </View>
                <Text style={styles.infoText}>After the event ends, the remaining rewards ≥ $5 can be withdrawn; if {'<'} $5, it will be automatically converted to coins.</Text>
                <TouchableOpacity style={styles.inviteBtnLarge}>
                    <LinearGradient colors={['#E6C27A', '#D4AF37']} style={styles.inviteBtnGradient}>
                        <Text style={styles.inviteBtnText}>Invite users</Text>
                        <Share2 color="#000" size={16} style={{ marginLeft: 8 }} />
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Coins recharged by friends Card */}
            <View style={styles.card}>
                <Text style={styles.cardSubTitleCenter}>Coins recharged by friends</Text>
                <Text style={styles.usdLargeZero}>0</Text>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.moreText}>View details</Text>
                    <ChevronRight color="#D4AF37" size={14} style={{ marginTop: 15, marginLeft: 2 }} />
                </TouchableOpacity>
            </View>

            {/* Levels Card */}
            <View style={styles.levelCard}>
                <View style={styles.rankingTabs}>
                    {['Next level', 'All levels'].map(tab => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveLevelTab(tab)}
                            style={[
                                styles.rankingTab,
                                activeLevelTab === tab && styles.activeRankingTab,
                                activeLevelTab === tab && { backgroundColor: '#1A1410' }
                            ]}
                        >
                            <Text style={[styles.rankingTabText, activeLevelTab === tab && styles.activeRankingTabText]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {activeLevelTab === 'Next level' ? (
                    <View style={styles.nextLevelContainer}>
                        <Text style={styles.nextLevelTitle}>Next level reward</Text>
                        <View style={styles.nextLevelRewardBox}>
                            <Text style={styles.nextLevelRewardText}>$0.5</Text>
                            <View style={styles.levelBadgeMini}><Text style={styles.levelBadgeMiniText}>Lv.1</Text></View>
                        </View>
                        <Text style={styles.completeTasksTitle}>Complete tasks to upgrade:</Text>

                        <View style={styles.progressCard}>
                            <Text style={styles.progressCardTitle}>Invite users to recharge <Text style={styles.progressCardHighlight}>10800000</Text> coins</Text>
                            <Text style={styles.progressCardFraction}>(0/10800000)</Text>
                            <View style={styles.progressBarBg}>
                                <View style={styles.progressBarFill} />
                            </View>
                            <View style={styles.progressRow}>
                                <Text style={styles.progressText}>0</Text>
                                <Text style={styles.progressText}>10800000</Text>
                            </View>
                        </View>

                        <Text style={styles.infoTextLeft}>* When countdown over, invited-friends not binded enough for 16 days will continue accumulate the recharge reward.</Text>
                    </View>
                ) : (
                    <View style={styles.allLevelsContainer}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>Lv.</Text>
                            <Text style={[styles.tableHeaderText, { flex: 2, textAlign: 'center' }]}>Requirements for upgrading</Text>
                            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Cash Reward</Text>
                        </View>
                        {levelRequirements.map((item, index) => (
                            <View key={item.lv} style={[styles.tableRow, index % 2 !== 0 && { backgroundColor: '#1A1410' }]}>
                                <Text style={[styles.tableRowText, { flex: 0.5 }]}>{item.lv}</Text>
                                <Text style={[styles.tableRowText, { flex: 2, textAlign: 'center' }]}>
                                    Invite users to recharge <Text style={{ color: '#D4AF37' }}>{item.req}</Text> coins
                                </Text>
                                <Text style={[styles.tableRowTextHighlight, { flex: 1, textAlign: 'right' }]}>{item.reward}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {/* Rankings Tab Area (USD) */}
            <View style={styles.rankingSection}>
                <View style={styles.rankingTabs}>
                    {['Rankings this period', 'Rankings last period'].map(tab => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveUSDRankingTab(tab)}
                            style={[styles.rankingTab, activeUSDRankingTab === tab && styles.activeRankingTab]}
                        >
                            <Text style={[styles.rankingTabText, activeUSDRankingTab === tab && styles.activeRankingTabText]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Sub tabs Global/Local */}
                <View style={styles.subTabsContainer}>
                    {['Global', 'Local'].map(tab => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveUSDRankingSubTab(tab)}
                            style={[styles.subTab, activeUSDRankingSubTab === tab && styles.activeSubTab]}
                        >
                            <Text style={[styles.subTabText, activeUSDRankingSubTab === tab && styles.activeSubTabText]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {usdRankings.map((user, index) => (
                    <View key={user.id} style={styles.rankingRow}>
                        <View style={styles.rankingUserCol}>
                            <Text style={styles.rankingIndex}>{index + 1}</Text>
                            <Image source={{ uri: user.avatar }} style={styles.rankingAvatar} />
                            <Text style={styles.rankingName}>{user.name}</Text>
                        </View>
                        <View style={styles.rankingRevenueCol}>
                            <Text style={styles.rankingRevenueText}>{user.revenue}</Text>
                        </View>
                    </View>
                ))}
                <View style={{ height: 100 }} />
            </View>
        </>
    );

    const renderPrivilegesTab = () => (
        <>
            {/* Section 1: Avatar Frame */}
            <View style={styles.privilegeSection}>
                <View style={styles.privilegeTitleRow}>
                    <View style={styles.privilegeTitleBadge}>
                        <Text style={styles.privilegeTitleBadgeNum}>50</Text>
                        <Text style={styles.privilegeTitleBadgeText}>Times</Text>
                    </View>
                    <Text style={styles.privilegeTitleText}>Invite friends to get avatar frame</Text>
                </View>

                <View style={styles.card}>
                    {/* Avatar frame display area */}
                    <View style={styles.avatarFrameContainer}>
                        <View style={styles.avatarFrameWrapper}>
                            <View style={styles.avatarInnerBg}>
                                <Text style={styles.avatarVText}>V</Text>
                            </View>
                            <View style={styles.avatarFrameGoldOverlay} />
                            <View style={styles.frameTimeBadge}>
                                <Text style={styles.frameTimeText}>7 days</Text>
                            </View>
                        </View>
                    </View>

                    {/* Progress Bar Container */}
                    <View style={styles.privilegeProgressContainer}>
                        <View style={styles.privilegeProgressBarBg}>
                            <View style={[styles.privilegeProgressBarFill, { width: '0%' }]} />
                        </View>
                        <View style={styles.privilegeProgressLabelRow}>
                            <Text style={styles.privilegeProgressLabel}>0</Text>
                            <Text style={styles.privilegeProgressLabel}>7</Text>
                        </View>
                        <Text style={styles.privilegeInviteTargetText}>
                            Invite <Text style={{ color: '#D4AF37' }}>7</Text> more people to get
                        </Text>
                    </View>

                    {/* Rule Info Text */}
                    <Text style={styles.privilegeInfoText}>
                        Every time you successfully invite X users, you can get an avatar frame valid for X days. After reaching the goal, the avatar frame will be directly sent to 'Shop{'>'} My Backpack'.
                    </Text>
                </View>
            </View>

            {/* Section 2: Medals */}
            <View style={styles.privilegeSection}>
                <View style={styles.privilegeTitleRow}>
                    <Text style={styles.privilegeTitleNumber2}>2.</Text>
                    <Text style={styles.privilegeTitleText2}>Invite friends to get medals</Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.medalCardRow}>
                        <View style={styles.medalTextContainer}>
                            <Text style={styles.medalCardText}>
                                When number of user you invite reach certain level, you can get permanent medal rewards.
                            </Text>
                        </View>
                        <View style={styles.medalIconContainer}>
                            <Image
                                source={{ uri: 'https://img.icons8.com/color/256/gift--v1.png' }}
                                style={styles.medalGiftImage}
                            />
                            <View style={styles.medalStatusBadge}>
                                <Text style={styles.medalStatusText}>Locked</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ height: 100 }} />
        </>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0B0806" />

            {/* Fixed Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <ChevronLeft color="#E6C27A" size={28} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Invite users</Text>
                <TouchableOpacity style={styles.headerBtn}>
                    <RefreshCw color="#E6C27A" size={20} />
                </TouchableOpacity>
            </View>

            {/* Top Tabs */}
            <View style={styles.topTabsContainer}>
                {['Coins', 'USD', 'Privileges'].map(tab => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setActiveTopTab(tab)}
                        style={[styles.topTab, activeTopTab === tab && styles.activeTopTab]}
                    >
                        <Text style={[styles.topTabText, activeTopTab === tab && styles.activeTopTabText]}>{tab}</Text>
                    </TouchableOpacity>
                ))}

                {/* Help Icon for rules */}
                <TouchableOpacity onPress={() => setRulesModalVisible(true)} style={styles.helpIconBtn}>
                    <HelpCircle color="#8B7A6A" size={22} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {activeTopTab === 'Coins' ? renderCoinsTab() : activeTopTab === 'USD' ? renderUSDTab() : renderPrivilegesTab()}
            </ScrollView>

            {/* Sticky Floating Invite Button */}
            <View style={styles.floatingBtnContainer}>
                <TouchableOpacity style={styles.inviteBtnFloating}>
                    <LinearGradient colors={['#E6C27A', '#D4AF37']} style={styles.inviteBtnGradientFloating}>
                        <Text style={styles.inviteBtnTextFloating}>Invite users</Text>
                        <Share2 color="#000" size={18} style={{ marginLeft: 8 }} />
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Detailed Rules Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={rulesModalVisible}
                onRequestClose={() => setRulesModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeaderRibbon}>
                            <Text style={styles.modalHeaderTitle}>Detailed rules</Text>
                        </View>

                        <ScrollView style={styles.modalScroll}>
                            <Text style={styles.modalRuleText}>① Users can unlock different levels of cash rewards when the invited-friend account reach certain number or the coin recharged by invited friend reach certain number(within 16 days after invited). Rewards of different levels could be accumulated.</Text>
                            <Text style={styles.modalRuleText}>② On the 1st and 16th of each month (UTC+3 time zone), the system will automatically reset the score and start a new round of tasks. You can repeatedly invite new users and get rewards again. (holiday period will adjusted, refer to the actual situation)</Text>
                            <Text style={styles.modalRuleText}>③ When countdown over and a new round of task begins, invited-friends not registered enough for 16 days will continue accumulate reward. Until the invited-user has registered for 16 days.</Text>
                            <Text style={styles.modalRuleText}>④ User can go to the wallet page and click the withdrawal button to withdraw the cash reward.</Text>
                        </ScrollView>

                        <TouchableOpacity style={styles.closeModalBtn} onPress={() => setRulesModalVisible(false)}>
                            <X color="#E6C27A" size={24} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

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
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 10,
        paddingBottom: 15,
        backgroundColor: '#0B0806',
        zIndex: 10,
    },
    headerBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#E6C27A',
        fontSize: 18,
        fontWeight: 'bold',
    },
    topTabsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#15110E',
        borderRadius: 25,
        marginHorizontal: 16,
        padding: 4,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#2A2015',
    },
    topTab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 20,
    },
    activeTopTab: {
        backgroundColor: '#2A2015',
        borderWidth: 1,
        borderColor: '#D4AF37',
    },
    topTabText: {
        color: '#8B7A6A',
        fontSize: 13,
        fontWeight: '600',
    },
    activeTopTabText: {
        color: '#E6C27A',
        fontWeight: 'bold',
    },
    helpIconBtn: {
        paddingHorizontal: 10,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    bannerContainer: {
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    bannerImage: {
        width: 120,
        height: 120,
        opacity: 0.8,
        marginBottom: 10,
    },
    bannerTextWrapper: {
        alignItems: 'center',
        marginBottom: 15,
    },
    bannerSubtitle: {
        color: '#A08B7D',
        fontSize: 16,
        fontWeight: '600',
    },
    bannerTitle: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    bannerTitleHighlight: {
        color: '#E6C27A',
        fontSize: 32,
    },
    countdownContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    countdownLabel: {
        color: '#8B7A6A',
        fontSize: 12,
        marginBottom: 6,
    },
    timeWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeBox: {
        backgroundColor: '#1F1610',
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#2A2015',
    },
    timeBoxText: {
        color: '#E6C27A',
        fontWeight: 'bold',
        fontSize: 12,
    },
    timeText: {
        color: '#8B7A6A',
        fontSize: 12,
    },
    marqueeContainer: {
        backgroundColor: 'rgba(230, 194, 122, 0.1)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        width: '100%',
        borderWidth: 1,
        borderColor: '#2A2015',
    },
    marqueeText: {
        color: '#E6C27A',
        fontSize: 12,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#15110E',
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#2A2015',
        alignItems: 'center',
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        width: '100%',
    },
    lvBadge: {
        backgroundColor: '#2A2015',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D4AF37',
    },
    lvText: {
        color: '#E6C27A',
        fontWeight: 'bold',
        fontSize: 12,
    },
    cardTitle: {
        color: '#A08B7D',
        fontSize: 13,
    },
    rewardAmount: {
        color: '#E6C27A',
        fontSize: 28,
        fontWeight: 'bold',
    },
    infoText: {
        color: '#8B7A6A',
        fontSize: 11,
        textAlign: 'center',
        marginBottom: 15,
        lineHeight: 16,
    },
    infoTextLeft: {
        color: '#8B7A6A',
        fontSize: 11,
        textAlign: 'left',
        marginTop: 15,
        lineHeight: 16,
    },
    cardSubTitleCenter: {
        color: '#D4AF37',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 10,
    },
    usdLargeZero: {
        color: '#E6C27A',
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    inviteBtnLarge: {
        width: '100%',
        borderRadius: 25,
        overflow: 'hidden',
    },
    inviteBtnGradient: {
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inviteBtnText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    ribbonLabel: {
        backgroundColor: '#2A2015',
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        position: 'absolute',
        top: 0,
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: '#D4AF37',
    },
    ribbonText: {
        color: '#E6C27A',
        fontWeight: 'bold',
        fontSize: 13,
    },
    revenueGrid: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 25,
    },
    revenueItem: {
        flex: 1,
        alignItems: 'center',
    },
    revenueDivider: {
        width: 1,
        backgroundColor: '#2A2015',
    },
    revenueValue: {
        color: '#E6C27A',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    revenueLabel: {
        color: '#8B7A6A',
        fontSize: 11,
    },
    moreText: {
        color: '#D4AF37',
        fontSize: 12,
        marginTop: 15,
    },
    stepContainer: {
        marginHorizontal: 16,
        marginBottom: 25,
    },
    stepTitle: {
        color: '#D4AF37',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
    },
    stepNum: {
        color: '#E6C27A',
        fontSize: 20,
        fontWeight: 'bold',
    },
    stepBoxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    stepBox: {
        flex: 1,
        backgroundColor: '#15110E',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A2015',
    },
    plusSign: {
        color: '#E6C27A',
        fontSize: 24,
        fontWeight: 'bold',
        marginHorizontal: 10,
    },
    stepIcon: {
        width: 30,
        height: 30,
        marginBottom: 6,
    },
    stepHighlight: {
        color: '#E6C27A',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    stepSubText: {
        color: '#8B7A6A',
        fontSize: 10,
        textAlign: 'center',
    },
    centerStepBox: {
        backgroundColor: '#15110E',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A2015',
        alignSelf: 'center',
        minWidth: 120,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15,
    },
    treeContainer: {
        backgroundColor: '#15110E',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#2A2015',
        alignItems: 'center',
    },
    treeTitle: {
        color: '#E6C27A',
        fontWeight: 'bold',
        marginBottom: 15,
    },
    treeNodeRow: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
    },
    treeTextColLeft: {
        flex: 1,
        alignItems: 'flex-end',
        paddingRight: 10,
    },
    treeNodeCenter: {
        width: 50,
        alignItems: 'center',
    },
    treeTextColRight: {
        flex: 1,
        alignItems: 'flex-start',
        paddingLeft: 10,
    },
    treeDescText: {
        color: '#A08B7D',
        fontSize: 11,
        textAlign: 'right',
    },
    treeDescTextRight: {
        color: '#A08B7D',
        fontSize: 11,
    },
    nodeCircleA: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2A2015',
        borderWidth: 2,
        borderColor: '#D4AF37',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    nodeCircleText: {
        color: '#E6C27A',
        fontWeight: 'bold',
        fontSize: 16,
    },
    treeLine: {
        width: 2,
        height: 25,
        backgroundColor: '#E6C27A',
        opacity: 0.5,
        marginVertical: 2,
    },
    nodeAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#2A2015',
        zIndex: 2,
    },
    nodeBadge: {
        position: 'absolute',
        bottom: -5,
        right: 0,
        backgroundColor: '#D4AF37',
        width: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3,
    },
    nodeBadgeText: {
        color: '#000',
        fontSize: 10,
        fontWeight: 'bold',
    },
    infoTextCenter: {
        color: '#8B7A6A',
        fontSize: 11,
        textAlign: 'center',
        marginBottom: 15,
    },
    guideStepsRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    guideStep: {
        flex: 1,
        alignItems: 'center',
    },
    guideIconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#1F1610',
        borderWidth: 1,
        borderColor: '#2A2015',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    guideText: {
        color: '#A08B7D',
        fontSize: 10,
        textAlign: 'center',
        paddingHorizontal: 4,
    },
    guideArrow: {
        color: '#E6C27A',
        fontSize: 12,
        marginTop: 18,
        marginHorizontal: 5,
    },
    inviteCodeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#15110E',
        borderWidth: 1,
        borderColor: '#D4AF37',
        borderRadius: 8,
        paddingLeft: 15,
        marginBottom: 20,
        overflow: 'hidden',
    },
    inviteCodeLabel: {
        flex: 1,
        color: '#A08B7D',
        fontSize: 13,
    },
    inviteCodeValue: {
        color: '#E6C27A',
        fontWeight: 'bold',
    },
    copyBtn: {
        backgroundColor: '#D4AF37',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    copyBtnText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 13,
    },
    statementArea: {
        backgroundColor: '#15110E',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2A2015',
    },
    statementTitle: {
        color: '#E6C27A',
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    statementText: {
        color: '#8B7A6A',
        fontSize: 11,
        marginBottom: 6,
        lineHeight: 16,
    },
    levelCard: {
        backgroundColor: '#15110E',
        marginHorizontal: 16,
        borderRadius: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#2A2015',
        overflow: 'hidden',
    },
    rankingSection: {
        backgroundColor: '#15110E',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 15,
        minHeight: 400,
    },
    rankingTabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#2A2015',
        backgroundColor: '#1F1610',
    },
    rankingTab: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
    },
    activeRankingTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#E6C27A',
        backgroundColor: '#15110E',
    },
    rankingTabText: {
        color: '#8B7A6A',
        fontSize: 13,
        fontWeight: '600',
    },
    activeRankingTabText: {
        color: '#E6C27A',
        fontWeight: 'bold',
    },
    subTabsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 15,
        gap: 15,
    },
    subTab: {
        paddingHorizontal: 25,
        paddingVertical: 6,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: '#2A2015',
    },
    activeSubTab: {
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        borderColor: '#E6C27A',
    },
    subTabText: {
        color: '#8B7A6A',
        fontSize: 12,
        fontWeight: '500',
    },
    activeSubTabText: {
        color: '#E6C27A',
        fontWeight: 'bold',
    },
    rankingListHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    rankingListHeaderText: {
        color: '#8B7A6A',
        fontSize: 11,
    },
    rankingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#1A1410',
    },
    rankingUserCol: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rankingIndex: {
        color: '#A08B7D',
        fontSize: 14,
        width: 20,
    },
    rankingAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginHorizontal: 10,
    },
    rankingName: {
        color: '#FFF',
        fontSize: 13,
    },
    rankingRevenueCol: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    coinIconSmall: {
        width: 16,
        height: 16,
        marginRight: 6,
    },
    rankingRevenueText: {
        color: '#E6C27A',
        fontSize: 14,
        fontWeight: 'bold',
    },
    nextLevelContainer: {
        padding: 16,
        alignItems: 'center',
    },
    nextLevelTitle: {
        color: '#A08B7D',
        fontSize: 13,
        marginBottom: 15,
    },
    nextLevelRewardBox: {
        backgroundColor: '#1F1610',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D4AF37',
        marginBottom: 20,
        position: 'relative',
    },
    nextLevelRewardText: {
        color: '#E6C27A',
        fontSize: 32,
        fontWeight: 'bold',
    },
    levelBadgeMini: {
        position: 'absolute',
        top: -8,
        right: -10,
        backgroundColor: '#D4AF37',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    levelBadgeMiniText: {
        color: '#000',
        fontSize: 10,
        fontWeight: 'bold',
    },
    completeTasksTitle: {
        color: '#E6C27A',
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    progressCard: {
        backgroundColor: '#1F1610',
        width: '100%',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2A2015',
    },
    progressCardTitle: {
        color: '#8B7A6A',
        fontSize: 13,
        marginBottom: 4,
    },
    progressCardHighlight: {
        color: '#E6C27A',
        fontWeight: 'bold',
    },
    progressCardFraction: {
        color: '#A08B7D',
        fontSize: 11,
        marginBottom: 10,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: '#2A2015',
        borderRadius: 3,
        width: '100%',
        marginBottom: 8,
    },
    progressBarFill: {
        width: '0%', // since it's 0/10800000
        height: '100%',
        backgroundColor: '#D4AF37',
        borderRadius: 3,
    },
    progressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressText: {
        color: '#8B7A6A',
        fontSize: 10,
    },
    allLevelsContainer: {
        padding: 0,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#1F1610',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2015',
    },
    tableHeaderText: {
        color: '#D4AF37',
        fontSize: 12,
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1A1410',
        alignItems: 'center',
    },
    tableRowText: {
        color: '#8B7A6A',
        fontSize: 11,
    },
    tableRowTextHighlight: {
        color: '#E6C27A',
        fontSize: 14,
        fontWeight: 'bold',
    },
    floatingBtnContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    inviteBtnFloating: {
        width: '100%',
        borderRadius: 30,
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
        overflow: 'hidden',
    },
    inviteBtnGradientFloating: {
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inviteBtnTextFloating: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#15110E',
        borderRadius: 16,
        width: '100%',
        maxHeight: '80%',
        borderWidth: 1,
        borderColor: '#2A2015',
        alignItems: 'center',
        paddingBottom: 20,
        paddingTop: 40,
    },
    modalHeaderRibbon: {
        backgroundColor: '#D4AF37',
        paddingHorizontal: 30,
        paddingVertical: 8,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        position: 'absolute',
        top: 0,
    },
    modalHeaderTitle: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalScroll: {
        paddingHorizontal: 20,
        width: '100%',
    },
    modalRuleText: {
        color: '#A08B7D',
        fontSize: 13,
        lineHeight: 20,
        marginBottom: 15,
    },
    closeModalBtn: {
        marginTop: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2A2015',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D4AF37',
    },
    privilegeSection: {
        marginBottom: 20,
    },
    privilegeTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 12,
    },
    privilegeTitleBadge: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#1F1610',
        borderWidth: 1.5,
        borderColor: '#D4AF37',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    privilegeTitleBadgeNum: {
        color: '#E6C27A',
        fontSize: 12,
        fontWeight: 'bold',
        lineHeight: 14,
    },
    privilegeTitleBadgeText: {
        color: '#8B7A6A',
        fontSize: 8,
        fontWeight: '600',
        lineHeight: 9,
        textTransform: 'uppercase',
    },
    privilegeTitleText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: 'bold',
        flex: 1,
    },
    privilegeTitleNumber2: {
        color: '#D4AF37',
        fontSize: 32,
        fontWeight: 'bold',
        marginRight: 8,
        lineHeight: 36,
    },
    privilegeTitleText2: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    avatarFrameContainer: {
        alignItems: 'center',
        marginVertical: 15,
    },
    avatarFrameWrapper: {
        width: 90,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    avatarInnerBg: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: '#3A2A54',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatarFrameGoldOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderWidth: 4,
        borderColor: '#D4AF37',
        borderRadius: 45,
    },
    avatarVText: {
        color: '#FFF',
        fontSize: 36,
        fontWeight: 'bold',
    },
    frameTimeBadge: {
        backgroundColor: '#FF8C00',
        paddingHorizontal: 12,
        paddingVertical: 3,
        borderRadius: 10,
        position: 'absolute',
        bottom: -4,
        borderWidth: 1,
        borderColor: '#FFF',
    },
    frameTimeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    privilegeProgressContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 15,
    },
    privilegeProgressBarBg: {
        height: 12,
        backgroundColor: '#2A2015',
        borderRadius: 6,
        width: '90%',
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#3D2F20',
        overflow: 'hidden',
    },
    privilegeProgressBarFill: {
        height: '100%',
        backgroundColor: '#D4AF37',
        borderRadius: 6,
    },
    privilegeProgressLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        paddingHorizontal: 4,
        marginBottom: 10,
    },
    privilegeProgressLabel: {
        color: '#8B7A6A',
        fontSize: 12,
        fontWeight: '600',
    },
    privilegeInviteTargetText: {
        color: '#E6C27A',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    privilegeInfoText: {
        color: '#8B7A6A',
        fontSize: 11,
        textAlign: 'center',
        lineHeight: 16,
        paddingHorizontal: 10,
    },
    medalCardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    medalTextContainer: {
        flex: 1,
        paddingRight: 10,
    },
    medalCardText: {
        color: '#A08B7D',
        fontSize: 13,
        lineHeight: 18,
    },
    medalIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
    },
    medalGiftImage: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
    medalStatusBadge: {
        backgroundColor: '#2A2015',
        borderWidth: 1,
        borderColor: '#D4AF37',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginTop: 4,
    },
    medalStatusText: {
        color: '#E6C27A',
        fontSize: 10,
        fontWeight: '600',
    }
});
