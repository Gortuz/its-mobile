import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../hooks/useUsers';
import type { User } from '@src/domain/entities/User';
import { UsersHeader } from '../components/users/UsersHeader';
import { UserCard } from '../components/users/UserCard';
import { UserFormModal } from '../components/users/UserFormModal';

export const UsersScreen = () => {
  const { data: users, isLoading, isFetching, refetch } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleOpenModal = (user?: User) => {
    setEditingUser(user || null);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingUser(null);
  };

  const handleSave = (userData: any) => {
    if (editingUser) {
      updateUser.mutate(
        { id: editingUser.id, user: userData },
        {
          onSuccess: () => {
            handleCloseModal();
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
            handleCloseModal();
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
      <UsersHeader 
        count={users?.length || 0} 
        onAddPress={() => handleOpenModal()} 
      />

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <UserCard 
            user={item} 
            onEdit={handleOpenModal} 
            onDelete={handleDelete} 
          />
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
            tintColor="#ffffffff"
            colors={['#f8f8f8']}
            progressViewOffset={10}
          />
        }
      />

      <UserFormModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingUser={editingUser}
        isSaving={createUser.isPending || updateUser.isPending}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
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
});
