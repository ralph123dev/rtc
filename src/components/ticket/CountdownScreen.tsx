import {
  type ActiveTicket,
  parseTicketDurationSeconds,
  useActiveTicket,
} from '@/contexts/active-ticket-context';
import { Ionicons } from '@expo/vector-icons';
import { Image, ImageBackground } from 'expo-image';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewInstance,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

type Props = {
  initialTicketId?: string;
  initialProductId?: string;
  initialTitle?: string;
};

const QR_SIZE = 25;
const ORBIT_CYCLE_DURATION_MS = 3000;
const TOUCH_ORBIT_CYCLE_DURATION_MS = 900;
const BACKGROUND_IMAGE_SCALE = 1.09;
const BACKGROUND_IMAGE_OFFSET_Y = 24;
function pad(num: number): string {
  return String(num).padStart(2, '0');
}

function formatFullDateTime(date: Date): string {
  const d = pad(date.getDate());
  const m = pad(date.getMonth() + 1);
  const y = date.getFullYear();
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${d}/${m}/${y} à ${h}:${min}`;
}

function buildQrMatrix(seedStr: string): boolean[][] {
  const n = QR_SIZE;
  const matrix: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));

  let s = 7;
  for (let i = 0; i < seedStr.length; i++) {
    s = (s * 31 + seedStr.charCodeAt(i)) >>> 0;
  }
  const rnd = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };

  const isFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!isFinder(x, y) && rnd() > 0.52) {
        matrix[y][x] = true;
      }
    }
  }

  const drawFinder = (startX: number, startY: number) => {
    for (let dy = 0; dy < 7; dy++) {
      for (let dx = 0; dx < 7; dx++) {
        const isBorder = dx === 0 || dx === 6 || dy === 0 || dy === 6;
        const isInner = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
        matrix[startY + dy][startX + dx] = isBorder || isInner;
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(n - 7, 0);
  drawFinder(0, n - 7);

  return matrix;
}

function QrGraphic({ code }: { code: string }) {
  const matrix = useMemo(() => buildQrMatrix(code), [code]);

  return (
    <View style={styles.qrContainer} accessibilityLabel="Code QR du titre">
      <Svg width={54} height={54} viewBox="0 0 25 25">
        <Rect x={0} y={0} width={25} height={25} fill="#FFFFFF" />
        {matrix.flatMap((row, y) =>
          row.map((isFilled, x) =>
            isFilled ? (
              <Rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#111111" />
            ) : null,
          ),
        )}
      </Svg>
    </View>
  );
}

function CalendarIcon({
  color = '#2f9a3f',
  size = 18,
  variant = 'check',
}: {
  color?: string;
  size?: number;
  variant?: 'check' | 'cross';
}) {
  const isCross = variant === 'cross' || color === '#d8282f' || color === '#EF4444';
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
      {isCross ? (
        <Path d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708" />
      ) : (
        <Path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0" />
      )}
      <Path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
    </Svg>
  );
}

export function CountdownScreen({ initialTicketId, initialProductId, initialTitle }: Props) {
  const insets = useSafeAreaInsets();
  const { activeTicket, activeTickets, isLoaded, activateTicket } = useActiveTicket();
  const orbitRotation = useRef(new Animated.Value(0)).current;
  const orbitAnim = useRef<Animated.CompositeAnimation | null>(null);
  const savedRotation = useRef(0);
  const isRotating = useRef(false);
  const activeTouchId = useRef<number | null>(null);
  const orbitPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const screenRef = useRef<ViewInstance>(null);
  const emblemRef = useRef<ViewInstance>(null);
  const screenOrigin = useRef({ x: 0, y: 0 });
  const [hasMovedOrbit, setHasMovedOrbit] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const matchingTicket = initialTicketId
    ? activeTickets.find((ticket) => ticket.id === initialTicketId) ?? null
    : activeTicket;
  const [ticketSnapshot, setTicketSnapshot] = useState<ActiveTicket | null>(null);

  useEffect(() => {
    if (matchingTicket) setTicketSnapshot(matchingTicket);
  }, [matchingTicket]);

  useEffect(() => {
    if (isLoaded && !matchingTicket && !initialTicketId && activeTickets.length === 0) {
      const title = initialTitle || 'RTC - 1 passage - Général';
      activateTicket({
        id: initialProductId || 'general-one-trip',
        title,
      });
    }
  }, [
    isLoaded,
    matchingTicket,
    initialTicketId,
    activeTickets.length,
    initialProductId,
    initialTitle,
    activateTicket,
  ]);

  const [now, setNow] = useState(() => Date.now());

  // Horodatage d'entrée sur la page — réinitialisé à chaque montage du composant
  // Sert uniquement au chrono affiché (timerText). La progression, elle, utilise activatedAt.
  const enteredAt = useRef(Date.now());


  const ticket: ActiveTicket = useMemo(() => {
    if (matchingTicket) return matchingTicket;
    if (ticketSnapshot) return ticketSnapshot;
    const activatedAt = Date.now();
    const duration = parseTicketDurationSeconds(initialTitle || 'RTC - 1 passage - Général');
    return {
      id: 'default-ticket',
      productId: initialProductId || 'general-one-trip',
      title: initialTitle || 'RTC - 1 passage - Général',
      quantity: 1,
      activatedAt,
      expiresAt: activatedAt + duration * 1000,
      durationSeconds: duration,
      controlCode: '1-6ACF49E06A8DA',
      expiredControlCode: '1-6ACA11C47B150',
    };
  }, [matchingTicket, ticketSnapshot, initialProductId, initialTitle]);

  const isLevisTicket = ticket.productId.startsWith('stlevis-');

  const totalDurationMs = useMemo(() => {
    return ticket.durationSeconds * 1000;
  }, [ticket.durationSeconds]);

  const elapsedMs = useMemo(() => {
    const elapsed = now - ticket.activatedAt;
    return Math.max(0, elapsed);
  }, [now, ticket.activatedAt]);

  const isExpired = elapsedMs >= totalDurationMs;

  // Intervalle de mise à jour chaque seconde (stoppé si le titre est expiré)
  useEffect(() => {
    if (isExpired) return;
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [isExpired]);

  // Enregistre continuellement la valeur de rotation actuelle
  useEffect(() => {
    const listenerId = orbitRotation.addListener(({ value }) => {
      savedRotation.current = value;
    });
    return () => {
      orbitRotation.removeListener(listenerId);
    };
  }, [orbitRotation]);

  const startOrbit = useCallback((cycleDuration = ORBIT_CYCLE_DURATION_MS) => {
    if (isExpired) return;
    isRotating.current = true;
    const startVal = savedRotation.current;
    const remainingTime = Math.max(50, cycleDuration * (1 - startVal));

    orbitAnim.current = Animated.timing(orbitRotation, {
      toValue: 1,
      duration: remainingTime,
      easing: Easing.linear,
      useNativeDriver: true,
    });

    orbitAnim.current.start(({ finished }) => {
      if (finished && isRotating.current) {
        orbitRotation.setValue(0);
        savedRotation.current = 0;
        const loopAnimation = () => {
          if (!isRotating.current) return;
          orbitAnim.current = Animated.timing(orbitRotation, {
            toValue: 1,
            duration: cycleDuration,
            easing: Easing.linear,
            useNativeDriver: true,
          });
          orbitAnim.current.start(({ finished: loopFinished }) => {
            if (loopFinished && isRotating.current) {
              orbitRotation.setValue(0);
              savedRotation.current = 0;
              loopAnimation();
            }
          });
        };
        loopAnimation();
      }
    });
  }, [isExpired, orbitRotation]);

  const pauseOrbit = useCallback(() => {
    isRotating.current = false;
    if (orbitAnim.current) {
      orbitAnim.current.stop();
    }
    const currentVal = (orbitRotation as any)._value;
    if (typeof currentVal === 'number') {
      savedRotation.current = currentVal;
    }
  }, [orbitRotation]);

  const handleTouchStart = useCallback(
    (event: Parameters<NonNullable<React.ComponentProps<typeof View>['onTouchStart']>>[0]) => {
      const touch = event.nativeEvent.changedTouches[0];
      if (!touch) return;
      activeTouchId.current = touch.identifier;
      setHasMovedOrbit(true);
      setScrollEnabled(false);
      pauseOrbit();
      startOrbit(TOUCH_ORBIT_CYCLE_DURATION_MS);
      screenRef.current?.measureInWindow((x, y) => {
        screenOrigin.current = { x, y };
        orbitPosition.setValue({
          x: touch.pageX - x - 78,
          y: touch.pageY - y - 78,
        });
      });
    },
    [orbitPosition, pauseOrbit, startOrbit],
  );

  const handleTouchMove = useCallback(
    (event: Parameters<NonNullable<React.ComponentProps<typeof View>['onTouchMove']>>[0]) => {
      const touch = event.nativeEvent.touches.find(
        ({ identifier }) => identifier === activeTouchId.current,
      );
      if (touch) {
        orbitPosition.setValue({
          x: touch.pageX - screenOrigin.current.x - 78,
          y: touch.pageY - screenOrigin.current.y - 78,
        });
      }
    },
    [orbitPosition],
  );

  const handleTouchEnd = useCallback(
    (event: Parameters<NonNullable<React.ComponentProps<typeof View>['onTouchEnd']>>[0]) => {
      const endedActiveTouch = event.nativeEvent.changedTouches.some(
        ({ identifier }) => identifier === activeTouchId.current,
      );
      if (endedActiveTouch) {
        activeTouchId.current = null;
        setScrollEnabled(true);
        if (!isExpired) {
          pauseOrbit();
          startOrbit();
          screenRef.current?.measureInWindow((screenX, screenY) => {
            screenOrigin.current = { x: screenX, y: screenY };
            emblemRef.current?.measureInWindow((logoX, logoY, width, height) => {
              Animated.spring(orbitPosition, {
                toValue: {
                  x: logoX - screenX + width / 2 - 78,
                  y: logoY - screenY + height / 2 - 78,
                },
                friction: 7,
                tension: 55,
                useNativeDriver: true,
              }).start(({ finished }) => {
                if (finished) {
                  setHasMovedOrbit(false);
                }
              });
            });
          });
        }
      }
    },
    [isExpired, orbitPosition, pauseOrbit, startOrbit],
  );

  const handleTouchCancel = handleTouchEnd;

  useEffect(() => {
    if (isExpired) {
      pauseOrbit();
      return;
    }
    startOrbit();
    return () => pauseOrbit();
  }, [isExpired, startOrbit, pauseOrbit]);

  // Pourcentage de progression (0 à 100)
  const progressPercent = useMemo(() => {
    if (isExpired) return 100;
    if (totalDurationMs <= 0) return 100;
    const ratio = Math.min(1, Math.max(0, elapsedMs / totalDurationMs));
    return Math.max(2, Math.round(ratio * 1000) / 10);
  }, [elapsedMs, totalDurationMs, isExpired]);

  // Chrono de session : repart de 0 à chaque retour sur la page
  // NB : maintenu par le même intervalle setNow() d'une seconde.
  const sessionElapsedSeconds = useMemo(() => {
    if (isExpired) return 0;
    const elapsed = Math.floor((now - enteredAt.current) / 1000);
    return Math.max(0, elapsed);
  }, [now, isExpired]);

  const timerText = useMemo(() => {
    const mins = Math.floor(sessionElapsedSeconds / 60);
    const secs = String(sessionElapsedSeconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  }, [sessionElapsedSeconds]);

  // Temps restant en secondes
  const remainingSeconds = useMemo(() => {
    if (isExpired) return 0;
    return Math.max(0, Math.floor((totalDurationMs - elapsedMs) / 1000));
  }, [isExpired, totalDurationMs, elapsedMs]);

  const remainingLabel = useMemo(() => {
    if (isExpired) return 'Titre expiré';
    const days = Math.floor(remainingSeconds / 86400);
    const hours = Math.floor((remainingSeconds % 86400) / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    if (days > 0) {
      return `${days}j ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
    }
    if (hours > 0) {
      return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
    }
    return `${pad(minutes)}m ${pad(seconds)}s`;
  }, [remainingSeconds, isExpired]);

  const startDate = useMemo(() => new Date(ticket.activatedAt), [ticket.activatedAt]);
  const endDate = useMemo(() => new Date(ticket.expiresAt), [ticket.expiresAt]);

  const displayControlCode = useMemo(() => {
    if (isExpired && ticket.expiredControlCode) {
      return ticket.expiredControlCode;
    }
    if (ticket.controlCode) {
      if (ticket.controlCode.startsWith('1-')) {
        return ticket.controlCode.toUpperCase();
      }
      return `1-${ticket.controlCode.toUpperCase()}`;
    }
    return '1-6ACF49E06A8DA';
  }, [isExpired, ticket.controlCode, ticket.expiredControlCode]);

  const renderOrbitDots = () => (
    <Animated.View
      pointerEvents={remainingSeconds > 1800 ? 'box-none' : 'none'}
      style={[
        styles.orbitingDots,
        {
          opacity: remainingSeconds > 1800 ? 1 : 0,
          transform: [
            {
              rotate: orbitRotation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        },
      ]}
    >
      <View style={[styles.dotTouchWrapper, styles.cyanDotPosition]}>
        <View style={[styles.dotCircle, { backgroundColor: '#52C5F8' }]} />
      </View>
      <View style={[styles.dotTouchWrapper, styles.pinkDotPosition]}>
        <View style={[styles.dotCircle, { backgroundColor: '#E4007C' }]} />
      </View>
    </Animated.View>
  );

  return (
    <ImageBackground
      source={
        isLevisTicket
          ? require('../../../assets/images/img/deuxieme.png')
          : require('../../../assets/images/img/motif_bleu.png')
      }
      style={styles.backgroundImage}
      contentFit="cover"
      imageStyle={{
        transform: [
          { scale: BACKGROUND_IMAGE_SCALE },
          { translateY: BACKGROUND_IMAGE_OFFSET_Y },
        ],
      }}
    >
      {!isLevisTicket && (
        <Svg
          pointerEvents="none"
          style={styles.backgroundGradient}
          viewBox="0 0 650 650"
        >
          <Defs>
            <RadialGradient id="backgroundBlueGradient" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#0066FF" stopOpacity="0.65" />
              <Stop offset="35%" stopColor="#0066FF" stopOpacity="0.25" />
              <Stop offset="55%" stopColor="#0066FF" stopOpacity="0.08" />
              <Stop offset="70%" stopColor="#0066FF" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect width="650" height="650" fill="url(#backgroundBlueGradient)" />
        </Svg>
      )}
      <View
        ref={screenRef}
        style={styles.screen}
        onLayout={() => {
          screenRef.current?.measureInWindow((x, y) => {
            screenOrigin.current = { x, y };
          });
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <View
          style={[
            styles.container,
            { paddingTop: insets.top, paddingBottom: insets.bottom + 8 },
          ]}
        >
        {/* Top Header Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Retour"
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          scrollEnabled={scrollEnabled}
        >
          {/* ────── CENTER EMBLEM (ACTIVE vs EXPIRED) ────── */}
          <View style={styles.emblemContainer}>
            {isExpired ? (
              <View style={styles.expiredCircle}>
                <Text style={styles.expiredCircleText}>EXPIRÉ</Text>
              </View>
            ) : (
              <View ref={emblemRef} style={styles.activeEmblemWrapper}>
                {/* Cercle blanc avec chameau — toujours visible quand actif */}
                <View style={styles.whiteCircle} pointerEvents="none">
                  <Image
                    source={require('../../../assets/images/img/camel_wifi.png')}
                    style={styles.camelImage}
                    contentFit="contain"
                    accessibilityLabel="Logo RTC Nomade avec chameau et ondes"
                  />
                </View>

                {!hasMovedOrbit && renderOrbitDots()}
              </View>
            )}
          </View>

          {/* ────── CARTES RTC (CARTE 1 & CARTE 2) ────── */}
          <View style={styles.cards}>
            {/* Carte 1 */}
            <View style={styles.card}>
              <View style={styles.head}>
                <View style={styles.tab}>
                  <Image
                    source={require('../../../assets/images/img/check.png')}
                    style={{ width: 28, height: 28 }}
                    contentFit="contain"
                    accessibilityLabel="Personne avec validation"
                  />
                  <Text style={styles.tabText}>{ticket.quantity || 1}</Text>
                </View>
                <Text style={styles.headTitle} numberOfLines={1}>
                  {ticket.title}
                </Text>
              </View>
              <View style={styles.c1}>
                <View style={styles.c1Txt}>
                  <Text style={styles.c1Label}>Période de validité</Text>
                  <View style={styles.c1DateRow}>
                    <CalendarIcon color="#2f9a3f" size={18} variant="check" />
                    <Text style={styles.c1DateText}>{formatFullDateTime(startDate)}</Text>
                  </View>
                  <View style={styles.c1DateRow}>
                    <CalendarIcon color="#d8282f" size={18} variant="cross" />
                    <Text style={styles.c1DateTextBold}>{formatFullDateTime(endDate)}</Text>
                  </View>
                </View>

                <View style={styles.c1Qr}>
                  <QrGraphic code={ticket.controlCode} />
                </View>
              </View>
            </View>

            {/* Carte 2 */}
            <View style={[styles.card, styles.cardMarginTop]}>
              <View style={styles.headCenter}>
                <View style={styles.c2Tab}>
                  <Text style={styles.c2TimerText}>{timerText}</Text>
                </View>
                <Text style={styles.headCenterTitle}>Informations de contrôle</Text>
              </View>

              <View style={styles.c2Body}>
                <View style={styles.c2Date}>
                  <CalendarIcon color="#2f9a3f" size={18} variant="check" />
                  <Text style={styles.c2DateText}>{formatFullDateTime(startDate)}</Text>
                </View>
                <Text style={styles.c2Code}>{displayControlCode}</Text>
              </View>
            </View>

            {/* Barre de progression (hauteur 32px verte, et 32px rouge quand expiré avec texte au milieu) */}
            <View style={styles.progress}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercent}%` },
                  isExpired ? styles.progressFillRed : styles.progressFillGreen,
                ]}
              />
              {isExpired && (
                <View style={styles.progressTextContainer} pointerEvents="none">
                  <Text style={styles.progressText}>EXPIRÉ</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
        </View>
        {hasMovedOrbit && !isExpired && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.touchOrbit,
              {
                transform: [
                  { translateX: orbitPosition.x },
                  { translateY: orbitPosition.y },
                ],
              },
            ]}
          >
            {renderOrbitDots()}
          </Animated.View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    backgroundColor: '#2549ED',
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundGradient: {
    height: 650,
    left: -200,
    position: 'absolute',
    top: -200,
    width: 650,
  },
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    zIndex: 10,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 20,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  scrollContent: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 28,
    paddingHorizontal: 16,
    paddingTop: 8,
    transform: [{ translateY: 23 }],
  },
  emblemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
    position: 'relative',
    marginTop: 220,
    transform: [{ translateY: -110 }],
  },
  activeEmblemWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 156,
    height: 156,
  },
  orbitingDots: {
    height: 156,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 156,
    zIndex: 40,
  },
  touchOrbit: {
    height: 156,
    position: 'absolute',
    width: 156,
    zIndex: 40,
  },
  dotTouchWrapper: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 50,
  },
  // Cyan : centré horizontalement en haut du cercle d'orbite (156×156)
  cyanDotPosition: {
    left: 46,
    top: -32,
  },
  // Pink : diamétralement opposé au cyan
  pinkDotPosition: {
    left: 46,
    top: 124,
  },
  dotCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 12,
  },
  whiteCircle: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 68,
    height: 136,
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    width: 136,
  },
  camelImage: {
    height: 88,
    width: 106,
  },
  expiredCircle: {
    alignItems: 'center',
    backgroundColor: '#DC2626',
    borderColor: '#FFFFFF',
    borderRadius: 68,
    borderWidth: 2.5,
    height: 136,
    justifyContent: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    width: 136,
  },
  expiredCircleText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  /* ────── CARTES RTC ────── */
  cards: {
    width: '100%',
    maxWidth: 412,
    paddingHorizontal: 0,
    transform: [{ translateY: -20 }],
  },
  card: {
    backgroundColor: '#f3f3f5',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
    marginTop: 16,
  },
  cardMarginTop: {
    marginTop: 16,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    backgroundColor: '#d9dcee',
  },
  tab: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
    paddingHorizontal: 14,
    backgroundColor: '#e9ebf7',
    borderBottomRightRadius: 12,
  },
  tabText: {
    fontWeight: '700',
    fontSize: 18,
    color: '#1b2b63',
  },
  headTitle: {
    flex: 1,
    textAlign: 'right',
    paddingRight: 10,
    color: '#1b2b63',
    fontWeight: '700',
    fontSize: 22,
  },
  headCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    backgroundColor: '#d9dcee',
  },
  c2Tab: {
    minWidth: 84,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eef2e8',
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: '#c9ceb9',
    borderBottomRightRadius: 12,
    paddingHorizontal: 8,
  },
  c2TimerText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1f5a26',
  },
  headCenterTitle: {
    flex: 1,
    textAlign: 'center',
    paddingRight: 60,
    fontSize: 18,
    fontWeight: '700',
    color: '#1b2b63',
  },
  c1: {
    flexDirection: 'row',
    paddingVertical: 9,
    paddingHorizontal: 12,
    minHeight: 78,
    alignItems: 'center',
  },
  c1Txt: {
    flex: 1,
    flexDirection: 'column',
    rowGap: 4,
  },
  c1Label: {
    fontSize: 14,
    color: '#444444',
  },
  c1DateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
  },
  c1DateText: {
    fontSize: 14,
    color: '#222222',
  },
  c1DateTextBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222222',
  },
  c1Qr: {
    width: 76,
    borderLeftWidth: 1.5,
    borderLeftColor: '#b9b9c6',
    paddingLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrContainer: {
    width: 54,
    height: 54,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  c2Body: {
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: 8,
    paddingTop: 11,
    paddingHorizontal: 10,
    paddingBottom: 13,
  },
  c2Date: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
  },
  c2DateText: {
    fontSize: 15,
    color: '#333333',
  },
  c2Code: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: 0.5,
    marginTop: 2,
  },

  /* ────── BARRE VERTE / ROUGE (HAUTEUR: 32PX) ────── */
  progress: {
    marginTop: 16,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e6e6f0',
    borderWidth: 1.5,
    borderColor: '#c6c6d8',
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    height: 32,
    borderRadius: 16,
  },
  progressFillGreen: {
    backgroundColor: '#2f9a3f',
  },
  progressFillRed: {
    backgroundColor: '#d8282f',
  },
  progressTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
    includeFontPadding: false,
    textAlign: 'center',
  },
});
