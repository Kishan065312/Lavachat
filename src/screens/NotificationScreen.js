import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar, Switch } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function NotificationScreen() {
    const navigation = useNavigation();
    const [winningNotify, setWinningNotify] = useState(false);
    const [giftNotify, setGiftNotify] = useState(false);
    const [systemRec, setSystemRec] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0B0806" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <ChevronLeft color="#E6C27A" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notification</Text>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    {/* Winning Notification Row */}
                    <View style={styles.row}>
                        <Text style={styles.label}>Winning Notification</Text>
                        <Switch
                            value={winningNotify}
                            onValueChange={setWinningNotify}
                            trackColor={{ false: '#36291E', true: '#E6C27A' }}
                            thumbColor={winningNotify ? '#FFF' : '#A08B7D'}
                        />
                    </View>

                    <View style={styles.divider} />

                    {/* Gift Notification Row */}
                    <View style={styles.row}>
                        <Text style={styles.label}>Gift Notification</Text>
                        <Switch
                            value={giftNotify}
                            onValueChange={setGiftNotify}
                            trackColor={{ false: '#36291E', true: '#E6C27A' }}
                            thumbColor={giftNotify ? '#FFF' : '#A08B7D'}
                        />
                    </View>

                    <View style={styles.divider} />

                    {/* System Recommendation Row */}
                    <View style={styles.columnRow}>
                        <View style={styles.columnLeft}>
                            <Text style={styles.label}>System Recommendation</Text>
                            <Text style={styles.description}>
                                After turning it on, you will receive system recommendation messages
                            </Text>
                        </View>
                        <Switch
                            value={systemRec}
                            onValueChange={setSystemRec}
                            trackColor={{ false: '#36291E', true: '#E6C27A' }}
                            thumbColor={systemRec ? '#FFF' : '#A08B7D'}
                        />
                    </View>
                </View>
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
    },
    card: {
        backgroundColor: '#120E0B',
        borderRadius: 18,
        borderWidth: 1.2,
        borderColor: 'rgba(230, 194, 122, 0.15)',
        paddingHorizontal: 16,
        paddingVertical: 4,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    columnRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 16,
    },
    columnLeft: {
        flex: 1,
        paddingRight: 16,
    },
    label: {
        color: '#FFF',
        fontSize: 14.5,
        fontWeight: 'bold',
    },
    description: {
        color: '#8B7A6A',
        fontSize: 11,
        lineHeight: 16,
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#221811',
    },
});
