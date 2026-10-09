import { useState } from 'react';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const tutorialImages = [
  require('../../assets/images/img/1.jpg'),
  require('../../assets/images/img/2.jpg'),
  require('../../assets/images/img/3.jpg'),
  require('../../assets/images/img/4.jpg'),
  require('../../assets/images/img/5.jpg'),
  require('../../assets/images/img/6.jpg'),
];

type Page = 'welcome' | 'tutorial';

export default function Onboarding() {
  const [page, setPage] = useState<Page>('welcome');
  const [tutorialIndex, setTutorialIndex] = useState(0);

  const closeOnboarding = () => router.replace('/(app)/panier');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fermer le tutoriel"
          hitSlop={12}
          onPress={closeOnboarding}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={26} color={COLORS.text} />
        </Pressable>
      </View>

      {page === 'welcome' ? (
        <ScrollView
          contentContainerStyle={styles.welcomeContent}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require('../../assets/images/img/user.jpg')}
            contentFit="contain"
            accessibilityLabel="Illustration d'une personne près d'un arbre"
            style={styles.welcomeImage}
          />
          <Text style={styles.title}>Votre application évolue !</Text>
          <Text style={styles.description}>
            Nous avons rendu l’application plus facile à parcourir. Les écrans présentés dans ce
            tutoriel sont des exemples.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Démarrer le tutoriel"
            onPress={() => setPage('tutorial')}
            style={({ pressed }) => [styles.startButton, pressed && styles.pressedButton]}
          >
            <Text style={styles.startButtonLabel}>Démarrer le tutoriel !</Text>
          </Pressable>
        </ScrollView>
      ) : (
        <View style={styles.tutorialContent}>
          <View style={styles.imageRow}>
            <Image
              key={tutorialIndex}
              source={tutorialImages[tutorialIndex]}
              contentFit="contain"
              accessibilityLabel={`Écran ${tutorialIndex + 1} sur ${tutorialImages.length} du tutoriel`}
              style={styles.tutorialImage}
              transition={150}
            />
          </View>
          <View style={styles.tutorialControls}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Image précédente"
              accessibilityState={{ disabled: tutorialIndex === 0 }}
              disabled={tutorialIndex === 0}
              hitSlop={8}
              onPress={() => setTutorialIndex((index) => Math.max(index - 1, 0))}
              style={[styles.arrowButton, tutorialIndex === 0 && styles.disabledArrow]}
            >
              <Ionicons name="chevron-back" size={26} color={COLORS.blue} />
            </Pressable>
            <View style={styles.pagination} accessibilityLabel="Progression du tutoriel">
              {tutorialImages.map((_, index) => (
                <Pressable
                  key={index}
                  accessibilityRole="button"
                  accessibilityLabel={`Afficher l’image ${index + 1}`}
                  accessibilityState={{ selected: index === tutorialIndex }}
                  onPress={() => setTutorialIndex(index)}
                  hitSlop={8}
                  style={styles.dotHitArea}
                >
                  <View style={[styles.dot, index === tutorialIndex && styles.activeDot]} />
                </Pressable>
              ))}
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Image suivante"
              accessibilityState={{ disabled: tutorialIndex === tutorialImages.length - 1 }}
              disabled={tutorialIndex === tutorialImages.length - 1}
              hitSlop={8}
              onPress={() =>
                setTutorialIndex((index) => Math.min(index + 1, tutorialImages.length - 1))
              }
              style={[
                styles.arrowButton,
                tutorialIndex === tutorialImages.length - 1 && styles.disabledArrow,
              ]}
            >
              <Ionicons name="chevron-forward" size={26} color={COLORS.blue} />
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const COLORS = {
  background: '#F2F2F2',
  blue: '#17499B',
  text: '#171717',
  muted: '#3E3E3E',
  disabled: '#B9B9B9',
} as const;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 20,
  },
  welcomeImage: {
    width: '55%',
    maxWidth: 210,
    height: 205,
    marginBottom: 24,
  },
  title: {
    maxWidth: 360,
    color: COLORS.text,
    fontSize: 23,
    fontWeight: '700',
    lineHeight: 29,
    textAlign: 'center',
  },
  description: {
    maxWidth: 440,
    marginTop: 16,
    color: COLORS.muted,
    fontSize: 17,
    lineHeight: 23,
    textAlign: 'center',
  },
  startButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 26,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: COLORS.blue,
  },
  pressedButton: {
    opacity: 0.82,
  },
  startButtonLabel: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  tutorialContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  imageRow: {
    flex: 1,
    width: '100%',
    maxWidth: 720,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tutorialImage: {
    width: '100%',
    height: '100%',
  },
  tutorialControls: {
    width: '100%',
    maxWidth: 480,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowButton: {
    width: 40,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledArrow: {
    opacity: 0.35,
  },
  pagination: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotHitArea: {
    minWidth: 24,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.disabled,
  },
  activeDot: {
    width: 18,
    backgroundColor: COLORS.blue,
  },
});
