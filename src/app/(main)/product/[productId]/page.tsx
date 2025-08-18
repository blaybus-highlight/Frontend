import React from 'react';

import ProductDetailPageContent from './ProductDetailPageContent';

interface PageProps {
  params: { productId: string };
}

export default function ProductDetailPage({ params }: PageProps) {
  const { productId } = params;

  return <ProductDetailPageContent productId={productId} />;
}
