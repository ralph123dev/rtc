import { useCallback, useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';
import { ADMIN_EMAIL } from '@/contexts/access-code-context';

type ProfileItem = {
  id: string;
  client_id?: string | null;
  full_name?: string | null;
  email?: string | null;
  access_code?: string | null;
  created_at?: string | null;
};

export default function AdminScreen() {
  const { user, signOut } = useAuth();
  const [users, setUsers] = useState<ProfileItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generatingUserId, setGeneratingUserId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Erreur chargement utilisateurs:', error.message);
      } else if (data) {
        setUsers(data as ProfileItem[]);
      }
    } catch (err: any) {
      console.warn('Exception chargement profils:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (user?.email?.trim().toLowerCase() !== ADMIN_EMAIL) {
      router.replace('/connexion');
      return;
    }
    void fetchUsers();
  }, [user, fetchUsers]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    void fetchUsers();
  }, [fetchUsers]);

  const handleGenerateCode = async (targetUser: ProfileItem) => {
    const randomCode = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratingUserId(targetUser.id);

    try {
      let updateSuccessful = false;

      // 1. Essayer la fonction RPC admin_set_access_code
      const { error: rpcError } = await supabase.rpc('admin_set_access_code', {
        target_user_id: targetUser.id,
        new_code: randomCode,
      });

      if (!rpcError) {
        updateSuccessful = true;
      } else {
        // 2. Fallback: mise à jour directe de la table profiles
        const { error: directError } = await supabase
          .from('profiles')
          .update({ access_code: randomCode })
          .eq('id', targetUser.id);

        if (!directError) {
          updateSuccessful = true;
        } else {
          throw new Error(directError.message || rpcError.message);
        }
      }

      if (updateSuccessful) {
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUser.id ? { ...u, access_code: randomCode } : u)),
        );

        const displayName = targetUser.full_name || targetUser.email || 'Utilisateur';
        Alert.alert(
          'Code généré avec succès !',
          `Utilisateur : ${displayName}\n\nNouveau code : ${randomCode}\n\nL'ancien code est désormais désactivé. Vous pouvez communiquer ce nouveau code à l'utilisateur.`,
          [{ text: 'Compris' }],
        );
      }
    } catch (err: any) {
      Alert.alert(
        'Erreur lors de la génération',
        `Impossible d'enregistrer le code : ${err.message}\n\nAssurez-vous d'avoir exécuté le script SQL data.sql sur Supabase.`,
      );
    } finally {
      setGeneratingUserId(null);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter du panneau administrateur ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se déconnecter',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/connexion');
        },
      },
    ]);
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const nameMatch = u.full_name?.toLowerCase().includes(q);
    const emailMatch = u.email?.toLowerCase().includes(q);
    const idMatch = u.client_id?.toLowerCase().includes(q);
    const codeMatch = u.access_code?.includes(q);
    return nameMatch || emailMatch || idMatch || codeMatch;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Header Administrateur */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../../assets/images/img/rtc.png')}
            contentFit="contain"
            style={styles.logo}
            accessibilityLabel="Logo RTC"
          />
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>ADMIN</Text>
          </View>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Déconnexion administrateur"
          onPress={handleSignOut}
          style={styles.logoutButton}
          activeOpacity={0.8}
        >
          <Ionicons name="power" size={18} color="#FFFFFF" />
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      {/* Titre et description */}
      <View style={styles.banner}>
        <Text style={styles.pageTitle}>Gestion des accès utilisateurs</Text>
        <Text style={styles.adminEmailText}>Connecté en tant que : {ADMIN_EMAIL}</Text>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par nom, email ou ID..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color="#6B7280" />
          </Pressable>
        )}
      </View>

      {/* Compteur d'utilisateurs */}
      <View style={styles.statsRow}>
        <Text style={styles.statsText}>
          {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} enregistré
          {filteredUsers.length > 1 ? 's' : ''}
        </Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshLink}>
          <Ionicons name="refresh" size={14} color="#0F3D87" />
          <Text style={styles.refreshLinkText}>Actualiser</Text>
        </TouchableOpacity>
      </View>

      {/* Liste des utilisateurs */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0F3D87" />
          <Text style={styles.loadingText}>Chargement des utilisateurs...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0F3D87']} />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>Aucun utilisateur trouvé</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? 'Aucun résultat ne correspond à votre recherche.'
                  : "Aucun utilisateur n'est encore inscrit dans la base de données."}
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const isCurrentUserAdmin = item.email?.trim().toLowerCase() === ADMIN_EMAIL;
            const isGenerating = generatingUserId === item.id;
            const hasCode = !!item.access_code;

            return (
              <View style={styles.userCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.avatarCircle}>
                    <Ionicons
                      name={isCurrentUserAdmin ? 'shield-checkmark' : 'person'}
                      size={20}
                      color={isCurrentUserAdmin ? '#0F3D87' : '#4B5563'}
                    />
                  </View>
                  <View style={styles.userInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.userName}>
                        {item.full_name || 'Utilisateur sans nom'}
                      </Text>
                      {isCurrentUserAdmin && (
                        <View style={styles.selfBadge}>
                          <Text style={styles.selfBadgeText}>Vous (Admin)</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.userEmail}>{item.email || 'Email non renseigné'}</Text>
                    {item.client_id && (
                      <Text style={styles.clientIdText}>ID Client : {item.client_id}</Text>
                    )}
                  </View>
                </View>

                {/* Section Code d'accès */}
                <View style={styles.codeSection}>
                  <View style={styles.codeStatusRow}>
                    <Text style={styles.codeLabel}>Code d’accès actuel :</Text>
                    {hasCode ? (
                      <View style={styles.codeBox}>
                        <Text style={styles.codeValue}>{item.access_code}</Text>
                      </View>
                    ) : (
                      <View style={styles.noCodeBox}>
                        <Text style={styles.noCodeText}>Aucun code (Accès bloqué)</Text>
                      </View>
                    )}
                  </View>

                  {/* Bouton Générer un code */}
                  {!isCurrentUserAdmin && (
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel={`Générer un code pour ${item.email}`}
                      style={[
                        styles.generateButton,
                        hasCode && styles.regenerateButton,
                        isGenerating && styles.generateButtonDisabled,
                      ]}
                      onPress={() => handleGenerateCode(item)}
                      disabled={isGenerating}
                      activeOpacity={0.8}
                    >
                      {isGenerating ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                      ) : (
                        <>
                          <Ionicons
                            name={hasCode ? 'sync-outline' : 'key-outline'}
                            size={18}
                            color="#FFFFFF"
                          />
                          <Text style={styles.generateButtonText}>
                            {hasCode ? 'Générer un nouveau code' : 'Générer un code'}
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F3F4F8',
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#0F3D87',
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  logo: {
    height: 36,
    width: 90,
  },
  adminBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  adminBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: '#DC2626',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  banner: {
    backgroundColor: '#0F3D87',
    paddingBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  adminEmailText: {
    color: '#BFDBFE',
    fontSize: 13,
    marginTop: 4,
  },
  searchContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    color: '#111827',
    flex: 1,
    fontSize: 15,
    height: 44,
  },
  statsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 6,
  },
  statsText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
  },
  refreshLink: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  refreshLinkText: {
    color: '#0F3D87',
    fontSize: 13,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 12,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: '#374151',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySubtitle: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 14,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  userName: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  selfBadge: {
    backgroundColor: '#DBEAFE',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  selfBadgeText: {
    color: '#1E40AF',
    fontSize: 11,
    fontWeight: '700',
  },
  userEmail: {
    color: '#4B5563',
    fontSize: 14,
    marginTop: 2,
  },
  clientIdText: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  codeSection: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  codeStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  codeLabel: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '600',
  },
  codeBox: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  codeValue: {
    color: '#065F46',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 3,
  },
  noCodeBox: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  noCodeText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  generateButton: {
    backgroundColor: '#0F3D87',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 11,
  },
  regenerateButton: {
    backgroundColor: '#2563EB',
  },
  generateButtonDisabled: {
    opacity: 0.7,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
