import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Platform, StatusBar, LayoutAnimation, UIManager, Alert } from 'react-native';
import { ChevronLeft, ChevronDown, ChevronUp, Gamepad2, Home, CircleDollarSign, CreditCard } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const faqData = {
    Game: [
        {
            q: 'The introduction about games.',
            a: 'Lavachat provides interactive multiplayer games like Ludo, Carrom, and more. You can play with friends or match with random players globally to win exclusive items and rise in influence!'
        },
        {
            q: 'What is the game coins?',
            a: 'Game coins are the primary currency used to join matches, enter high-stakes rooms, purchase in-game tokens, and unlock special cosmetics. You can purchase them in the Store or earn them through levels.'
        },
        {
            q: 'What is the game lucky bags in the room?',
            a: 'Lucky bags are special gift packs that hosts or visitors can drop in the chat room. Once dropped, any listener in the room can tap them to claim random rewards like coins, titles, or medals!'
        }
    ],
    Room: [
        {
            q: 'How to follow or unfollow a room?',
            a: 'To follow a room, tap the Heart/Follow icon on the room banner or in the header. To unfollow, tap it again, or manage your followed rooms list in your Profile under Following.'
        },
        {
            q: 'How to lock my room?',
            a: 'Go to your Room settings inside your active room, select "Room Lock", and configure a 4-digit password or restrict room entry to specific guests.'
        },
        {
            q: 'How to play music in the room?',
            a: 'Tap the Music icon at the bottom of the room control panel, select tracks from your local device or from the cloud library, and hit play to stream high-quality audio to all room listeners.'
        },
        {
            q: 'How can I change the mic number of my room?',
            a: 'Room hosts and admins can change the number of microphones by tapping Room Settings > Mic Layout, choosing between a 4-mic grid, a 9-mic layout, or a standard list.'
        }
    ],
    Recharge: [
        {
            q: 'How to recharge?',
            a: 'Go to your Profile, tap on the Recharge button next to your Coins, select a package, and complete your purchase using Google Pay, credit cards, UPI, or local payment options.'
        },
        {
            q: 'How to increase the rich level?',
            a: 'You can increase your rich level by buying and gifting items to hosts, purchasing VIP status, and recharging coins regularly. Higher rich levels unlock exclusive entry effect badges and profile frames.'
        },
        {
            q: 'Online Recharge problem.',
            a: 'If you encounter any payment gateway failure, double charge, or delay in coin credits, please wait 5-10 minutes. If the issue persists, click "Get help from Customer Service" below with your transaction receipt.'
        }
    ],
    'Cash out': [
        {
            q: 'How to cash out?',
            a: 'Go to the Cash Out portal from your LUEX Credit card in the Profile page, choose your withdrawal method (Bank Transfer or Wallet), enter the cash-out amount, and confirm.'
        },
        {
            q: 'Official cash out problem.',
            a: 'Cash outs are processed within 24-48 hours. If your transaction is rejected or delayed, check that your bank account details or KYC information is accurate, or contact support using the button below.'
        }
    ]
};

export default function CustomerServiceScreen() {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Game');
    const [expandedIndex, setExpandedIndex] = useState(null);

    const tabs = [
        { name: 'Game', icon: Gamepad2, activeColor: '#10B981' },
        { name: 'Room', icon: Home, activeColor: '#8B5CF6' },
        { name: 'Recharge', icon: CircleDollarSign, activeColor: '#F59E0B' },
        { name: 'Cash out', icon: CreditCard, activeColor: '#3B82F6' }
    ];

    const toggleAccordion = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (expandedIndex === index) {
            setExpandedIndex(null);
        } else {
            setExpandedIndex(index);
        }
    };

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        setExpandedIndex(null);
    };

    const handleContactSupport = () => {
        Alert.alert('Contact Support', 'Connecting to Customer Service Agent...');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0B0806" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <ChevronLeft color="#E6C27A" size={24} />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('CustomerServiceHistoryScreen')} 
                    style={styles.historyBtn}
                >
                    <Text style={styles.historyText}>History</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Branding row */}
                <View style={styles.brandingRow}>
                    <Text style={styles.helpTitle}>Hi. How can we help?</Text>
                    <Image 
                        source={{ uri: 'https://img.icons8.com/color/256/peacock.png' }} 
                        style={styles.logo} 
                    />
                </View>

                {/* Tabs Grid */}
                <View style={styles.tabsGrid}>
                    {tabs.map((tab) => {
                        const IconComponent = tab.icon;
                        const isActive = activeTab === tab.name;
                        return (
                            <TouchableOpacity
                                key={tab.name}
                                onPress={() => handleTabChange(tab.name)}
                                style={[
                                    styles.tabCard,
                                    isActive && styles.activeTabCard
                                ]}
                            >
                                <View style={[styles.tabIconBg, isActive && { backgroundColor: 'rgba(230, 194, 122, 0.1)' }]}>
                                    <IconComponent color={isActive ? '#E6C27A' : '#8B7A6A'} size={24} />
                                </View>
                                <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>{tab.name}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* FAQ List */}
                <View style={styles.faqSection}>
                    <Text style={styles.faqSectionHeader}>{activeTab} FAQ</Text>

                    {faqData[activeTab].map((faq, idx) => {
                        const isExpanded = expandedIndex === idx;
                        return (
                            <View key={idx} style={styles.accordionContainer}>
                                <TouchableOpacity 
                                    onPress={() => toggleAccordion(idx)} 
                                    style={styles.accordionHeader}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.accordionQuestion}>{faq.q}</Text>
                                    {isExpanded ? (
                                        <ChevronUp color="#E6C27A" size={16} />
                                    ) : (
                                        <ChevronDown color="#8B7A6A" size={16} />
                                    )}
                                </TouchableOpacity>
                                
                                {isExpanded && (
                                    <View style={styles.accordionContent}>
                                        <Text style={styles.accordionAnswer}>{faq.a}</Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Bottom Support Button */}
            <View style={styles.bottomBar}>
                <TouchableOpacity onPress={handleContactSupport} style={styles.supportBtn}>
                    <LinearGradient
                        colors={['#e6c27a', '#c29e57']}
                        style={styles.supportGradient}
                    >
                        <Text style={styles.supportBtnText}>Get help from Customer Service</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
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
    historyBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    historyText: {
        color: '#E6C27A',
        fontSize: 13,
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 100,
    },
    brandingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingRight: 6,
    },
    helpTitle: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: 'bold',
        flex: 1,
        paddingRight: 10,
    },
    logo: {
        width: 48,
        height: 48,
    },
    tabsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        marginBottom: 24,
    },
    tabCard: {
        flex: 1,
        backgroundColor: '#120E0B',
        borderRadius: 16,
        borderWidth: 1.2,
        borderColor: 'rgba(230, 194, 122, 0.1)',
        paddingVertical: 12,
        alignItems: 'center',
        gap: 6,
    },
    activeTabCard: {
        borderColor: '#E6C27A',
        borderWidth: 1.5,
    },
    tabIconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabLabel: {
        color: '#8B7A6A',
        fontSize: 11,
        fontWeight: 'bold',
    },
    activeTabLabel: {
        color: '#E6C27A',
    },
    faqSection: {
        gap: 12,
    },
    faqSectionHeader: {
        color: '#E6C27A',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    accordionContainer: {
        backgroundColor: '#120E0B',
        borderRadius: 16,
        borderWidth: 1.2,
        borderColor: 'rgba(230, 194, 122, 0.12)',
        overflow: 'hidden',
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    accordionQuestion: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: 'bold',
        flex: 1,
        paddingRight: 10,
    },
    accordionContent: {
        paddingHorizontal: 16,
        paddingBottom: 14,
        borderTopWidth: 1,
        borderTopColor: '#221811',
        paddingTop: 10,
    },
    accordionAnswer: {
        color: '#A08B7D',
        fontSize: 12,
        lineHeight: 18,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#0B0806',
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: Platform.OS === 'ios' ? 24 : 12,
        borderTopWidth: 1,
        borderTopColor: '#221811',
    },
    supportBtn: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    supportGradient: {
        paddingVertical: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    supportBtnText: {
        color: '#4a2c11',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
