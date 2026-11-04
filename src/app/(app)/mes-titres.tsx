import { useEffect, useMemo, useState } from 'react';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { AppPage } from '@/components/shop/AppPage';
import { BuyTicketsButton } from '@/components/shop/BuyTicketsButton';
import { ShopTheme } from '@/constants/shop-theme';
import {
  type ActiveTicket,
  useActiveTicket,
} from '@/contexts/active-ticket-context';
import { useShopCart } from '@/contexts/shop-cart-context';

type TitlesTab = 'current' | 'remaining';
const QR_SIZE = 21;

function formatExpiryDate(timestamp: number): string {
  const date = new Date(timestamp);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} à ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function buildTicketCodeMatrix(code: string): boolean[][] {
  const matrix = Array.from({ length: QR_SIZE }, () => Array(QR_SIZE).fill(false));
  let seed = Array.from(code).reduce(
    (value, character) => (value * 31 + character.charCodeAt(0)) >>> 0,
    0,
  );

  const finderOrigins = [
    [0, 0],
    [QR_SIZE - 7, 0],
    [0, QR_SIZE - 7],
  ];

  const inFinderArea = (x: number, y: number) =>
    finderOrigins.some(([originX, originY]) =>
      x >= originX - 1 &&
      x <= originX + 7 &&
      y >= originY - 1 &&
      y <= originY + 7,
    );

  for (const [originX, originY] of finderOrigins) {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const isBorder = x === 0 || x === 6 || y === 0 || y === 6;
        const isCenter = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        matrix[originY + y][originX + x] = isBorder || isCenter;
      }
    }
  }

  for (let y = 0; y < QR_SIZE; y++) {
    for (let x = 0; x < QR_SIZE; x++) {
      if (inFinderArea(x, y)) continue;
      seed = (seed * 1664525 + 1013904223) >>> 0;
      matrix[y][x] = (seed & 0x80000000) !== 0;
    }
  }

  return matrix;
}

function TicketCodeGraphic({ code }: { code: string }) {
  const modules = useMemo(() => buildTicketCodeMatrix(code), [code]);

  return (
    <View style={styles.codeFrame} accessibilityLabel="Code graphique du titre">
      <Svg width="100%" height="100%" viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`} accessibilityLabel="Code du titre">
        {modules.flatMap((row, y) =>
          row.map((isFilled, x) =>
            isFilled ? <Rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#000000" /> : null,
          ),
        )}
      </Svg>
    </View>
  );
}

function PassengerBadge({ quantity }: { quantity: number }) {
  return (
    <View style={styles.passengerBadge}>
      <Svg width={21} height={21} viewBox="0 0 24 24" accessibilityLabel="Nombre de titres">
        <Circle cx={9} cy={7} r={4} fill={ShopTheme.colors.ticketBlue} />
        <Path
          d="M1.5 20c0-4 3-6.5 7.5-6.5 1.6 0 3 .3 4.1.9L11 19.5V21H2.5c-.6 0-1-.4-1-1z"
          fill={ShopTheme.colors.ticketBlue}
        />
        <Path
          d="m12.5 18.5 2.8 2.8 5.7-6"
          stroke={ShopTheme.colors.ticketBlue}
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      <Text style={styles.passengerCount}>{quantity}</Text>
    </View>
  );
}

export default function MesTitres() {
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [selectedTab, setSelectedTab] = useState<TitlesTab>('current');
  const isCurrentTab = selectedTab === 'current';
  const { activeTickets, remainingTickets, activatePurchasedTicket } = useActiveTicket();
  const { showToast } = useShopCart();
  const currentTickets = [
    ...remainingTickets.map((ticket) => ({
      id: ticket.id,
      productId: ticket.productId,
      title: ticket.title,
      activeTicket: null as ActiveTicket | null,
    })),
    ...activeTickets.map((ticket) => ({
      id: ticket.id,
      productId: ticket.productId,
      title: ticket.title,
      activeTicket: ticket,
    })),
  ];

  useEffect(() => {
    if (tab === 'current' || tab === 'remaining') {
      setSelectedTab(tab);
    }
  }, [tab]);

  const handleOpenTicket = (ticket: Pick<ActiveTicket, 'id' | 'productId' | 'title'>) => {
    router.push({
      pathname: '/ticket-countdown',
      params: {
        ticketId: ticket.id,
        productId: ticket.productId,
        title: ticket.title,
      },
    });
  };

  const handleActivateTicket = async (ticketId: string) => {
    try {
      const ticket = await activatePurchasedTicket(ticketId);
      if (!ticket) {
        const alreadyActivated = activeTickets.find((item) => item.id === ticketId);
        if (alreadyActivated) {
          handleOpenTicket(alreadyActivated);
          return;
        }
        showToast('Ce titre n’est plus disponible.');
        return;
      }

      handleOpenTicket(ticket);
    } catch {
      showToast('Impossible d’activer ce titre. Veuillez réessayer.');
    }
  };

  return (
    <AppPage title="Mes titres">
      <View style={styles.content}>
        <View style={styles.tabsContainer}>
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: isCurrentTab }}
            onPress={() => setSelectedTab('current')}
            style={[styles.tab, isCurrentTab && styles.tabActive]}
          >
            <Text style={styles.tabText}>Titres en cours</Text>
          </Pressable>
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: !isCurrentTab }}
            onPress={() => setSelectedTab('remaining')}
            style={[styles.tab, !isCurrentTab && styles.tabActive]}
          >
            <Text style={styles.tabText}>Titres restants</Text>
          </Pressable>
        </View>

        {isCurrentTab && currentTickets.length > 0 ? (
          <View style={styles.remainingTickets}>
            <Text style={styles.remainingCount}>
              {currentTickets.length}{' '}
              {currentTickets.length > 1 ? 'titres' : 'titre'}
            </Text>
            {currentTickets.map((ticket) => {
              const activatedTicket = ticket.activeTicket;
              return (
                <View key={ticket.id} style={styles.ticketCard}>
                  <View style={[styles.ticketHeader, styles.remainingTicketHeader]}>
                    <PassengerBadge quantity={1} />
                    <Text
                      style={[styles.ticketTitle, styles.remainingTicketTitle]}
                      numberOfLines={2}
                    >
                      {ticket.title}
                    </Text>
                  </View>

                  <View style={styles.ticketBody}>
                    <View style={styles.validity}>
                      {activatedTicket ? (
                        <>
                          <Text style={styles.validityLabel}>Valide jusqu&apos;au :</Text>
                          <View style={styles.expiryRow}>
                            <Ionicons name="calendar-outline" size={16} color="#D6322F" />
                            <Text style={styles.expiryDate} numberOfLines={1}>
                              {formatExpiryDate(activatedTicket.expiresAt)}
                            </Text>
                          </View>
                        </>
                      ) : (
                        <Text style={styles.validityLabel}>Titre prêt à être activé</Text>
                      )}
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.ticketAside}>
                      <View style={styles.activePill}>
                        <View
                          style={[
                            styles.greenDot,
                            !activatedTicket && styles.inactiveDot,
                          ]}
                        />
                        <Text style={styles.activePillText}>
                          {activatedTicket ? 'en cours' : 'à valider'}
                        </Text>
                      </View>
                      {activatedTicket && (
                        <TicketCodeGraphic code={activatedTicket.controlCode} />
                      )}
                    </View>
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                      activatedTicket
                        ? `Afficher le compte à rebours de ${ticket.title}`
                        : `Valider une correspondance avec ${ticket.title}`
                    }
                    onPress={() =>
                      activatedTicket
                        ? handleOpenTicket(activatedTicket)
                        : void handleActivateTicket(ticket.id)
                    }
                    style={({ pressed }) => [
                      styles.correspondenceButton,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Text style={styles.correspondenceButtonText}>
                      {activatedTicket
                        ? 'Afficher le compte à rebours'
                        : 'Valider une correspondance'}
                    </Text>
                  </Pressable>
                  {activatedTicket && (
                    <View style={styles.validityNotice}>
                      <Ionicons
                        name="information-circle"
                        size={26}
                        color={ShopTheme.colors.ticketBlue}
                      />
                      <Text style={styles.validityNoticeText}>
                        Billet valide{' '}
                        {Math.round(activatedTicket.durationSeconds / 60)} minutes après validation
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ) : !isCurrentTab && remainingTickets.length > 0 ? (
          <View style={styles.remainingTickets}>
            <Text style={styles.remainingCount}>
              {remainingTickets.length}{' '}
              {remainingTickets.length > 1 ? 'titres disponibles' : 'titre disponible'}
            </Text>
            {remainingTickets.map((ticket) => (
              <View key={ticket.id} style={styles.remainingTicketCard}>
                <View style={[styles.ticketHeader, styles.remainingTicketHeader]}>
                  <PassengerBadge quantity={1} />
                  <Text
                    style={[styles.ticketTitle, styles.remainingTicketTitle]}
                    numberOfLines={2}
                  >
                    {ticket.title}
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Valider une correspondance avec ${ticket.title}`}
                  onPress={() => void handleActivateTicket(ticket.id)}
                  style={({ pressed }) => [
                    styles.correspondenceButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.correspondenceButtonText}>Valider une correspondance</Text>
                </Pressable>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Image
              source={require('../../../assets/images/img/titres.png')}
              contentFit="contain"
              accessibilityLabel="Illustration d’un titre de transport"
              style={styles.ticketImage}
            />
            <Text style={styles.emptyText}>
              {isCurrentTab
                ? "Vous n'avez aucun titre en cours"
                : "Vous n'avez aucun titre restant"}
            </Text>
            <BuyTicketsButton />
          </View>
        )}
      </View>
    </AppPage>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabsContainer: {
    backgroundColor: ShopTheme.colors.card,
    borderRadius: 12,
    boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.16)',
    elevation: 4,
    flexDirection: 'row',
    height: 48,
    marginTop: -22,
    overflow: 'hidden',
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  tabActive: {
    borderBottomColor: ShopTheme.colors.blue,
    borderBottomWidth: 2,
  },
  tabText: {
    color: ShopTheme.colors.text,
    fontFamily: ShopTheme.fonts.regular,
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    flex: 1,
    gap: 28,
    justifyContent: 'center',
    paddingBottom: 24,
    paddingTop: 34,
  },
  ticketImage: {
    height: 90,
    width: 120,
  },
  emptyText: {
    color: ShopTheme.colors.text,
    fontFamily: ShopTheme.fonts.bold,
    fontSize: 16,
    textAlign: 'center',
  },
  activeTicketContainer: {
    alignItems: 'center',
    paddingTop: 24,
  },
  remainingTickets: {
    gap: 14,
    paddingBottom: 24,
    paddingTop: 24,
  },
  remainingCount: {
    color: ShopTheme.colors.text,
    fontFamily: ShopTheme.fonts.bold,
    fontSize: 16,
  },
  remainingTicketCard: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: ShopTheme.colors.ticketBlue,
    borderRadius: 12,
    borderWidth: 1.5,
    elevation: 3,
    maxWidth: 368,
    overflow: 'hidden',
    paddingBottom: 10,
    paddingTop: 0,
    shadowColor: '#142864',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    width: '100%',
  },
  remainingTicketHeader: {
    height: 'auto',
    minHeight: 48,
  },
  remainingTicketTitle: {
    paddingVertical: 6,
  },
  validityNotice: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  validityNoticeText: {
    color: '#4B5563',
    flex: 1,
    fontFamily: ShopTheme.fonts.regular,
    fontSize: 13,
    textAlign: 'left',
  },
  ticketCard: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: ShopTheme.colors.ticketBlue,
    borderRadius: 12,
    borderWidth: 1.5,
    elevation: 3,
    maxWidth: 368,
    overflow: 'hidden',
    paddingBottom: 10,
    shadowColor: '#142864',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    width: '100%',
  },
  ticketHeader: {
    alignItems: 'stretch',
    backgroundColor: '#C6D4EC',
    flexDirection: 'row',
    height: 35,
  },
  passengerBadge: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomColor: ShopTheme.colors.ticketBlue,
    borderBottomRightRadius: 12,
    borderBottomWidth: 1.5,
    borderRightColor: ShopTheme.colors.ticketBlue,
    borderRightWidth: 1.5,
    flexDirection: 'row',
    gap: 2,
    justifyContent: 'center',
    width: 54,
  },
  passengerCount: {
    color: '#0E1B45',
    fontFamily: ShopTheme.fonts.bold,
    fontSize: 17,
  },
  ticketTitle: {
    color: '#0E1B45',
    flex: 1,
    fontFamily: ShopTheme.fonts.bold,
    fontSize: 14,
    paddingHorizontal: 5,
    textAlign: 'right',
    textAlignVertical: 'center',
  },
  ticketBody: {
    flexDirection: 'row',
    height: 105,
  },
  validity: {
    alignSelf: 'flex-end',
    flex: 1,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 4,
  },
  validityLabel: {
    color: '#111111',
    fontFamily: ShopTheme.fonts.regular,
    fontSize: 14,
    lineHeight: 18,
  },
  expiryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    marginTop: 3,
  },
  expiryDate: {
    color: '#111111',
    flexShrink: 1,
    fontFamily: ShopTheme.fonts.bold,
    fontSize: 13,
    lineHeight: 18,
  },
  separator: {
    backgroundColor: ShopTheme.colors.ticketBlue,
    marginBottom: 1,
    marginTop: 10,
    width: 1.5,
  },
  ticketAside: {
    alignItems: 'center',
    paddingTop: 11,
    width: 92,
  },
  activePill: {
    alignItems: 'center',
    backgroundColor: '#E0F4BD',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 5,
    height: 24,
    paddingLeft: 7,
    paddingRight: 9,
  },
  greenDot: {
    backgroundColor: '#2E9B43',
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  inactiveDot: {
    backgroundColor: '#8A8A8A',
  },
  activePillText: {
    color: '#1D2A3A',
    fontFamily: ShopTheme.fonts.medium,
    fontSize: 12,
  },
  codeFrame: {
    backgroundColor: '#FFFFFF',
    borderColor: '#555555',
    borderRadius: 3,
    borderWidth: 1,
    height: 50,
    marginTop: 7,
    padding: 3,
    width: 50,
  },
  correspondenceButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: ShopTheme.colors.ticketBlue,
    borderRadius: 5,
    height: 39,
    justifyContent: 'center',
    marginHorizontal: 10,
    marginTop: 10,
    width: '94%',
  },
  correspondenceButtonText: {
    color: '#FFFFFF',
    fontFamily: ShopTheme.fonts.medium,
    fontSize: 15,
    letterSpacing: 0.3,
  },
  cardPressed: {
    opacity: 0.8,
  },
  buttonPressed: {
    opacity: 0.85,
  },
});
