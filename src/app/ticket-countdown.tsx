import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CountdownScreen } from '@/components/ticket/CountdownScreen';

export default function TicketCountdownRoute() {
  const { productId, title } = useLocalSearchParams<{
    productId?: string;
    title?: string;
  }>();

  return (
    <>
      <StatusBar style="light" />
      <CountdownScreen
        initialProductId={productId}
        initialTitle={title}
      />
    </>
  );
}
