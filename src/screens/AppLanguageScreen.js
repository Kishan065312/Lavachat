import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import { ChevronLeft, Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const languages = [
    { code: 'en', name: 'English' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'ar', name: 'العربية' },
    { code: 'am', name: 'አማርኛ' },
    { code: 'es', name: 'Español' },
    { code: 'id', name: 'Indonesia' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'русский язык' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'ml', name: 'മലയാളം' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'hi', name: 'हिन्दी' }
];

export default function AppLanguageScreen() {
    const navigation = useNavigation();
    const [selectedCode, setSelectedCode] = useState('en');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0B0806" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <ChevronLeft color="#E6C27A" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>App Language</Text>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.listCard}>
                    {languages.map((lang, index) => {
                        const isSelected = selectedCode === lang.code;
                        return (
                            <View key={lang.code}>
                                <TouchableOpacity 
                                    onPress={() => setSelectedCode(lang.code)} 
                                    style={styles.langRow}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.langText, isSelected && styles.selectedLangText]}>
                                        {lang.name}
                                    </Text>
                                    {isSelected && (
                                        <View style={styles.checkWrapper}>
                                            <Check color="#10B981" size={16} strokeWidth={3} />
                                        </View>
                                    )}
                                </TouchableOpacity>
                                {index < languages.length - 1 && <View style={styles.divider} />}
                            </View>
                        );
                    })}
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
    listCard: {
        backgroundColor: '#120E0B',
        borderRadius: 18,
        borderWidth: 1.2,
        borderColor: 'rgba(230, 194, 122, 0.15)',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    langRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
    },
    langText: {
        color: '#FFF',
        fontSize: 14.5,
        fontWeight: '500',
    },
    selectedLangText: {
        color: '#E6C27A',
        fontWeight: 'bold',
    },
    checkWrapper: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#221811',
    },
});
