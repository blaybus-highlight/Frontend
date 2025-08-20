'use client';

import { useState } from "react";
import { Trash2, Edit } from "lucide-react";

const PermissionManagementPage = () => {
  // 상태 관리
  const [permissionCurrentPage, setPermissionCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showPermissionEditModal, setShowPermissionEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

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

  const permissionItemsPerPage = 10;
  const permissionTotalPages = Math.ceil(permissionUsers.length / permissionItemsPerPage);
  const permissionStartIndex = (permissionCurrentPage - 1) * permissionItemsPerPage;
  const currentPermissionUsers = permissionUsers.slice(permissionStartIndex, permissionStartIndex + permissionItemsPerPage);

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
    </div>
  );
};

export default PermissionManagementPage;