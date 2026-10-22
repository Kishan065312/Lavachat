import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Platform, StatusBar, Alert } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const socialPlatforms = [
    { name: 'Facebook', handle: '@Taka Globals', icon: 'https://img.icons8.com/color/96/facebook-new.png' },
    { name: 'LinkedIn', handle: '@Taka Globals', icon: 'https://img.icons8.com/color/96/linkedin.png' },
    { name: 'Instagram', handle: '@Taka Globals', icon: 'https://img.icons8.com/color/96/instagram-new.png' },
    { name: 'YouTube', handle: '@Takaofficial', icon: 'https://img.icons8.com/color/96/youtube-play.png' }
];

export default function FollowUsScreen() {
    const navigation = useNavigation();

    const handleFollow = (platform) => {
        Alert.alert('Follow Requested', `Opening ${platform} profile...`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0B0806" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <ChevronLeft color="#E6C27A" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Follow Us</Text>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Main Branding Card */}
                <LinearGradient
                    colors={['rgba(230, 194, 122, 0.12)', 'rgba(11, 8, 6, 0.95)']}
                    style={styles.brandingCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                >
                    <Image
                        source={{ uri: 'https://img.icons8.com/color/256/peacock.png' }}
                        style={styles.peacockLogo}
                        resizeMode="contain"
                    />

                    {/* Sparkle decors */}
                    <Text style={styles.sparkle1}>✦</Text>
                    <Text style={styles.sparkle2}>✦</Text>
                    <Text style={styles.sparkle3}>✦</Text>

                    <Text style={styles.mainTitle}>Follow AUCHO Official</Text>
                    <Text style={styles.mainDesc}>
                        Help you make money quickly, get the latest official news here, and receive multiple benefits
                    </Text>
                </LinearGradient>

                {/* Social Card List */}
                <View style={styles.socialListContainer}>
                    {socialPlatforms.map((platform, idx) => (
                        <View key={idx} style={styles.socialRowCard}>
                            <View style={styles.socialLeft}>
                                <Image source={{ uri: platform.icon }} style={styles.socialIcon} />
                                <View style={styles.socialText}>
                                    <Text style={styles.platformName}>{platform.name}</Text>
                                    <Text style={styles.platformHandle}>{platform.handle}</Text>
                                </View>
                            </View>

                            <TouchableOpacity onPress={() => handleFollow(platform.name)} style={styles.followBtn}>
                                <LinearGradient
                                    colors={['#e6c27a', '#c29e57']}
                                    style={styles.followGradient}
                                >
                                    <Text style={styles.followBtnText}>Follow ↗</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    ))}
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
    brandingCard: {
        alignItems: 'center',
        borderRadius: 24,
        borderWidth: 1.2,
        borderColor: 'rgba(230, 194, 122, 0.25)',
        paddingVertical: 35,
        paddingHorizontal: 20,
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 20,
    },
    peacockLogo: {
        width: 100,
        height: 100,
        marginBottom: 16,
    },
    sparkle1: {
        position: 'absolute',
        top: 40,
        left: 55,
        color: '#E6C27A',
        fontSize: 18,
        opacity: 0.8,
    },
    sparkle2: {
        position: 'absolute',
        top: 90,
        left: 30,
        color: '#E6C27A',
        fontSize: 15,
        opacity: 0.6,
    },
    sparkle3: {
        position: 'absolute',
        top: 100,
        right: 45,
        color: '#E6C27A',
        fontSize: 18,
        opacity: 0.7,
    },
    mainTitle: {
        color: '#E6C27A',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    mainDesc: {
        color: '#A08B7D',
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
        paddingHorizontal: 10,
    },
    socialListContainer: {
        backgroundColor: '#120E0B',
        borderRadius: 24,
        borderWidth: 1.2,
        borderColor: 'rgba(230, 194, 122, 0.15)',
        padding: 16,
        gap: 12,
    },
    socialRowCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1A130F',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(230, 194, 122, 0.08)',
    },
    socialLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    socialIcon: {
        width: 36,
        height: 36,
    },
    socialText: {
        marginLeft: 12,
    },
    platformName: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    platformHandle: {
        color: '#8B7A6A',
        fontSize: 11,
        marginTop: 2,
    },
    followBtn: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    followGradient: {
        paddingHorizontal: 16,
        paddingVertical: 7,
        justifyContent: 'center',
        alignItems: 'center',
    },
    followBtnText: {
        color: '#4a2c11',
        fontSize: 11.5,
        fontWeight: 'bold',
    },
});
