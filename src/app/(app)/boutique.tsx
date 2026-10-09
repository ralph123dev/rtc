import { useState } from 'react';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ImageSourcePropType,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

export type TicketItem = {
  id: string;
  title: string;
  price: string;
  category: string;
  description?: string;
  image?: ImageSourcePropType;
};

const CATEGORIES = [
  'RTC - Général',
  'RTC - 14 - 18 ans',
  'RTC - Etudiant +',
  'RTC - 65+',
  'STLévis',
  'RTC + Communauto',
  'RTC - ÉquiMobilité',
  'STAC - ÉquiMobilité',
] as const;

type Category = (typeof CATEGORIES)[number];

const TICKETS_DATA: Record<Category, TicketItem[]> = {
  'RTC - Général': [
    {
      id: 'rtc-1-passage-general',
      title: 'RTC - 1 passage - Général',
      price: 'CA$3.85',
      category: 'RTC - Général',
      description: 'Titre d’un passage pour le réseau général du RTC.',
    },
    {
      id: 'rtc-20-billets-eco',
      title: 'RTC - Lot de 20 billets économique',
      price: 'CA$67',
      category: 'RTC - Général',
      description: 'Carnet économique de 20 passages individuels.',
    },
    {
      id: 'rtc-90-jours-cons',
      title: 'RTC - 90 jours consécutifs - Général',
      price: 'CA$276.75',
      category: 'RTC - Général',
      description: 'Accès illimité pendant 90 jours consécutifs.',
      image: require('../../../assets/images/img/rtc_autre.png'),
    },
    {
      id: 'rtc-mensuel-octobre-general',
      title: 'RTC - Mensuel - octobre - Général',
      price: 'CA$102.50',
      category: 'RTC - Général',
      description: 'Titre mensuel RTC pour le mois d’octobre.',
      image: require('../../../assets/images/img/rtc_autre.png'),
    },
    {
      id: 'rtc-1-jour',
      title: 'RTC - 1 jour',
      price: 'CA$9.25',
      category: 'RTC - Général',
      description: 'Déplacements illimités pendant une journée entière.',
    },
    {
      id: 'rtc-weekend',
      title: 'RTC - Pass Illimité Week-end',
      price: 'CA$8.75',
      category: 'RTC - Général',
      description: 'Du vendredi 17h30 au dimanche fin de service.',
    },
  ],
  'RTC - 14 - 18 ans': [
    {
      id: 'rtc-1-passage-14-18',
      title: 'RTC - 1 passage - 14-18 ans',
      price: 'CA$2.75',
      category: 'RTC - 14 - 18 ans',
      description: 'Titre d’un passage tarif réduit 14-18 ans.',
    },
    {
      id: 'rtc-20-billets-14-18',
      title: 'RTC - Lot de 20 billets 14-18 ans',
      price: 'CA$48.00',
      category: 'RTC - 14 - 18 ans',
      description: 'Lot de 20 passages tarif réduit 14-18 ans.',
    },
    {
      id: 'rtc-mensuel-14-18',
      title: 'RTC - Mensuel 14-18 ans',
      price: 'CA$64.00',
      category: 'RTC - 14 - 18 ans',
      description: 'Laissez-passer mensuel pour les 14-18 ans.',
    },
  ],
  'RTC - Etudiant +': [
    {
      id: 'rtc-mensuel-etudiant',
      title: 'RTC - Mensuel Étudiant +',
      price: 'CA$64.00',
      category: 'RTC - Etudiant +',
      description: 'Abonnement mensuel réservé aux étudiants admissibles.',
    },
    {
      id: 'rtc-session-etudiant',
      title: 'RTC - Session Étudiant +',
      price: 'CA$195.00',
      category: 'RTC - Etudiant +',
      description: 'Abonnement pour la session complète.',
    },
  ],
  'RTC - 65+': [
    {
      id: 'rtc-1-passage-65',
      title: 'RTC - 1 passage - 65+',
      price: 'CA$2.75',
      category: 'RTC - 65+',
      description: 'Titre 1 passage pour aînés 65 ans et plus.',
    },
    {
      id: 'rtc-mensuel-65',
      title: 'RTC - Mensuel - 65+',
      price: 'CA$64.00',
      category: 'RTC - 65+',
      description: 'Abonnement mensuel réservé aux 65 ans et plus.',
    },
  ],
  STLévis: [
    {
      id: 'stlevis-1-passage',
      title: 'STLévis - 1 passage',
      price: 'CA$3.75',
      category: 'STLévis',
      description: 'Titre 1 passage pour le réseau de la STLévis.',
    },
    {
      id: 'stlevis-mensuel',
      title: 'STLévis - Mensuel',
      price: 'CA$95.00',
      category: 'STLévis',
      description: 'Abonnement mensuel STLévis.',
    },
  ],
  'RTC + Communauto': [
    {
      id: 'rtc-communauto-mensuel',
      title: 'RTC + Communauto Mensuel',
      price: 'CA$105.00',
      category: 'RTC + Communauto',
      description: 'Combinaison mensuelle transport en commun et auto-partage.',
    },
  ],
  'RTC - ÉquiMobilité': [
    {
      id: 'rtc-equi-1-passage',
      title: 'RTC - ÉquiMobilité 1 passage',
      price: 'CA$2.15',
      category: 'RTC - ÉquiMobilité',
      description: 'Titre à tarif réduit ÉquiMobilité.',
    },
    {
      id: 'rtc-equi-mensuel',
      title: 'RTC - ÉquiMobilité Mensuel',
      price: 'CA$44.50',
      category: 'RTC - ÉquiMobilité',
      description: 'Laissez-passer mensuel programme ÉquiMobilité.',
    },
  ],
  'STAC - ÉquiMobilité': [
    {
      id: 'stac-equi-1-passage',
      title: 'STAC - ÉquiMobilité 1 passage',
      price: 'CA$2.15',
      category: 'STAC - ÉquiMobilité',
      description: 'Titre STAC adaptatif ÉquiMobilité.',
    },
    {
      id: 'stac-equi-mensuel',
      title: 'STAC - ÉquiMobilité Mensuel',
      price: 'CA$44.50',
      category: 'STAC - ÉquiMobilité',
      description: 'Abonnement mensuel STAC ÉquiMobilité.',
    },
  ],
};

function BasketPlusIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M7 8L10 3.5M17 8L14 3.5" stroke="#171717" strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M3 8.5H21" stroke="#171717" strokeWidth="1.8" strokeLinecap="round" />
      <Path
        d="M4.5 8.5L5.8 17.2C5.9 18.2 6.7 19 7.7 19H12.5"
        stroke="#171717"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <Path d="M19.5 8.5L18.8 13" stroke="#171717" strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M17 15V20M14.5 17.5H19.5" stroke="#171717" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export default function Boutique() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('RTC - Général');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentTickets = TICKETS_DATA[selectedCategory] || [];

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  const handleAddToCart = (item: TicketItem) => {
    Alert.alert('Panier', `${item.title} a été ajouté au panier.`, [{ text: 'OK' }]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header Bar with Logo and User Icon */}
      <View style={styles.logoBar}>
        <Image
          source={require('../../../assets/images/img/rtc.png')}
          contentFit="contain"
          accessibilityLabel="RTC logo"
          style={styles.logo}
        />
        <View style={styles.userIcon}>
          <Ionicons name="person" size={28} color="#FFFFFF" />
        </View>
      </View>

      <View style={styles.page}>
        {/* Blue Hero Header section */}
        <View style={styles.hero}>
          <Text style={styles.title}>Store</Text>
        </View>

        {/* Dropdown Container overlaying Header and List */}
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`Catégorie sélectionnée: ${selectedCategory}`}
            activeOpacity={0.8}
            onPress={() => setIsDropdownOpen((prev) => !prev)}
            style={styles.dropdownTrigger}
          >
            <Text style={styles.dropdownTriggerText}>{selectedCategory}</Text>
            <Ionicons
              name={isDropdownOpen ? 'caret-up' : 'caret-down'}
              size={18}
              color="#171717"
            />
          </TouchableOpacity>

          {/* Expanded Dropdown Options List */}
          {isDropdownOpen && (
            <View style={styles.dropdownMenu}>
              {CATEGORIES.map((cat) => {
                const isSelected = cat === selectedCategory;
                return (
                  <TouchableOpacity
                    key={cat}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    activeOpacity={0.7}
                    onPress={() => handleSelectCategory(cat)}
                    style={[styles.dropdownItem, isSelected && styles.dropdownItemSelected]}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        isSelected && styles.dropdownItemTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Ticket Items List */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {currentTickets.map((item) => (
            <View style={styles.card} key={item.id}>
              <View style={styles.imageContainer}>
                <Image
                  source={
                    item.image ?? require('../../../assets/images/img/ticket_bleu.png')
                  }
                  contentFit="contain"
                  accessibilityLabel="Icone ticket bleu"
                  style={styles.ticketImage}
                />
              </View>

              {/* Title */}
              <View style={styles.titleContainer}>
                <Text style={styles.cardTitle}>{item.title}</Text>
              </View>

              {/* Price & Add to Cart Action */}
              <View style={styles.actionContainer}>
                <Text style={styles.cardPrice}>{item.price}</Text>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={`Ajouter ${item.title} au panier`}
                  activeOpacity={0.7}
                  onPress={() => handleAddToCart(item)}
                  style={styles.cartButton}
                >
                  <BasketPlusIcon />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const COLORS = {
  navy: '#15366F',
  blue: '#1C4698',
  background: '#F2F2F2',
  white: '#FFFFFF',
  text: '#171717',
  border: '#D0D0D0',
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.navy,
  },
  logoBar: {
    height: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.navy,
    paddingHorizontal: 20,
    position: 'relative',
  },
  logo: {
    width: 116,
    height: 58,
  },
  userIcon: {
    position: 'absolute',
    right: 20,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  page: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  hero: {
    height: 110,
    paddingTop: 24,
    paddingHorizontal: 24,
    backgroundColor: COLORS.blue,
  },
  title: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: '700',
  },
  dropdownWrapper: {
    position: 'relative',
    marginTop: -28,
    marginHorizontal: 20,
    zIndex: 100,
    elevation: 6,
  },
  dropdownTrigger: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.12)',
    elevation: 4,
  },
  dropdownTriggerText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '500',
  },
  dropdownMenu: {
    marginTop: 4,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 6,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  dropdownItemSelected: {
    backgroundColor: '#F3F4F6',
  },
  dropdownItemText: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '400',
  },
  dropdownItemTextSelected: {
    fontWeight: '600',
    color: COLORS.navy,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 28,
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.08)',
    elevation: 3,
    minHeight: 120,
  },
  imageContainer: {
    width: 82,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketImage: {
    width: 82,
    height: 72,
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
  },
  actionContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 72,
  },
  cardPrice: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '800',
  },
  cartButton: {
    width: 44,
    height: 42,
    borderRadius: 8,
    borderWidth: 1.2,
    borderColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});

