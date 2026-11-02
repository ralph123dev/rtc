import { useState } from 'react';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShopTheme } from '@/constants/shop-theme';
import { useAccessCode } from '@/contexts/access-code-context';
import { useAuth } from '@/contexts/auth-context';
import { Ionicons } from '@expo/vector-icons';

export default function AccessCodeScreen() {
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const { validateCode } = useAccessCode();
  const { user, profile, signOut } = useAuth();

  const handleValidate = async () => {
    Keyboard.dismiss();
    const cleanCode = code.trim();
    if (!cleanCode) {
      setErrorMessage('Veuillez saisir votre code à 6 chiffres.');
      return;
    }

    setIsValidating(true);
    setErrorMessage(null);

    const result = await validateCode(cleanCode);
    setIsValidating(false);

    if (result.success) {
      router.replace('/(app)/boutique');
    } else {
      setErrorMessage(
        result.error ||
          'Code incorrect ou invalidé. Veuillez demander votre nouveau code à l’administrateur.',
      );
    }
  };

  const handleSignOut = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter pour changer de compte ?', [
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="key-outline" size={42} color={ShopTheme.colors.navy} />
          </View>

          <Text style={styles.title}>Code de validation</Text>
          <Text style={styles.description}>
            Saisissez le code fourni par l’administrateur pour utiliser l’application RTC.
          </Text>

          {user && (
            <View style={styles.userBadge}>
              <Ionicons name="person-circle-outline" size={18} color="#0F3D87" />
              <Text style={styles.userBadgeText} numberOfLines={1}>
                {profile?.fullName ? `${profile.fullName} (${user.email})` : user.email}
              </Text>
            </View>
          )}

          <Text style={styles.inputLabel}>Code à 6 chiffres</Text>
          <TextInput
            accessibilityLabel="Code de validation"
            autoComplete="off"
            autoFocus
            keyboardType="number-pad"
            maxLength={6}
            onChangeText={(value) => {
              setCode(value.replace(/\D/g, ''));
              setErrorMessage(null);
            }}
            onSubmitEditing={handleValidate}
            returnKeyType="done"
            style={[styles.input, !!errorMessage && styles.inputError]}
            value={code}
            placeholder="······"
            placeholderTextColor="#9CA3AF"
          />

          {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Valider le code"
            disabled={isValidating}
            onPress={handleValidate}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              isValidating && styles.buttonDisabled,
            ]}
          >
            {isValidating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Valider l’accès</Text>
            )}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Se déconnecter ou changer de compte"
            onPress={handleSignOut}
            style={styles.switchAccountButton}
          >
            <Ionicons name="log-out-outline" size={18} color="#4B5563" />
            <Text style={styles.switchAccountText}>Changer de compte / Se déconnecter</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  iconCircle: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#E0E7FF',
    borderRadius: 44,
    height: 88,
    justifyContent: 'center',
    marginBottom: 20,
    width: 88,
  },
  title: {
    color: '#0F172A',
    fontFamily: ShopTheme.fonts.bold,
    fontSize: 24,
    textAlign: 'center',
  },
  description: {
    color: '#475569',
    fontFamily: ShopTheme.fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    textAlign: 'center',
  },
  userBadge: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    marginTop: 14,
    maxWidth: '90%',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  userBadgeText: {
    color: '#1E40AF',
    fontFamily: ShopTheme.fonts.medium,
    fontSize: 13,
  },
  inputLabel: {
    color: '#1E293B',
    fontFamily: ShopTheme.fonts.medium,
    fontSize: 14,
    marginTop: 28,
    textAlign: 'left',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 12,
    borderWidth: 1.5,
    color: '#0F172A',
    fontFamily: ShopTheme.fonts.bold,
    fontSize: 24,
    letterSpacing: 10,
    marginTop: 8,
    minHeight: 56,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  inputError: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  error: {
    color: '#DC2626',
    fontFamily: ShopTheme.fonts.medium,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#0F3D87',
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 24,
    minHeight: 52,
    shadowColor: '#0F3D87',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: ShopTheme.fonts.bold,
    fontSize: 16,
  },
  switchAccountButton: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 24,
    padding: 10,
  },
  switchAccountText: {
    color: '#4B5563',
    fontFamily: ShopTheme.fonts.medium,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
