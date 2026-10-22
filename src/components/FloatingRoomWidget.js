import React, { useEffect, useRef } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { X } from 'lucide-react-native';
import { closeMinimizedRoom } from '../store/slices/roomSlice';
import { colors } from '../styles/globalStyles';

const FloatingRoomWidget = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { minimizedRoom } = useSelector(state => state.room);
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (minimizedRoom) {
            startSpin();
        } else {
            spinValue.setValue(0);
        }
    }, [minimizedRoom]);

    const startSpin = () => {
        spinValue.setValue(0);
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    };

    if (!minimizedRoom) return null;

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const handlePress = () => {
        navigation.navigate('ChatScreen', { roomData: minimizedRoom });
        // Optional: Keep it minimized or close it? 
        // Typically, maximizing means we don't show the bubble anymore until minimized again.
        dispatch(closeMinimizedRoom());
    };

    const handleClose = () => {
        dispatch(closeMinimizedRoom());
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
                <Animated.View style={[styles.discContainer, { transform: [{ rotate: spin }] }]}>
                    <Image
                        source={minimizedRoom.image ? { uri: minimizedRoom.image } : require('../assets/av1.jpg')}
                        style={styles.avatar}
                    />
                    {/* Border overlay removed as asset is missing. Container style handles border. */}
                </Animated.View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <X size={12} color={colors.text} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 100, // Above bottom tabs
        right: 20,
        zIndex: 9999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    discContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: colors.tertiary,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    borderOverlay: {
        position: 'absolute',
        width: 60,
        height: 60,
        // If no asset, this is invisible but ready
        // border prop handled by container
    },
    closeButton: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'rgba(0,0,0,0.6)',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.text,
    }
});

export default FloatingRoomWidget;
