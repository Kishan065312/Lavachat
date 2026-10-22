import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Platform } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function MysteryDescriptionScreen() {
    const navigation = useNavigation();

    const rules = [
        {
            id: 1,
            text: 'Mystery privileges are special rights in the room. You can obtain the mystery privileges experience card by participating in the event.'
        },
        {
            id: 2,
            text: 'After having privileges, you can freely switch between the real ID and the mystery ID in the mystery privileges page or in the room-tool box.'
        },
        {
            id: 3,
            text: 'After turning on the mystery ID, the mystery suit will take effect automatically. You will get a random mystery nickname, reset every time you turn on the mystery ID (or re-enter the room at 4:00 a.m. saudi time every day).'
        },
        {
            id: 4,
            text: 'The mystery privileges are only valid in the room. Giving gifts and playing games in the room will hide your true ID and not be discovered. Interactions outside the room are not protected by invisibility. In addition, activities, interactions and lists that involve awards in and out of the room may expose your true ID. Please pay attention to your interactive content and ensure that your real ID is not exposed.'
        },
        {
            id: 5,
            text: 'After the privilege expires, your ID will automatically be restored to your real ID. Please pay attention to the validity period of your privileges during use to avoid exposing your identity.'
        }
    ];

    // Highlight key words for extreme professionalism
    const renderHighlightedText = (text) => {
        const keywords = [
            'Mystery privileges',
            'switch between the real ID and the mystery ID',
            '4:00 a.m. saudi time',
            'only valid in the room',
            'hide your true ID and not be discovered',
            'not protected by invisibility',
            'ensure that your real ID is not exposed',
            'automatically be restored'
        ];

        let elements = [text];

        keywords.forEach(keyword => {
            let nextElements = [];
            elements.forEach(element => {
                if (typeof element !== 'string') {
                    nextElements.push(element);
                    return;
                }

                const parts = element.split(keyword);
                if (parts.length > 1) {
                    for (let i = 0; i < parts.length; i++) {
                        nextElements.push(parts[i]);
                        if (i < parts.length - 1) {
                            nextElements.push(
                                <Text key={keyword + i} style={styles.highlightText}>
                                    {keyword}
                                </Text>
                            );
                        }
                    }
                } else {
                    nextElements.push(element);
                }
            });
            elements = nextElements;
        });

        return <Text style={styles.ruleText}>{elements}</Text>;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0B0806" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <ChevronLeft color="#E6C27A" size={28} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mystery privileges description</Text>
                <View style={{ width: 40 }} /> {/* balance spacing */}
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.rulesCard}>
                    {rules.map((rule) => (
                        <View key={rule.id} style={styles.ruleItemRow}>
                            <View style={styles.numBadge}>
                                <Text style={styles.numBadgeText}>{rule.id}</Text>
                            </View>
                            <View style={styles.ruleTextContainer}>
                                {renderHighlightedText(rule.text)}
                            </View>
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
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    rulesCard: {
        backgroundColor: '#15110E',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#2A2015',
    },
    ruleItemRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    numBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#1F1610',
        borderWidth: 1,
        borderColor: '#D4AF37',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    numBadgeText: {
        color: '#E6C27A',
        fontSize: 12,
        fontWeight: 'bold',
    },
    ruleTextContainer: {
        flex: 1,
    },
    ruleText: {
        color: '#A08B7D',
        fontSize: 13,
        lineHeight: 20,
    },
    highlightText: {
        color: '#E6C27A',
        fontWeight: 'bold',
    },
});
