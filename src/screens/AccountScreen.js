import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Platform, StatusBar, Switch, Alert } from 'react-native';
import { ChevronLeft, Copy, ShieldAlert, Download } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

export default function AccountScreen() {
    const navigation = useNavigation();
    const [isPasswordLogin, setIsPasswordLogin] = useState(true);

    const handleCopy = (label, value) => {
        Alert.alert('Copied', `${label} copied to clipboard!`);
    };

    const handleSave = () => {
        Alert.alert('Success', 'Account details saved to album!');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0B0806" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <ChevronLeft color="#E6C27A" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Account</Text>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Account Information Card */}
                <View style={styles.infoCard}>
                    <View style={styles.cardHeaderRow}>
                        <View style={styles.logoTitleWrapper}>
                            <Image
                                source={{ uri: 'https://img.icons8.com/color/96/peacock.png' }}
                                style={styles.appLogo}
                            />
                            <Text style={styles.appTitle}>AUCHO</Text>
                        </View>
                        <Image
                            source={{ uri: 'https://img.icons8.com/color/256/circled-user-male-skin-type-6.png' }}
                            style={styles.avatar}
                        />
                    </View>

                    <Text style={styles.sectionTitle}>Account information</Text>

                    {/* Account ID Row */}
                    <View style={styles.infoRow}>
                        <View>
                            <Text style={styles.infoLabel}>Account ID</Text>
                            <Text style={styles.infoValue}>596042783</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleCopy('Account ID', '596042783')} style={styles.copyBtn}>
                            <Copy color="#E6C27A" size={16} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />

                    {/* Password Row */}
                    <View style={styles.infoRow}>
                        <View>
                            <Text style={styles.infoLabel}>Password</Text>
                            <Text style={styles.infoValue}>Y2Xjbib542</Text>
                            <TouchableOpacity style={styles.linkWrapper}>
                                <Text style={styles.linkText}>Update Password &gt;</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => handleCopy('Password', 'Y2Xjbib542')} style={styles.copyBtn}>
                            <Copy color="#E6C27A" size={16} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />

                    {/* Phone Number Row */}
                    <View style={styles.infoRow}>
                        <View>
                            <Text style={styles.infoLabel}>Phone number</Text>
                            <TouchableOpacity style={styles.linkWrapper}>
                                <Text style={styles.linkText}>Link Phone number &gt;</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Google Row */}
                    <View style={styles.infoRow}>
                        <View>
                            <Text style={styles.infoLabel}>Google</Text>
                            <Text style={styles.infoValue}>venompatel1999@gmail.com</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleCopy('Google email', 'venompatel1999@gmail.com')} style={styles.copyBtn}>
                            <Copy color="#E6C27A" size={16} />
                        </TouchableOpacity>
                    </View>

                    {/* Warning text */}
                    <View style={styles.warningRow}>
                        <ShieldAlert color="#EF4444" size={14} />
                        <Text style={styles.warningText}>Don't share this password with anyone</Text>
                    </View>

                    {/* Save to album button */}
                    <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                        <LinearGradient
                            colors={['#2B1C13', '#15100B']}
                            style={styles.saveGradient}
                        >
                            <Download color="#E6C27A" size={16} style={{ marginRight: 6 }} />
                            <Text style={styles.saveBtnText}>Save to album</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Account Security Card */}
                <View style={styles.securityCard}>
                    <Text style={styles.securityTitle}>Account Security</Text>

                    <View style={styles.securityRow}>
                        <Text style={styles.securityLabel}>Log in with Password</Text>
                        <Switch
                            value={isPasswordLogin}
                            onValueChange={setIsPasswordLogin}
                            trackColor={{ false: '#36291E', true: '#E6C27A' }}
                            thumbColor={isPasswordLogin ? '#FFF' : '#A08B7D'}
                        />
                    </View>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.securityRow}>
                        <Text style={styles.securityLabel}>Security Password</Text>
                        <Text style={styles.securityValue}>Not set &gt;</Text>
                    </TouchableOpacity>
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
    infoCard: {
        backgroundColor: '#120E0B',
        borderRadius: 18,
        borderWidth: 1.2,
        borderColor: 'rgba(230, 194, 122, 0.15)',
        padding: 16,
        marginBottom: 20,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    logoTitleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    appLogo: {
        width: 28,
        height: 28,
        marginRight: 8,
    },
    appTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1.5,
        borderColor: '#E6C27A',
    },
    sectionTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    infoLabel: {
        color: '#8B7A6A',
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 4,
    },
    infoValue: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    copyBtn: {
        padding: 6,
        backgroundColor: 'rgba(230, 194, 122, 0.05)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(230, 194, 122, 0.1)',
    },
    linkWrapper: {
        marginTop: 4,
    },
    linkText: {
        color: '#E6C27A',
        fontSize: 11,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#221811',
        marginVertical: 6,
    },
    warningRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.06)',
        borderRadius: 8,
        padding: 8,
        marginTop: 16,
        gap: 6,
    },
    warningText: {
        color: '#F87171',
        fontSize: 11,
        fontWeight: '500',
    },
    saveBtn: {
        marginTop: 16,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1.2,
        borderColor: 'rgba(230, 194, 122, 0.25)',
    },
    saveGradient: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
    },
    saveBtnText: {
        color: '#E6C27A',
        fontSize: 13,
        fontWeight: 'bold',
    },
    securityCard: {
        backgroundColor: '#120E0B',
        borderRadius: 18,
        borderWidth: 1.2,
        borderColor: 'rgba(230, 194, 122, 0.15)',
        padding: 16,
    },
    securityTitle: {
        color: '#8B7A6A',
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    securityRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    securityLabel: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    securityValue: {
        color: '#8B7A6A',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
