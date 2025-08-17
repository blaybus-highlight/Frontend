import axios from 'axios';

import type { ProductSearchParams, ProductsResponse } from '@/types/api';
import { API_BASE_URL } from '@/types/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const productsApi = {
  getProducts: async (
    params: ProductSearchParams = {},
  ): Promise<ProductsResponse> => {
    const requestParams = {
      ...params,
      page: params.page || 0,
      size: params.size || 20,
      sortCode: params.sortCode || 'newest',
    };

    console.log('🚀 API 호출:', { params, requestParams });

    const response = await api.get('/api/public/products/', {
      params: requestParams,
    });

    console.log('✅ API 응답 성공:', {
      status: response.status,
      dataCount: response.data?.data?.content?.length || 0,
      totalElements: response.data?.data?.totalElements,
    });

    return response.data;
  },
};
