import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { formatDate } from '../utils/constants';
import { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onPress,
  onDelete,
  onEdit,
}) => {
  const getCategoryStyle = (category: string): string => {
    const styles: Record<string, string> = {
      personal: 'bg-blue-100',
      work: 'bg-purple-100',
      ideas: 'bg-yellow-100',
      tasks: 'bg-green-100',
    };
    return styles[category] || 'bg-gray-100';
  };

  const getCategoryTextStyle = (category: string): string => {
    const styles: Record<string, string> = {
      personal: 'text-blue-700',
      work: 'text-purple-700',
      ideas: 'text-yellow-700',
      tasks: 'text-green-700',
    };
    return styles[category] || 'text-gray-700';
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-5 mx-4 mb-3 shadow-sm border border-gray-100"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View
          className={`px-3 py-1 rounded-full ${getCategoryStyle(
            note.category,
          )}`}
        >
          <Text
            className={`text-xs font-semibold ${getCategoryTextStyle(
              note.category,
            )}`}
          >
            {note.category}
          </Text>
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity onPress={onEdit} className="p-1">
            <Icon name="edit-2" size={16} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} className="p-1">
            <Icon name="trash-2" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <Text className="font-bold text-lg text-gray-800 mb-2" numberOfLines={2}>
        {note.title}
      </Text>
      <Text className="text-gray-600 text-sm mb-4" numberOfLines={3}>
        {note.content}
      </Text>

      <View className="flex-row items-center gap-2">
        <Icon name="calendar" size={12} color="#9CA3AF" />
        <Text className="text-xs text-gray-400">
          {formatDate(note.updatedAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default NoteCard;
