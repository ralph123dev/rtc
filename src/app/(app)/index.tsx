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
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlusScreen() {
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleNavigateConnexion = () => {
    router.push('/connexion');
  };

  const handleItemPress = (title: string) => {
    Alert.alert(title, `Navigation vers ${title}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top RTC Header */}
      <View style={styles.header}>
        <Image
          source={require('../../../assets/images/img/rtc.png')}
          contentFit="contain"
          accessibilityLabel="RTC logo"
          style={styles.logo}
        />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Blue Profile Banner */}
        <View style={styles.profileBanner}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={54} color="#000000" />
          </View>
          <Text style={styles.profileTitle}>Non connecté</Text>
          <TouchableOpacity
            style={styles.idCard}
            activeOpacity={0.8}
            onPress={() => Alert.alert('ID client', "Vous n'avez pas d'ID client.")}
          >
            <Text style={styles.idCardText}>Vous n'avez pas d'ID client</Text>
          </TouchableOpacity>
        </View>

        {/* Services Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Services</Text>
          <View style={styles.servicesGrid}>
            <TouchableOpacity
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
              <Text style={styles.serviceCardText}>Nomade{'\n'}temps réel</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Infos Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Infos</Text>
          <View style={styles.infosGrid}>
            <TouchableOpacity
              style={styles.infoCard}
              activeOpacity={0.8}
              onPress={() => router.push('/cgu-cgv')}
            >
              <Ionicons name="clipboard-outline" size={32} color="#0F3D87" />
              <Text style={styles.infoCardText}>CGU / CGV</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.infoCard}
              activeOpacity={0.8}
              onPress={() => router.push('/politique-confidentialite')}
            >
              <Ionicons name="shield-checkmark-outline" size={32} color="#0F3D87" />
              <Text style={styles.infoCardText}>Politique{'\n'}de confide{'\n'}ntialité</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.infoCard}
              activeOpacity={0.8}
              onPress={() => handleItemPress('Accessibilité')}
            >
              <Ionicons name="eye-off-outline" size={32} color="#0F3D87" />
              <Text style={styles.infoCardText}>Accessibilit{'\n'}é</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.infoCard}
              activeOpacity={0.8}
              onPress={() => handleItemPress('Notez-nous !')}
            >
              <Ionicons name="thumbs-up-outline" size={32} color="#0F3D87" />
              <Text style={styles.infoCardText}>Notez-nou{'\n'}s !</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.infoCard}
              activeOpacity={0.8}
              onPress={() => handleItemPress('Carte des arrêts')}
            >
              <Ionicons name="map-outline" size={32} color="#0F3D87" />
              <Text style={styles.infoCardText}>Carte des{'\n'}arrêts</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.infoCard}
              activeOpacity={0.8}
              onPress={() => handleItemPress('Contact')}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={32} color="#0F3D87" />
              <Text style={styles.infoCardText}>Contact</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Se connecter Button */}
        <TouchableOpacity
          style={styles.connectButton}
          activeOpacity={0.8}
          onPress={handleNavigateConnexion}
        >
          <Text style={styles.connectButtonText}>Se connecter</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>Ver. 2.0.3 (428) prod</Text>
      </ScrollView>

      {/* Floating Action Button (FAB) for Scroll to Top */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={handleScrollToTop}
        accessibilityRole="button"
        accessibilityLabel="Retour en haut"
      >
        <Ionicons name="chevron-up" size={24} color="#0F3D87" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F3D87',
  },
  header: {
    height: 52,
    backgroundColor: '#0F3D87',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 95,
    height: 36,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F3F4F8',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  profileBanner: {
    backgroundColor: '#0F3D87',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 28,
    paddingHorizontal: 16,
  },
  avatarCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  idCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: '92%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  idCardText: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: 114,
    height: 114,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  nomadeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: '#0F3D87',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  nomadeImage: {
    width: 44,
    height: 44,
    borderRadius: 6,
  },
  serviceCardText: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
  infosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '31%',
    height: 118,
    margin: '1.16%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  infoCardText: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 16,
  },
  connectButton: {
    backgroundColor: '#0F3D87',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 44,
    alignSelf: 'center',
    marginTop: 32,
    marginBottom: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  versionText: {
    color: '#6B7280',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 4,
  },
  fabPressed: {
    opacity: 0.8,
  },
});
