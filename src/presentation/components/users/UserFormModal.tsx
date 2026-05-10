import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import type { User } from '@src/domain/entities/User';

interface UserFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (userData: any) => void;
  editingUser: User | null;
  isSaving: boolean;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  visible,
  onClose,
  onSave,
  editingUser,
  isSaving,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (visible) {
      if (editingUser) {
        setFirstName(editingUser.firstName || '');
        setLastName(editingUser.lastName || '');
        setEmail(editingUser.email || '');
        setPassword('');
        setConfirmPassword('');
        setIsActive(editingUser.isActive ?? true);
      } else {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setIsActive(true);
      }
    }
  }, [visible, editingUser]);

  const handleSave = () => {
    if (!firstName || !lastName || !email) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (!editingUser && !password) {
      Alert.alert('Error', 'Password is required for new users');
      return;
    }

    if (password && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password && password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    const userData: any = {
      firstName,
      lastName,
      email,
      isActive,
    };

    if (password) {
      userData.password = password;
    }

    onSave(userData);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{editingUser ? 'Edit Person' : 'New Person'}</Text>

          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              placeholder="First Name"
              placeholderTextColor="#64748b"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={[styles.input, { flex: 1, marginLeft: 8 }]}
              placeholder="Last Name"
              placeholderTextColor="#64748b"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#64748b"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.passwordSection}>
            <Text style={styles.sectionLabel}>
              {editingUser ? 'Change Password (optional)' : 'Security'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor="#64748b"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {password.length > 0 && (
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                placeholderTextColor="#64748b"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            )}
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Active Account</Text>
            <Switch
              value={isActive}
              onValueChange={setIsActive}
              trackColor={{ false: '#334155', true: '#0ea5e9' }}
              thumbColor={isActive ? '#fff' : '#94a3b8'}
            />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
              disabled={isSaving}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
    paddingBottom: 48,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    color: '#f8fafc',
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  passwordSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  switchLabel: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#334155',
  },
  saveButton: {
    backgroundColor: '#0ea5e9',
  },
  cancelButtonText: {
    color: '#f8fafc',
    fontWeight: '700',
    fontSize: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
