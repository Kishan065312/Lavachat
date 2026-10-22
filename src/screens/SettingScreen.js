import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar, Alert } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function SettingScreen() {
    const navigation = useNavigation();

    const handleOptionPress = (optionName) => {
        if (optionName === 'App Language') {
            navigation.navigate('AppLanguageScreen');
        } else if (optionName === 'Notification') {
            navigation.navigate('NotificationScreen');
        } else if (optionName === 'Resource Download') {
            navigation.navigate('ResourceDownloadScreen');
        } else if (optionName === 'Delete Account') {
            navigation.navigate('DeleteAccountScreen');
        } else if (optionName === 'About') {
            navigation.navigate('AboutScreen');
        } else {
            Alert.alert('Option Pressed', `Navigating to ${optionName}...`);
        }
    };

    const handleLogOut = () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Log Out', 
                    style: 'destructive',
                    onPress: () => {
                        // In a real app we'd dispatch log out action
                        navigation.navigate('Login');
                    } 
                }
            ]
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
                <Text style={styles.headerTitle}>Setting</Text>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Options List 1 */}
                <View style={styles.optionsCard}>
                    <TouchableOpacity onPress={() => handleOptionPress('App Language')} style={styles.optionRow}>
                        <Text style={styles.optionLabel}>App Language</Text>
                        <View style={styles.rightValueWrapper}>
                            <Text style={styles.optionValue}>English</Text>
                            <ChevronRight color="#8B7A6A" size={16} />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity onPress={() => handleOptionPress('Notification')} style={styles.optionRow}>
                        <Text style={styles.optionLabel}>Notification</Text>
                        <ChevronRight color="#8B7A6A" size={16} />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity onPress={() => handleOptionPress('Resource Download')} style={styles.optionRow}>
                        <Text style={styles.optionLabel}>Resource Download</Text>
                        <ChevronRight color="#8B7A6A" size={16} />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity onPress={() => handleOptionPress('Delete Account')} style={styles.optionRow}>
                        <Text style={styles.optionLabel}>Delete Account</Text>
                        <ChevronRight color="#8B7A6A" size={16} />
                    </TouchableOpacity>
                </View>

                {/* Options List 2 */}
                <View style={styles.optionsCard}>
                    <View style={styles.optionRowNonTouchable}>
                        <Text style={styles.optionLabel}>Current Version</Text>
                        <Text style={styles.optionValueMuted}>V 1.2.7</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.optionRowNonTouchable}>
                        <Text style={styles.optionLabel}>Region Code</Text>
                        <Text style={styles.optionValueMuted}>1001</Text>
                    </View>

                    <View style={styles.divider} />

                    <TouchableOpacity onPress={() => handleOptionPress('About')} style={styles.optionRow}>
                        <Text style={styles.optionLabel}>About</Text>
                        <ChevronRight color="#8B7A6A" size={16} />
                    </TouchableOpacity>
                </View>

                {/* Log Out Button */}
                <TouchableOpacity onPress={handleLogOut} style={styles.logoutBtn}>
                    <Text style={styles.logoutBtnText}>Log Out</Text>
                </TouchableOpacity>
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
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 40,
        gap: 16,
    },
    optionsCard: {
        backgroundColor: '#120E0B',
        borderRadius: 18,
        borderWidth: 1.2,
        borderColor: 'rgba(230, 194, 122, 0.15)',
        paddingVertical: 4,
        paddingHorizontal: 16,
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
    },
    optionRowNonTouchable: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
    },
    optionLabel: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    rightValueWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    optionValue: {
        color: '#E6C27A',
        fontSize: 13,
        fontWeight: '600',
    },
    optionValueMuted: {
        color: '#8B7A6A',
        fontSize: 13,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#221811',
    },
    logoutBtn: {
        backgroundColor: '#120E0B',
        borderRadius: 18,
        borderWidth: 1.2,
        borderColor: 'rgba(239, 68, 68, 0.3)',
        paddingVertical: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    logoutBtnText: {
        color: '#EF4444',
        fontSize: 15,
        fontWeight: 'bold',
    },
});
