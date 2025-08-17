import Link from 'next/link';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-24'>
      <h1 className='mb-8 text-4xl font-bold'>메인 페이지 (구현예정)</h1>
      <Link className='text-blue-500 hover:underline' href='/login'>
        로그인 페이지로 이동
      </Link>
      <Link className='text-blue-500 hover:underline' href='/signup'>
        회원가입 페이지로 이동
      </Link>
      <Link className='text-blue-500 hover:underline' href='/product/1'>
        제품 상세 페이지로 이동 (진행중)
      </Link>
      <Link className='text-blue-500 hover:underline' href='/product/2'>
        제품 상세 페이지로 이동 (예정)
      </Link>
      <Link className='text-blue-500 hover:underline' href='/product/3'>
        제품 상세 페이지로 이동 (마감)
      </Link>
      <Link className='text-blue-500 hover:underline' href='/product/4'>
        제품 상세 페이지로 이동 (마감임박)
      </Link>
      <Link className='text-blue-500 hover:underline' href='/product/5'>
        제품 상세 페이지로 이동 (프리미엄)
      </Link>
    </main>
  );
}
