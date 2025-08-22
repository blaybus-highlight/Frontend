'use client';

import { useState, useMemo } from "react";
import { Trash2, Edit, Search } from "lucide-react";
import { Button } from '@/components/ui/button';

// 계정 등록 모달 컴포넌트
const AccountRegistrationModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [adminId, setAdminId] = useState('');
  const [role, setRole] = useState('대표');

  const handleSubmit = () => {
    // TODO: 실제 등록 로직 구현
    console.log('계정 등록:', { adminId, role });
    alert('계정이 등록되었습니다.');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[600px]">
        {/* 제목 */}
        <h2 className="text-xl font-bold text-black mb-6">계정 등록</h2>
        
                 {/* 입력 필드들 - 하나의 행에 가로로 배치 */}
         <div className="flex space-x-4">
           {/* ID 입력 */}
           <div className="flex-1">
             <label className="block text-sm font-medium text-black mb-2">ID</label>
             <input
               type="text"
               value={adminId}
               onChange={(e) => setAdminId(e.target.value)}
               placeholder="아이디를 입력해주세요"
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
             />
           </div>
           
           {/* 권한 선택 */}
           <div className="flex-1">
             <label className="block text-sm font-medium text-black mb-2">권한</label>
             <select
               value={role}
               onChange={(e) => setRole(e.target.value)}
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
             >
               <option value="대표">대표</option>
               <option value="관리자">관리자</option>
               <option value="일반">직원</option>
               <option value="일반">인턴</option>
             </select>
           </div>
         </div>
        
        {/* 버튼들 */}
        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
          >
            등록하기
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-white text-black border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

const PermissionManagementPage = () => {
  // 상태 관리
  const [permissionCurrentPage, setPermissionCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showPermissionEditModal, setShowPermissionEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 더미 데이터
  const permissionUsers = [
    { id: "qlwkdnfd11", permission: "대표" },
    { id: "wlwnfkdlw12", permission: "대표" },
    { id: "qlwkdnfd11", permission: "대표" },
    { id: "wlwnfkdlw12", permission: "대표" },
    { id: "qlwkdnfd11", permission: "대표" },
    { id: "wlwnfkdlw12", permission: "대표" },
    { id: "qlwkdnfd11", permission: "대표" },
    { id: "wlwnfkdlw12", permission: "대표" },
    { id: "qlwkdnfd11", permission: "대표" },
    { id: "wlwnfkdlw12", permission: "대표" },
  ];

  // 검색 필터링된 사용자 목록
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return permissionUsers;
    return permissionUsers.filter(user => 
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.permission.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, permissionUsers]);

  const permissionItemsPerPage = 10;
  const permissionTotalPages = Math.ceil(filteredUsers.length / permissionItemsPerPage);
  const permissionStartIndex = (permissionCurrentPage - 1) * permissionItemsPerPage;
  const currentPermissionUsers = filteredUsers.slice(permissionStartIndex, permissionStartIndex + permissionItemsPerPage);

  // 핸들러 함수들
  const handlePermissionChange = (userId: string, newPermission: string) => {
    alert(`${userId}의 권한이 ${newPermission}로 변경되었습니다`);
  };

  const handlePermissionEdit = (user: any) => {
    setEditingUser(user);
    setShowPermissionEditModal(true);
  };

  const handlePermissionDelete = (userId: string) => {
    setDeleteItemId(userId);
    setShowDeleteModal(true);
  };

  const handlePermissionPageClick = (page: number) => {
    setPermissionCurrentPage(page);
  };

  const handleAddRegistration = () => {
    setIsModalOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPermissionCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* 기존 사이드바 영역을 삭제했습니다.
      */}

      {/* 메인 콘텐츠 */}
      <div className="flex-1">
        {/* 헤더 */}
        <div className="bg-white border-b border-[#E5E7EB] px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-[28px] font-bold text-[#111416]">권한 관리</h1>
            {/*
              기존의 우측 상단 고객센터 영역을 삭제했습니다.
            */}
          </div>
        </div>

        {/* 테이블 영역 */}
        <div className="px-8 py-6">
          <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
            {/* 검색 및 추가등록 버튼 영역 */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-b border-[#F3F4F6]">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-[#9CA3AF]" />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="block w-80 pl-10 pr-3 py-2 border border-[#D1D5DB] rounded-md leading-5 bg-white placeholder-[#9CA3AF] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent text-sm"
                />
              </div>
              
              <button
                onClick={handleAddRegistration}
                className="bg-[#111827] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-[#1F2937] transition-colors"
              >
                추가등록
              </button>
            </div>

            {/* 테이블 */}
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  {/* ID 열 너비를 60%로 확장 */}
                  <th className="text-left px-6 py-4 text-[12px] font-bold text-[#6B7280] uppercase tracking-wider w-[60%]">
                    ID
                  </th>
                  {/* 권한 열 너비를 20%로 축소 */}
                  <th className="text-left px-6 py-4 text-[12px] font-bold text-[#6B7280] uppercase tracking-wider w-[20%]">
                    권한
                  </th>
                  {/* 작업 열 너비를 20%로 축소 */}
                  <th className="text-center px-6 py-4 text-[12px] font-bold text-[#6B7280] uppercase tracking-wider w-[20%]">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPermissionUsers.map((user, index) => (
                  <tr 
                    key={`${user.id}-${index}`} 
                    className={`border-b border-[#F3F4F6] ${index % 2 === 1 ? 'bg-[#F9FAFB]' : 'bg-white'}`}
                  >
                    {/* ID 컬럼: 헤더와 같은 정렬로 변경 */}
                    <td className="px-6 py-5 text-left">
                      <span className="text-[14px] text-[#111827] font-medium">{user.id}</span>
                    </td>

                    {/* 권한 드롭다운 컬럼: 헤더와 같은 정렬로 변경 */}
                    <td className="px-6 py-5 text-left">
                      <div className="relative inline-block">
                        <select
                          className="appearance-none bg-white border border-[#D1D5DB] rounded-md px-4 py-2 pr-10 text-[14px] text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent shadow-sm min-w-[100px]"
                          value={user.permission}
                          onChange={(e) => handlePermissionChange(user.id, e.target.value)}
                        >
                          <option value="대표">대표</option>
                          <option value="관리자">관리자</option>
                          <option value="직원">직원</option>
                          <option value="인턴">인턴</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </td>

                    {/* 작업 버튼 컬럼: 헤더와 같은 정렬로 변경 */}
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          className="w-10 h-10 flex items-center justify-center hover:bg-[#F3F4F6] rounded-lg transition-colors"
                          onClick={() => handlePermissionDelete(`${user.id}-${index}`)}
                        >
                          <Trash2 className="w-5 h-5 text-[#6B7280]" />
                        </button>
                        <button
                          className="w-10 h-10 flex items-center justify-center hover:bg-[#F3F4F6] rounded-lg transition-colors"
                          onClick={() => handlePermissionEdit(user)}
                        >
                          <Edit className="w-5 h-5 text-[#6B7280]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 페이지네이션 */}
            <div className="px-6 py-5 bg-white border-t border-[#F3F4F6]">
              <div className="flex justify-center">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, "...", 8, 9, 10].map((page, index) => (
                    <button
                      key={index}
                      className={`px-3 py-2 text-sm font-medium transition-colors ${
                        page === permissionCurrentPage 
                          ? "text-[#111827] text-base" 
                          : "text-[#6B7280] text-sm hover:text-[#374151]"
                      }`}
                      onClick={() => typeof page === "number" && handlePermissionPageClick(page)}
                      disabled={typeof page !== "number"}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 계정 등록 모달 */}
      <AccountRegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default PermissionManagementPage;