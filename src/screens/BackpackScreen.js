import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Dimensions, Platform, StatusBar } from 'react-native';
import { ChevronLeft, Play } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Dummy data for backpack
const backpackData = {
    'Car': [
        { id: 1, name: 'Submarine Car', status: 'Expired', actionText: 'cannot be renewed', image: 'https://img.icons8.com/color/256/submarine.png' },
        { id: 2, name: 'Pink Racer', status: 'Expired', actionText: 'cannot be renewed', image: 'https://img.icons8.com/color/256/f1-car.png' },
        { id: 3, name: 'Gold Lambo', status: 'Expired', actionText: 'cannot be renewed', image: 'https://img.icons8.com/color/256/sports-car.png' },
    ],
    'Profile photo frame': [
        { id: 11, name: 'Gold Frame', status: 'Expired', actionText: 'cannot be renewed', image: 'https://img.icons8.com/color/256/picture-frame.png' },
    ],
    'Ring': [
        { id: 21, name: 'Diamond Ring', status: 'Expired', actionText: 'cannot be renewed', image: 'https://img.icons8.com/color/256/diamond-ring.png' },
    ],
    'Profile card background': [
        { id: 31, name: 'Galaxy BG', status: 'Expired', actionText: 'cannot be renewed', image: 'https://img.icons8.com/color/256/galaxy.png' },
    ],
    'Entrance Show': [
        { id: 41, name: 'Dragon Entry', status: 'Expired', actionText: 'cannot be renewed', image: 'https://img.icons8.com/color/256/dragon.png' },
    ],
    'Event Title': [],
    'Bubble': [
        { id: 61, name: 'Gold Bubble', status: 'Expired', actionText: 'cannot be renewed', image: 'https://img.icons8.com/color/256/speech-bubble-with-dots.png' },
    ]
};

const sideTabs = [
    { id: 'Car', icon: 'https://img.icons8.com/fluency/96/car.png' },
    { id: 'Profile photo frame', icon: 'https://img.icons8.com/fluency/96/picture-frame.png' },
    { id: 'Ring', icon: 'https://img.icons8.com/fluency/96/diamond-ring.png' },
    { id: 'Profile card background', icon: 'https://img.icons8.com/fluency/96/wallpaper.png' },
    { id: 'Entrance Show', icon: 'https://img.icons8.com/fluency/96/red-carpet.png' },
    { id: 'Event Title', icon: 'https://img.icons8.com/fluency/96/event-accepted.png' },
    { id: 'Bubble', icon: 'https://img.icons8.com/fluency/96/speech-bubble.png' },
];

export default function BackpackScreen() {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Car');

    const activeItems = backpackData[activeTab] || [];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0B0806" />
            
            <View style={styles.container}>
                
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <ChevronLeft color="#E6C27A" size={28} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My backpack</Text>
                    {/* Empty view for spacing to keep title centered */}
                    <View style={styles.emptyHeaderRight} />
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
                                    return (
                                        <View key={item.id} style={styles.productCardWrapper}>
                                            <View style={styles.productCard}>
                                                <View style={styles.cardHeader}>
                                                    <Text style={styles.statusText}>{item.status}</Text>
                                                    <View style={styles.playIconWrapper}>
                                                        <Play fill="#A08B7D" color="#A08B7D" size={8} />
                                                    </View>
                                                </View>
                                                
                                                <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="contain" />
                                                
                                                <View style={styles.actionBar}>
                                                    <Text style={styles.actionText}>{item.actionText}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })}
                                {activeItems.length === 0 && (
                                    <View style={styles.emptyStateContainer}>
                                        <Text style={styles.emptyStateText}>No items found</Text>
                                    </View>
                                )}
                            </View>
                        </ScrollView>
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
        textAlign: 'center',
    },
    emptyHeaderRight: {
        width: 40,
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
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    statusText: {
        color: '#A08B7D',
        fontSize: 11,
        fontWeight: '500',
    },
    playIconWrapper: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    productImage: {
        width: '100%',
        height: 70,
        marginVertical: 12,
    },
    actionBar: {
        backgroundColor: '#1A1410',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#2A2015',
    },
    actionText: {
        color: '#8B7A6A',
        fontSize: 11,
        fontWeight: '600',
    },
    emptyStateContainer: {
        flex: 1,
        paddingTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    emptyStateText: {
        color: '#8B7A6A',
        fontSize: 14,
    }
});
