import React from 'react';

import ProductDetailPageContent from './ProductDetailPageContent';

interface PageProps {
  params: Promise<{ productId: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { productId } = await params;

  return <ProductDetailPageContent productId={productId} />;
}
