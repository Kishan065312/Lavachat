import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Dimensions, Platform, StatusBar } from 'react-native';
import { ChevronLeft, Play, ChevronRight } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Dummy data for different categories
const storeData = {
    'Car': [
        { id: 1, name: 'Gold Lambo', price: '2M', duration: '7 day', image: 'https://img.icons8.com/color/256/sports-car.png' },
        { id: 2, name: 'Gold Jet', price: '1.8M', duration: '7 day', image: 'https://img.icons8.com/color/256/fighter-jet.png' },
        { id: 3, name: 'Green Super', price: '2M', duration: '7 day', image: 'https://img.icons8.com/color/256/car.png' },
        { id: 4, name: 'Hover Bike', price: '600k', duration: '7 day', image: 'https://img.icons8.com/color/256/motorcycle.png' },
        { id: 5, name: 'Flame Car', price: '1M', duration: '7 day', image: 'https://img.icons8.com/color/256/race-car.png' },
        { id: 6, name: 'Neon Kart', price: '800k', duration: '7 day', image: 'https://img.icons8.com/color/256/go-kart.png' },
    ],
    'Profile photo frame': [
        { id: 11, name: 'Gold Frame', price: '500k', duration: '7 day', image: 'https://img.icons8.com/color/256/picture-frame.png' },
        { id: 12, name: 'Silver Frame', price: '200k', duration: '7 day', image: 'https://img.icons8.com/color/256/mirror.png' },
    ],
    'Lucky account': [
        { id: 21, name: 'Special ID 1', price: '3M', duration: 'Permanent', image: 'https://img.icons8.com/color/256/vip.png' },
    ],
    'Ring': [
        { id: 31, name: 'Diamond Ring', price: '1.5M', duration: '7 day', image: 'https://img.icons8.com/color/256/diamond-ring.png' },
        { id: 32, name: 'Gold Ring', price: '1M', duration: '7 day', image: 'https://img.icons8.com/color/256/ring.png' },
    ],
    'Profile card background': [
        { id: 41, name: 'Galaxy BG', price: '400k', duration: '7 day', image: 'https://img.icons8.com/color/256/galaxy.png' },
    ],
    'Entrance Show': [
        { id: 51, name: 'Dragon Entry', price: '2.5M', duration: '7 day', image: 'https://img.icons8.com/color/256/dragon.png' },
    ]
};

const sideTabs = [
    { id: 'Car', icon: 'https://img.icons8.com/fluency/96/car.png' },
    { id: 'Profile photo frame', icon: 'https://img.icons8.com/fluency/96/picture-frame.png' },
    { id: 'Lucky account', icon: 'https://img.icons8.com/fluency/96/id-card.png' },
    { id: 'Ring', icon: 'https://img.icons8.com/fluency/96/diamond-ring.png' },
    { id: 'Profile card background', icon: 'https://img.icons8.com/fluency/96/wallpaper.png' },
    { id: 'Entrance Show', icon: 'https://img.icons8.com/fluency/96/red-carpet.png' },
];

export default function StoreScreen() {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Car');
    const [selectedItem, setSelectedItem] = useState(1);

    const activeItems = storeData[activeTab] || [];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0B0806" />
            
            <View style={styles.container}>
                
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <ChevronLeft color="#E6C27A" size={28} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Shop</Text>
                    <TouchableOpacity style={styles.mineBtn}>
                        <Image source={{ uri: 'https://img.icons8.com/fluency/48/bell.png' }} style={styles.mineIcon} />
                        <Text style={styles.mineText}>Mine</Text>
                    </TouchableOpacity>
                </View>

                {/* Main Content Area */}
                <View style={styles.contentArea}>
                    
                    {/* Left Sidebar */}
                    <View style={styles.sidebar}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sidebarScroll}>
                            {sideTabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <TouchableOpacity
                                        key={tab.id}
                                        onPress={() => setActiveTab(tab.id)}
                                        style={[
                                            styles.sideTabItem,
                                            isActive && styles.activeSideTabItem
                                        ]}
                                    >
                                        <View style={[
                                            styles.iconWrapper,
                                            isActive && styles.activeIconWrapper
                                        ]}>
                                            <Image source={{ uri: tab.icon }} style={styles.tabIcon} />
                                        </View>
                                        <Text style={[
                                            styles.tabText,
                                            isActive && styles.activeTabText
                                        ]}>
                                            {tab.id}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>

                    {/* Right Grid Area */}
                    <View style={styles.gridArea}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.gridScroll}>
                            <View style={styles.gridContainer}>
                                {activeItems.map((item) => {
                                    const isSelected = selectedItem === item.id;
                                    return (
                                        <TouchableOpacity 
                                            key={item.id} 
                                            onPress={() => setSelectedItem(item.id)}
                                            style={styles.productCardWrapper}
                                        >
                                            <View style={[
                                                styles.productCard,
                                                isSelected && styles.selectedProductCard
                                            ]}>
                                                <View style={styles.cardHeader}>
                                                    <Text style={styles.durationText}>{item.duration}</Text>
                                                    <View style={styles.playIconWrapper}>
                                                        <Play fill="#E6C27A" color="#E6C27A" size={8} />
                                                    </View>
                                                </View>
                                                
                                                <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="contain" />
                                                
                                                <LinearGradient 
                                                    colors={isSelected ? ['#2B2015', '#15110E'] : ['#15110E', '#0B0806']} 
                                                    style={[
                                                        styles.priceBar,
                                                        isSelected && styles.selectedPriceBar
                                                    ]}
                                                >
                                                    <Image source={{ uri: 'https://img.icons8.com/fluency/48/coin.png' }} style={styles.coinIconSmall} />
                                                    <Text style={[
                                                        styles.priceText,
                                                        isSelected && styles.selectedPriceText
                                                    ]}>{item.price}</Text>
                                                </LinearGradient>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>

                </View>

                {/* Bottom Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.balanceContainer}>
                        <Image source={{ uri: 'https://img.icons8.com/fluency/48/coin.png' }} style={styles.coinIconLarge} />
                        <Text style={styles.balanceText}>38638</Text>
                        <ChevronRight color="#E6C27A" size={16} />
                    </TouchableOpacity>
                    
                    <View style={styles.actionBtnsRow}>
                        <TouchableOpacity style={styles.sendBtn}>
                            <LinearGradient colors={['#3F2E23', '#2A2015']} style={styles.sendBtnGradient}>
                                <Text style={styles.sendBtnText}>Send</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.purchaseBtn}>
                            <LinearGradient colors={['#E6C27A', '#D4AF37']} style={styles.purchaseBtnGradient}>
                                <Text style={styles.purchaseBtnText}>purchase</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

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
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 10,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#1A1410',
    },
    backBtn: {
        width: 40,
        justifyContent: 'center',
    },
    headerTitle: {
        color: '#E6C27A',
        fontSize: 18,
        fontWeight: 'bold',
    },
    mineBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(230, 194, 122, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(230, 194, 122, 0.3)',
    },
    mineIcon: {
        width: 14,
        height: 14,
        marginRight: 6,
    },
    mineText: {
        color: '#E6C27A',
        fontSize: 12,
        fontWeight: 'bold',
    },
    contentArea: {
        flex: 1,
        flexDirection: 'row',
    },
    sidebar: {
        width: 85,
        backgroundColor: '#15110E',
        borderRightWidth: 1,
        borderRightColor: '#1A1410',
    },
    sidebarScroll: {
        paddingVertical: 10,
    },
    sideTabItem: {
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 5,
        marginBottom: 8,
    },
    activeSideTabItem: {
        backgroundColor: '#1F1610',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        borderRightWidth: 2,
        borderRightColor: '#D4AF37',
    },
    iconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A2015',
        marginBottom: 6,
    },
    activeIconWrapper: {
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderColor: '#E6C27A',
        borderWidth: 2,
    },
    tabIcon: {
        width: 32,
        height: 32,
    },
    tabText: {
        color: '#8B7A6A',
        fontSize: 10,
        fontWeight: '600',
        textAlign: 'center',
    },
    activeTabText: {
        color: '#E6C27A',
        fontWeight: 'bold',
    },
    gridArea: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 16,
    },
    gridScroll: {
        paddingTop: 10,
        paddingBottom: 20,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    productCardWrapper: {
        width: '48%',
        marginBottom: 12,
    },
    productCard: {
        backgroundColor: '#120E0B',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#2A2015',
    },
    selectedProductCard: {
        borderColor: '#E6C27A',
        borderWidth: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingTop: 8,
    },
    durationText: {
        color: '#A08B7D',
        fontSize: 10,
    },
    playIconWrapper: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: 'rgba(230, 194, 122, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    productImage: {
        width: '100%',
        height: 70,
        marginVertical: 10,
    },
    priceBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#1A1410',
    },
    selectedPriceBar: {
        borderTopColor: 'transparent',
    },
    coinIconSmall: {
        width: 14,
        height: 14,
        marginRight: 6,
    },
    priceText: {
        color: '#A08B7D',
        fontSize: 13,
        fontWeight: 'bold',
    },
    selectedPriceText: {
        color: '#E6C27A',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#15110E',
        borderTopWidth: 1,
        borderTopColor: '#2A2015',
        paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    },
    balanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    coinIconLarge: {
        width: 20,
        height: 20,
        marginRight: 6,
    },
    balanceText: {
        color: '#E6C27A',
        fontSize: 15,
        fontWeight: 'bold',
        marginRight: 4,
    },
    actionBtnsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    sendBtn: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E6C27A',
    },
    sendBtnGradient: {
        paddingHorizontal: 18,
        paddingVertical: 8,
    },
    sendBtnText: {
        color: '#E6C27A',
        fontSize: 13,
        fontWeight: 'bold',
    },
    purchaseBtn: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    purchaseBtnGradient: {
        paddingHorizontal: 18,
        paddingVertical: 8,
    },
    purchaseBtnText: {
        color: '#000',
        fontSize: 13,
        fontWeight: 'bold',
    }
});
