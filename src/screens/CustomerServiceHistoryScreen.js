import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import { ChevronLeft, Inbox, ChevronDown } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function CustomerServiceHistoryScreen() {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Feedback');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0B0806" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <ChevronLeft color="#E6C27A" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>History</Text>
                <View style={{ width: 36 }} />
            </View>

            {/* Sub-Tabs: Feedback / Report */}
            <View style={styles.subTabsRow}>
                <TouchableOpacity 
                    onPress={() => setActiveTab('Feedback')} 
                    style={[styles.subTab, activeTab === 'Feedback' && styles.activeSubTab]}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.subTabText, activeTab === 'Feedback' && styles.activeSubTabText]}>
                        Feedback
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => setActiveTab('Report')} 
                    style={[styles.subTab, activeTab === 'Report' && styles.activeSubTab]}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.subTabText, activeTab === 'Report' && styles.activeSubTabText]}>
                        Report
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Dropdown Filter Row */}
            <View style={styles.filterRow}>
                <TouchableOpacity style={styles.dropdownBadge} activeOpacity={0.7}>
                    <Text style={styles.dropdownText}>All</Text>
                    <ChevronDown color="#E6C27A" size={13} />
                </TouchableOpacity>
            </View>

            {/* Empty State Content */}
            <ScrollView contentContainerStyle={styles.emptyStateContainer} bounces={false}>
                <View style={styles.illustrationWrapper}>
                    <Inbox color="#E6C27A" size={60} strokeWidth={1} style={styles.emptyIcon} />
                    <View style={styles.emptyGlow} />
                </View>
                <Text style={styles.emptyText}>No Data</Text>
            </ScrollView>
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
    headerTitle: {
        color: '#E6C27A',
        fontSize: 16,
        fontWeight: 'bold',
    },
    subTabsRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#221811',
    },
    subTab: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        position: 'relative',
    },
    activeSubTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#E6C27A',
    },
    subTabText: {
        color: '#8B7A6A',
        fontSize: 14,
        fontWeight: 'bold',
    },
    activeSubTabText: {
        color: '#E6C27A',
    },
    filterRow: {
        paddingHorizontal: 16,
        paddingTop: 12,
        alignItems: 'flex-start',
    },
    dropdownBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#120E0B',
        borderWidth: 1.2,
        borderColor: 'rgba(230, 194, 122, 0.15)',
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 6,
        gap: 4,
    },
    dropdownText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 60,
    },
    illustrationWrapper: {
        position: 'relative',
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyIcon: {
        zIndex: 2,
    },
    emptyGlow: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(230, 194, 122, 0.03)',
        borderWidth: 1.5,
        borderColor: 'rgba(230, 194, 122, 0.08)',
        zIndex: 1,
    },
    emptyText: {
        color: '#8B7A6A',
        fontSize: 13.5,
        fontWeight: 'bold',
    },
});
