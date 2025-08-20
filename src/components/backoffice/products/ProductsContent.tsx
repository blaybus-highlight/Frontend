"use client"

import { Menu } from "lucide-react"
import { useMemo, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getProductList } from "@/api/auction"
import { ProductListItem } from "@/types/auction"
import AuctionSubmitModal from "./AuctionSubmitModal"

const ProductsContent = () => {
  const router = useRouter()
  const [productFilter, setProductFilter] = useState<string>("전체")
  const [productSearchTerm, setProductSearchTerm] = useState<string>("")
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [productCurrentPage, setProductCurrentPage] = useState<number>(1)
  const [showProductFilter, setShowProductFilter] = useState<boolean>(false)
  const [showAuctionModal, setShowAuctionModal] = useState<boolean>(false)
  const [selectedProductForAuction, setSelectedProductForAuction] = useState<ProductListItem | null>(null)
  
  // API 데이터 상태
  const [productData, setProductData] = useState<ProductListItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [totalElements, setTotalElements] = useState<number>(0)

  // API에서 상품 목록 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await getProductList(
          productCurrentPage, 
          10, 
          "경매대기" // statusDescription 필터
        )
        
        console.log('API 응답 전체:', response)
        
        // API 응답 구조에 맞게 데이터 추출
        if (response.success && response.data) {
          console.log('설정할 상품 데이터:', response.data.content)
          console.log('총 페이지 수:', response.data.totalPages)
          console.log('총 요소 수:', response.data.totalElements)
          
          setProductData(response.data.content || [])
          setTotalPages(response.data.totalPages || 0)
          setTotalElements(response.data.totalElements || 0)
        } else {
          setError('상품 목록 데이터를 불러올 수 없습니다.')
        }
      } catch (err) {
        console.error('상품 목록 조회 실패:', err)
        setError('상품 목록을 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [productCurrentPage])

  const filteredProducts = useMemo(() => {
    if (!productData) return []
    
    console.log('필터링할 상품 데이터:', productData)
    console.log('현재 필터:', productFilter)
    console.log('검색어:', productSearchTerm)
    
    return productData.filter((product) => {
      console.log('상품 상태:', product.statusDescription, '카테고리:', product.category)
      
      const matchesFilter =
        productFilter === "전체" ||
        (productFilter === "최상" && product.statusDescription === "최상") ||
        (productFilter === "상" && product.statusDescription === "상") ||
        (productFilter === "의류" && product.category === "FASHION") ||
        (productFilter === "액세서리" && product.category === "PROPS")

      const term = productSearchTerm.trim().toLowerCase()
      const matchesSearch =
        term === "" ||
        product.productName.toLowerCase().includes(term) ||
        product.shortDescription.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)

      const result = matchesFilter && matchesSearch
      console.log(`상품 ${product.productName}: 필터=${matchesFilter}, 검색=${matchesSearch}, 결과=${result}`)
      
      return result
    })
  }, [productData, productFilter, productSearchTerm])

  const productsPerPage = 10
  const currentProducts = filteredProducts

  const handleProductCheckbox = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    )
  }

  const handleProductFilter = (filter: string) => {
    setProductFilter(filter)
    setProductCurrentPage(1)
    setShowProductFilter(false)
    // 필터 변경 시 선택된 상품들은 유지 (초기화하지 않음)
  }

  const handleProductSearch = (searchTerm: string) => {
    setProductSearchTerm(searchTerm)
    setProductCurrentPage(1)
    // 검색 변경 시 선택된 상품들은 유지 (초기화하지 않음)
  }

  const handleProductPageClick = (page: number) => {
    setProductCurrentPage(page)
    // 페이지 변경 시 선택된 상품들은 유지 (초기화하지 않음)
  }

  const handleProductConditionClick = (condition: string, productId: string) => {
    alert(`상품 ${productId}의 상태: ${condition}`)
  }

  return (
    <>
      <div className="flex flex-col items-start self-stretch gap-3">
        <span className="text-[#111416] text-[28px] font-bold ml-4 mr-[241px]">상품</span>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="text-lg">상품 목록을 불러오는 중...</div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center p-8">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      )}

             {/* Product Controls */}
       {!loading && !error && (
         <div className="flex items-center justify-between self-stretch p-4 mb-[5px] gap-6">
           {/* Left side - Filter only */}
           <div className="flex shrink-0 items-center">
             <div className="relative">
               <button
                 className="flex shrink-0 items-center bg-white text-left py-2.5 px-6 gap-2 rounded-lg border border-solid border-[#D5D6DA]"
                 style={{ boxShadow: "0px 1px 2px #0A0C120D" }}
                 onClick={() => setShowProductFilter(!showProductFilter)}
               >
                 <Menu className="w-5 h-5" />
                 <span className="text-[#414651] text-sm font-bold">필터</span>
               </button>

               {/* Filter Dropdown */}
               {showProductFilter && (
                 <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                   {["전체", "최상", "상", "의류", "액세서리"].map((filter) => (
                     <button
                       key={filter}
                       className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                       onClick={() => handleProductFilter(filter)}
                     >
                       {filter}
                     </button>
                   ))}
                 </div>
               )}
             </div>
           </div>

           {/* Right side - Search and Action Buttons */}
           <div className="flex items-center gap-4">
             {/* Search */}
             <div
               className="flex shrink-0 items-center bg-white py-2.5 px-4 gap-2 rounded-lg border border-solid border-[#D5D6DA]"
               style={{ boxShadow: "0px 1px 2px #0A0C120D" }}
             >
               <div className="w-5 h-5 flex items-center justify-center">
                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                   <path
                     d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9"
                     stroke="#717680"
                     strokeWidth="1.33"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                   />
                 </svg>
               </div>
               <input
                 placeholder="Search"
                 value={productSearchTerm}
                 onChange={(e) => handleProductSearch(e.target.value)}
                 className="text-[#717680] bg-transparent text-base w-[200px] border-0 outline-none"
               />
             </div>

             {/* Action Buttons */}
             <div className="flex items-center gap-4">
               {/* Selected Products Count */}
               {selectedProducts.length > 0 && (
                 <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                   선택된 상품: {selectedProducts.length}개
                 </div>
               )}
                <button
                  className="flex items-center bg-black text-white py-2.5 px-6 gap-2 rounded-none hover:bg-gray-800 transition-colors"
                  onClick={() => router.push('/backoffice/products/submit')}
                >
                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                   <path
                     d="M8 2v12M2 8h12"
                     stroke="white"
                     strokeWidth="1.5"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                   />
                 </svg>
                 <span className="text-white text-sm font-bold">상품 등록</span>
               </button>

                                                                                               <button
                    className="flex items-center bg-gray-500 text-white py-2.5 px-6 gap-2 rounded-none hover:bg-gray-600 transition-colors"
                    onClick={() => {
                      if (selectedProducts.length === 0) {
                        alert('경매 등록할 상품을 선택해주세요.');
                        return;
                      }
                      if (selectedProducts.length > 1) {
                        alert('경매 등록은 한 번에 하나의 상품만 가능합니다.');
                        return;
                      }
                      
                      const selectedProduct = currentProducts.find(p => p.id === selectedProducts[0]);
                      if (selectedProduct) {
                        setSelectedProductForAuction(selectedProduct);
                        setShowAuctionModal(true);
                      }
                    }}
                  >
                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                   <path
                     d="M12 4l-4 4-4-4"
                     stroke="white"
                     strokeWidth="1.5"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                   />
                   <path
                     d="M8 8v4"
                     stroke="white"
                     strokeWidth="1.5"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                   />
                 </svg>
                 <span className="text-white text-sm font-bold">경매 등록</span>
               </button>

               <button
                 className="flex items-center bg-white text-black py-2.5 px-6 gap-2 rounded-none border border-solid border-[#D5D6DA] hover:bg-gray-50 transition-colors"
                 style={{ boxShadow: "0px 1px 2px #0A0C120D" }}
                 onClick={() => {
                   if (selectedProducts.length === 0) {
                     alert('수정할 상품을 선택해주세요.');
                     return;
                   }
                   if (selectedProducts.length > 1) {
                     alert('수정은 한 번에 하나의 상품만 가능합니다.');
                     return;
                   }
                   
                   const selectedProductId = selectedProducts[0];
                   router.push(`/backoffice/products/update?id=${selectedProductId}`);
                 }}
               >
                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                   <path
                     d="M11.25 1.25l3.5 3.5-3.5 3.5"
                     stroke="#414651"
                     strokeWidth="1.5"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                   />
                   <path
                     d="M14.75 4.75h-7.5a2.5 2.5 0 0 0-2.5 2.5v5a2.5 2.5 0 0 0 2.5 2.5h5a2.5 2.5 0 0 0 2.5-2.5v-5"
                     stroke="#414651"
                     strokeWidth="1.5"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                   />
                 </svg>
                 <span className="text-[#414651] text-sm font-bold">수정하기</span>
               </button>
             </div>
           </div>
         </div>
       )}

      {/* Product Table (Responsive Grid) */}
      {!loading && !error && (
        <div className="flex flex-col items-start self-stretch px-4">
          <div className="flex flex-col items-start self-stretch overflow-x-auto">
            {/* Desktop Table */}
            <div className="hidden lg:block">
                             {/* Header */}
               <div className="grid grid-cols-10 bg-gray-50 border-b-2 border-gray-300 px-4 py-3 gap-2">
                                    <div className="flex items-center justify-center">
                     <div
                       className={`w-5 h-5 rounded-md border border-[#D5D6DA] cursor-pointer flex items-center justify-center ${
                         currentProducts.length > 0 && currentProducts.every((p) => selectedProducts.includes(p.id))
                           ? "bg-blue-500"
                           : "bg-white"
                       }`}
                       onClick={() => {
                         const currentIds = currentProducts.map((p) => p.id)
                         const allSelectedOnPage = currentIds.every((id) => selectedProducts.includes(id))
                         if (allSelectedOnPage) {
                           // 현재 페이지의 상품들만 선택 해제
                           setSelectedProducts((prev) => prev.filter((id) => !currentIds.includes(id)))
                         } else {
                           // 현재 페이지의 상품들을 추가 (중복 제거)
                           setSelectedProducts((prev) => Array.from(new Set([...prev, ...currentIds])))
                         }
                       }}
                     >
                       {currentProducts.length > 0 && currentProducts.every((p) => selectedProducts.includes(p.id)) && (
                         <span className="text-white text-xs">✓</span>
                       )}
                     </div>
                   </div>
                 <span className="text-[#535862] text-sm font-bold text-center">카테고리</span>
                 <span className="text-[#535862] text-sm font-bold text-center truncate">상품명</span>
                 <span className="text-[#535862] text-sm font-bold text-center">사이즈</span>
                 <span className="text-[#535862] text-sm font-bold text-center">개수</span>
                 <span className="text-[#535862] text-sm font-bold text-center">상태</span>
                 <span className="text-[#535862] text-sm font-bold text-center">재질</span>
                 <span className="text-[#535862] text-sm font-bold text-center">생산년도</span>
                 <span className="text-[#535862] text-sm font-bold text-center">브랜드명</span>
                 <span className="text-[#535862] text-sm font-bold text-center truncate">상품소개</span>
               </div>

                             {/* Desktop Rows */}
               {currentProducts.map((product, index) => (
                 <div
                   key={product.id}
                   className="grid grid-cols-10 border-b-2 border-gray-200 px-4 py-4 gap-2 bg-white"
                 >
                   <div className="flex items-center justify-center">
                     <div
                       className={`w-5 h-5 rounded-md border border-[#D5D6DA] cursor-pointer flex items-center justify-center ${
                         selectedProducts.includes(product.id) ? "bg-blue-500" : "bg-white"
                       }`}
                       onClick={() => handleProductCheckbox(product.id)}
                     >
                       {selectedProducts.includes(product.id) && (
                         <span className="text-white text-xs">✓</span>
                       )}
                     </div>
                   </div>

                                       <span className="text-[#181D27] text-sm text-center">{product.category}</span>
                    <span className="text-[#181D27] text-sm text-center truncate">{product.productName}</span>
                    <span className="text-[#181D27] text-sm text-center">{product.size || "-"}</span>
                    <span className="text-[#181D27] text-sm text-center">{product.productCount}</span>
                    <div className="flex items-center justify-center">
                      <button
                        className={`px-4 py-1 rounded-2xl text-sm font-medium cursor-pointer transition-colors ${
                          product.statusDescription === "경매대기"
                            ? "bg-[#B5F5EB] text-black hover:bg-[#A0F0E6]"
                            : "bg-[#E8FCF9] text-black hover:bg-[#D0F9F4]"
                        }`}
                        onClick={() => handleProductConditionClick(product.statusDescription, product.id.toString())}
                      >
                        {product.statusDescription}
                      </button>
                    </div>
                    <span className="text-[#181D27] text-sm text-center">{product.material || "-"}</span>
                    <span className="text-[#181D27] text-sm text-center">{product.manufactureYear || "-"}</span>
                    <span className="text-[#181D27] text-sm text-center">{product.brand || "-"}</span>
                    <span className="text-[#181D27] text-sm truncate" title={product.shortDescription}>
                      {product.shortDescription}
                    </span>
                 </div>
               ))}
            </div>

                         {/* Mobile/Tablet Cards */}
             <div className="lg:hidden space-y-4">
               {currentProducts.map((product, index) => (
                 <div key={product.id} className="bg-white border-2 border-gray-200 rounded-lg p-4 space-y-3">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div
                         className={`w-5 h-5 rounded-md border border-[#D5D6DA] cursor-pointer flex items-center justify-center ${
                           selectedProducts.includes(product.id) ? "bg-blue-500" : "bg-white"
                         }`}
                         onClick={() => handleProductCheckbox(product.id)}
                       >
                         {selectedProducts.includes(product.id) && (
                           <span className="text-white text-xs">✓</span>
                         )}
                       </div>
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-2 text-sm">
                     <div>
                       <span className="text-[#535862] font-bold">카테고리:</span>
                       <span className="text-[#181D27] ml-2">{product.category}</span>
                     </div>
                     <div>
                       <span className="text-[#535862] font-bold">상품명:</span>
                       <span className="text-[#181D27] ml-2 truncate">{product.productName}</span>
                     </div>
                                           <div>
                        <span className="text-[#535862] font-bold">사이즈:</span>
                        <span className="text-[#181D27] ml-2">{product.size || "-"}</span>
                      </div>
                      <div>
                        <span className="text-[#535862] font-bold">개수:</span>
                        <span className="text-[#181D27] ml-2">{product.productCount}</span>
                      </div>
                      <div>
                        <span className="text-[#535862] font-bold">상태:</span>
                        <button
                          className={`ml-2 px-2 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                            product.statusDescription === "경매대기"
                              ? "bg-[#B5F5EB] text-black hover:bg-[#A0F0E6]"
                              : "bg-[#E8FCF9] text-black hover:bg-[#D0F9F4]"
                          }`}
                          onClick={() => handleProductConditionClick(product.statusDescription, product.id.toString())}
                        >
                          {product.statusDescription}
                        </button>
                      </div>
                      <div>
                        <span className="text-[#535862] font-bold">재질:</span>
                        <span className="text-[#181D27] ml-2">{product.material || "-"}</span>
                      </div>
                      <div>
                        <span className="text-[#535862] font-bold">생산년도:</span>
                        <span className="text-[#181D27] ml-2">{product.manufactureYear || "-"}</span>
                      </div>
                      <div>
                        <span className="text-[#535862] font-bold">브랜드명:</span>
                        <span className="text-[#181D27] ml-2">{product.brand || "-"}</span>
                      </div>
                   </div>
                   
                   <div>
                     <span className="text-[#535862] font-bold">상품소개:</span>
                     <p className="text-[#181D27] mt-1 text-sm line-clamp-2" title={product.shortDescription}>
                       {product.shortDescription}
                     </p>
                   </div>
                 </div>
               ))}
             </div>

            {/* Pagination */}
            <div className="flex flex-col items-center self-stretch pt-5">
              <div className="flex items-start">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <span
                    key={page}
                    className={`font-bold my-2.5 mx-2 cursor-pointer hover:text-blue-500 transition-colors ${
                      page === productCurrentPage ? "text-black text-base" : "text-[#717680] text-sm"
                    }`}
                    onClick={() => handleProductPageClick(page)}
                  >
                    {page}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
             )}

       {/* Auction Submit Modal */}
       <AuctionSubmitModal 
         isOpen={showAuctionModal} 
         onClose={() => {
           setShowAuctionModal(false);
           setSelectedProductForAuction(null);
         }}
         selectedProduct={selectedProductForAuction}
       />
     </>
   )
 }

export default ProductsContent;
