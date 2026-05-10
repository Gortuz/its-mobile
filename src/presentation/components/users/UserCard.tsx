import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { User } from '@src/domain/entities/User';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.firstName ? user.firstName.charAt(0) : '?'}
          </Text>
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>
              {user.firstName} {user.lastName}
            </Text>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: user.isActive ? '#10b981' : '#ef4444' },
              ]}
            />
          </View>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(user)}>
          <Text style={styles.editLabel}>Edit / Change Pass</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => onDelete(user.id)}>
          <Text style={styles.deleteLabel}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});
