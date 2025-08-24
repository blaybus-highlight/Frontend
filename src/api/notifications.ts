import axiosInstance from '@/lib/axiosInstance';
import { NotificationItem } from '@/types/notification';

// API 응답 타입 정의
interface ApiNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: number;
  actionUrl?: string;
  productName?: string;
  productImageUrl?: string;
  amount?: number;
}

interface NotificationsResponse {
  success: boolean;
  data: {
    content: ApiNotification[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
  message: string;
}

// API 응답을 프론트엔드 타입으로 변환
const mapApiNotificationToNotificationItem = (apiNotification: ApiNotification): NotificationItem => {
  return {
    id: apiNotification.id.toString(),
    type: apiNotification.type as any, // 타입 변환 필요시 매핑 로직 추가
    title: apiNotification.title,
    message: apiNotification.message,
    isRead: apiNotification.isRead,
    createdAt: apiNotification.createdAt,
    relatedId: apiNotification.relatedId,
    actionUrl: apiNotification.actionUrl,
    productName: apiNotification.productName,
    productImage: apiNotification.productImageUrl,
    amount: apiNotification.amount
  };
};

// 사용자 알림 목록 조회
export const getUserNotifications = async (
  page: number = 0,
  size: number = 20,
  unreadOnly: boolean = false
): Promise<NotificationItem[]> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(unreadOnly && { unreadOnly: 'true' })
    });

    const response = await axiosInstance.get<NotificationsResponse>(
      `/api/user/notifications?${params.toString()}`
    );

    if (response.data.success) {
      return response.data.data.content.map(mapApiNotificationToNotificationItem);
    } else {
      console.error('알림 조회 실패:', response.data.message);
      return [];
    }
  } catch (error) {
    console.error('알림 조회 API 호출 실패:', error);
    return [];
  }
};

// 알림 읽음 처리
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.put(`/api/user/notifications/${notificationId}/read`);
    return response.data.success;
  } catch (error) {
    console.error('알림 읽음 처리 실패:', error);
    return false;
  }
};

// 모든 알림 읽음 처리
export const markAllNotificationsAsRead = async (): Promise<boolean> => {
  try {
    const response = await axiosInstance.put('/api/notifications/read-all');
    return response.data.success;
  } catch (error) {
    console.error('전체 알림 읽음 처리 실패:', error);
    return false;
  }
};

// 알림 삭제
export const deleteNotification = async (notificationId: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.delete(`/api/notifications/${notificationId}`);
    return response.data.success;
  } catch (error) {
    console.error('알림 삭제 실패:', error);
    return false;
  }
};

// 모든 알림 삭제
export const deleteAllNotifications = async (): Promise<boolean> => {
  try {
    const response = await axiosInstance.delete('/api/notifications');
    return response.data.success;
  } catch (error) {
    console.error('전체 알림 삭제 실패:', error);
    return false;
  }
};