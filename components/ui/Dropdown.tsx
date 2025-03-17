import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface DropdownProps {
  label?: string;
  value: string;
  onPress: () => void;
  isOpen: boolean;
  disabled?: boolean;
}

export function Dropdown({ label, value, onPress, isOpen, disabled }: DropdownProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Pressable 
        style={[styles.button, disabled && styles.buttonDisabled]} 
        onPress={onPress}
        disabled={disabled}>
        <Text style={styles.buttonText}>{value}</Text>
        <MaterialCommunityIcons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#000"
        />
      </Pressable>
    </View>
  );
}

interface DropdownListProps {
  children: React.ReactNode;
  visible: boolean;
}

export function DropdownList({ children, visible }: DropdownListProps) {
  if (!visible) return null;
  
  return (
    <View style={styles.list}>
      {children}
    </View>
  );
}

interface DropdownItemProps {
  onPress: () => void;
  children: React.ReactNode;
  isSelected?: boolean;
}

export function DropdownItem({ onPress, children, isSelected }: DropdownItemProps) {
  return (
    <Pressable
      style={[styles.item, isSelected && styles.itemSelected]}
      onPress={onPress}>
      <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
  list: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 4,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  item: {
    padding: 12,
    borderRadius: 8,
  },
  itemSelected: {
    backgroundColor: '#6C5CE7',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  itemTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
