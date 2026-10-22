import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Platform, StatusBar, Alert } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function AboutScreen() {
    const navigation = useNavigation();

    const handleLinkPress = (title) => {
        Alert.alert(title, `Opening ${title} details...`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0B0806" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <ChevronLeft color="#E6C27A" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About</Text>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Brand Logo & Version Info */}
                <View style={styles.logoContainer}>
                    <View style={styles.logoWrapper}>
                        <Image 
                            source={{ uri: 'https://img.icons8.com/color/256/peacock.png' }} 
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.appTitle}>AUCHO</Text>
                    <Text style={styles.versionText}>Current Version 1.2.7</Text>
                </View>

                {/* Legal Links Card */}
                <View style={styles.linksCard}>
                    <TouchableOpacity 
                        onPress={() => handleLinkPress('User Agreement')} 
                        style={styles.row}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.label}>User Agreement</Text>
                        <ChevronRight color="#8B7A6A" size={16} />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity 
                        onPress={() => handleLinkPress('Privacy Policy')} 
                        style={styles.row}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.label}>Privacy Policy</Text>
                        <ChevronRight color="#8B7A6A" size={16} />
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
    logoContainer: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 40,
    },
    logoWrapper: {
        width: 100,
        height: 100,
        backgroundColor: '#120E0B',
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: 'rgba(230, 194, 122, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    logo: {
        width: 70,
        height: 70,
    },
    appTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '900',
        marginTop: 16,
        letterSpacing: 0.5,
    },
    versionText: {
        color: '#8B7A6A',
        fontSize: 12,
        fontWeight: '500',
        marginTop: 6,
    },
    linksCard: {
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
    label: {
        color: '#FFF',
        fontSize: 14.5,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#221811',
    },
});
