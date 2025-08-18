import { useEffect, useRef, useState } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
}

interface UseWebSocketProps {
  url: string;
  onMessage?: (message: WebSocketMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
}

export const useWebSocket = ({ url, onMessage, onOpen, onClose, onError }: UseWebSocketProps) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        ws.current = new WebSocket(url);

        ws.current.onopen = () => {
          console.log('🔌 WebSocket 연결 성공:', {
            url,
            readyState: ws.current?.readyState,
            timestamp: new Date().toISOString()
          });
          setIsConnected(true);
          onOpen?.();
        };

        ws.current.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            console.log('📨 WebSocket 메시지:', message);
            setLastMessage(message);
            onMessage?.(message);
          } catch (error) {
            console.error('WebSocket 메시지 파싱 오류:', error);
          }
        };

        ws.current.onclose = (event) => {
          console.log('🔌 WebSocket 연결 종료:', {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean,
            timestamp: new Date().toISOString(),
            url
          });
          setIsConnected(false);
          
          // CONNECTION_LOST 메시지 전송
          if (onMessage) {
            onMessage({
              type: 'CONNECTION_LOST',
              data: { message: '연결이 끊어졌어요' }
            });
          }
          
          onClose?.();
          
          // 자동 재연결 (5초 후)
          setTimeout(() => {
            if (ws.current?.readyState === WebSocket.CLOSED) {
              console.log('🔄 WebSocket 재연결 시도...');
              connectWebSocket();
            }
          }, 5000);
        };

        ws.current.onerror = (error) => {
          console.error('❌ WebSocket 오류:', {
            error,
            url,
            readyState: ws.current?.readyState,
            timestamp: new Date().toISOString()
          });
          onError?.(error);
        };
      } catch (error) {
        console.error('WebSocket 연결 실패:', {
          error,
          url,
          timestamp: new Date().toISOString()
        });
      }
    };

    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url, onMessage, onOpen, onClose, onError]);

  const sendMessage = (message: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
      console.log('📤 WebSocket 메시지 전송:', message);
    } else {
      console.warn('WebSocket 메시지 전송 실패:', {
        readyState: ws.current?.readyState,
        readyStateText: ws.current ? ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][ws.current.readyState] : 'NULL',
        message,
        timestamp: new Date().toISOString()
      });
    }
  };

  return {
    isConnected,
    lastMessage,
    sendMessage,
  };
};