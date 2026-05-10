import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Switch,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@src/presentation/hooks/useUsers';
import type { User } from '@src/domain/entities/User';

export default function UsersScreen() {
  const { data: users, isLoading, isFetching, isError, error, refetch } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPassword('');
      setConfirmPassword('');
      setIsActive(user.isActive ?? true);
    } else {
      setEditingUser(null);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setIsActive(true);
    }
    setModalVisible(true);
  };

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

    if (editingUser) {
      updateUser.mutate(
        { id: editingUser.id, user: userData },
        {
          onSuccess: () => {
            setModalVisible(false);
            Alert.alert('Success', 'Person updated successfully');
          },
          onError: (err) => {
            Alert.alert('Error', err.message || 'Failed to update person');
          }
        }
      );
    } else {
      createUser.mutate(
        { ...userData, role: 'User' },
        {
          onSuccess: () => {
            setModalVisible(false);
            Alert.alert('Success', 'Person created successfully');
          },
          onError: (err) => {
            Alert.alert('Error', err.message || 'Failed to create person');
          }
        }
      );
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Person', 'Are you sure you want to delete this person?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteUser.mutate(id, {
            onSuccess: () => {
              Alert.alert('Success', 'Person deleted successfully');
            },
            onError: (err) => {
              Alert.alert('Error', err.message || 'Failed to delete person');
            }
          });
        },
      },
    ]);
  };

  if (isLoading && !users) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text style={styles.statusText}>Loading people...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>People</Text>
          <Text style={styles.subtitle}>{users?.length || 0} registered</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => handleOpenModal()}>
          <Text style={styles.addButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.firstName ? item.firstName.charAt(0) : '?'}
                </Text>
              </View>
              <View style={styles.info}>
                <View style={styles.nameRow}>
                  <Text style={styles.userName}>
                    {item.firstName} {item.lastName}
                  </Text>
                  <View
                    style={[
                      styles.statusIndicator,
                      { backgroundColor: item.isActive ? '#10b981' : '#ef4444' },
                    ]}
                  />
                </View>
                <Text style={styles.userEmail}>{item.email}</Text>
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleOpenModal(item)}>
                <Text style={styles.editLabel}>Edit / Change Pass</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteLabel}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No people found.</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
              <Text style={styles.retryButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor="#f8f0f0ff"
            colors={['#f8f8f8ff']}
            progressViewOffset={10}
          />
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
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
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
                disabled={createUser.isPending || updateUser.isPending}
              >
                {createUser.isPending || updateUser.isPending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 2,
  },
  refreshIndicatorContainer: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  addButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#0ea5e9',
    fontSize: 20,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  userName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#f8fafc',
  },
  userEmail: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 12,
  },
  actionButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  editLabel: {
    color: '#0ea5e9',
    fontWeight: '600',
    fontSize: 14,
  },
  deleteLabel: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 14,
  },
  centered: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    marginTop: 16,
    color: '#94a3b8',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    padding: 8,
  },
  retryButtonText: {
    color: '#0ea5e9',
    fontWeight: '600',
  },
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
