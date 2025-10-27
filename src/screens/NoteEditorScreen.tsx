import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { createNote, updateNote } from '../services/firebase';
import { getCurrentUser } from '../services/auth';
import { CATEGORIES } from '../utils/constants';
import { Category, RootStackParamList } from '../types';

type NoteEditorScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'NoteEditor'
>;
type NoteEditorScreenRouteProp = RouteProp<RootStackParamList, 'NoteEditor'>;

interface NoteEditorScreenProps {
  navigation: NoteEditorScreenNavigationProp;
  route: NoteEditorScreenRouteProp;
}

const NoteEditorScreen: React.FC<NoteEditorScreenProps> = ({
  route,
  navigation,
}) => {
  const { note } = route.params || {};
  const isEditing = !!note;
  const user = getCurrentUser();

  const [title, setTitle] = useState<string>(note?.title || '');
  const [content, setContent] = useState<string>(note?.content || '');
  const [category, setCategory] = useState<Category>(
    note?.category || 'personal',
  );
  const [saving, setSaving] = useState<boolean>(false);

  const getCategoryStyle = (cat: string): string => {
    const styles: Record<string, string> = {
      personal: 'bg-blue-100',
      work: 'bg-purple-100',
      ideas: 'bg-yellow-100',
      tasks: 'bg-green-100',
    };
    return styles[cat] || 'bg-gray-100';
  };

  const getCategoryTextStyle = (cat: string): string => {
    const styles: Record<string, string> = {
      personal: 'text-blue-700',
      work: 'text-purple-700',
      ideas: 'text-yellow-700',
      tasks: 'text-green-700',
    };
    return styles[cat] || 'text-gray-700';
  };

  const handleSave = async (): Promise<void> => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
      setSaving(true);
      const noteData = { title, content, category };

      if (isEditing && note) {
        await updateNote(note.id, noteData);
      } else {
        await createNote(user.uid, noteData);
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save note');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-100 flex-row justify-between items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Icon name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">
          {isEditing ? 'Edit Note' : 'New Note'}
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          className="p-2"
        >
          <Icon name="check" size={24} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 pt-5">
        {/* Title Input */}
        <TextInput
          className="text-2xl font-bold text-gray-800 mb-5 py-2"
          placeholder="Note title"
          placeholderTextColor="#9CA3AF"
          value={title}
          onChangeText={setTitle}
          multiline
        />

        {/* Category Selector */}
        <View className="mb-5">
          <View className="flex-row items-center gap-2 mb-3">
            <Icon name="tag" size={16} color="#6B7280" />
            <Text className="text-sm font-semibold text-gray-600">
              Category
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                className={`px-4 py-2 rounded-xl mr-2 ${
                  category === cat ? getCategoryStyle(cat) : 'bg-gray-100'
                }`}
                onPress={() => setCategory(cat)}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-sm ${
                    category === cat
                      ? `font-semibold ${getCategoryTextStyle(cat)}`
                      : 'text-gray-600'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content Input */}
        <TextInput
          className="text-base text-gray-800 leading-6"
          placeholder="Write your note here..."
          placeholderTextColor="#9CA3AF"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          style={{ minHeight: 300 }}
        />
      </ScrollView>
    </View>
  );
};

export default NoteEditorScreen;
