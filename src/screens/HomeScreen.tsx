import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import NoteCard from '../components/NoteCard';
import CategoryChip from '../components/CategoryChip';
import { getUserNotes, deleteNote } from '../services/firebase';
import { signOut, getCurrentUser } from '../services/auth';
import { CATEGORIES } from '../utils/constants';
import { Note, RootStackParamList } from '../types';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const user = getCurrentUser();

  useEffect(() => {
    if (user) {
      const unsubscribe = getUserNotes(user.uid, setNotes);
      return () => unsubscribe();
    }
  }, [user]);

  const handleDeleteNote = (noteId: string): void => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteNote(noteId),
      },
    ]);
  };

  const handleSignOut = (): void => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => signOut(),
      },
    ]);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-100">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 bg-blue-500 rounded-xl justify-center items-center">
              <Text className="text-2xl">📝</Text>
            </View>
            <View>
              <Text className="text-2xl font-bold text-gray-800">My Notes</Text>
              <Text className="text-sm text-gray-500">
                {notes.length} notes
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3">
            {user?.photoURL && (
              <Image
                source={{ uri: user.photoURL }}
                className="w-10 h-10 rounded-full border-2 border-blue-200"
              />
            )}
            <TouchableOpacity onPress={handleSignOut} className="p-2">
              <Icon name="log-out" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View className="bg-white mx-4 my-4 px-4 rounded-xl border border-gray-200 flex-row items-center">
        <Icon name="search" size={20} color="#9CA3AF" />
        <TextInput
          className="flex-1 py-3 px-2 text-base text-gray-800"
          placeholder="Search notes..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="max-h-12 px-4 mb-2"
      >
        <CategoryChip
          category="all"
          selected={selectedCategory === 'all'}
          onPress={() => setSelectedCategory('all')}
        />
        {CATEGORIES.map(category => (
          <CategoryChip
            key={category}
            category={category}
            selected={selectedCategory === category}
            onPress={() => setSelectedCategory(category)}
          />
        ))}
      </ScrollView>

      {/* Notes List */}
      <FlatList
        data={filteredNotes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onPress={() => navigation.navigate('NoteEditor', { note: item })}
            onDelete={() => handleDeleteNote(item.id)}
            onEdit={() => navigation.navigate('NoteEditor', { note: item })}
          />
        )}
        contentContainerStyle={{ paddingVertical: 8, paddingBottom: 80 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-16">
            <Text className="text-6xl mb-4">📝</Text>
            <Text className="text-xl font-semibold text-gray-600 mb-2">
              No notes found
            </Text>
            <Text className="text-sm text-gray-400 text-center">
              {searchTerm
                ? 'Try a different search term'
                : 'Create your first note to get started'}
            </Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute right-6 bottom-6 w-14 h-14 bg-blue-500 rounded-full justify-center items-center shadow-lg"
        onPress={() => navigation.navigate('NoteEditor')}
        activeOpacity={0.8}
      >
        <Icon name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
