import React from 'react';

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex h-screen bg-gray-100">
      {/* TODO: 추후 이 곳에 사이드바 네비게이션 컴포넌트가 들어갑니다. */}
      <aside className="w-64 flex-shrink-0 bg-gray-800 p-4 text-white">
        <h1 className="mb-4 text-2xl font-bold">Admin</h1>
        <nav>
          <ul>
            <li className="mb-2">
              <a href="/backoffice" className="block rounded p-2 hover:bg-gray-700">
                Dashboard
              </a>
            </li>
            {/* TODO: 추후 관리자 메뉴들이 추가됩니다. */}
            <li className="mb-2">
              <a href="#" className="block rounded p-2 hover:bg-gray-700">
                Users
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="block rounded p-2 hover:bg-gray-700">
                Products
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </section>
  );
}
