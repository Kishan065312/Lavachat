import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Mic, BarChart2 } from 'lucide-react-native';
import { colors } from '../styles/globalStyles';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

export default function RoomCard({ item, onPress }) {
    return (
        <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.cardContainer}>
            {/* IMAGE BACKGROUND */}
            <Image source={item.img} style={styles.bgImage} resizeMode="cover" />

            {/* GRADIENT OVERLAY */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)', '#000']}
                style={styles.gradient}
            />

            {/* LIVE BADGE */}
            <View style={styles.liveBadge}>
                <BarChart2 size={12} color={colors.text} />
                <Text style={styles.liveText}>{item.live}</Text>
            </View>

            {/* CONTENT */}
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>

                <View style={styles.hostRow}>
                    <View style={styles.avatarContainer}>
                        <Image source={require('../assets/av1.jpg')} style={styles.avatar} />
                    </View>
                    <Text style={styles.hostName}>Host Name</Text>
                </View>
            </View>

            {/* MIC ICON (Floating) */}
            <View style={styles.micIcon}>
                <Mic size={14} color={colors.text} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        width: CARD_WIDTH,
        height: CARD_WIDTH * 1.2,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: colors.card,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
    bgImage: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%',
    },
    liveBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    liveText: {
        color: colors.text,
        fontSize: 10,
        fontWeight: '700',
    },
    content: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        right: 12,
    },
    title: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 6,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    hostRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    avatarContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    avatar: {
        width: 22,
        height: 22,
        borderRadius: 11,
    },
    hostName: {
        color: colors.primary,
        fontSize: 10,
        fontWeight: '600',
    },
    micIcon: {
        position: 'absolute',
        top: 10,
        left: 10,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
