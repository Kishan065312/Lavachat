import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Platform,
  FlatList
} from 'react-native';
import { ChevronLeft, HelpCircle, FileText } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

// Detailed Level 1 to 25 Points Table Data with bright, high-contrast colors for premium readability
const levelData = [
  {
    id: 'Bronze',
    label: 'Bronze',
    color: '#FF9E43', // Brighter bronze
    glowColor: 'rgba(255, 158, 67, 0.15)',
    trophyUri: 'https://img.icons8.com/color/256/bronze-medal.png',
    bgGradient: ['#231812', '#120c09', '#080504'],
    requiredPlay: '9,983,600',
    gradeNext: 'Silver',
    privileges: [
      { id: 'logo', name: 'Bronze Logo', desc: 'Exclusive Level Logo', icon: 'https://img.icons8.com/color/96/bronze-medal.png' },
      { id: 'diamond', name: '3,000', desc: 'Diamond Reward', icon: 'https://img.icons8.com/color/96/diamond.png', isDiamonds: true },
    ]
  },
  {
    id: 'Silver',
    label: 'Silver',
    color: '#D4D4D8', // Brighter silver
    glowColor: 'rgba(212, 212, 216, 0.15)',
    trophyUri: 'https://img.icons8.com/color/256/silver-medal.png',
    bgGradient: ['#1d1e26', '#0f1015', '#060608'],
    requiredPlay: '24,950,000',
    gradeNext: 'Gold',
    privileges: [
      { id: 'logo', name: 'Silver Logo', desc: 'Exclusive Level Logo', icon: 'https://img.icons8.com/color/96/silver-medal.png' },
      { id: 'diamond', name: '6,000', desc: 'Diamond Reward', icon: 'https://img.icons8.com/color/96/diamond.png', isDiamonds: true },
      { id: 'chat_theme', name: 'Silver Theme', desc: 'Exclusive Room Theme', icon: 'https://img.icons8.com/color/96/room.png' },
    ]
  },
  {
    id: 'Gold',
    label: 'Gold',
    color: '#FFD700', // Gold
    glowColor: 'rgba(255, 215, 0, 0.15)',
    trophyUri: 'https://img.icons8.com/color/256/trophy.png',
    bgGradient: ['#2b1f19', '#140f0c', '#080605'],
    requiredPlay: '62,300,000',
    gradeNext: 'Platinum',
    privileges: [
      { id: 'logo', name: 'Gold Logo', desc: 'Exclusive Level Logo', icon: 'https://img.icons8.com/color/96/trophy.png' },
      { id: 'diamond', name: '9,000', desc: 'Diamond Reward', icon: 'https://img.icons8.com/color/96/diamond.png', isDiamonds: true },
      { id: 'bonus', name: '0.6% Bonus', desc: 'Day rebate bonus', icon: 'https://img.icons8.com/color/96/coins.png' },
      { id: 'chat_theme', name: 'Gold Theme', desc: 'Exclusive Room Theme', icon: 'https://img.icons8.com/color/96/room.png' },
    ]
  },
  {
    id: 'Platinum',
    label: 'Platinum',
    color: '#E2E8F0', // Brighter platinum
    glowColor: 'rgba(226, 232, 240, 0.15)',
    trophyUri: 'https://img.icons8.com/color/256/medal.png',
    bgGradient: ['#22262f', '#121419', '#08090a'],
    requiredPlay: '155,000,000',
    gradeNext: 'Diamond',
    privileges: [
      { id: 'logo', name: 'Platinum Logo', desc: 'Exclusive Level Logo', icon: 'https://img.icons8.com/color/96/medal.png' },
      { id: 'diamond', name: '12,000', desc: 'Diamond Reward', icon: 'https://img.icons8.com/color/96/diamond.png', isDiamonds: true },
      { id: 'bonus', name: '0.8% Bonus', desc: 'Day rebate bonus', icon: 'https://img.icons8.com/color/96/coins.png' },
      { id: 'badge', name: 'Platinum Badge', desc: 'Exclusive profile badge', icon: 'https://img.icons8.com/color/96/warranty.png' },
    ]
  },
  {
    id: 'Diamond',
    label: 'Diamond',
    color: '#80E5FF', // Brighter diamond blue
    glowColor: 'rgba(128, 229, 255, 0.2)',
    trophyUri: 'https://img.icons8.com/color/256/diamond.png',
    bgGradient: ['#162630', '#0a1217', '#030608'],
    requiredPlay: '388,000,000',
    gradeNext: 'Crown',
    privileges: [
      { id: 'logo', name: 'Diamond Logo', desc: 'Exclusive Level Logo', icon: 'https://img.icons8.com/color/96/diamond.png' },
      { id: 'diamond', name: '15,000', desc: 'Diamond Reward', icon: 'https://img.icons8.com/color/96/diamond.png', isDiamonds: true },
      { id: 'bonus', name: '1.0% Bonus', desc: 'Day rebate bonus', icon: 'https://img.icons8.com/color/96/coins.png' },
      { id: 'frame', name: 'Diamond Frame', desc: 'Avatar decoration frame', icon: 'https://img.icons8.com/color/96/name-tag.png' },
    ]
  },
  {
    id: 'Crown',
    label: 'Crown',
    color: '#D680FF', // Brighter crown purple
    glowColor: 'rgba(214, 128, 255, 0.15)',
    trophyUri: 'https://img.icons8.com/color/256/crown.png',
    bgGradient: ['#25152b', '#130a17', '#08040a'],
    requiredPlay: '970,000,000',
    gradeNext: 'Ace',
    privileges: [
      { id: 'logo', name: 'Crown Logo', desc: 'Exclusive Level Logo', icon: 'https://img.icons8.com/color/96/crown.png' },
      { id: 'diamond', name: '18,000', desc: 'Diamond Reward', icon: 'https://img.icons8.com/color/96/diamond.png', isDiamonds: true },
      { id: 'bonus', name: '1.2% Bonus', desc: 'Day rebate bonus', icon: 'https://img.icons8.com/color/96/coins.png' },
      { id: 'entry', name: 'Crown Entry', desc: 'Special entry effect', icon: 'https://img.icons8.com/color/96/magic-wand.png' },
    ]
  },
  {
    id: 'Ace',
    label: 'Ace',
    color: '#33FFFF', // Brighter Ace cyan
    glowColor: 'rgba(51, 255, 255, 0.15)',
    trophyUri: 'https://img.icons8.com/color/256/cards.png',
    bgGradient: ['#122a2a', '#091515', '#040909'],
    requiredPlay: '2,425,000,000',
    gradeNext: 'Extraordinary',
    privileges: [
      { id: 'logo', name: 'Ace Logo', desc: 'Exclusive Level Logo', icon: 'https://img.icons8.com/color/96/cards.png' },
      { id: 'diamond', name: '21,000', desc: 'Diamond Reward', icon: 'https://img.icons8.com/color/96/diamond.png', isDiamonds: true },
      { id: 'bonus', name: '1.4% Bonus', desc: 'Day rebate bonus', icon: 'https://img.icons8.com/color/96/coins.png' },
      { id: 'entry', name: 'Ace Entry', desc: 'Special entry effect', icon: 'https://img.icons8.com/color/96/magic-wand.png' },
    ]
  },
  {
    id: 'Extraordinary',
    label: 'Extraordinary',
    color: '#66FFA3', // Brighter extraordinary green
    glowColor: 'rgba(102, 255, 163, 0.15)',
    trophyUri: 'https://img.icons8.com/color/256/star-medal.png',
    bgGradient: ['#132b1d', '#0a160f', '#040a06'],
    requiredPlay: '499,999,983,600',
    gradeNext: 'Unparalleled',
    privileges: [
      { id: 'logo', name: 'Extraordinary Logo', desc: 'Exclusive Level Logo', icon: 'https://img.icons8.com/color/96/star-medal.png' },
      { id: 'diamond', name: '24,000', desc: 'Diamond Reward', icon: 'https://img.icons8.com/color/96/diamond.png', isDiamonds: true },
      { id: 'bonus', name: '1.6% Bonus', desc: 'Day rebate bonus', icon: 'https://img.icons8.com/color/96/coins.png' },
      { id: 'badge', name: 'Superb Badge', desc: 'Exclusive Profile Badge', icon: 'https://img.icons8.com/color/96/warranty.png' },
    ]
  },
  {
    id: 'Unparalleled',
    label: 'Unparalleled',
    color: '#FF66FF', // Brighter unparalleled magenta
    glowColor: 'rgba(255, 102, 255, 0.15)',
    trophyUri: 'https://img.icons8.com/color/256/shield.png',
    bgGradient: ['#2b122b', '#160916', '#0a040a'],
    requiredPlay: '625,000,000,000',
    gradeNext: 'Glorious',
    privileges: [
      { id: 'logo', name: 'Unparalleled Logo', desc: 'Exclusive Level Logo', icon: 'https://img.icons8.com/color/96/shield.png' },
      { id: 'diamond', name: '27,000', desc: 'Diamond Reward', icon: 'https://img.icons8.com/color/96/diamond.png', isDiamonds: true },
      { id: 'bonus', name: '1.8% Bonus', desc: 'Day rebate bonus', icon: 'https://img.icons8.com/color/96/coins.png' },
      { id: 'frame', name: 'Mythic Frame', desc: 'Special Avatar Frame', icon: 'https://img.icons8.com/color/96/name-tag.png' },
    ]
  },
  {
    id: 'Glorious',
    label: 'Glorious',
    color: '#FFEA00', // Brighter glorious yellow
    glowColor: 'rgba(255, 234, 0, 0.15)',
    trophyUri: 'https://img.icons8.com/color/256/gold-medal.png',
    bgGradient: ['#2a2a12', '#151509', '#0a0a04'],
    requiredPlay: '780,000,000,000',
    gradeNext: 'Supreme',
    privileges: [
      { id: 'logo', name: 'Glorious Logo', desc: 'Exclusive Level Logo', icon: 'https://img.icons8.com/color/96/gold-medal.png' },
      { id: 'diamond', name: '30,000', desc: 'Diamond Reward', icon: 'https://img.icons8.com/color/96/diamond.png', isDiamonds: true },
      { id: 'bonus', name: '2.0% Bonus', desc: 'Day rebate bonus', icon: 'https://img.icons8.com/color/96/coins.png' },
      { id: 'service', name: 'VIP Care', desc: 'Personal Service Support', icon: 'https://img.icons8.com/color/96/headset.png' },
    ]
  },
  {
    id: 'Supreme',
    label: 'Supreme',
    color: '#FF9533', // Brighter supreme orange
    glowColor: 'rgba(255, 149, 51, 0.15)',
    trophyUri: 'https://img.icons8.com/color/256/diploma.png',
    bgGradient: ['#2d1d12', '#170f09', '#0a0604'],
    requiredPlay: '975,000,000,000',
    gradeNext: 'Immortal',
    privileges: [
      { id: 'logo', name: 'Supreme Logo', desc: 'Exclusive Level Logo', icon: 'https://img.icons8.com/color/96/diploma.png' },
      { id: 'diamond', name: '33,000', desc: 'Diamond Reward', icon: 'https://img.icons8.com/color/96/diamond.png', isDiamonds: true },
      { id: 'bonus', name: '2.2% Bonus', desc: 'Day rebate bonus', icon: 'https://img.icons8.com/color/96/coins.png' },
      { id: 'entry', name: 'Supreme Entry', desc: 'Stunning entry effect', icon: 'https://img.icons8.com/color/96/magic-wand.png' },
    ]
  },
  {
    id: 'Immortal',
    label: 'Immortal',
    color: '#FF3383', // Brighter immortal rose
    glowColor: 'rgba(255, 51, 131, 0.15)',
    trophyUri: 'https://img.icons8.com/color/256/wings.png',
    bgGradient: ['#2b121e', '#16090f', '#0a0407'],
    requiredPlay: '1,220,000,000,000',
    gradeNext: 'Mystic',
    privileges: [
      { id: 'logo', name: 'Immortal Logo', desc: 'Exclusive Level Logo', icon: 'https://img.icons8.com/color/96/wings.png' },
      { id: 'diamond', name: '36,000', desc: 'Diamond Reward', icon: 'https://img.icons8.com/color/96/diamond.png', isDiamonds: true },
      { id: 'bonus', name: '2.4% Bonus', desc: 'Day rebate bonus', icon: 'https://img.icons8.com/color/96/coins.png' },
      { id: 'service', name: 'VIP Care', desc: 'Personal Service Support', icon: 'https://img.icons8.com/color/96/headset.png' },
    ]
  },
  {
    id: 'Mystic',
    label: 'Mystic',
    color: '#9E66FF', // Brighter mystic purple
    glowColor: 'rgba(158, 102, 255, 0.15)',
    trophyUri: 'https://img.icons8.com/color/256/crystal-ball.png',
    bgGradient: ['#191228', '#0c0915', '#05040a'],
    requiredPlay: '1,525,000,000,000',
    gradeNext: 'Celestial',
    privileges: [
      { id: 'logo', name: 'Mystic Logo', desc: 'Exclusive Level Logo', icon: 'https://img.icons8.com/color/96/crystal-ball.png' },
      { id: 'diamond', name: '40,000', desc: 'Diamond Reward', icon: 'https://img.icons8.com/color/96/diamond.png', isDiamonds: true },
      { id: 'bonus', name: '2.6% Bonus', desc: 'Day rebate bonus', icon: 'https://img.icons8.com/color/96/coins.png' },
      { id: 'chat_theme', name: 'Mystic Room', desc: 'Special Room Theme', icon: 'https://img.icons8.com/color/96/room.png' },
    ]
  },
  {
    id: 'Celestial',
    label: 'Celestial',
    color: '#8BE4FF', // Brighter celestial sky
    glowColor: 'rgba(139, 228, 255, 0.15)',
    trophyUri: 'https://img.icons8.com/color/256/sun.png',
    bgGradient: ['#15282e', '#0a1417', '#04080a'],
    requiredPlay: '1,900,000,000,000',
    gradeNext: 'Divine',
    privileges: [
      { id: 'logo', name: 'Celestial Logo', desc: 'Exclusive Level Logo', icon: 'https://img.icons8.com/color/96/sun.png' },
      { id: 'diamond', name: '45,000', desc: 'Diamond Reward', icon: 'https://img.icons8.com/color/96/diamond.png', isDiamonds: true },
      { id: 'bonus', name: '2.8% Bonus', desc: 'Day rebate bonus', icon: 'https://img.icons8.com/color/96/coins.png' },
      { id: 'entry', name: 'Celestial Entry', desc: 'Stunning entry effect', icon: 'https://img.icons8.com/color/96/magic-wand.png' },
    ]
  },
  {
    id: 'Divine',
    label: 'Divine',
    color: '#FFF8B3', // Brighter divine light gold
    glowColor: 'rgba(255, 248, 179, 0.15)',
    trophyUri: 'https://img.icons8.com/color/256/yin-yang.png',
    bgGradient: ['#28261c', '#14130e', '#090906'],
    requiredPlay: '2,375,000,000,000',
    gradeNext: 'King',
    privileges: [
      { id: 'logo', name: 'Divine Logo', desc: 'Exclusive Level Logo', icon: 'https://img.icons8.com/color/96/yin-yang.png' },
      { id: 'diamond', name: '50,000', desc: 'Diamond Reward', icon: 'https://img.icons8.com/color/96/diamond.png', isDiamonds: true },
      { id: 'bonus', name: '3.0% Bonus', desc: 'Day rebate bonus', icon: 'https://img.icons8.com/color/96/coins.png' },
      { id: 'chat_theme', name: 'Divine Room', desc: 'Special Room Theme', icon: 'https://img.icons8.com/color/96/room.png' },
    ]
  },
  {
    id: 'King',
    label: 'King',
    color: '#FF5C43', // Brighter king red
    glowColor: 'rgba(255, 92, 67, 0.15)',
    trophyUri: 'https://img.icons8.com/color/256/crown.png',
    bgGradient: ['#2d1312', '#170a09', '#0a0404'],
    requiredPlay: '2,960,000,000,000',
    gradeNext: 'Lord',
    privileges: [
      { id: 'logo', name: 'King Logo', desc: 'Exclusive Level Logo', icon: 'https://img.icons8.com/color/96/crown.png' },
      { id: 'diamond', name: '60,000', desc: 'Diamond Reward', icon: 'https://img.icons8.com/color/96/diamond.png', isDiamonds: true },
      { id: 'bonus', name: '3.2% Bonus', desc: 'Day rebate bonus', icon: 'https://img.icons8.com/color/96/coins.png' },
      { id: 'frame', name: 'King Frame', desc: 'Exclusive King Border', icon: 'https://img.icons8.com/color/96/name-tag.png' },
    ]
  },
  {
    id: 'Lord',
    label: 'Lord',
    color: '#6688FF', // Brighter lord blue
    glowColor: 'rgba(102, 136, 255, 0.15)',
    trophyUri: 'https://img.icons8.com/color/256/scepter.png',
    bgGradient: ['#12122b', '#090916', '#04040a'],
    requiredPlay: '3,700,000,000,000',
    gradeNext: 'Peerless King',
    privileges: [
      { id: 'logo', name: 'Lord Logo', desc: 'Exclusive Level Logo', icon: 'https://img.icons8.com/color/96/scepter.png' },
      { id: 'diamond', name: '70,000', desc: 'Diamond Reward', icon: 'https://img.icons8.com/color/96/diamond.png', isDiamonds: true },
      { id: 'bonus', name: '3.4% Bonus', desc: 'Day rebate bonus', icon: 'https://img.icons8.com/color/96/coins.png' },
      { id: 'service', name: 'VIP Care', desc: 'Personal Service Support', icon: 'https://img.icons8.com/color/96/headset.png' },
    ]
  },
  {
    id: 'Peerless King',
    label: 'Peerless King',
    color: '#E59EA9', // Brighter peerless rose gold
    glowColor: 'rgba(229, 158, 169, 0.15)',
    trophyUri: 'https://img.icons8.com/color/256/sword.png',
    bgGradient: ['#281b1d', '#140e0f', '#090607'],
    requiredPlay: '4,625,000,000,000',
    gradeNext: 'Legend King',
    privileges: [
      { id: 'logo', name: 'Peerless Logo', desc: 'Exclusive Level Logo', icon: 'https://img.icons8.com/color/96/sword.png' },
      { id: 'diamond', name: '80,000', desc: 'Diamond Reward', icon: 'https://img.icons8.com/color/96/diamond.png', isDiamonds: true },
      { id: 'bonus', name: '3.6% Bonus', desc: 'Day rebate bonus', icon: 'https://img.icons8.com/color/96/coins.png' },
      { id: 'entry', name: 'Legend Entrance', desc: 'Royal entry animations', icon: 'https://img.icons8.com/color/96/magic-wand.png' },
    ]
  },
  {
    id: 'Legend King',
    label: 'Legend King',
    color: '#FF66CD', // Brighter legend king orchid
    glowColor: 'rgba(255, 102, 205, 0.15)',
    trophyUri: 'https://img.icons8.com/color/256/championship-belt.png',
    bgGradient: ['#2a1223', '#150912', '#0a0409'],
    requiredPlay: '5,780,000,000,000',
    gradeNext: 'Glory King',
    privileges: [
      { id: 'logo', name: 'Legend Logo', desc: 'Exclusive Level Logo', icon: 'https://img.icons8.com/color/96/championship-belt.png' },
      { id: 'diamond', name: '90,000', desc: 'Diamond Reward', icon: 'https://img.icons8.com/color/96/diamond.png', isDiamonds: true },
      { id: 'bonus', name: '3.8% Bonus', desc: 'Day rebate bonus', icon: 'https://img.icons8.com/color/96/coins.png' },
      { id: 'chat_color', name: 'Text Highlight', desc: 'Special color text', icon: 'https://img.icons8.com/color/96/paint-palette.png' },
    ]
  },
  {
    id: 'Glory King',
    label: 'Glory King',
    color: '#FF6E33', // Brighter glory king orange
    glowColor: 'rgba(255, 110, 51, 0.15)',
    trophyUri: 'https://img.icons8.com/color/256/laurel-wreath.png',
    bgGradient: ['#2e1512', '#170b09', '#0a0504'],
    requiredPlay: '7,225,000,000,000',
    gradeNext: 'Mythic Overlord',
    privileges: [
      { id: 'logo', name: 'Glory Logo', desc: 'Exclusive Level Logo', icon: 'https://img.icons8.com/color/96/laurel-wreath.png' },
      { id: 'diamond', name: '100,000', desc: 'Diamond Reward', icon: 'https://img.icons8.com/color/96/diamond.png', isDiamonds: true },
      { id: 'bonus', name: '4.0% Bonus', desc: 'Day rebate bonus', icon: 'https://img.icons8.com/color/96/coins.png' },
      { id: 'frame', name: 'Glory Border', desc: 'Exclusive Profile Border', icon: 'https://img.icons8.com/color/96/name-tag.png' },
    ]
  },
  {
    id: 'Mythic Overlord',
    label: 'Mythic Overlord',
    color: '#FF4D4D', // Brighter mythic overlord red
    glowColor: 'rgba(255, 77, 77, 0.15)',
    trophyUri: 'https://img.icons8.com/color/256/throne.png',
    bgGradient: ['#260f0f', '#130808', '#090404'],
    requiredPlay: '9,030,000,000,000',
    gradeNext: 'Apex Predator',
    privileges: [
      { id: 'logo', name: 'Overlord Logo', desc: 'Exclusive Level Logo', icon: 'https://img.icons8.com/color/96/throne.png' },
      { id: 'diamond', name: '120,000', desc: 'Diamond Reward', icon: 'https://img.icons8.com/color/96/diamond.png', isDiamonds: true },
      { id: 'bonus', name: '4.2% Bonus', desc: 'Day rebate bonus', icon: 'https://img.icons8.com/color/96/coins.png' },
      { id: 'service', name: 'VIP Care', desc: 'Personal Service Support', icon: 'https://img.icons8.com/color/96/headset.png' },
    ]
  },
  {
    id: 'Apex Predator',
    label: 'Apex Predator',
    color: '#5CFF5C', // Brighter lime green
    glowColor: 'rgba(92, 255, 92, 0.15)',
    trophyUri: 'https://img.icons8.com/color/256/lion.png',
    bgGradient: ['#152d15', '#0b170b', '#050a05'],
    requiredPlay: '11,280,000,000,000',
    gradeNext: 'Eternity',
    privileges: [
      { id: 'logo', name: 'Apex Logo', desc: 'Exclusive Level Logo', icon: 'https://img.icons8.com/color/96/lion.png' },
      { id: 'diamond', name: '150,000', desc: 'Diamond Reward', icon: 'https://img.icons8.com/color/96/diamond.png', isDiamonds: true },
      { id: 'bonus', name: '4.4% Bonus', desc: 'Day rebate bonus', icon: 'https://img.icons8.com/color/96/coins.png' },
      { id: 'entry', name: 'Predator Arrival', desc: 'Mythic entry animations', icon: 'https://img.icons8.com/color/96/magic-wand.png' },
    ]
  },
  {
    id: 'Eternity',
    label: 'Eternity',
    color: '#D8B4FE', // Bright lilac violet (Highly readable!)
    glowColor: 'rgba(216, 180, 254, 0.15)',
    trophyUri: 'https://img.icons8.com/color/256/hourglass.png',
    bgGradient: ['#190f23', '#0c0812', '#060409'],
    requiredPlay: '14,100,000,000,000',
    gradeNext: 'Sovereign',
    privileges: [
      { id: 'logo', name: 'Eternity Logo', desc: 'Exclusive Level Logo', icon: 'https://img.icons8.com/color/96/hourglass.png' },
      { id: 'diamond', name: '200,000', desc: 'Diamond Reward', icon: 'https://img.icons8.com/color/96/diamond.png', isDiamonds: true },
      { id: 'bonus', name: '4.6% Bonus', desc: 'Day rebate bonus', icon: 'https://img.icons8.com/color/96/coins.png' },
      { id: 'chat_theme', name: 'Eternity Room', desc: 'Special Room Theme', icon: 'https://img.icons8.com/color/96/room.png' },
    ]
  },
  {
    id: 'Sovereign',
    label: 'Sovereign',
    color: '#FFD700', // Gold
    glowColor: 'rgba(255, 215, 0, 0.15)',
    trophyUri: 'https://img.icons8.com/color/256/globe.png',
    bgGradient: ['#2e2412', '#171209', '#0a0804'],
    requiredPlay: '17,625,000,000,000',
    gradeNext: 'Conqueror',
    privileges: [
      { id: 'logo', name: 'Sovereign Logo', desc: 'Exclusive Level Logo', icon: 'https://img.icons8.com/color/96/globe.png' },
      { id: 'diamond', name: '250,000', desc: 'Diamond Reward', icon: 'https://img.icons8.com/color/96/diamond.png', isDiamonds: true },
      { id: 'bonus', name: '4.8% Bonus', desc: 'Day rebate bonus', icon: 'https://img.icons8.com/color/96/coins.png' },
      { id: 'frame', name: 'Sovereign Border', desc: 'Avatar decoration border', icon: 'https://img.icons8.com/color/96/name-tag.png' },
    ]
  },
  {
    id: 'Conqueror',
    label: 'Conqueror',
    color: '#FF5722', // Bright orange-red
    glowColor: 'rgba(255, 87, 34, 0.15)',
    trophyUri: 'https://img.icons8.com/color/256/flag.png',
    bgGradient: ['#2e1712', '#170c09', '#0a0504'],
    requiredPlay: '22,000,000,000,000',
    gradeNext: 'Max Level',
    privileges: [
      { id: 'logo', name: 'Conqueror Logo', desc: 'Exclusive Level Logo', icon: 'https://img.icons8.com/color/96/flag.png' },
      { id: 'diamond', name: '300,000', desc: 'Diamond Reward', icon: 'https://img.icons8.com/color/96/diamond.png', isDiamonds: true },
      { id: 'bonus', name: '5.0% Bonus', desc: 'Day rebate bonus', icon: 'https://img.icons8.com/color/96/coins.png' },
      { id: 'frame', name: 'Conqueror Border', desc: 'Avatar decoration border', icon: 'https://img.icons8.com/color/96/name-tag.png' },
      { id: 'service', name: 'VIP Care', desc: 'Personal Service Support', icon: 'https://img.icons8.com/color/96/headset.png' },
    ]
  }
];

export default function GameLevelScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('Silver');
  const flatListRef = useRef(null);
  const tabsScrollViewRef = useRef(null);

  const activeLevel = levelData.find(l => l.id === selectedTab) || levelData[1];

  const handleTabPress = (tabId) => {
    setSelectedTab(tabId);
    const index = levelData.findIndex(l => l.id === tabId);
    if (index !== -1) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
    }
  };



  useEffect(() => {
    const index = levelData.findIndex(l => l.id === selectedTab);
    if (index !== -1) {
      tabsScrollViewRef.current?.scrollTo({
        x: Math.max(0, index * 95 - width / 2 + 47),
        animated: true
      });
    }
  }, [selectedTab]);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
        <ChevronLeft color="#fff" size={28} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Game Level</Text>
      <View style={styles.headerRight}>
        <TouchableOpacity onPress={() => navigation.navigate('RewardRecordScreen')} style={styles.iconBtn}>
          <FileText color="#fff" size={22} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('GameLevelRulesScreen')} style={styles.iconBtn}>
          <HelpCircle color="#fff" size={22} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('GameLevelRankingsScreen')} style={styles.iconBtn}>
          <Image source={{ uri: 'https://img.icons8.com/color/48/podium-with-speaker.png' }} style={{ width: 22, height: 22 }} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={activeLevel.bgGradient} style={StyleSheet.absoluteFillObject} />

      <SafeAreaView style={{ flex: 1 }}>
        {renderHeader()}

        <ScrollView bounces={false} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Top Info Card */}
          <View style={styles.topInfoCard}>
            {/* Split Row for Next Level (prevents overlap) */}
            <View style={styles.topInfoRow}>
              <Text style={styles.infoText}>Next Level</Text>
              <Text style={[styles.nextLevelLabel, { color: activeLevel.color || '#FFD700' }]}>
                {activeLevel.gradeNext}
              </Text>
            </View>

            {/* Split Row for Required Play (prevents overlap) */}
            <View style={[styles.topInfoRow, { marginTop: 8 }]}>
              <Text style={styles.infoText}>Required Play</Text>
              <Text style={styles.highlightText}>{activeLevel.requiredPlay}</Text>
            </View>

            {/* Custom Premium Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBg}>
                <LinearGradient
                  colors={[activeLevel.color, '#FFF']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[styles.progressBarFill, { width: activeLevel.id === 'Conqueror' ? '100%' : '65%' }]}
                />
              </View>
            </View>
            <Text style={styles.circleText}>New circle calculation: 2026.06.26</Text>
          </View>

          {/* Trophy Section / Carousel */}
          <View style={styles.trophySection}>
            <FlatList
              ref={flatListRef}
              data={levelData}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              bounces={false}
              initialScrollIndex={levelData.findIndex(l => l.id === 'Silver')}
              getItemLayout={(data, index) => (
                { length: width, offset: width * index, index }
              )}
              onMomentumScrollEnd={(e) => {
                const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
                setSelectedTab(levelData[newIndex].id);
              }}
              renderItem={({ item }) => (
                <View style={{ width, height: 270, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {/* Dynamic Glow Halo using LinearGradient */}
                  <LinearGradient
                    colors={[item.glowColor, 'transparent']}
                    style={styles.trophyGlow}
                  />

                  <Image
                    source={{ uri: item.trophyUri }}
                    style={styles.trophyImage}
                  />
                </View>
              )}
            />
          </View>

          {/* Centered Level Tabs */}
          <View style={styles.tabsContainer}>
            <ScrollView
              ref={tabsScrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsScrollContent}
            >
              {levelData.map((level) => {
                const isSelected = selectedTab === level.id;
                return (
                  <TouchableOpacity
                    key={level.id}
                    style={[styles.tab, isSelected && styles.activeTab, isSelected && { borderBottomColor: level.color }]}
                    onPress={() => handleTabPress(level.id)}
                  >
                    <Text style={[styles.tabText, isSelected && styles.activeTabText, isSelected && { color: level.color }]}>
                      {level.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Dynamic Privileges Section */}
          <View style={styles.privilegeSection}>
            <View style={styles.sectionTitleContainer}>
              <Image source={{ uri: 'https://img.icons8.com/color/48/floral-design.png' }} style={styles.decoLeft} />
              <Text style={styles.sectionTitle}>{activeLevel.label} Level Privileges</Text>
              <Image source={{ uri: 'https://img.icons8.com/color/48/floral-design.png' }} style={styles.decoRight} />
            </View>

            <View style={styles.privilegeGrid}>
              {activeLevel.privileges.map((priv) => (
                <LinearGradient
                  key={priv.id}
                  colors={['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.02)']}
                  style={styles.privilegeCard}
                >
                  <Image source={{ uri: priv.icon }} style={styles.privilegeIcon} />
                  {priv.isDiamonds ? (
                    <View style={styles.diamondRow}>
                      <Image source={{ uri: 'https://img.icons8.com/color/96/diamond.png' }} style={styles.diamondIcon} />
                      <Text style={styles.privilegeName}>{priv.name}</Text>
                    </View>
                  ) : (
                    <Text style={styles.privilegeName} numberOfLines={1}>{priv.name}</Text>
                  )}
                  <Text style={styles.privilegeDesc}>{priv.desc}</Text>
                </LinearGradient>
              ))}
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 50,
  },
  headerIcon: {
    padding: 4,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
    textShadowColor: 'rgba(255, 215, 0, 0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    marginLeft: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  topInfoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 16,
    marginTop: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  topInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoText: {
    color: '#A0A0AB',
    fontSize: 14,
    fontWeight: '600',
  },
  nextLevelLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  highlightText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '800',
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressContainer: {
    marginTop: 14,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  circleText: {
    color: '#6A6A73',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 12,
    letterSpacing: 0.5,
  },
  trophySection: {
    marginTop: 25,
    height: 270,
  },

  trophyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
    position: 'relative',
  },
  trophyGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: 35,
    alignSelf: 'center',
    zIndex: 1,
  },
  trophyImage: {
    width: 190,
    height: 190,
    resizeMode: 'contain',
    zIndex: 4,
  },
  tabsContainer: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  tabsScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    marginHorizontal: 4,
  },
  activeTab: {
    // Underline color is dynamically styled based on level colors
  },
  tabText: {
    color: '#8A8A93',
    fontSize: 15,
    fontWeight: '600',
  },
  activeTabText: {
    fontWeight: '800',
    textShadowColor: 'rgba(255, 255, 255, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  privilegeSection: {
    marginTop: 25,
    paddingHorizontal: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  decoLeft: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  decoRight: {
    width: 20,
    height: 20,
    marginLeft: 8,
    transform: [{ scaleX: -1 }],
  },
  sectionTitle: {
    color: '#FFD700',
    fontSize: 17,
    fontWeight: '900',
    textShadowColor: 'rgba(255, 215, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
  privilegeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  privilegeCard: {
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    width: (width - 48) / 3, // 3 columns
    minHeight: 125,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  privilegeIcon: {
    width: 50,
    height: 50,
    marginBottom: 6,
    resizeMode: 'contain',
  },
  privilegeName: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  privilegeDesc: {
    color: '#8A8A93',
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  diamondRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  diamondIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
  }
});
