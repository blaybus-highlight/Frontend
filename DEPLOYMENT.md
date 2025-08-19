# GitHub Actions CI/CD 배포 가이드

## 개요
이 프로젝트는 GitHub Actions를 통해 Docker 이미지를 빌드하고 AWS EC2에 자동 배포하는 CI/CD 파이프라인을 사용합니다.

## 사전 준비사항

### 1. AWS 설정
- AWS ECR (Elastic Container Registry) 리포지토리 생성
- EC2 인스턴스에 Docker 설치
- EC2 인스턴스에 ECR 접근 권한 설정

### 2. GitHub Secrets 설정
GitHub 저장소의 Settings > Secrets and variables > Actions에서 다음 시크릿을 설정해야 합니다:

#### 필수 Secrets:
- `AWS_ACCESS_KEY_ID`: AWS IAM 사용자의 Access Key ID
- `AWS_SECRET_ACCESS_KEY`: AWS IAM 사용자의 Secret Access Key
- `EC2_HOST`: EC2 인스턴스의 퍼블릭 IP 또는 도메인
- `EC2_USERNAME`: EC2 인스턴스의 SSH 사용자명 (보통 `ubuntu` 또는 `ec2-user`)
- `EC2_SSH_KEY`: EC2 인스턴스 접속용 SSH 프라이빗 키

## 배포 과정

### 1. 코드 푸시
- `main` 또는 `develop` 브랜치에 코드를 푸시하면 자동으로 배포가 시작됩니다.

### 2. CI/CD 파이프라인 단계
1. **코드 체크아웃**: GitHub 저장소에서 코드를 가져옵니다.
2. **Node.js 설정**: Node.js 18 환경을 설정합니다.
3. **의존성 설치**: `pnpm install`을 실행합니다.
4. **테스트 실행**: 테스트가 있다면 실행합니다.
5. **애플리케이션 빌드**: `pnpm run build`를 실행합니다.
6. **AWS 인증**: AWS 자격 증명을 설정합니다.
7. **ECR 로그인**: Amazon ECR에 로그인합니다.
8. **Docker 이미지 빌드 및 푸시**: 
   - Docker 이미지를 빌드합니다.
   - ECR에 이미지를 푸시합니다.
9. **EC2 배포**: 
   - EC2 인스턴스에 SSH로 연결합니다.
   - 새 이미지를 풀합니다.
   - 기존 컨테이너를 중지하고 제거합니다.
   - 새 컨테이너를 실행합니다.

## EC2 인스턴스 설정

### Docker 설치
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Amazon Linux 2
sudo yum update -y
sudo yum install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user
```

### ECR 로그인 설정
```bash
# AWS CLI 설치
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# ECR 로그인
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin [AWS_ACCOUNT_ID].dkr.ecr.ap-northeast-2.amazonaws.com
```

## 환경 변수

### 프로덕션 환경 변수
컨테이너 실행 시 다음 환경 변수를 설정할 수 있습니다:
- `NODE_ENV`: production
- `PORT`: 3000

### 추가 환경 변수 설정
필요한 경우 GitHub Actions 워크플로우에서 추가 환경 변수를 설정할 수 있습니다:

```yaml
docker run -d \
  --name nafal-frontend \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=${{ secrets.DATABASE_URL }} \
  -e API_BASE_URL=${{ secrets.API_BASE_URL }} \
  ${{ steps.build-image.outputs.image }}
```

## 모니터링 및 로그

### 컨테이너 로그 확인
```bash
docker logs nafal-frontend
```

### 컨테이너 상태 확인
```bash
docker ps
docker stats nafal-frontend
```

## 롤백

### 이전 버전으로 롤백
```bash
# 이전 이미지로 컨테이너 재시작
docker stop nafal-frontend
docker rm nafal-frontend
docker run -d --name nafal-frontend -p 3000:3000 [이전_이미지_태그]
```

## 문제 해결

### 일반적인 문제들
1. **ECR 접근 권한 오류**: IAM 사용자에게 ECR 접근 권한이 있는지 확인
2. **SSH 연결 오류**: EC2 보안 그룹에서 SSH 포트(22)가 열려있는지 확인
3. **포트 충돌**: 3000번 포트가 사용 중인지 확인
4. **메모리 부족**: EC2 인스턴스의 메모리가 충분한지 확인

### 로그 확인
- GitHub Actions 로그: Actions 탭에서 확인
- Docker 로그: `docker logs nafal-frontend`
- 시스템 로그: `journalctl -u docker`
