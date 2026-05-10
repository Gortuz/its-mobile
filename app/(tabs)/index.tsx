import { useUsers } from '@src/presentation/hooks/useUsers';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import type { User } from '@src/domain/entities/User';

function UserCard({ user }: { user: User }) {
  return (
    <View style={styles.card}>
      <Text style={styles.userName}>{user.name}</Text>
      <Text style={styles.userEmail}>{user.email}</Text>
      <View style={styles.roleBadge}>
        <Text style={styles.roleText}>{user.role}</Text>
      </View>
    </View>
  );
}

export default function UsersScreen() {
  const { data: users, isLoading, isError, error, refetch } = useUsers();

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.statusText}>Loading users…</ThemedText>
      </ThemedView>
    );
  }

  if (isError) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.errorText}>⚠ {error?.message}</ThemedText>
        <ThemedText style={styles.retryText} onPress={() => refetch()}>
          Tap to retry
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.heading}>
        Users
      </ThemedText>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <UserCard user={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <ThemedText style={styles.statusText}>No users found.</ThemedText>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  heading: {
    marginBottom: 16,
  },
  list: {
    gap: 12,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  userName: {
    color: '#f1f5f9',
    fontSize: 16,
    fontWeight: '600',
  },
  userEmail: {
    color: '#94a3b8',
    fontSize: 14,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    marginTop: 6,
    backgroundColor: '#0ea5e9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  roleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  statusText: {
    marginTop: 8,
    opacity: 0.6,
  },
  errorText: {
    color: '#f87171',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  retryText: {
    color: '#0ea5e9',
    textDecorationLine: 'underline',
  },
});
