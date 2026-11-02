import { useState } from 'react';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/auth-context';

type Mode = 'login' | 'signup';

export default function ConnexionScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Connexion', 'Veuillez saisir votre email et votre mot de passe.');
      return;
    }
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) {
      Alert.alert('Erreur de connexion', error.message);
    } else {
      const cleanEmail = email.trim().toLowerCase();
      if (cleanEmail === 'rtcmailpro@gmail.com') {
        router.replace('/admin');
      } else {
        router.replace('/access-code');
      }
    }
  };

  const handleCreateAccount = async () => {
    if (mode !== 'signup') {
      setMode('signup');
      return;
    }
    if (!email || !password) {
      Alert.alert('Inscription', 'Veuillez saisir votre email et votre mot de passe.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Inscription', 'Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    setLoading(true);
    const { error, data } = await signUp(email.trim(), password);
    setLoading(false);
    if (error) {
      Alert.alert("Erreur d'inscription", error.message);
    } else if (data?.session) {
      router.replace('/access-code');
    } else {
      Alert.alert(
        'Compte créé',
        'Votre compte a été créé avec succès. Connectez-vous maintenant pour saisir votre code d’accès fourni par l’administrateur.',
        [{ text: 'Se connecter', onPress: () => setMode('login') }],
      );
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Mot de passe oublié', 'Instructions envoyées par courriel.');
  };

  const handleFacebookLogin = () => {
    void Linking.openURL('https://facebook.com');
  };

  const isFormValid = email.trim().length > 0 && password.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Header bar */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <Ionicons name="chevron-back" size={20} color="#0F3D87" />
        </Pressable>

        <Image
          source={require('../../assets/images/img/rtc.png')}
          contentFit="contain"
          accessibilityLabel="RTC logo"
          style={styles.logo}
        />
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.pageTitle}>
            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </Text>

          {/* White Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {mode === 'login' ? 'Connectez-vous' : 'Inscrivez-vous'}
            </Text>

            {/* Email field */}
            <TextInput
              style={styles.input}
              placeholder="*Email"
              placeholderTextColor="#6B7280"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            {/* Password field */}
            <View style={styles.passwordRow}>
              <TextInput
                style={styles.passwordInput}
                placeholder="*Mot de passe"
                placeholderTextColor="#6B7280"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable
                style={styles.eyeButton}
                onPress={() => setShowPassword((prev) => !prev)}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
                }
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={22}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            {/* Forgot password link */}
            {mode === 'login' && (
              <TouchableOpacity
                onPress={handleForgotPassword}
                style={styles.forgotPasswordContainer}
              >
                <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
              </TouchableOpacity>
            )}

            {/* Action buttons row */}
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.createAccountButton}
                onPress={() => {
                  if (mode === 'login') {
                    setMode('signup');
                  } else {
                    handleCreateAccount();
                  }
                }}
                activeOpacity={0.8}
                disabled={loading}
              >
                {loading && mode === 'signup' ? (
                  <ActivityIndicator color="#0F3D87" />
                ) : (
                  <Text style={styles.createAccountText}>
                    {mode === 'signup' ? "S'inscrire" : 'Créer un compte'}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.loginButton, isFormValid && styles.loginButtonActive]}
                onPress={() => {
                  if (mode === 'signup') {
                    setMode('login');
                  } else {
                    handleLogin();
                  }
                }}
                activeOpacity={0.8}
                disabled={loading}
              >
                {loading && mode === 'login' ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={[styles.loginButtonText, isFormValid && styles.loginButtonTextActive]}>
                    {mode === 'login' ? 'Se connecter' : 'Retour connexion'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>  ou connectez-vous avec  </Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Facebook login */}
            <TouchableOpacity
              style={styles.facebookButton}
              onPress={handleFacebookLogin}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-facebook" size={26} color="#000000" />
            </TouchableOpacity>

            {/* Legal notice */}
            <Text style={styles.legalNotice}>
              En vous connectant avec un service tiers, vous acceptez nos{' '}
              <Text
                style={styles.legalLink}
                onPress={() => router.push('/cgu-cgv')}
              >
                conditions d'utilisation
              </Text>{' '}
              et notre{' '}
              <Text
                style={styles.legalLink}
                onPress={() => router.push('/politique-confidentialite')}
              >
                politique de confidentialité
              </Text>
              .
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#0F3D87',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    opacity: 0.8,
  },
  logo: {
    width: 95,
    height: 36,
  },
  headerSpacer: {
    width: 36,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    color: '#000000',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#111827',
    marginBottom: 14,
  },
  passwordRow: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#111827',
    height: '100%',
  },
  eyeButton: {
    width: 50,
    height: 50,
    backgroundColor: '#8E8E93',
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 22,
  },
  forgotPasswordText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  createAccountButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createAccountText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '600',
  },
  loginButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonActive: {
    backgroundColor: '#0F3D87',
  },
  loginButtonText: {
    color: '#9CA3AF',
    fontSize: 15,
    fontWeight: '600',
  },
  loginButtonTextActive: {
    color: '#FFFFFF',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#000000',
  },
  dividerText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '400',
  },
  facebookButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  legalNotice: {
    color: '#000000',
    fontSize: 14,
    lineHeight: 20,
  },
  legalLink: {
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
