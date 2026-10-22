import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, SafeAreaView, StatusBar, Dimensions, Platform } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function TransferCoinsScreen() {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Transfer coins');
    const [lamaId, setLamaId] = useState('');
    const [coinAmount, setCoinAmount] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft color="#374151" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Transfer coins</Text>
                <View style={styles.headerRight} />
            </View>

            {/* Sub Tabs */}
            <View style={styles.subTabsContainer}>
                <TouchableOpacity onPress={() => setActiveTab('Transfer coins')} style={styles.subTabBtn}>
                    <Text style={[styles.subTabText, activeTab === 'Transfer coins' && styles.activeSubTabText]}>Transfer coins</Text>
                    {activeTab === 'Transfer coins' && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('Sell VIP')} style={styles.subTabBtn}>
                    <Text style={[styles.subTabText, activeTab === 'Sell VIP' && styles.activeSubTabText]}>Sell VIP</Text>
                    {activeTab === 'Sell VIP' && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('Recharge')} style={styles.subTabBtn}>
                    <Text style={[styles.subTabText, activeTab === 'Recharge' && styles.activeSubTabText]}>Recharge</Text>
                    {activeTab === 'Recharge' && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Balance Section */}
                <Text style={styles.balanceLabel}>Coins balance</Text>
                <View style={styles.balanceRow}>
                    <Image source={{ uri: 'https://img.icons8.com/fluency/96/coins.png' }} style={styles.coinIcon} />
                    <Text style={styles.balanceText}>4818114</Text>
                </View>

                {/* Form Card */}
                <View style={styles.formCard}>
                    <Text style={styles.inputLabel}>Put in the lama id you want to transfer to:</Text>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter ID"
                            placeholderTextColor="#9CA3AF"
                            value={lamaId}
                            onChangeText={setLamaId}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity style={styles.searchBtn}>
                            <Text style={styles.searchBtnText}>Search</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.inputLabel, { marginTop: 24 }]}>Coin amount to transfer:</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Input quantity"
                        placeholderTextColor="#9CA3AF"
                        value={coinAmount}
                        onChangeText={setCoinAmount}
                        keyboardType="numeric"
                    />
                </View>

                {/* Tips Section */}
                <View style={styles.tipsSection}>
                    <Text style={styles.tipsTitle}>Tips:</Text>
                    <Text style={styles.tipsText}>1. Don't transfer at a price lower than 1 US dollar = 61000 gold coins. When it happen, you may lose your identity as a merchant.</Text>
                    <Text style={styles.tipsText}>2. If you need to recharge, please contact the official methods and provide with your lama id.</Text>
                    <Text style={styles.tipsText}>(1) Lark:</Text>
                    <Text style={styles.tipsText}>fantinehuitingyang@gmail.com</Text>
                    <Text style={styles.tipsText}>ws16427@163.com</Text>
                    <Text style={styles.tipsText}>(2) Whatsapp:</Text>
                    <Text style={styles.tipsText}>0086 13380049343</Text>
                    <Text style={styles.tipsText}>0086 13235576496</Text>
                    <Text style={styles.tipsText}>3. If the number of gold coins in the account is below 5000, the coin merchant logo will not be displayed, please recharge in time.</Text>
                    <Text style={styles.tipsText}>4. Merchant must receive the full payment.</Text>
                </View>

                {/* Confirm Button */}
                <TouchableOpacity style={styles.confirmBtn}>
                    <Text style={styles.confirmBtnText}>Confirm</Text>
                </TouchableOpacity>

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
    backBtn: {
        padding: 4,
        width: 40,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    headerRight: {
        width: 40,
    },
    subTabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#F3F4F6',
    },
    subTabBtn: {
        marginRight: 24,
        paddingVertical: 12,
        alignItems: 'center',
    },
    subTabText: {
        fontSize: 14,
        color: '#9CA3AF',
        fontWeight: '600',
    },
    activeSubTabText: {
        color: '#111827',
        fontWeight: '700',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        width: 24,
        height: 3,
        backgroundColor: '#06B6D4',
        borderRadius: 2,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    balanceLabel: {
        fontSize: 13,
        color: '#9CA3AF',
        fontWeight: '500',
        marginBottom: 8,
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    coinIcon: {
        width: 28,
        height: 28,
        marginRight: 8,
    },
    balanceText: {
        fontSize: 32,
        fontWeight: '800',
        color: '#111827',
    },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
        marginBottom: 12,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        fontSize: 15,
        color: '#111827',
        paddingVertical: 8,
    },
    searchBtn: {
        backgroundColor: '#06B6D4',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        marginLeft: 12,
    },
    searchBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },
    tipsSection: {
        paddingHorizontal: 4,
        marginBottom: 32,
    },
    tipsTitle: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    tipsText: {
        fontSize: 12,
        color: '#9CA3AF',
        lineHeight: 18,
        marginBottom: 2,
    },
    confirmBtn: {
        backgroundColor: '#7DD3FC', // Cyan-300 for active state, or #22D3EE if fully enabled
        paddingVertical: 14,
        borderRadius: 24,
        alignItems: 'center',
        marginHorizontal: 16,
    },
    confirmBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    }
});
