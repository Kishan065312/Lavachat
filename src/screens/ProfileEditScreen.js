import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    Modal,
    TextInput,
    Switch,
    Platform,
    Alert,
    ActivityIndicator,
    StatusBar
} from 'react-native';
import { ChevronLeft, ChevronRight, Plus, Camera, ShieldCheck, HelpCircle, X } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { setProfile } from '../store/slices/authSlice';
import apiService from '../services/apiService';
import { launchImageLibrary } from 'react-native-image-picker';

const { width } = Dimensions.get('window');

const RELATIONSHIP_OPTIONS = [
    { label: "Single", emoji: "👤" },
    { label: "In a relationship", emoji: "💑" },
    { label: "Married", emoji: "💍" },
    { label: "It's complicated", emoji: "🤷" }
];

const OCCUPATION_OPTIONS = [
    { label: "Students", emoji: "🎓" }, { label: "Farmer", emoji: "🧑‍🌾" }, { label: "Sales", emoji: "💼" }, { label: "Clerk", emoji: "📋" },
    { label: "IT", emoji: "💻" }, { label: "Engineer", emoji: "🛠️" }, { label: "Teacher", emoji: "🍎" }, { label: "Freelancer", emoji: "🖋️" },
    { label: "Driver", emoji: "🚗" }, { label: "Finance", emoji: "💰" }, { label: "Accountant", emoji: "📊" }, { label: "Designer", emoji: "🎨" },
    { label: "Government Worker", emoji: "🏛️" }, { label: "Doctor", emoji: "🩺" }, { label: "Nurse", emoji: "💉" }, { label: "Police", emoji: "👮" },
    { label: "Military", emoji: "🪖" }, { label: "Lawyer", emoji: "⚖️" }, { label: "Architect", emoji: "🏗️" }, { label: "Chef", emoji: "🧑‍🍳" },
    { label: "Host", emoji: "🎤" }, { label: "Cast", emoji: "🎭" }, { label: "Model", emoji: "👗" }, { label: "Photographer", emoji: "📸" },
    { label: "Author", emoji: "📖" }, { label: "Tour Guide", emoji: "🗺️" }, { label: "Journalist", emoji: "📰" }, { label: "Athlete", emoji: "🏃" },
    { label: "Executive", emoji: "👔" }, { label: "Unemployed", emoji: "🔴" }, { label: "Firefighter", emoji: "🚒" }, { label: "Pilot", emoji: "✈️" },
    { label: "Other", emoji: "❓" }
];

const LANGUAGE_OPTIONS = [
    { label: "English", emoji: "🇬🇧" }, { label: "Spanish", emoji: "🇪🇸" }, { label: "French", emoji: "🇫🇷" }, { label: "German", emoji: "🇩🇪" },
    { label: "Hindi", emoji: "🇮🇳" }, { label: "Gujarati", emoji: "🇮🇳" }, { label: "Mandarin", emoji: "🇨🇳" }, { label: "Japanese", emoji: "🇯🇵" },
    { label: "Korean", emoji: "🇰🇷" }, { label: "Arabic", emoji: "🇸🇦" }, { label: "Russian", emoji: "🇷🇺" }, { label: "Portuguese", emoji: "🇵🇹" },
    { label: "Italian", emoji: "🇮🇹" }, { label: "Bengali", emoji: "🇧🇩" }, { label: "Urdu", emoji: "🇵🇰" }, { label: "Turkish", emoji: "🇹🇷" },
    { label: "Vietnamese", emoji: "🇻🇳" }, { label: "Polish", emoji: "🇵🇱" }, { label: "Dutch", emoji: "🇳🇱" }, { label: "Indonesian", emoji: "🇮🇩" },
    { label: "Thai", emoji: "🇹🇭" }, { label: "Other", emoji: "🌐" }
];

const GENDER_OPTIONS = [
    { id: 'Male', label: "Male", emoji: "♂️" },
    { id: 'Female', label: "Female", emoji: "♀️" },
    { id: 'Other', label: "Other", emoji: "🌈" }
];

const HOBBIES_DATA = {
    Food: [
        { label: "Curry", emoji: "🍛" }, { label: "Ramen", emoji: "🍜" }, { label: "Pasta", emoji: "🍝" }, { label: "Sushi", emoji: "🍣" },
        { label: "Barbecue", emoji: "🍢" }, { label: "Steak", emoji: "🥩" }, { label: "Pizza", emoji: "🍕" }, { label: "Hamburger/Fries", emoji: "🍔" },
        { label: "Grilled meat", emoji: "🍖" }, { label: "Fried Chicken", emoji: "🌭" }, { label: "Vegetarian", emoji: "🌱" }, { label: "Coffee", emoji: "☕" },
        { label: "Tea", emoji: "🍵" }, { label: "Yogurt", emoji: "🥛" }, { label: "Tiramisu", emoji: "🧁" }, { label: "Mousse Cake", emoji: "🍰" },
        { label: "Cheese", emoji: "🧀" }, { label: "Chocolate", emoji: "🍫" }, { label: "Ice cream", emoji: "🍦" }, { label: "Omnivore", emoji: "🍽️" }
    ],
    Exercise: [
        { label: "Cricket", emoji: "🏏" }, { label: "Swimming", emoji: "🏊" }, { label: "Running", emoji: "🏃" }, { label: "Cycling", emoji: "🚴" },
        { label: "Yoga", emoji: "🧘‍♂️" }, { label: "Basketball", emoji: "🏀" }, { label: "Soccer", emoji: "⚽" }, { label: "Baseball", emoji: "⚾" },
        { label: "Polo", emoji: "🏇" }, { label: "Softball", emoji: "🥎" }, { label: "Tennis", emoji: "🎾" }, { label: "Skateboarding", emoji: "🛹" },
        { label: "Surfing", emoji: "🏄" }, { label: "Rowing", emoji: "🚣" }, { label: "Boxing", emoji: "🥊" }, { label: "Fencing", emoji: "🤺" },
        { label: "Shooting", emoji: "🎯" }, { label: "Archery", emoji: "🏹" }, { label: "Hockey", emoji: "🏒" }
    ],
    Film: [
        { label: "Comedy", emoji: "😂" }, { label: "Horror", emoji: "👻" }, { label: "Romance", emoji: "💖" }, { label: "Sci-Fi", emoji: "🚀" },
        { label: "Variety Show", emoji: "🎭" }, { label: "Documentary", emoji: "📹" }, { label: "War", emoji: "⚔️" }, { label: "Anime", emoji: "🎬" }
    ],
    Music: [
        { label: "Rap", emoji: "🎤" }, { label: "Folk Music", emoji: "🍃" }, { label: "String Music", emoji: "🎻" }, { label: "Jazz", emoji: "🎷" },
        { label: "Rock", emoji: "🤘" }, { label: "A Cappella", emoji: "🎶" }, { label: "R&B", emoji: "🎧" }, { label: "Pop Music", emoji: "🎵" },
        { label: "Reggae", emoji: "🌴" }, { label: "Soul Music", emoji: "🎼" }, { label: "Electronic Music", emoji: "🎛️" }, { label: "Country Music", emoji: "🎸" },
        { label: "Punk", emoji: "🖤" }, { label: "Classical", emoji: "🎹" }
    ]
};

export default function ProfileEditScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.userId);
    const profile = useSelector((state) => state.auth.profile);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [birthday, setBirthday] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [country, setCountry] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [relationship, setRelationship] = useState("");
    const [occupation, setOccupation] = useState("");
    const [language, setLanguage] = useState("");
    const [bio, setBio] = useState("");
    const [gender, setGender] = useState("Female");

    // Form IDs
    const [countryId, setCountryId] = useState(null);
    const [stateId, setStateId] = useState(null);
    const [cityId, setCityId] = useState(null);
    const [relationshipId, setRelationshipId] = useState(null);
    const [occupationId, setOccupationId] = useState(null);
    const [languageId, setLanguageId] = useState(null);

    // Master Dropdown Data Lists
    const [relationshipList, setRelationshipList] = useState([]);
    const [occupationList, setOccupationList] = useState([]);
    const [languageList, setLanguageList] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [statesList, setStatesList] = useState([]);
    const [citiesList, setCitiesList] = useState([]);
    const [hobbiesData, setHobbiesData] = useState({});

    // Profile Images state
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarLocalUri, setAvatarLocalUri] = useState(null);
    const [albumFiles, setAlbumFiles] = useState([null, null, null, null, null, null]);
    const [albumLocalUris, setAlbumLocalUris] = useState([null, null, null, null, null, null]);

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [currentField, setCurrentField] = useState({ key: '', label: '', value: '' });
    const [editValue, setEditValue] = useState("");

    // DatePicker State
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateValue, setDateValue] = useState(new Date());

    // Custom Modals State
    const [selectionModalVisible, setSelectionModalVisible] = useState(false);
    const [selectionType, setSelectionType] = useState('');
    const [hobbiesModalVisible, setHobbiesModalVisible] = useState(false);
    const [selectedHobbies, setSelectedHobbies] = useState([]);
    const [activeHobbyTab, setActiveHobbyTab] = useState('Food');
    const [dropdownSearchQuery, setDropdownSearchQuery] = useState("");

    // Helper for relative profile image URLs
    const getProfileImageUri = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `https://landing.hostingsky.in${url}`;
    };

    // Load initial profile data and master dropdowns
    useEffect(() => {
        // Initialize hobbies fallback
        const fallback = {};
        Object.keys(HOBBIES_DATA).forEach(cat => {
            fallback[cat] = HOBBIES_DATA[cat].map((item, idx) => ({
                id: idx + 1,
                label: item.label,
                emoji: item.emoji
            }));
        });
        setHobbiesData(fallback);

        const loadInitialData = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);

                // 1. Fetch Masters
                const mastersRes = await apiService.get(`api/Master/GetMasterDropdown?typeId=1,2,3,4,7&userId=${userId}`);
                if (mastersRes.data) {
                    const data = mastersRes.data;
                    if (data.languageMaster) setLanguageList(data.languageMaster);
                    if (data.occupationMaster) setOccupationList(data.occupationMaster);
                    if (data.relationshipStatusMaster) setRelationshipList(data.relationshipStatusMaster);
                    if (data.countryMaster) setCountryList(data.countryMaster);

                    if (data.hobbyCategoryMaster) {
                        const parsedHobbies = {};
                        data.hobbyCategoryMaster.forEach(cat => {
                            parsedHobbies[cat.categoryName] = cat.hobbyMaster.map(h => ({
                                id: h.hobbyId,
                                label: h.name,
                                emoji: h.icon || "✨"
                            }));
                        });
                        setHobbiesData(parsedHobbies);
                    }
                }

                // 2. Load User Profile
                let userProfile = profile;
                if (!userProfile) {
                    const profileRes = await apiService.get(`api/User/${userId}/profile`);
                    if (profileRes.success && profileRes.data) {
                        userProfile = profileRes.data;
                        dispatch(setProfile(userProfile));
                    }
                }

                if (userProfile) {
                    setName(userProfile.name || userProfile.displayName || "");
                    setBio(userProfile.bio || "");
                    setGender(userProfile.gender || "Female");

                    if (userProfile.birthday) {
                        setBirthday(userProfile.birthday.split('T')[0]);
                        setDateValue(new Date(userProfile.birthday));
                    } else if (userProfile.dob) {
                        setBirthday(userProfile.dob.split('T')[0]);
                        setDateValue(new Date(userProfile.dob));
                    }

                    setHeight(userProfile.height ? `${userProfile.height} ${userProfile.heightUnit || 'cm'}` : "");
                    setWeight(userProfile.weight ? `${userProfile.weight} ${userProfile.weightUnit || 'kg'}` : "");

                    setCountry(userProfile.countryName || "");
                    setCountryId(userProfile.countryId || null);

                    setState(userProfile.stateName || "");
                    setStateId(userProfile.stateId || null);

                    setCity(userProfile.cityName || "");
                    setCityId(userProfile.cityId || null);

                    setRelationship(userProfile.relation || "");
                    setRelationshipId(userProfile.relationshipId || null);

                    setOccupation(userProfile.occupationName || "");
                    setOccupationId(userProfile.occupationId || null);

                    setLanguage(userProfile.languageName || "");
                    setLanguageId(userProfile.languageId || null);

                    if (userProfile.hobbies) {
                        setSelectedHobbies(userProfile.hobbies.map(h => ({
                            id: h.hobbyId,
                            label: h.hobbyName,
                            emoji: h.hobbyIcon || "✨"
                        })));
                    }

                    if (userProfile.albums) {
                        const uris = [null, null, null, null, null, null];
                        userProfile.albums.forEach((album, idx) => {
                            if (idx < 6) {
                                uris[idx] = getProfileImageUri(album.albumPath);
                            }
                        });
                        setAlbumLocalUris(uris);
                    }

                    // 3. Conditional fetches of States/Cities if user profile had them
                    if (userProfile.countryId) {
                        const stateRes = await apiService.get('api/Master/GetMasterDropdown', { typeId: '5', countryId: userProfile.countryId });
                        if (stateRes.data && stateRes.data.stateMaster) {
                            setStatesList(stateRes.data.stateMaster);
                        }
                    }

                    if (userProfile.stateId) {
                        const cityRes = await apiService.get('api/Master/GetMasterDropdown', { typeId: '6', stateId: userProfile.stateId });
                        if (cityRes.data && cityRes.data.cityMaster) {
                            setCitiesList(cityRes.data.cityMaster);
                        }
                    }
                }
            } catch (err) {
                console.error("Error loading initial data:", err);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const openEditModal = (key, label, value) => {
        if (key === 'birthday') {
            const current = new Date(birthday);
            setDateValue(isNaN(current) ? new Date() : current);
            setShowDatePicker(true);
            return;
        }
        if (key === 'relationship' || key === 'occupation' || key === 'language' || key === 'country' || key === 'state' || key === 'city' || key === 'gender') {
            setSelectionType(key);
            setDropdownSearchQuery("");
            setSelectionModalVisible(true);
            return;
        }
        setCurrentField({ key, label, value });
        setEditValue(value);
        setModalVisible(true);
    };

    const handleSave = () => {
        switch (currentField.key) {
            case 'name': setName(editValue); saveProfileData({ name: editValue }); break;
            case 'birthday': setBirthday(editValue); saveProfileData({ birthday: editValue }); break;
            case 'height': setHeight(editValue); saveProfileData({ height: editValue }); break;
            case 'weight': setWeight(editValue); saveProfileData({ weight: editValue }); break;
            case 'bio': setBio(editValue); saveProfileData({ bio: editValue }); break;
        }
        setModalVisible(false);
    };

    const getRelationshipEmoji = (name) => {
        const found = RELATIONSHIP_OPTIONS.find(o => o.label.toLowerCase() === name?.toLowerCase());
        return found ? found.emoji : "💑";
    };

    const getOccupationEmoji = (name) => {
        const found = OCCUPATION_OPTIONS.find(o => o.label.toLowerCase() === name?.toLowerCase());
        return found ? found.emoji : "💼";
    };

    const getLanguageEmoji = (name) => {
        const found = LANGUAGE_OPTIONS.find(o => o.label.toLowerCase() === name?.toLowerCase());
        return found ? found.emoji : "🌐";
    };

    const getSelectionOptions = () => {
        let options = [];
        switch (selectionType) {
            case 'gender':
                options = GENDER_OPTIONS;
                break;
            case 'relationship':
                options = relationshipList.length > 0
                    ? relationshipList.map(item => ({ id: item.relationshipId, label: item.relation, emoji: getRelationshipEmoji(item.relation) }))
                    : RELATIONSHIP_OPTIONS.map((item, idx) => ({ id: idx + 1, label: item.label, emoji: item.emoji }));
                break;
            case 'occupation':
                options = occupationList.length > 0
                    ? occupationList.map(item => ({ id: item.occupationId, label: item.occupationName, emoji: getOccupationEmoji(item.occupationName) }))
                    : OCCUPATION_OPTIONS.map((item, idx) => ({ id: idx + 1, label: item.label, emoji: item.emoji }));
                break;
            case 'language':
                options = languageList.length > 0
                    ? languageList.map(item => ({ id: item.languageId, label: item.languageName, emoji: getLanguageEmoji(item.languageName) }))
                    : LANGUAGE_OPTIONS.map((item, idx) => ({ id: idx + 1, label: item.label, emoji: item.emoji }));
                break;
            case 'country':
                options = countryList.map(item => ({ id: item.countryId, label: item.countryName, emoji: "🏳️" }));
                break;
            case 'state':
                options = statesList.map(item => ({ id: item.stateId, label: item.stateName, emoji: "📍" }));
                break;
            case 'city':
                options = citiesList.map(item => ({ id: item.cityId, label: item.cityName, emoji: "🏙️" }));
                break;
            default:
                options = [];
        }

        if (dropdownSearchQuery.trim()) {
            const query = dropdownSearchQuery.toLowerCase();
            return options.filter(opt => opt.label && opt.label.toLowerCase().includes(query));
        }

        if (options.length > 40) {
            return options.slice(0, 40);
        }

        return options;
    };

    const handleSelectOption = async (item) => {
        if (selectionType === 'gender') {
            setGender(item.label);
            saveProfileData({ gender: item.label });
        } else if (selectionType === 'relationship') {
            setRelationship(item.label);
            setRelationshipId(item.id);
            saveProfileData({ relationshipId: item.id });
        } else if (selectionType === 'occupation') {
            setOccupation(item.label);
            setOccupationId(item.id);
            saveProfileData({ occupationId: item.id });
        } else if (selectionType === 'language') {
            setLanguage(item.label);
            setLanguageId(item.id);
            saveProfileData({ languageId: item.id });
        } else if (selectionType === 'country') {
            setCountry(item.label);
            setCountryId(item.id);
            setState('');
            setStateId(null);
            setCity('');
            setCityId(null);
            setStatesList([]);
            setCitiesList([]);
            saveProfileData({ countryId: item.id, stateId: null, cityId: null });
            try {
                const stateRes = await apiService.get('api/Master/GetMasterDropdown', { typeId: '5', countryId: item.id });
                if (stateRes.data && stateRes.data.stateMaster) {
                    setStatesList(stateRes.data.stateMaster);
                }
            } catch (err) {
                console.error("Error fetching states:", err);
            }
        } else if (selectionType === 'state') {
            setState(item.label);
            setStateId(item.id);
            setCity('');
            setCityId(null);
            setCitiesList([]);
            saveProfileData({ stateId: item.id, cityId: null });
            try {
                const cityRes = await apiService.get('api/Master/GetMasterDropdown', { typeId: '6', stateId: item.id });
                if (cityRes.data && cityRes.data.cityMaster) {
                    setCitiesList(cityRes.data.cityMaster);
                }
            } catch (err) {
                console.error("Error fetching cities:", err);
            }
        } else if (selectionType === 'city') {
            setCity(item.label);
            setCityId(item.id);
            saveProfileData({ cityId: item.id });
        }
        setSelectionModalVisible(false);
    };

    const handleSelectAvatar = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
            if (response.assets && response.assets.length > 0) {
                const asset = response.assets[0];
                const fileObj = {
                    uri: asset.uri,
                    name: asset.fileName || 'avatar.jpg',
                    type: asset.type || 'image/jpeg'
                };
                setAvatarFile(fileObj);
                setAvatarLocalUri(asset.uri);
                saveProfileData({ avatarFile: fileObj });
            }
        });
    };

    const handleSelectAlbumImage = (index) => {
        launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
            if (response.assets && response.assets.length > 0) {
                const asset = response.assets[0];
                const fileObj = {
                    uri: asset.uri,
                    name: asset.fileName || `album_${index}.jpg`,
                    type: asset.type || 'image/jpeg'
                };
                const newAlbums = [...albumFiles];
                newAlbums[index] = fileObj;
                setAlbumFiles(newAlbums);

                const newUris = [...albumLocalUris];
                newUris[index] = asset.uri;
                setAlbumLocalUris(newUris);
                saveProfileData({ albumFiles: newAlbums });
            }
        });
    };

    const handleDeleteAlbumImage = (index) => {
        const newAlbums = [...albumFiles];
        newAlbums[index] = null;
        setAlbumFiles(newAlbums);

        const newUris = [...albumLocalUris];
        newUris[index] = null;
        setAlbumLocalUris(newUris);
        saveProfileData({ albumFiles: newAlbums });
    };

    const saveProfileData = async (overrides = {}) => {
        try {
            setSaving(true);
            const formData = new FormData();

            const finalName = overrides.hasOwnProperty('name') ? overrides.name : name;
            const finalBio = overrides.hasOwnProperty('bio') ? overrides.bio : bio;
            const finalGender = overrides.hasOwnProperty('gender') ? overrides.gender : gender;
            const finalBirthday = overrides.hasOwnProperty('birthday') ? overrides.birthday : birthday;

            const finalHeightStr = overrides.hasOwnProperty('height') ? overrides.height : height;
            const finalWeightStr = overrides.hasOwnProperty('weight') ? overrides.weight : weight;

            const finalCountryId = overrides.hasOwnProperty('countryId') ? overrides.countryId : countryId;
            const finalStateId = overrides.hasOwnProperty('stateId') ? overrides.stateId : stateId;
            const finalCityId = overrides.hasOwnProperty('cityId') ? overrides.cityId : cityId;

            const finalRelationshipId = overrides.hasOwnProperty('relationshipId') ? overrides.relationshipId : relationshipId;
            const finalOccupationId = overrides.hasOwnProperty('occupationId') ? overrides.occupationId : occupationId;
            const finalLanguageId = overrides.hasOwnProperty('languageId') ? overrides.languageId : languageId;

            const finalHobbies = overrides.hasOwnProperty('selectedHobbies') ? overrides.selectedHobbies : selectedHobbies;
            const finalAvatarFile = overrides.hasOwnProperty('avatarFile') ? overrides.avatarFile : avatarFile;
            const finalAlbumFiles = overrides.hasOwnProperty('albumFiles') ? overrides.albumFiles : albumFiles;

            formData.append('DisplayName', finalName);
            formData.append('Bio', finalBio);
            formData.append('Gender', finalGender);

            if (finalBirthday) {
                formData.append('Dob', `${finalBirthday}T00:00:00.000Z`);
            }

            // Height and Weight parsing
            const heightVal = parseInt(finalHeightStr) || 0;
            const heightUnitVal = finalHeightStr.toLowerCase().includes('ft') ? 'ft' : 'cm';

            const weightVal = parseInt(finalWeightStr) || 0;
            const weightUnitVal = finalWeightStr.toLowerCase().includes('lbs') ? 'lbs' : 'kg';

            formData.append('Height', heightVal.toString());
            formData.append('HeightUnit', heightUnitVal);
            formData.append('Weight', weightVal.toString());
            formData.append('WeightUnit', weightUnitVal);

            if (finalCountryId !== null && finalCountryId !== undefined) formData.append('CountryId', finalCountryId.toString());
            if (finalStateId !== null && finalStateId !== undefined) formData.append('StateId', finalStateId.toString());
            if (finalCityId !== null && finalCityId !== undefined) formData.append('CityId', finalCityId.toString());
            if (finalRelationshipId !== null && finalRelationshipId !== undefined) formData.append('RelationshipId', finalRelationshipId.toString());
            if (finalOccupationId !== null && finalOccupationId !== undefined) formData.append('OccupationId', finalOccupationId.toString());
            if (finalLanguageId !== null && finalLanguageId !== undefined) formData.append('LanguageId', finalLanguageId.toString());

            // Append HobbyIds
            finalHobbies.forEach(h => {
                if (h.id !== null && h.id !== undefined) {
                    formData.append('HobbyIds', h.id.toString());
                }
            });

            // Avatar Upload
            if (finalAvatarFile) {
                formData.append('ProfilePictureUrl', {
                    uri: Platform.OS === 'android' ? finalAvatarFile.uri : finalAvatarFile.uri.replace('file://', ''),
                    name: finalAvatarFile.name || 'avatar.jpg',
                    type: finalAvatarFile.type || 'image/jpeg'
                });
            } else {
                const currentAvatar = profile?.profilePictureUrl || profile?.avatarUrl || "";
                formData.append('AvatarUrl', currentAvatar);
            }

            // Album Images Upload
            finalAlbumFiles.forEach((file, index) => {
                if (file) {
                    formData.append('Albums', {
                        uri: Platform.OS === 'android' ? file.uri : file.uri.replace('file://', ''),
                        name: file.name || `album_${index}.jpg`,
                        type: file.type || 'image/jpeg'
                    });
                }
            });

            const url = `https://landing.hostingsky.in/api/User/${userId}`;
            console.log('Sending PUT request to ' + url);

            const response = await fetch(url, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer tempToken'
                }
            });

            console.log('Update API Response status:', response.status);
            const responseText = await response.text();
            console.log('Update API Response text:', responseText);

            let resJson = {};
            try {
                resJson = JSON.parse(responseText);
            } catch (e) {
                console.error('Error parsing response JSON:', e);
            }

            if (response.ok || resJson.status || resJson.success) {
                // Fetch fresh profile data to update Redux store
                const freshRes = await apiService.get(`api/User/${userId}/profile`);
                if (freshRes.success && freshRes.data) {
                    dispatch(setProfile(freshRes.data));
                }
            } else {
                Alert.alert('Error', resJson.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Something went wrong while saving profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#22c55e" />
                <Text style={{ marginTop: 12, color: '#4b5563', fontWeight: '600' }}>Loading Profile Details...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <ChevronLeft color="#000" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>

                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* 1. Profile Photo Section */}
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Profile Photo</Text>
                        <TouchableOpacity style={styles.upgradeBtn}>
                            <Text style={styles.upgradeText}>Upgrade to SVIP7, upload GIF</Text>
                            <ChevronRight color="#c2410c" size={14} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.avatarContainer}>
                        <TouchableOpacity style={styles.avatarWrapper} onPress={handleSelectAvatar}>
                            <Image
                                source={avatarLocalUri ? { uri: avatarLocalUri } : (profile?.avatarUrl || profile?.profilePictureUrl ? { uri: getProfileImageUri(profile.avatarUrl || profile.profilePictureUrl) } : require('../assets/av1.jpg'))}
                                style={styles.avatarImage}
                            />
                            <View style={styles.cameraBadge}>
                                <Camera color="#fff" size={12} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSelectAvatar}>
                            <Text style={styles.changePhotoText}>Change Profile Photo</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.verifyBanner}>
                        <ShieldCheck color="#166534" size={20} />
                        <View style={styles.verifyBannerTextContainer}>
                            <Text style={styles.verifyBannerTitle}>Verify the profile photo is yourself</Text>
                            <Text style={styles.verifyBannerSub}>You will get verification mark</Text>
                        </View>
                        <TouchableOpacity style={styles.verifyBtnSmall}>
                            <Text style={styles.verifyBtnSmallText}>Verify</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 2. Album Section */}
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Album <Text style={styles.countText}>{albumLocalUris.filter(x => x).length}/6</Text></Text>
                        <TouchableOpacity style={styles.tipsBtn}>
                            <HelpCircle color="#6b7280" size={14} />
                            <Text style={styles.tipsText}>Tips</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.albumGrid}>
                        {[0, 1, 2, 3, 4, 5].map((index) => {
                            const uri = albumLocalUris[index];
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.albumItem}
                                    onPress={() => handleSelectAlbumImage(index)}
                                    activeOpacity={0.8}
                                >
                                    {uri ? (
                                        <>
                                            <Image source={{ uri }} style={styles.albumImage} />
                                            <View style={styles.albumVerifyBadge}>
                                                <Text style={styles.albumVerifyText}>Verify</Text>
                                            </View>
                                            {/* Delete Overlay Button */}
                                            <TouchableOpacity
                                                style={styles.albumDeleteBtn}
                                                onPress={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteAlbumImage(index);
                                                }}
                                            >
                                                <X color="#fff" size={10} />
                                            </TouchableOpacity>
                                        </>
                                    ) : (
                                        <View style={styles.albumPlaceholder}>
                                            <Plus color="#9ca3af" size={20} />
                                            <Text style={styles.addPhotoText}>Add</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* 4. Basic Information Section */}
                <View style={styles.card}>
                    <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Basic information</Text>
                    <InfoRow label="Name" value={name} onPress={() => openEditModal('name', 'Name', name)} />
                    <InfoRow label="Gender" value={gender} onPress={() => openEditModal('gender', 'Gender', gender)} />
                    <InfoRow label="Birthday" value={birthday} onPress={() => openEditModal('birthday', 'Birthday', birthday)} />
                    <InfoRow label="Height" value={height} onPress={() => openEditModal('height', 'Height', height)} />
                    <InfoRow label="Weight" value={weight} onPress={() => openEditModal('weight', 'Weight', weight)} />
                    <InfoRow label="Country" value={country} onPress={() => openEditModal('country', 'Country', country)} />
                    <InfoRow label="State" value={state} onPress={() => openEditModal('state', 'State', state)} />
                    <InfoRow label="City Location" value={city} onPress={() => openEditModal('city', 'City Location', city)} />
                    <InfoRow label="Relationship Status" value={relationship} onPress={() => openEditModal('relationship', 'Relationship Status', relationship)} />
                    <InfoRow label="Occupation" value={occupation} onPress={() => openEditModal('occupation', 'Occupation', occupation)} />
                    <InfoRow label="Native Language" value={language} onPress={() => openEditModal('language', 'Native Language', language)} />
                </View>

                {/* 5. Hobbies Section */}
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Hobbies <Text style={styles.countText}>{selectedHobbies.length}/10</Text></Text>
                        <TouchableOpacity style={styles.tipsBtn} onPress={() => setHobbiesModalVisible(true)}>
                            <Text style={styles.tipsText}>Edit</Text>
                            <ChevronRight color="#6b7280" size={16} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.pillsContainer}>
                        {selectedHobbies.map((item, index) => (
                            <View key={index} style={[styles.pill, styles.selectionPillActive]}>
                                <Text style={styles.pillEmoji}>{item.emoji}</Text>
                                <Text style={[styles.pillText, styles.selectionPillTextActive]}>{item.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* 6. Bio Section */}
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Bio</Text>
                        <TouchableOpacity style={styles.tipsBtn} onPress={() => openEditModal('bio', 'Bio', bio)}>
                            <Text style={styles.tipsText}>Edit</Text>
                            <ChevronRight color="#6b7280" size={16} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.bioText}>{bio}</Text>
                </View>

                {/* 7. Other Information Section */}
                <View style={styles.card}>
                    <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Other Information</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Telegram</Text>
                        <TouchableOpacity style={styles.infoRight}>
                            <Text style={styles.addText}>Add</Text>
                            <ChevronRight color="#22c55e" size={16} />
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>

            {/* Edit Modal */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Edit {currentField.label}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <X color="#9ca3af" size={24} />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={[
                                styles.modalInput,
                                currentField.key === 'bio' && { height: 100, textAlignVertical: 'top' }
                            ]}
                            value={editValue}
                            onChangeText={setEditValue}
                            autoFocus={true}
                            multiline={currentField.key === 'bio'}
                        />
                        <TouchableOpacity style={styles.submitBtn} onPress={handleSave}>
                            <Text style={styles.submitBtnText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Selection Modal */}
            <Modal visible={selectionModalVisible} transparent={true} animationType="slide" onRequestClose={() => setSelectionModalVisible(false)}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSelectionModalVisible(false)}>
                    <View style={[styles.modalContent, { height: '80%' }]} onStartShouldSetResponder={() => true}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {selectionType === 'occupation' && 'Occupation'}
                                {selectionType === 'language' && 'Native Language'}
                                {selectionType === 'relationship' && 'Relationship Status'}
                                {selectionType === 'country' && 'Country'}
                                {selectionType === 'state' && 'State'}
                                {selectionType === 'city' && 'City Location'}
                                {selectionType === 'gender' && 'Gender'}
                            </Text>
                            <TouchableOpacity onPress={() => setSelectionModalVisible(false)}>
                                <X color="#9ca3af" size={24} />
                            </TouchableOpacity>
                        </View>

                        {/* Search Input for lists */}
                        {['country', 'state', 'city', 'occupation', 'language'].includes(selectionType) && (
                            <View style={styles.searchBarContainer}>
                                <TextInput
                                    style={styles.dropdownSearchInput}
                                    placeholder="Search..."
                                    placeholderTextColor="#9ca3af"
                                    value={dropdownSearchQuery}
                                    onChangeText={setDropdownSearchQuery}
                                    autoCapitalize="none"
                                    clearButtonMode="while-editing"
                                />
                            </View>
                        )}

                        <ScrollView contentContainerStyle={styles.selectionPillsContainer}>
                            {getSelectionOptions().map((item, index) => {
                                let isSelected = false;
                                if (selectionType === 'relationship') isSelected = relationshipId === item.id || relationship === item.label;
                                else if (selectionType === 'occupation') isSelected = occupationId === item.id || occupation === item.label;
                                else if (selectionType === 'language') isSelected = languageId === item.id || language === item.label;
                                else if (selectionType === 'country') isSelected = countryId === item.id || country === item.label;
                                else if (selectionType === 'state') isSelected = stateId === item.id || state === item.label;
                                else if (selectionType === 'city') isSelected = cityId === item.id || city === item.label;
                                else if (selectionType === 'gender') isSelected = gender === item.label;

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.selectionPill, isSelected && styles.selectionPillActive]}
                                        onPress={() => handleSelectOption(item)}
                                    >
                                        <Text style={styles.pillEmoji}>{item.emoji}</Text>
                                        <Text style={[styles.selectionPillText, isSelected && styles.selectionPillTextActive]}>{item.label}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Hobbies Modal */}
            <Modal visible={hobbiesModalVisible} transparent={true} animationType="slide" onRequestClose={() => setHobbiesModalVisible(false)}>
                <View style={styles.fullModalContainer}>
                    <View style={styles.hobbiesHeader}>
                        <TouchableOpacity onPress={() => setHobbiesModalVisible(false)} style={styles.closeBtn}>
                            <X color="#111827" size={24} />
                        </TouchableOpacity>
                        <Text style={styles.hobbiesTitle}>1/1{"\n"}Hobbies</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    <View style={styles.hobbiesTabsRow}>
                        {Object.keys(hobbiesData).map(tab => (
                            <TouchableOpacity key={tab} onPress={() => setActiveHobbyTab(tab)}>
                                <Text style={[styles.hobbiesTab, activeHobbyTab === tab && styles.hobbiesTabActive]}>{tab}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <ScrollView contentContainerStyle={styles.hobbiesScrollContent}>
                        <View style={styles.selectionPillsContainer}>
                            {(hobbiesData[activeHobbyTab] || []).map((item, index) => {
                                const isSelected = selectedHobbies.some(h => h.id === item.id || h.label === item.label);
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.selectionPill, isSelected && styles.selectionPillActive]}
                                        onPress={() => {
                                            if (isSelected) {
                                                setSelectedHobbies(prev => prev.filter(h => h.id !== item.id && h.label !== item.label));
                                            } else {
                                                if (selectedHobbies.length < 10) {
                                                    setSelectedHobbies(prev => [...prev, item]);
                                                }
                                            }
                                        }}
                                    >
                                        <Text style={styles.pillEmoji}>{item.emoji}</Text>
                                        <Text style={[styles.selectionPillText, isSelected && styles.selectionPillTextActive]}>{item.label}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </ScrollView>

                    <View style={styles.hobbiesFooter}>
                        <Text style={styles.hobbiesSelectedCount}>Selected:{selectedHobbies.length}/10</Text>
                        <TouchableOpacity style={styles.hobbiesDoneBtn} onPress={() => { setHobbiesModalVisible(false); saveProfileData({ selectedHobbies }); }}>
                            <Text style={styles.hobbiesDoneText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {showDatePicker && (
                <DateTimePicker
                    value={dateValue}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                            setDateValue(selectedDate);
                            const formatted = selectedDate.toISOString().split('T')[0];
                            setBirthday(formatted);
                            saveProfileData({ birthday: formatted });
                        }
                    }}
                />
            )}
        </SafeAreaView>
    );
}

const InfoRow = ({ label, value, onPress, isSwitch, switchValue, onSwitchChange }) => (
    <TouchableOpacity style={styles.infoRow} onPress={onPress} disabled={isSwitch}>
        <View style={{ flex: 1 }}>
            <Text style={styles.infoLabel}>{label}</Text>
            {isSwitch && <Text style={styles.infoSubLabel}>Shown after a 3-day streak</Text>}
        </View>
        <View style={styles.infoRight}>
            {isSwitch ? (
                <Switch value={switchValue} onValueChange={onSwitchChange} trackColor={{ false: "#d1d5db", true: "#22c55e" }} thumbColor="#fff" />
            ) : (
                <>
                    <Text style={styles.infoValue}>{value || "Not Set"}</Text>
                    <ChevronRight color="#9ca3af" size={16} />
                </>
            )}
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? StatusBar.currentHeight + 8 : 28) : 12,
        paddingBottom: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    saveButton: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        backgroundColor: '#e8f5e9',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#86efac',
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#16a34a',
        fontSize: 14,
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: 12,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    countText: {
        color: '#6b7280',
        fontWeight: 'normal',
        fontSize: 14,
    },
    upgradeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    upgradeText: {
        color: '#c2410c',
        fontSize: 12,
        fontWeight: '600',
        marginRight: 4,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarWrapper: {
        position: 'relative',
        width: 80,
        height: 80,
        marginBottom: 8,
    },
    avatarImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    cameraBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#22c55e',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    changePhotoText: {
        color: '#374151',
        fontSize: 12,
        fontWeight: '500',
    },
    verifyBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#dcfce7',
        padding: 12,
        borderRadius: 8,
    },
    verifyBannerTextContainer: {
        flex: 1,
        marginLeft: 8,
    },
    verifyBannerTitle: {
        color: '#166534',
        fontSize: 12,
        fontWeight: 'bold',
    },
    verifyBannerSub: {
        color: '#166534',
        fontSize: 11,
    },
    verifyBtnSmall: {
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    verifyBtnSmallText: {
        color: '#111827',
        fontSize: 12,
        fontWeight: 'bold',
    },
    tipsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tipsText: {
        color: '#6b7280',
        fontSize: 13,
        marginLeft: 4,
    },
    albumGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 10,
    },
    albumItem: {
        width: (width - 64) / 3,
        aspectRatio: 1,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
    },
    albumImage: {
        width: '100%',
        height: '100%',
    },
    albumVerifyBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: '#fff',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
    },
    albumVerifyText: {
        color: '#16a34a',
        fontSize: 10,
        fontWeight: 'bold',
    },
    albumPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f9fafb',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderStyle: 'dashed',
    },
    addPhotoText: {
        fontSize: 10,
        color: '#9ca3af',
        marginTop: 4,
        fontWeight: 'bold',
    },
    albumDeleteBtn: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(239, 68, 68, 0.85)',
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    infoLabel: {
        fontSize: 15,
        color: '#111827',
        fontWeight: '500',
    },
    infoRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoValue: {
        fontSize: 15,
        color: '#4b5563',
        marginRight: 8,
    },
    infoSubLabel: {
        fontSize: 12,
        color: '#9ca3af',
        marginTop: 2,
    },
    pillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f3f4f6',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    pillEmoji: {
        fontSize: 14,
        marginRight: 4,
    },
    pillText: {
        color: '#111827',
        fontSize: 13,
        fontWeight: '500',
    },
    bioText: {
        color: '#4b5563',
        fontSize: 14,
        lineHeight: 20,
    },
    addText: {
        color: '#22c55e',
        fontSize: 14,
        fontWeight: '600',
        marginRight: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 20,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#111827',
        marginBottom: 20,
    },
    submitBtn: {
        backgroundColor: '#4ade80',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    selectionPillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 10,
    },
    selectionPill: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#fff',
    },
    selectionPillActive: {
        borderColor: '#86efac',
        backgroundColor: '#f0fdf4',
    },
    selectionPillText: {
        color: '#4b5563',
        fontSize: 14,
        fontWeight: '500',
    },
    selectionPillTextActive: {
        color: '#16a34a',
    },
    fullModalContainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
    },
    hobbiesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    hobbiesTitle: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    closeBtn: {
        padding: 5,
    },
    hobbiesTabsRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
        gap: 24,
    },
    hobbiesTab: {
        fontSize: 15,
        color: '#9ca3af',
        fontWeight: '600',
    },
    hobbiesTabActive: {
        color: '#111827',
    },
    hobbiesScrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    hobbiesFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderTopWidth: 1,
        borderColor: '#f3f4f6',
        backgroundColor: '#fff',
    },
    hobbiesSelectedCount: {
        fontSize: 14,
        color: '#4b5563',
        fontWeight: '500',
    },
    hobbiesDoneBtn: {
        backgroundColor: '#22c55e',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 8,
    },
    hobbiesDoneText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
    searchBarContainer: {
        marginBottom: 12,
        paddingHorizontal: 2,
    },
    dropdownSearchInput: {
        backgroundColor: '#f3f4f6',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === 'ios' ? 12 : 8,
        fontSize: 15,
        color: '#111827',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    }
});
