import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

interface STOMPMessage {
  type: string;
  data: any;
}

interface UseSTOMPSocketProps {
  url: string;
  onMessage?: (message: STOMPMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

export const useSTOMPSocket = ({ url, onMessage, onConnect, onDisconnect, onError }: UseSTOMPSocketProps) => {
  const client = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<STOMPMessage | null>(null);
  const subscriptions = useRef<{ [key: string]: any }>({});

  useEffect(() => {
    const connectSTOMP = () => {
      try {
        console.log('🔄 STOMP 연결 시도:', url);
        
        // SockJS 소켓 생성
        const socket = new SockJS(url);
        
        // 소켓 연결 상태 모니터링
        socket.onopen = () => {
          console.log('✅ SockJS 소켓 연결 성공');
        };
        
        socket.onerror = (error) => {
          console.error('❌ SockJS 소켓 오류:', error);
        };
        
        socket.onclose = (event) => {
          console.log('🔌 SockJS 소켓 닫힘:', event);
        };
        
        // STOMP 클라이언트 생성
        client.current = new Client({
          webSocketFactory: () => socket as any,
          debug: (str) => {
            // 연결/재연결 관련 로그만 표시
            if (str.includes('Connect') || str.includes('Disconnect') || str.includes('Error')) {
              console.log('🔍 STOMP Debug:', str);
            }
          },
          onConnect: (frame) => {
            console.log('🔌 STOMP 연결 성공:', frame.headers);
            setIsConnected(true);
            onConnect?.();
          },
          onDisconnect: (frame) => {
            console.log('🔌 STOMP 연결 종료:', frame?.headers);
            setIsConnected(false);
            onDisconnect?.();
          },
          onStompError: (frame) => {
            console.error('❌ STOMP 프로토콜 오류:', frame.headers, frame.body);
            setIsConnected(false);
            onError?.(frame);
          },
          onWebSocketError: (error) => {
            console.error('❌ WebSocket 연결 오류:', error);
            setIsConnected(false);
            onError?.(error);
          },
          onWebSocketClose: (event) => {
            console.log('🔌 WebSocket 연결 닫힘:', event?.code, event?.reason);
            setIsConnected(false);
          },
          reconnectDelay: 3000,
          heartbeatIncoming: 10000,
          heartbeatOutgoing: 10000,
          maxReconnectAttempts: 10,
        });

        // 연결 시작
        client.current.activate();

      } catch (error) {
        console.error('❌ STOMP 초기화 실패:', error);
        setIsConnected(false);
        onError?.(error);
      }
    };

    // 초기 연결
    connectSTOMP();

    return () => {
      if (client.current) {
        // 모든 구독 해제
        Object.values(subscriptions.current).forEach((subscription: any) => {
          subscription.unsubscribe();
        });
        subscriptions.current = {};
        
        // 연결 종료
        client.current.deactivate();
      }
    };
  }, [url]);

  // 구독 함수
  const subscribe = (destination: string, callback: (message: any) => void) => {
    if (client.current && client.current.connected) {
      const subscription = client.current.subscribe(destination, (message) => {
        try {
          const parsedMessage = JSON.parse(message.body);
          // 실시간 메시지 로그
          if (parsedMessage.type === 'NEW_BID') {
            console.log('💸 새 입찰:', parsedMessage.data?.bidAmount + '원');
          } else if (parsedMessage.type === 'BID_OUTBID') {
            console.log('🔥 입찰 경합!');
          } else if (parsedMessage.type !== 'AUCTION_STATUS_UPDATE') {
            console.log(`📨 STOMP [${parsedMessage.type}]:`, parsedMessage.data);
          }
          setLastMessage(parsedMessage);
          callback(parsedMessage);
          onMessage?.(parsedMessage);
        } catch (error) {
          console.error('STOMP 메시지 파싱 오류:', error);
        }
      });
      
      subscriptions.current[destination] = subscription;
      console.log(`✅ 구독 완료: ${destination}`);
      return subscription;
    } else {
      console.warn('STOMP 클라이언트가 연결되지 않음');
      return null;
    }
  };

  // 구독 해제 함수
  const unsubscribe = (destination: string) => {
    if (subscriptions.current[destination]) {
      subscriptions.current[destination].unsubscribe();
      delete subscriptions.current[destination];
      console.log(`❌ 구독 해제: ${destination}`);
    }
  };

  // 메시지 전송 함수
  const sendMessage = (destination: string, message: any) => {
    if (client.current && client.current.connected) {
      client.current.publish({
        destination,
        body: JSON.stringify(message),
      });
      console.log(`📤 STOMP 메시지 전송 [${destination}]:`, message);
    } else {
      console.warn('STOMP 메시지 전송 실패: 연결되지 않음', {
        connected: client.current?.connected,
        message,
        timestamp: new Date().toISOString()
      });
    }
  };

  return {
    isConnected,
    lastMessage,
    subscribe,
    unsubscribe,
    sendMessage,
  };
};