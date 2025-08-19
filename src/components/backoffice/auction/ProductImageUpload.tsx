import React, { useState, useRef, useCallback } from 'react';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
  type: string;
  primary?: boolean;
}

interface ProductImageUploadProps {
  onImagesChange?: (images: ImageFile[]) => void;
  maxImages?: number;
}

export const ProductImageUpload = ({ 
  onImagesChange, 
  maxImages = 10 
}: ProductImageUploadProps) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 파일 처리
  const processImageFile = (file: File): Promise<ImageFile> => {
    return new Promise((resolve, reject) => {
      // 지원하는 이미지 형식 검증
      const supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!supportedTypes.includes(file.type)) {
        reject(new Error('지원하지 않는 이미지 형식입니다. JPEG, PNG, GIF, WebP만 업로드 가능합니다.'));
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB 제한
        reject(new Error('파일 크기는 10MB 이하여야 합니다.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageFile: ImageFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          file,
          preview: e.target?.result as string,
          name: file.name,
          size: file.size,
          type: file.type
        };
        resolve(imageFile);
      };
      reader.onerror = () => reject(new Error('파일 읽기 실패'));
      reader.readAsDataURL(file);
    });
  };

  // 이미지 추가
  const addImages = useCallback(async (files: FileList) => {
    if (images.length + files.length > maxImages) {
      alert(`최대 ${maxImages}개의 이미지만 업로드 가능합니다.`);
      return;
    }

    const newImages: ImageFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const imageFile = await processImageFile(files[i]);
        newImages.push(imageFile);
      } catch (error) {
        alert(error instanceof Error ? error.message : '이미지 처리 중 오류가 발생했습니다.');
      }
    }

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImagesChange?.(updatedImages);
  }, [images, maxImages, onImagesChange]);

  // 파일 선택 핸들러
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      addImages(files);
    }
    // 같은 파일을 다시 선택할 수 있도록 초기화
    event.target.value = '';
  };

  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files) {
      addImages(files);
    }
  };

  // 이미지 삭제
  const removeImage = (id: string) => {
    const updatedImages = images.filter(img => img.id !== id);
    setImages(updatedImages);
    onImagesChange?.(updatedImages);
  };

  // 대표 이미지 설정
  const setPrimaryImage = (id: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      primary: img.id === id
    }));
    setImages(updatedImages);
    onImagesChange?.(updatedImages);
  };

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col items-start self-stretch gap-3 mt-4">
      <span className="text-[#111416] text-[20px] font-bold ml-4">상품 이미지</span>
      <div className="ml-4 w-full pr-4">
        {/* 이미지 업로드 영역 */}
        <div
          className={`flex flex-col justify-center items-center w-full h-48 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="text-[#111416] text-[20px] font-bold">이미지 업로드</span>
                     <span className="text-base text-black mt-2 text-center">
             이미지를 드래그 앤 드롭하거나 클릭하여 업로드하세요.<br />
             최대 {maxImages}개의 이미지를 허용합니다. (10MB 이하)<br />
             지원 형식: JPEG, PNG, GIF, WebP
           </span>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* 업로드된 이미지 목록 */}
        {images.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">업로드된 이미지 ({images.length}/{maxImages})</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={image.id} className="relative group">
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image.preview}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                    {/* 대표 이미지 표시 */}
                    {image.primary && (
                      <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        대표
                      </div>
                    )}
                    {/* 순서 표시 */}
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </div>
                    {/* 삭제 버튼 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(image.id);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                                     <div className="mt-2 text-xs text-gray-600">
                     <p className="truncate">{image.name}</p>
                     <p>{formatFileSize(image.size)}</p>
                     <p className="text-blue-600">📁 선택됨</p>
                   </div>
                  {/* 대표 이미지 설정 버튼 */}
                  {!image.primary && (
                    <button
                      onClick={() => setPrimaryImage(image.id)}
                      className="mt-1 w-full text-xs bg-gray-200 hover:bg-gray-300 py-1 rounded transition-colors"
                    >
                      대표로 설정
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
