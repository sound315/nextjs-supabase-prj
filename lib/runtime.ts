// 서비스 기동 시 1회 생성되는 고유 식별자
// 서비스 재기동 시마다 새로운 값으로 갱신됨
export const SERVICE_UID = crypto.randomUUID()
