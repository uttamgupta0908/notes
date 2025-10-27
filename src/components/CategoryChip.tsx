import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface CategoryChipProps {
  category: string;
  selected: boolean;
  onPress: () => void;
}

const CategoryChip: React.FC<CategoryChipProps> = ({
  category,
  selected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      className={`px-4 py-2.5 rounded-xl mr-2 ${
        selected ? 'bg-blue-500' : 'bg-white border border-gray-200'
      }`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        className={`text-sm font-semibold ${
          selected ? 'text-white' : 'text-gray-600'
        }`}
      >
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryChip;
