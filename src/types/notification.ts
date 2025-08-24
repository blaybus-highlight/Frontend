export interface NotificationItem {
  id: string;
  type: 'BID_OUTBID' | 'AUCTION_WON' | 'AUCTION_LOST' | 'AUCTION_START' | 'AUCTION_ENDING_SOON' | 'NEW_BID' | 'AUCTION_ENDED' | 'PRICE_DROP' | 'WISHLIST_ADDED' | 'WISHLIST_REMOVED';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: number; // auctionId, productId 등
  actionUrl?: string; // 클릭시 이동할 URL
  productName?: string;
  productImage?: string;
  amount?: number; // 입찰가, 낙찰가 등
}

export interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  isOpen: boolean;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  toggleDropdown: () => void;
  clearAll: () => void;
}

// 알림 타입별 설정
export const NotificationConfig = {
  BID_OUTBID: {
    icon: '🔥',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  AUCTION_WON: {
    icon: '🎉',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  AUCTION_LOST: {
    icon: '😔',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50'
  },
  AUCTION_START: {
    icon: '🚀',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  AUCTION_ENDING_SOON: {
    icon: '⏰',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  NEW_BID: {
    icon: '💰',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  AUCTION_ENDED: {
    icon: '🏁',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50'
  },
  PRICE_DROP: {
    icon: '📉',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  WISHLIST_ADDED: {
    icon: '❤️',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  WISHLIST_REMOVED: {
    icon: '💔',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50'
  }
} as const;