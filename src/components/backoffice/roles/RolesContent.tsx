'use client';

import { useState, useMemo, useEffect } from "react";
import { Trash2, Edit, Search } from "lucide-react";
import { Button } from '@/components/ui/button';

// 알림 모달 컴포넌트
const NotificationModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'info' 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}) => {
  if (!isOpen) return null;

  const getIconColor = () => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '⚠';
      default: return 'ℹ';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-[400px] shadow-xl border" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center mb-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getIconColor()} bg-opacity-10`}>
            <span className={`text-xl ${getIconColor()}`}>{getIcon()}</span>
          </div>
          {title && <h2 className="text-lg font-semibold text-gray-800">{title}</h2>}
        </div>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

// 삭제 확인 모달 컴포넌트
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-black mb-4">삭제 확인</h2>
        <p className="text-gray-700 mb-6">정말로 이 계정을 삭제하시겠습니까?</p>
        
        <div className="flex space-x-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            삭제
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

// 계정 등록 모달 컴포넌트
const AccountRegistrationModal = ({ 
  isOpen, 
  onClose, 
  onAddUser, 
  existingUsers,
  showNotification 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onAddUser: (user: { id: string; permission: string }) => void;
  existingUsers: { id: string; permission: string }[];
  showNotification: (message: string, type: 'success' | 'error' | 'info', title?: string) => void;
}) => {
  const [adminId, setAdminId] = useState('');
  const [role, setRole] = useState('대표');

  const handleSubmit = () => {
    // ID 입력 체크
    if (!adminId.trim()) {
      showNotification('아이디를 입력해주세요.', 'error', '입력 오류');
      return;
    }

    // 중복 체크
    const isDuplicate = existingUsers.some(user => user.id === adminId.trim());
    if (isDuplicate) {
      showNotification('이미 존재하는 아이디입니다.', 'error', '중복 오류');
      return;
    }

    // 실제 등록 로직
    onAddUser({ id: adminId.trim(), permission: role });
    
    // 모달 닫기 및 초기화
    setAdminId('');
    setRole('대표');
    onClose();
    
    // 등록 완료 알림 (모달이 닫힌 후)
    setTimeout(() => {
      showNotification('계정이 성공적으로 등록되었습니다.', 'success', '등록 완료');
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-[600px]" onClick={(e) => e.stopPropagation()}>
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
               <option value="직원">직원</option>
               <option value="인턴">인턴</option>
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
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
    title?: string;
  }>({
    isOpen: false,
    message: '',
    type: 'info'
  });

  // 기본 더미 데이터
  const defaultUsers = [
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

  // localStorage에서 데이터 로드
  const [permissionUsers, setPermissionUsers] = useState<{id: string; permission: string}[]>([]);

  useEffect(() => {
    const savedUsers = localStorage.getItem('permissionUsers');
    if (savedUsers) {
      setPermissionUsers(JSON.parse(savedUsers));
    } else {
      setPermissionUsers(defaultUsers);
    }
  }, []);

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
  const handlePermissionChange = (userIndex: number, newPermission: string) => {
    const updatedUsers = [...permissionUsers];
    const userId = updatedUsers[userIndex].id;
    updatedUsers[userIndex].permission = newPermission;
    
    setPermissionUsers(updatedUsers);
    localStorage.setItem('permissionUsers', JSON.stringify(updatedUsers));
    
    // 권한 변경 완료 알림
    showNotification(`${userId}의 권한이 ${newPermission}으로 변경되었습니다.`, 'success', '권한 변경 완료');
  };

  const handlePermissionEdit = (user: any) => {
    setEditingUser(user);
    setShowPermissionEditModal(true);
  };

  const handlePermissionDelete = (userId: string) => {
    setDeleteItemId(userId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteItemId) {
      const updatedUsers = permissionUsers.filter((_, index) => `${permissionUsers[index].id}-${index}` !== deleteItemId);
      setPermissionUsers(updatedUsers);
      localStorage.setItem('permissionUsers', JSON.stringify(updatedUsers));
      setShowDeleteModal(false);
      setDeleteItemId(null);
      
      // 삭제 완료 알림
      showNotification('계정이 성공적으로 삭제되었습니다.', 'success', '삭제 완료');
    }
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

  const handleAddUser = (newUser: { id: string; permission: string }) => {
    const updatedUsers = [...permissionUsers, newUser];
    setPermissionUsers(updatedUsers);
    localStorage.setItem('permissionUsers', JSON.stringify(updatedUsers));
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info', title?: string) => {
    setNotification({ isOpen: true, message, type, title });
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
                          onChange={(e) => handlePermissionChange(permissionStartIndex + index, e.target.value)}
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
        onAddUser={handleAddUser}
        existingUsers={permissionUsers}
        showNotification={showNotification}
      />

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal 
        isOpen={showDeleteModal} 
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteItemId(null);
        }} 
        onConfirm={confirmDelete}
      />

      {/* 알림 모달 */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
};

export default PermissionManagementPage;