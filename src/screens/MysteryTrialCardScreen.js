import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Alert, Platform } from 'react-native';
import { ChevronLeft, Clock, Gift } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function MysteryTrialCardScreen() {
    const navigation = useNavigation();

    const showHistoryAlert = () => {
        Alert.alert(
            "Usage History",
            "You have no expired or used mystery trial cards in your history.",
            [{ text: "OK" }]
        );
    };

    const showHowToGetAlert = () => {
        Alert.alert(
            "How to Get Trial Cards",
            "Mystery privilege trial cards can be obtained by participating in official Lavachat events, SVIP reward drops, or guild competitions.",
            [
                { 
                    text: "View Details", 
                    onPress: () => navigation.navigate('MysteryDescriptionScreen') 
                },
                { 
                    text: "Close", 
                    style: "cancel" 
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
                    <ChevronLeft color="#E6C27A" size={28} />
                </TouchableOpacity>
                
                <Text style={styles.headerTitle}>Mystery trial card</Text>
                
                <TouchableOpacity onPress={showHistoryAlert} style={styles.headerBtn}>
                    <Clock color="#E6C27A" size={22} />
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                {/* Visual Empty State Box Graphic */}
                <View style={styles.illustrationContainer}>
                    <LinearGradient
                        colors={['rgba(123, 44, 191, 0.15)', 'rgba(0, 0, 0, 0)']}
                        style={styles.glowRing}
                    />
                    
                    {/* Popper Box Representation */}
                    <View style={styles.boxPopperWrapper}>
                        {/* Lid angled */}
                        <View style={styles.boxLid} />
                        {/* Main Box body */}
                        <LinearGradient
                            colors={['#00C896', '#0F8F6F']}
                            style={styles.boxBody}
                        >
                            <Gift color="#FFF" size={24} />
                        </LinearGradient>
                        {/* Little sparkles/dots */}
                        <View style={[styles.sparkle, { top: -20, left: -20 }]} />
                        <View style={[styles.sparkle, { top: -30, right: -10 }]} />
                        <View style={[styles.sparkle, { bottom: 10, left: -30 }]} />
                    </View>
                    
                    <Text style={styles.emptyStateText}>No trial card yet</Text>
                    <Text style={styles.emptyStateSubtext}>Participate in active room events to unlock premium mystery cards!</Text>
                </View>

                {/* Interactive Action Button */}
                <TouchableOpacity onPress={showHowToGetAlert} style={styles.howToGetBtn}>
                    <LinearGradient
                        colors={['#E6C27A', '#D4AF37']}
                        style={styles.howToGetBtnGradient}
                    >
                        <Text style={styles.howToGetBtnText}>How to get trial card</Text>
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
        borderBottomWidth: 1,
        borderColor: '#1A1410',
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
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingBottom: 80,
    },
    illustrationContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: 35,
        width: '100%',
    },
    glowRing: {
        position: 'absolute',
        width: 220,
        height: 220,
        borderRadius: 110,
        top: -60,
    },
    boxPopperWrapper: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'relative',
        marginBottom: 20,
    },
    boxBody: {
        width: 80,
        height: 60,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#00E676',
    },
    boxLid: {
        width: 90,
        height: 14,
        backgroundColor: '#00E676',
        borderRadius: 4,
        position: 'absolute',
        top: 15,
        transform: [{ rotate: '-12deg' }],
        zIndex: 5,
        borderWidth: 1,
        borderColor: '#FFF',
    },
    sparkle: {
        position: 'absolute',
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#D4AF37',
    },
    emptyStateText: {
        color: '#E6C27A',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    emptyStateSubtext: {
        color: '#8B7A6A',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 18,
        paddingHorizontal: 20,
    },
    howToGetBtn: {
        width: '80%',
        borderRadius: 22,
        overflow: 'hidden',
    },
    howToGetBtnGradient: {
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    howToGetBtnText: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
