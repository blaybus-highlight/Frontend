"use client"

import { Menu } from "lucide-react"
import { useMemo, useState } from "react"

const ProductsContent = () => {
  const [productFilter, setProductFilter] = useState<string>("전체")
  const [productSearchTerm, setProductSearchTerm] = useState<string>("")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [productCurrentPage, setProductCurrentPage] = useState<number>(1)
  const [showProductFilter, setShowProductFilter] = useState<boolean>(false)

  const productData = useMemo(
    () => [
      {
        id: "PROD001",
        category: "일반",
        productCategory: "의류",
        productName: "남성 L (105)",
        size: "남성 L (105)",
        quantity: 1,
        condition: "최상",
        material: "양가죽",
        productionYear: "1987",
        brand: "Custom Made",
        description:
          "최고급 양가죽으로 제작되었으며, 곳곳에 밴드의 상징인 스터드 장식이 있습니다. 안쪽에 착용자의 이니셜이 새겨져 있습니다",
      },
      {
        id: "PROD002",
        category: "일반",
        productCategory: "액세서리",
        productName: "400X30(cm)",
        size: "400X30(cm)",
        quantity: 1,
        condition: "최상",
        material: "패브릭",
        productionYear: "2000",
        brand: "Custom Made",
        description:
          "최고급 양가죽으로 제작되었으며, 곳곳에 밴드의 상징인 스터드 장식이 있습니다. 안쪽에 착용자의 이니셜이 새겨져 있습니다",
      },
      {
        id: "PROD003",
        category: "일반",
        productCategory: "의류",
        productName: "남성 L (105)",
        size: "남성 L (105)",
        quantity: 1,
        condition: "상",
        material: "양가죽",
        productionYear: "1987",
        brand: "Custom Made",
        description:
          "최고급 양가죽으로 제작되었으며, 곳곳에 밴드의 상징인 스터드 장식이 있습니다. 안쪽에 착용자의 이니셜이 새겨져 있습니다",
      },
      ...Array.from({ length: 7 }, (_, i) => ({
        id: `PROD00${i + 4}`,
        category: "일반",
        productCategory: i % 2 === 0 ? "의류" : "액세서리",
        productName: "남성 L (105)",
        size: "남성 L (105)",
        quantity: 1,
        condition: i % 2 === 0 ? "최상" : "상",
        material: i % 2 === 0 ? "양가죽" : "패브릭",
        productionYear: "1987",
        brand: "Custom Made",
        description:
          "최고급 양가죽으로 제작되었으며, 곳곳에 밴드의 상징인 스터드 장식이 있습니다. 안쪽에 착용자의 이니셜이 새겨져 있습니다",
      })),
    ],
    [],
  )

  const filteredProducts = useMemo(() => {
    return productData.filter((product) => {
      const matchesFilter =
        productFilter === "전체" ||
        (productFilter === "최상" && product.condition === "최상") ||
        (productFilter === "상" && product.condition === "상") ||
        (productFilter === "의류" && product.productCategory === "의류") ||
        (productFilter === "액세서리" && product.productCategory === "액세서리")

      const term = productSearchTerm.trim().toLowerCase()
      const matchesSearch =
        term === "" ||
        product.productName.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.material.toLowerCase().includes(term)

      return matchesFilter && matchesSearch
    })
  }, [productData, productFilter, productSearchTerm])

  const productsPerPage = 10
  const totalProductPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startProductIndex = (productCurrentPage - 1) * productsPerPage
  const currentProducts = filteredProducts.slice(
    startProductIndex,
    startProductIndex + productsPerPage,
  )

  const handleProductCheckbox = (productId: string) => {
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
  }

  const handleProductSearch = (searchTerm: string) => {
    setProductSearchTerm(searchTerm)
    setProductCurrentPage(1)
  }

  const handleProductPageClick = (page: number) => {
    setProductCurrentPage(page)
  }

  const handleProductConditionClick = (condition: string, productId: string) => {
    alert(`상품 ${productId}의 상태: ${condition}`)
  }

  return (
    <>
      <div className="flex flex-col items-start self-stretch gap-3">
        <span className="text-[#111416] text-[28px] font-bold ml-4 mr-[241px]">상품</span>
      </div>

      {/* Product Controls */}
      <div className="flex items-center self-stretch p-4 mb-[5px] gap-4">
        <div className="flex shrink-0 items-center">
          <div className="relative">
            <button
              className="flex shrink-0 items-center bg-white text-left py-2.5 px-4 mr-4 gap-2 rounded-lg border border-solid border-[#D5D6DA]"
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

          <div
            className="flex shrink-0 items-center bg-white py-2.5 px-3.5 gap-2 rounded-lg border border-solid border-[#D5D6DA]"
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
        </div>
      </div>

                    {/* Product Table (Responsive Grid) */}
       <div className="flex flex-col items-start self-stretch px-4">
         <div className="flex flex-col items-start self-stretch overflow-x-auto">
           {/* Desktop Table */}
           <div className="hidden lg:block">
             {/* Header */}
             <div className="grid grid-cols-10 bg-gray-50 border-b-2 border-gray-300 px-4 py-3 gap-2">
               <div className="flex items-center gap-3">
                 <div
                   className={`w-5 h-5 rounded-md border border-[#D5D6DA] cursor-pointer flex items-center justify-center ${
                     selectedProducts.length === currentProducts.length && currentProducts.length > 0
                       ? "bg-blue-500"
                       : "bg-white"
                   }`}
                   onClick={() => {
                     const currentIds = currentProducts.map((p) => p.id)
                     const allSelectedOnPage = currentIds.every((id) => selectedProducts.includes(id))
                     if (allSelectedOnPage) {
                       setSelectedProducts((prev) => prev.filter((id) => !currentIds.includes(id)))
                     } else {
                       setSelectedProducts((prev) => Array.from(new Set([...prev, ...currentIds])))
                     }
                   }}
                 >
                   {selectedProducts.length === currentProducts.length && currentProducts.length > 0 && (
                     <span className="text-white text-xs">✓</span>
                   )}
                 </div>
                 <span className="text-[#535862] text-sm font-bold">선택</span>
               </div>
               <span className="text-[#535862] text-sm font-bold text-center truncate">상품명</span>
               <span className="text-[#535862] text-sm font-bold text-center truncate">사이즈</span>
               <span className="text-[#535862] text-sm font-bold text-center">상태</span>
               <span className="text-[#535862] text-sm font-bold text-center">구성</span>
               <span className="text-[#535862] text-sm font-bold text-center truncate">재질</span>
               <span className="text-[#535862] text-sm font-bold text-center">카테고리</span>
               <span className="text-[#535862] text-sm font-bold text-center">브랜드명</span>
               <span className="text-[#535862] text-sm font-bold text-center">생산연도</span>
               <span className="text-[#535862] text-sm font-bold text-center truncate">상품소개</span>
             </div>

             {/* Desktop Rows */}
             {currentProducts.map((product, index) => (
               <div
                 key={product.id}
                 className="grid grid-cols-10 border-b-2 border-gray-200 px-4 py-4 gap-2 bg-white"
               >
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
                   <span className="text-[#181D27] text-sm">선택</span>
                 </div>

                 <span className="text-[#181D27] text-sm text-center truncate">{product.productName}</span>
                 <span className="text-[#181D27] text-sm text-center truncate">{product.size}</span>
                 <div className="flex items-center justify-center">
                   <button
                     className={`px-4 py-1 rounded-2xl text-sm font-medium cursor-pointer transition-colors ${
                       product.condition === "최상"
                         ? "bg-[#B5F5EB] text-black hover:bg-[#A0F0E6]"
                         : "bg-[#E8FCF9] text-black hover:bg-[#D0F9F4]"
                     }`}
                     onClick={() => handleProductConditionClick(product.condition, product.id)}
                   >
                     {product.condition}
                   </button>
                 </div>
                 <span className="text-[#181D27] text-sm text-center">본품</span>
                 <span className="text-[#181D27] text-sm text-center truncate">{product.material}</span>
                 <span className="text-[#181D27] text-sm text-center">{product.productCategory}</span>
                 <span className="text-[#181D27] text-sm text-center truncate">{product.brand}</span>
                 <span className="text-[#181D27] text-sm text-center">{product.productionYear}</span>
                 <span className="text-[#181D27] text-sm truncate" title={product.description}>
                   {product.description}
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
                     <span className="text-[#535862] text-sm font-bold">선택</span>
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-2 text-sm">
                   <div>
                     <span className="text-[#535862] font-bold">상품명:</span>
                     <span className="text-[#181D27] ml-2 truncate">{product.productName}</span>
                   </div>
                   <div>
                     <span className="text-[#535862] font-bold">사이즈:</span>
                     <span className="text-[#181D27] ml-2 truncate">{product.size}</span>
                   </div>
                   <div>
                     <span className="text-[#535862] font-bold">상태:</span>
                     <button
                       className={`ml-2 px-2 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                         product.condition === "최상"
                           ? "bg-[#B5F5EB] text-black hover:bg-[#A0F0E6]"
                           : "bg-[#E8FCF9] text-black hover:bg-[#D0F9F4]"
                       }`}
                       onClick={() => handleProductConditionClick(product.condition, product.id)}
                     >
                       {product.condition}
                     </button>
                   </div>
                   <div>
                     <span className="text-[#535862] font-bold">구성:</span>
                     <span className="text-[#181D27] ml-2">본품</span>
                   </div>
                   <div>
                     <span className="text-[#535862] font-bold">재질:</span>
                     <span className="text-[#181D27] ml-2 truncate">{product.material}</span>
                   </div>
                   <div>
                     <span className="text-[#535862] font-bold">카테고리:</span>
                     <span className="text-[#181D27] ml-2">{product.productCategory}</span>
                   </div>
                   <div>
                     <span className="text-[#535862] font-bold">브랜드명:</span>
                     <span className="text-[#181D27] ml-2 truncate">{product.brand}</span>
                   </div>
                   <div>
                     <span className="text-[#535862] font-bold">생산연도:</span>
                     <span className="text-[#181D27] ml-2">{product.productionYear}</span>
                   </div>
                 </div>
                 
                 <div>
                   <span className="text-[#535862] font-bold">상품소개:</span>
                   <p className="text-[#181D27] mt-1 text-sm line-clamp-2" title={product.description}>
                     {product.description}
                   </p>
                 </div>
               </div>
             ))}
           </div>

          {/* Pagination */}
          <div className="flex flex-col items-center self-stretch pt-5">
            <div className="flex items-start">
              {Array.from({ length: totalProductPages }, (_, i) => i + 1).map((page) => (
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
    </>
  )
}

export default ProductsContent;
