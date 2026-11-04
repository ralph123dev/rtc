import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CountdownScreen } from '@/components/ticket/CountdownScreen';

export default function TicketCountdownRoute() {
  const { productId, title, ticketId } = useLocalSearchParams<{
    productId?: string;
    title?: string;
    ticketId?: string;
  }>();

  return (
    <>
      <StatusBar style="light" />
      <CountdownScreen
        key={ticketId}
        initialTicketId={ticketId}
        initialProductId={productId}
        initialTitle={title}
      />
    </>
  );
}
