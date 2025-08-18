const saveToken = async (e: React.FormEvent<HTMLFormElement>) => {
  if (data && data.token) {
    localStorage.setItem('accessToken', data.token);
    console.log('로그인 성공: localStorage에 토큰 저장 완료');
    router.push('/'); // 로그인 성공 시 홈으로 이동
  } else {
    throw new Error('토큰이 수신되지 않았습니다.');
  }
}