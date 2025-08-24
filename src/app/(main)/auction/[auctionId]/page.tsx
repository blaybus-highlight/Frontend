import React from 'react';

import AuctionDetailPageContent from './AuctionDetailPageContent';

interface PageProps {
  params: Promise<{ auctionId: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { auctionId } = await params;

  return <AuctionDetailPageContent productId={auctionId} />;
}
