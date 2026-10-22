import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, StatusBar, Switch } from 'react-native';
import { ChevronLeft, HelpCircle, Briefcase, Info } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function MysteryScreen() {
    const navigation = useNavigation();
    const [isMysteryActive, setIsMysteryActive] = useState(false);

    const toggleMysteryMode = () => {
        setIsMysteryActive(previousState => !previousState);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0B0806" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <ChevronLeft color="#E6C27A" size={28} />
                </TouchableOpacity>
                
                <Text style={styles.headerTitle}>Mystery privilege</Text>
                
                <View style={styles.headerRightContainer}>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('MysteryDescriptionScreen')} 
                        style={styles.headerBtn}
                    >
                        <HelpCircle color="#E6C27A" size={22} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('MysteryTrialCardScreen')} 
                        style={styles.headerBtn}
                    >
                        <Briefcase color="#E6C27A" size={22} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Banner Area */}
                <LinearGradient
                    colors={['#2B123D', '#130A21']}
                    style={styles.bannerContainer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.bannerLeft}>
                        <Text style={styles.bannerTitle}>Exclusive mystery image, hide your real ID</Text>
                        <Text style={styles.bannerSubtitle}>Enable the suit to go completely anonymous inside the rooms.</Text>
                    </View>
                    <View style={styles.bannerRight}>
                        <Image
                            source={{ uri: 'https://img.icons8.com/color/256/spy.png' }}
                            style={styles.bannerImage}
                        />
                    </View>
                </LinearGradient>

                {/* Switch ID Quick Controller */}
                <View style={styles.controlCard}>
                    <View style={styles.controlInfoCol}>
                        <Text style={styles.controlTitle}>Anonymous Identity Mode</Text>
                        <Text style={styles.controlDesc}>
                            {isMysteryActive ? 'Your real ID is hidden inside rooms.' : 'Activate to mask your profile.'}
                        </Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#2A2015', true: '#E6C27A' }}
                        thumbColor={isMysteryActive ? '#D4AF37' : '#8B7A6A'}
                        ios_backgroundColor="#2A2015"
                        onValueChange={toggleMysteryMode}
                        value={isMysteryActive}
                    />
                </View>

                {/* Section Header: Mystery Suit */}
                <View style={styles.sectionHeaderWrapper}>
                    <View style={styles.sectionLine} />
                    <LinearGradient
                        colors={['#2B123D', '#1E0E2C']}
                        style={styles.sectionTitleBadge}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.sectionTitleText}>Mystery Suit</Text>
                    </LinearGradient>
                    <View style={styles.sectionLine} />
                </View>

                {/* Feature 1: Mystery ID */}
                <View style={styles.featureCard}>
                    <View style={styles.featureLeft}>
                        <View style={styles.avatarWrapper}>
                            <View style={styles.avatarInner}>
                                <Image
                                    source={{ uri: 'https://img.icons8.com/color/256/spy.png' }}
                                    style={styles.featureAvatarImage}
                                />
                            </View>
                            <View style={styles.avatarLabelBadge}>
                                <Text style={styles.avatarLabelBadgeText}>Mystery</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.featureRight}>
                        <Text style={styles.featureTitle}>Mystery ID</Text>
                        <Text style={styles.featureDesc}>Mystery user exclusive avatar and nickname inside active rooms.</Text>
                    </View>
                </View>

                {/* Feature 2: Exclusive entry effects */}
                <View style={styles.featureCard}>
                    <View style={styles.featureRight}>
                        <Text style={styles.featureTitle}>Exclusive entry effects</Text>
                        <Text style={styles.featureDesc}>Mysterious and cool flying screen and premium room mounts.</Text>
                    </View>
                    <View style={styles.featureLeft}>
                        <Image
                            source={{ uri: 'https://img.icons8.com/color/256/sports-car.png' }}
                            style={styles.featureCarImage}
                        />
                    </View>
                </View>

                {/* Feature 3: Exclusive dynamic avatar headwear */}
                <View style={styles.featureCard}>
                    <View style={styles.featureLeft}>
                        <View style={styles.avatarWrapper}>
                            <View style={styles.avatarInner}>
                                <Image
                                    source={{ uri: 'https://img.icons8.com/color/256/spy.png' }}
                                    style={styles.featureAvatarImage}
                                />
                            </View>
                            {/* Gold Wreath Overlay */}
                            <Image
                                source={{ uri: 'https://img.icons8.com/color/256/wreath.png' }}
                                style={styles.wreathOverlayImage}
                            />
                        </View>
                    </View>
                    <View style={styles.featureRight}>
                        <Text style={styles.featureTitle}>Exclusive dynamic headwear</Text>
                        <Text style={styles.featureDesc}>The exclusive dynamic avatar headwear wreath for the mystery user.</Text>
                    </View>
                </View>

                {/* Feature 4: Mystery logo */}
                <View style={styles.featureCard}>
                    <View style={styles.featureRight}>
                        <Text style={styles.featureTitle}>Mystery logo</Text>
                        <Text style={styles.featureDesc}>Exclusive gold and purple mystery identification tag displayed on your profile.</Text>
                    </View>
                    <View style={styles.featureLeft}>
                        <Image
                            source={{ uri: 'https://img.icons8.com/color/256/shield.png' }}
                            style={styles.featureBadgeImage}
                        />
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Button */}
            <View style={styles.footerContainer}>
                <TouchableOpacity onPress={toggleMysteryMode} style={styles.actionBtn}>
                    <LinearGradient
                        colors={isMysteryActive ? ['#8B7A6A', '#2A2015'] : ['#E6C27A', '#D4AF37']}
                        style={styles.actionBtnGradient}
                    >
                        <Text style={[styles.actionBtnText, isMysteryActive && { color: '#E6C27A' }]}>
                            {isMysteryActive ? 'Disable Mystery ID' : 'Activate Mystery ID'}
                        </Text>
                    </LinearGradient>
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
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 10,
        paddingBottom: 15,
        backgroundColor: '#0B0806',
    },
    headerBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#E6C27A',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
        marginLeft: 40, // offset right icons
    },
    headerRightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 120,
    },
    bannerContainer: {
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3D1C5C',
        marginBottom: 15,
        shadowColor: '#7B2CBF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    bannerLeft: {
        flex: 1.3,
        paddingRight: 10,
    },
    bannerRight: {
        flex: 0.7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 24,
        marginBottom: 8,
    },
    bannerSubtitle: {
        color: '#B299D1',
        fontSize: 11,
        lineHeight: 16,
    },
    bannerImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    controlCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#15110E',
        marginHorizontal: 16,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#2A2015',
        marginBottom: 20,
    },
    controlInfoCol: {
        flex: 1,
        paddingRight: 10,
    },
    controlTitle: {
        color: '#E6C27A',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    controlDesc: {
        color: '#8B7A6A',
        fontSize: 11,
    },
    sectionHeaderWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 24,
        marginBottom: 20,
    },
    sectionLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#D4AF37',
        opacity: 0.2,
    },
    sectionTitleBadge: {
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#D4AF37',
        marginHorizontal: 12,
    },
    sectionTitleText: {
        color: '#E6C27A',
        fontWeight: 'bold',
        fontSize: 13,
        textTransform: 'uppercase',
    },
    featureCard: {
        backgroundColor: '#15110E',
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#2A2015',
        flexDirection: 'row',
        alignItems: 'center',
    },
    featureLeft: {
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureRight: {
        flex: 1,
        paddingHorizontal: 12,
    },
    avatarWrapper: {
        width: 66,
        height: 66,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInner: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#2A1A3A',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#7B2CBF',
    },
    featureAvatarImage: {
        width: 38,
        height: 38,
        resizeMode: 'contain',
    },
    avatarLabelBadge: {
        position: 'absolute',
        bottom: -2,
        backgroundColor: '#7B2CBF',
        borderRadius: 8,
        paddingHorizontal: 6,
        paddingVertical: 1.5,
        borderWidth: 1,
        borderColor: '#FFF',
    },
    avatarLabelBadgeText: {
        color: '#FFF',
        fontSize: 8,
        fontWeight: 'bold',
    },
    wreathOverlayImage: {
        position: 'absolute',
        width: 68,
        height: 68,
        top: -1,
        left: -1,
        resizeMode: 'contain',
        zIndex: 5,
    },
    featureCarImage: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
    },
    featureBadgeImage: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
    featureTitle: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    featureDesc: {
        color: '#A08B7D',
        fontSize: 11,
        lineHeight: 16,
    },
    footerContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        paddingHorizontal: 30,
        alignItems: 'center',
    },
    actionBtn: {
        width: '100%',
        borderRadius: 25,
        overflow: 'hidden',
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    actionBtnGradient: {
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionBtnText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
