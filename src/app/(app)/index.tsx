import { useRef } from 'react';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppHeader } from '@/components/shop/AppHeader';
import { ShopTheme } from '@/constants/shop-theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/auth-context';

export default function PlusScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const { user, profile, signOut } = useAuth();

  const isConnected = !!user;

  const handleItemPress = (title: string) => {
    Alert.alert(title, `Navigation vers ${title}`);
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Se déconnecter',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.screen}>
      <AppHeader />
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ───── Profile Banner ───── */}
        <View style={styles.profileBanner}>
          {isConnected ? (
            <>
              <View style={styles.avatarCircle}>
                {profile?.avatarUrl ? (
                  <Image
                    source={{ uri: profile.avatarUrl }}
                    contentFit="cover"
                    style={styles.avatarImage}
                    accessibilityLabel="Photo de profil"
                  />
                ) : (
                  <Image
                    source={require('../../../assets/images/img/user.jpg')}
                    contentFit="cover"
                    style={styles.avatarImage}
                    accessibilityLabel="Photo de profil"
                  />
                )}
              </View>
              <View style={styles.nameRow}>
                <Text style={styles.profileTitle}>
                  {profile?.fullName || 'Utilisateur'}
                </Text>
                <Ionicons name="create-outline" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
              </View>

              {/* ID Client row with logout button */}
              <View style={styles.idRow}>
                <View style={styles.idCard}>
                  <Ionicons name="qr-code-outline" size={22} color="#111827" />
                  <Text style={styles.idCardText}>
                    ID client : {profile?.clientId || '------'}
                  </Text>
                </View>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Se déconnecter"
                  style={styles.logoutButton}
                  activeOpacity={0.8}
                  onPress={handleSignOut}
                >
                  <Ionicons name="power-outline" size={24} color={ShopTheme.colors.card} />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={54} color="#000000" />
              </View>
              <Text style={styles.profileTitle}>Non connecté</Text>
              <TouchableOpacity
                accessibilityRole="button"
                style={styles.idCardFull}
                activeOpacity={0.8}
                onPress={() => Alert.alert('ID client', "Vous n'avez pas d'ID client.")}
              >
                <Text style={styles.idCardText}>Vous n'avez pas d'ID client</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* ───── Achats Section (only if connected) ───── */}
        {isConnected && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Achats</Text>
            <View style={styles.servicesGrid}>
              <TouchableOpacity
                accessibilityRole="button"
                style={styles.serviceCard}
                activeOpacity={0.8}
                onPress={() => handleItemPress('Mes factures')}
              >
                <Ionicons name="document-text-outline" size={32} color="#0F3D87" />
                <Text style={styles.serviceCardText}>Mes factures</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ───── Mon compte Section (only if connected) ───── */}
        {isConnected && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Mon compte</Text>
            <View style={styles.infosGrid}>
              <TouchableOpacity
                accessibilityRole="button"
                style={styles.infoCard}
                activeOpacity={0.8}
                onPress={() => handleItemPress('Mes moyens de paiement')}
              >
                <Ionicons name="card-outline" size={32} color="#0F3D87" />
                <Text style={styles.infoCardText}>Mes moyens{'\n'}de paiement</Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                style={styles.infoCard}
                activeOpacity={0.8}
                onPress={() => handleItemPress('Mes documents')}
              >
                <Ionicons name="attach-outline" size={32} color="#0F3D87" />
                <Text style={styles.infoCardText}>Mes documents</Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                style={styles.infoCard}
                activeOpacity={0.8}
                onPress={() => handleItemPress('Mes demandes')}
              >
                <Ionicons name="folder-outline" size={32} color="#0F3D87" />
                <Text style={styles.infoCardText}>Mes demandes</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ───── Ma connexion biométrique (only if connected) ───── */}
        {isConnected && (
          <View style={styles.sectionContainer}>
            <View style={styles.servicesGrid}>
              <TouchableOpacity
                accessibilityRole="button"
                style={styles.serviceCard}
                activeOpacity={0.8}
                onPress={() => handleItemPress('Ma connexion biométrique')}
              >
                <Ionicons name="finger-print-outline" size={32} color="#0F3D87" />
                <Text style={styles.serviceCardText}>Ma connexion{'\n'}biométrique</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ───── Services Section ───── */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Services</Text>
          <View style={styles.servicesGrid}>
            <TouchableOpacity
              accessibilityRole="button"
              style={styles.serviceCard}
              activeOpacity={0.8}
              onPress={() => handleItemPress('Nomade temps réel')}
            >
              <View style={styles.nomadeIconBox}>
                <Image
                  source={require('../../../assets/images/img/nomade.jpg')}
                  contentFit="cover"
                  accessibilityLabel="Nomade temps réel"
                  style={styles.nomadeImage}
                />
              </View>
              <Text style={styles.serviceCardText}>
                Nomade{'\n'}temps réel
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ───── Infos Section ───── */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Infos</Text>
          <View style={styles.infosGrid}>
            <TouchableOpacity
              accessibilityRole="button"
              style={styles.infoCard}
              activeOpacity={0.8}
              onPress={() => handleItemPress('Tutoriels')}
            >
              <Ionicons name="help-circle-outline" size={32} color="#0F3D87" />
              <Text style={styles.infoCardText}>Tutoriels</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              style={styles.infoCard}
              activeOpacity={0.8}
              onPress={() => router.push('/cgu-cgv')}
            >
              <Ionicons name="clipboard-outline" size={32} color="#0F3D87" />
              <Text style={styles.infoCardText}>CGU / CGV</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              style={styles.infoCard}
              activeOpacity={0.8}
              onPress={() => router.push('/politique-confidentialite')}
            >
              <Ionicons name="shield-checkmark-outline" size={32} color="#0F3D87" />
              <Text style={styles.infoCardText}>
                Politique de{'\n'}confidentialité
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              style={styles.infoCard}
              activeOpacity={0.8}
              onPress={() => handleItemPress('Accessibilité')}
            >
              <Ionicons name="eye-off-outline" size={32} color="#0F3D87" />
              <Text style={styles.infoCardText}>Accessibilité</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              style={styles.infoCard}
              activeOpacity={0.8}
              onPress={() => handleItemPress('Notez-nous !')}
            >
              <Ionicons name="thumbs-up-outline" size={32} color="#0F3D87" />
              <Text style={styles.infoCardText}>Notez-nous !</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              style={styles.infoCard}
              activeOpacity={0.8}
              onPress={() => handleItemPress('Carte des arrêts')}
            >
              <Ionicons name="map-outline" size={32} color="#0F3D87" />
              <Text style={styles.infoCardText}>Carte des{'\n'}arrêts</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              style={styles.infoCard}
              activeOpacity={0.8}
              onPress={() => handleItemPress('Contact')}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={32} color="#0F3D87" />
              <Text style={styles.infoCardText}>Contact</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ───── Connect / Disconnect button ───── */}
        {isConnected ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Se déconnecter"
            style={styles.disconnectButton}
            activeOpacity={0.8}
            onPress={handleSignOut}
          >
            <Text style={styles.disconnectButtonText}>Se déconnecter</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Se connecter"
            style={styles.connectButton}
            activeOpacity={0.8}
            onPress={() => router.push('/connexion')}
          >
            <Text style={styles.connectButtonText}>Se connecter</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.versionText}>Ver. 2.0.3 (428) prod</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#0F3D87',
    flex: 1,
  },
  scrollView: {
    backgroundColor: '#F3F4F8',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  profileBanner: {
    alignItems: 'center',
    backgroundColor: '#0F3D87',
    paddingBottom: 28,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  avatarCircle: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 43,
    height: 86,
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
    width: 86,
  },
  avatarImage: {
    height: 86,
    width: 86,
  },
  nameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
  },
  profileTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 0,
  },
  idRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    width: '92%',
    maxWidth: 380,
  },
  idCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.12)',
    elevation: 3,
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  idCardFull: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.12)',
    elevation: 3,
    maxWidth: 380,
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    width: '92%',
  },
  idCardText: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: ShopTheme.colors.blue,
    borderRadius: 12,
    elevation: 3,
    height: 52,
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    width: 52,
  },
  sectionContainer: {
    paddingHorizontal: 14,
    paddingTop: 20,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    marginLeft: 4,
  },
  servicesGrid: {
    flexDirection: 'row',
  },
  serviceCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
    elevation: 2,
    height: 114,
    justifyContent: 'center',
    padding: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    width: 114,
  },
  nomadeIconBox: {
    alignItems: 'center',
    backgroundColor: '#0F3D87',
    borderRadius: 6,
    height: 44,
    justifyContent: 'center',
    marginBottom: 8,
    width: 44,
  },
  nomadeImage: {
    borderRadius: 6,
    height: 44,
    width: 44,
  },
  serviceCardText: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 16,
    textAlign: 'center',
  },
  infosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  infoCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
    elevation: 2,
    height: 118,
    justifyContent: 'center',
    margin: '1.16%',
    padding: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    width: '31%',
  },
  infoCardText: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  connectButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#0F3D87',
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 32,
    minWidth: 200,
    paddingHorizontal: 44,
    paddingVertical: 14,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  versionText: {
    color: '#6B7280',
    fontSize: 13,
    marginBottom: 16,
    marginTop: 4,
    textAlign: 'center',
  },
  disconnectButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#DC2626',
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 32,
    minWidth: 200,
    paddingHorizontal: 44,
    paddingVertical: 14,
  },
  disconnectButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
