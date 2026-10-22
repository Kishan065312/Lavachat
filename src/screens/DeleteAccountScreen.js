import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar, Alert } from 'react-native';
import { ChevronLeft, ShieldAlert } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

export default function DeleteAccountScreen() {
    const navigation = useNavigation();
    const profile = useSelector((state) => state.auth.profile);
    const idDisplay = profile?.id || '596042783';

    const handleDeleteConfirm = () => {
        Alert.alert(
            'Confirm Deletion',
            'Your account deletion request has been submitted. It will be permanently deleted in 7 days.',
            [
                { 
                    text: 'OK', 
                    onPress: () => {
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
                <Text style={styles.headerTitle}>Delete Account</Text>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Warning Card */}
                <View style={styles.warningContainer}>
                    <View style={styles.warningIconWrapper}>
                        <ShieldAlert color="#EF4444" size={48} />
                    </View>

                    <Text style={styles.warningTitle}>Are you sure to delete the account?</Text>
                    <Text style={styles.warningSubtitle}>(AUCHO ID: {idDisplay})</Text>

                    {/* Disclaimer Points */}
                    <View style={styles.pointsCard}>
                        <View style={styles.pointRow}>
                            <Text style={styles.pointNumber}>1.</Text>
                            <Text style={styles.pointText}>
                                Account-related information will be deleted, and friends/followers/chat records will be deleted.
                            </Text>
                        </View>
                        <View style={styles.pointRow}>
                            <Text style={styles.pointNumber}>2.</Text>
                            <Text style={styles.pointText}>
                                Your rank level/account balance/All personal equity will be cleared.
                            </Text>
                        </View>
                        <View style={styles.pointRow}>
                            <Text style={styles.pointNumber}>3.</Text>
                            <Text style={styles.pointText}>
                                After the account is deleted, it cannot be recovered, and you can no longer log in to this account.
                            </Text>
                        </View>
                        <View style={styles.pointRow}>
                            <Text style={styles.pointNumber}>4.</Text>
                            <Text style={styles.pointText}>
                                The account deletion process takes 7 days. Within 7 days, you can apply for recovery.
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Action Buttons at bottom */}
            <View style={styles.bottomBar}>
                <TouchableOpacity 
                    onPress={handleDeleteConfirm} 
                    style={[styles.btn, styles.confirmBtn]}
                    activeOpacity={0.8}
                >
                    <Text style={styles.confirmBtnText}>Confirm</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={[styles.btn, styles.cancelBtn]}
                    activeOpacity={0.8}
                >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
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
    headerTitle: {
        color: '#E6C27A',
        fontSize: 16,
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 100,
    },
    warningContainer: {
        alignItems: 'center',
    },
    warningIconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    warningTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    warningSubtitle: {
        color: '#E6C27A',
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 6,
        textAlign: 'center',
    },
    pointsCard: {
        backgroundColor: '#120E0B',
        borderRadius: 18,
        borderWidth: 1.2,
        borderColor: 'rgba(230, 194, 122, 0.15)',
        padding: 16,
        marginTop: 25,
        width: '100%',
        gap: 16,
    },
    pointRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    pointNumber: {
        color: '#E6C27A',
        fontSize: 13,
        fontWeight: 'bold',
        marginRight: 8,
    },
    pointText: {
        color: '#A08B7D',
        fontSize: 12.5,
        lineHeight: 18,
        flex: 1,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#0B0806',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 24 : 12,
        borderTopWidth: 1,
        borderTopColor: '#221811',
        flexDirection: 'row',
        gap: 12,
    },
    btn: {
        flex: 1,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmBtn: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#EF4444',
    },
    confirmBtnText: {
        color: '#EF4444',
        fontSize: 14.5,
        fontWeight: 'bold',
    },
    cancelBtn: {
        backgroundColor: '#EF4444',
    },
    cancelBtnText: {
        color: '#FFF',
        fontSize: 14.5,
        fontWeight: 'bold',
    },
});
