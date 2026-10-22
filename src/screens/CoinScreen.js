import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, StatusBar, Dimensions, Platform } from 'react-native';
import { ChevronLeft, HelpCircle, ChevronRight, FileText, UserCircle, CreditCard, ChevronDown } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

export default function CoinScreen() {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Coin');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <ChevronLeft color="#111827" size={24} />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Wallet</Text>

                <TouchableOpacity style={styles.iconBtn}>
                    <FileText color="#111827" size={24} />
                </TouchableOpacity>
            </View>

            {/* Sub Tabs */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity onPress={() => setActiveTab('Coin')} style={styles.tabBtn}>
                    <Text style={[styles.tabText, activeTab === 'Coin' && styles.activeTabText]}>Coin</Text>
                    {activeTab === 'Coin' && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('Game Coins')} style={styles.tabBtn}>
                    <Text style={[styles.tabText, activeTab === 'Game Coins' && styles.activeTabText]}>Coins</Text>
                    {activeTab === 'Game Coins' && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('Diamond')} style={styles.tabBtn}>
                    <Text style={[styles.tabText, activeTab === 'Diamond' && styles.activeTabText]}>JADE</Text>
                    {activeTab === 'Diamond' && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Balance Card */}
                <LinearGradient colors={['#FFF8E7', '#FFF3D4']} style={styles.balanceCard}>
                    <TouchableOpacity style={styles.faqRow}>
                        <Text style={styles.faqText}>FAQ</Text>
                        <HelpCircle color="#D9A05B" size={14} style={{ marginLeft: 4 }} />
                    </TouchableOpacity>

                    <View style={styles.mainBalanceRow}>
                        <Image source={{ uri: 'https://img.icons8.com/fluency/96/coins.png' }} style={styles.bigCoinIcon} />
                        <Text style={styles.mainBalanceText}>4832327</Text>
                    </View>

                    <View style={styles.subBalanceRow}>
                        <View style={styles.subBalanceCol}>
                            <Text style={styles.subBalanceNum}>14213</Text>
                            <Text style={styles.subBalanceLabel}>Entertainment Coins</Text>
                        </View>
                        <View style={styles.subBalanceColRight}>
                            <Text style={styles.subBalanceNum}>4818114</Text>
                            <Text style={styles.subBalanceLabel}>Merchant Coins</Text>
                            <TouchableOpacity 
                                style={styles.transferBtn}
                                onPress={() => navigation.navigate('TransferCoinsScreen')}
                            >
                                <Text style={styles.transferBtnText}>Transfer coins</Text>
                                <ChevronRight color="#fff" size={12} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>

                <Text style={styles.sectionTitle}>Recharge by</Text>

                {/* Recharge Options */}
                <View style={styles.rechargeList}>
                    
                    <TouchableOpacity style={styles.rechargeItem}>
                        <View style={styles.rechargeItemLeft}>
                            <View style={styles.iconWrapper}>
                                <UserCircle color="#000" size={32} />
                                <Image source={{ uri: 'https://img.icons8.com/fluency/48/coins.png' }} style={styles.tinyCoin} />
                            </View>
                            <Text style={styles.rechargeItemText}>Merchant ship</Text>
                        </View>
                        <View style={styles.rechargeItemRight}>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>More cheap</Text>
                            </View>
                            <ChevronRight color="#9CA3AF" size={20} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.rechargeItem}>
                        <View style={styles.rechargeItemLeft}>
                            <View style={styles.cardsWrapper}>
                                <Image source={{ uri: 'https://img.icons8.com/color/48/visa.png' }} style={styles.cardLogo} />
                                <Image source={{ uri: 'https://img.icons8.com/color/48/mastercard.png' }} style={styles.cardLogo} />
                                <Image source={{ uri: 'https://img.icons8.com/color/48/amex.png' }} style={styles.cardLogo} />
                                <Image source={{ uri: 'https://img.icons8.com/color/48/jcb.png' }} style={styles.cardLogo} />
                            </View>
                            <Text style={styles.rechargeItemText}>Visa/Master Card</Text>
                        </View>
                        <ChevronDown color="#9CA3AF" size={20} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.rechargeItem}>
                        <View style={styles.rechargeItemLeft}>
                            <View style={styles.gpayWrapper}>
                                <Image source={{ uri: 'https://img.icons8.com/color/48/google-logo.png' }} style={styles.gLogo} />
                                <Text style={styles.gPayText}>Pay</Text>
                            </View>
                            <Text style={styles.rechargeItemText}>Google Pay</Text>
                        </View>
                        <ChevronDown color="#9CA3AF" size={20} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.rechargeItem}>
                        <View style={styles.rechargeItemLeft}>
                            <Image source={{ uri: 'https://img.icons8.com/color/96/upi.png' }} style={styles.upiLogoBig} resizeMode="contain" />
                            <Text style={styles.rechargeItemText}>UPI</Text>
                        </View>
                        <ChevronDown color="#9CA3AF" size={20} />
                    </TouchableOpacity>

                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 12 : 12,
        paddingBottom: 12,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    iconBtn: {
        padding: 4,
    },
    tabsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingBottom: 4,
    },
    tabBtn: {
        marginHorizontal: 12,
        paddingVertical: 8,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 15,
        color: '#9CA3AF',
        fontWeight: '600',
    },
    activeTabText: {
        color: '#111827',
        fontWeight: '700',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        width: 16,
        height: 3,
        backgroundColor: '#06B6D4',
        borderRadius: 2,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    balanceCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },
    faqRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    faqText: {
        color: '#D9A05B',
        fontSize: 12,
        fontWeight: '600',
    },
    mainBalanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 16,
    },
    bigCoinIcon: {
        width: 28,
        height: 28,
        marginRight: 8,
    },
    mainBalanceText: {
        fontSize: 32,
        fontWeight: '800',
        color: '#111827',
    },
    subBalanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    subBalanceCol: {
        alignItems: 'center',
        flex: 1,
    },
    subBalanceColRight: {
        alignItems: 'center',
        flex: 1,
    },
    subBalanceNum: {
        fontSize: 16,
        fontWeight: '700',
        color: '#D9A05B',
    },
    subBalanceLabel: {
        fontSize: 11,
        color: '#D9A05B',
        opacity: 0.8,
        marginTop: 2,
    },
    transferBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F97316',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 8,
    },
    transferBtnText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
        marginRight: 2,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
        marginLeft: 4,
    },
    rechargeList: {
        gap: 12,
    },
    rechargeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    rechargeItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rechargeItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrapper: {
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
    },
    tinyCoin: {
        width: 12,
        height: 12,
        position: 'absolute',
        bottom: -2,
        right: 0,
    },
    rechargeItemText: {
        fontSize: 15,
        color: '#1F2937',
        fontWeight: '500',
    },
    badge: {
        backgroundColor: '#E11D48',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginRight: 8,
        borderTopRightRadius: 0,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
    },
    cardsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 48,
        height: 32,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
    },
    cardLogo: {
        width: 18,
        height: 12,
        resizeMode: 'contain',
    },
    gpayWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 12,
        width: 58,
    },
    gLogo: {
        width: 14,
        height: 14,
        marginRight: 2,
    },
    gPayText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
    },
    upiLogoBig: {
        width: 50,
        height: 24,
        marginRight: 12,
    },
    upiLogoSmall: {
        width: 32,
        height: 16,
        marginRight: 12,
    }
});
