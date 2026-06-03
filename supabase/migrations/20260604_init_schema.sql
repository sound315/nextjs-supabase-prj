-- ============================================================
-- 병원 투약 안전 관리 시스템 초기 스키마
-- ============================================================

-- ──────────────────────────────────────────────
-- 1. 사용자 프로필 (역할 관리)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_profiles (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role            text NOT NULL DEFAULT 'nurse' CHECK (role IN ('admin', 'doctor', 'nurse', 'pharmacist')),
  name            text,
  service_uid     uuid NOT NULL DEFAULT gen_random_uuid(),
  job_uid         uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 프로필만 조회 가능" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "본인 프로필만 수정 가능" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- ──────────────────────────────────────────────
-- 2. 환자 정보
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS patients (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_no      text NOT NULL UNIQUE,
  name            text NOT NULL,
  birth_date      date,
  gender          text CHECK (gender IN ('M', 'F')),
  weight_kg       numeric(5,2),
  allergies       text,
  notes           text,
  service_uid     uuid NOT NULL DEFAULT gen_random_uuid(),
  job_uid         uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "인증된 사용자만 환자 조회" ON patients
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "인증된 사용자만 환자 등록" ON patients
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "인증된 사용자만 환자 수정" ON patients
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────
-- 3. 약물 제품 정보
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code    text NOT NULL UNIQUE,
  product_name    text NOT NULL,
  manufacturer    text,
  dosage_form     text,
  unit            text,
  service_uid     uuid NOT NULL DEFAULT gen_random_uuid(),
  job_uid         uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "인증된 사용자만 제품 조회" ON products
  FOR SELECT USING (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────
-- 4. 성분 정보
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ingredients (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_code     text NOT NULL UNIQUE,
  name_ko             text NOT NULL,
  name_en             text,
  service_uid         uuid NOT NULL DEFAULT gen_random_uuid(),
  job_uid             uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "인증된 사용자만 성분 조회" ON ingredients
  FOR SELECT USING (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────
-- 5. 제품-성분 매핑 (M:N)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_ingredients (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  ingredient_id   uuid NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  amount_mg       numeric(10,3),
  service_uid     uuid NOT NULL DEFAULT gen_random_uuid(),
  job_uid         uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE(product_id, ingredient_id)
);

ALTER TABLE product_ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "인증된 사용자만 제품-성분 조회" ON product_ingredients
  FOR SELECT USING (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────
-- 6. 성분 간 상호작용 금기
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ingredient_interactions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_a_id     uuid NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  ingredient_b_id     uuid NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  severity            text NOT NULL CHECK (severity IN ('contraindicated', 'major', 'moderate', 'minor')),
  description         text,
  source              text,
  service_uid         uuid NOT NULL DEFAULT gen_random_uuid(),
  job_uid             uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE(ingredient_a_id, ingredient_b_id)
);

ALTER TABLE ingredient_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "인증된 사용자만 상호작용 조회" ON ingredient_interactions
  FOR SELECT USING (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────
-- 7. 환자 특이 금기
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS patient_contraindications (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  ingredient_id   uuid REFERENCES ingredients(id) ON DELETE SET NULL,
  product_id      uuid REFERENCES products(id) ON DELETE SET NULL,
  reason          text,
  service_uid     uuid NOT NULL DEFAULT gen_random_uuid(),
  job_uid         uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE patient_contraindications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "인증된 사용자만 환자 금기 조회" ON patient_contraindications
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "인증된 사용자만 환자 금기 등록" ON patient_contraindications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────
-- 8. 급여/보험 제한
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reimbursement_restrictions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  restriction     text NOT NULL,
  effective_from  date,
  effective_to    date,
  service_uid     uuid NOT NULL DEFAULT gen_random_uuid(),
  job_uid         uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reimbursement_restrictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "인증된 사용자만 급여 제한 조회" ON reimbursement_restrictions
  FOR SELECT USING (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────
-- 9. 처방 목록
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS prescriptions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  prescribed_by   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  prescribed_at   timestamptz NOT NULL DEFAULT now(),
  status          text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  notes           text,
  service_uid     uuid NOT NULL DEFAULT gen_random_uuid(),
  job_uid         uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "인증된 사용자만 처방 조회" ON prescriptions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "인증된 사용자만 처방 등록" ON prescriptions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "인증된 사용자만 처방 수정" ON prescriptions
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────
-- 10. 처방별 제품 목록
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS prescription_products (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id uuid NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  product_id      uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  dosage          text,
  frequency       text,
  duration_days   int,
  service_uid     uuid NOT NULL DEFAULT gen_random_uuid(),
  job_uid         uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE prescription_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "인증된 사용자만 처방 제품 조회" ON prescription_products
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "인증된 사용자만 처방 제품 등록" ON prescription_products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────
-- 11. 투약 이력
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS medication_logs (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id     uuid NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  product_id          uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  administered_by     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  administered_at     timestamptz NOT NULL DEFAULT now(),
  status              text NOT NULL DEFAULT 'administered' CHECK (status IN ('administered', 'skipped', 'refused')),
  notes               text,
  service_uid         uuid NOT NULL DEFAULT gen_random_uuid(),
  job_uid             uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE medication_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "인증된 사용자만 투약 이력 조회" ON medication_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "인증된 사용자만 투약 이력 등록" ON medication_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────
-- 12. 경고 발생 이력
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alert_logs (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id          uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  prescription_id     uuid REFERENCES prescriptions(id) ON DELETE SET NULL,
  alert_type          text NOT NULL CHECK (alert_type IN ('interaction', 'patient_contraindication', 'reimbursement')),
  severity            text NOT NULL CHECK (severity IN ('contraindicated', 'major', 'moderate', 'minor')),
  product_a_id        uuid REFERENCES products(id) ON DELETE SET NULL,
  product_b_id        uuid REFERENCES products(id) ON DELETE SET NULL,
  ingredient_a_id     uuid REFERENCES ingredients(id) ON DELETE SET NULL,
  ingredient_b_id     uuid REFERENCES ingredients(id) ON DELETE SET NULL,
  description         text,
  acknowledged        boolean NOT NULL DEFAULT false,
  acknowledged_by     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  acknowledged_at     timestamptz,
  service_uid         uuid NOT NULL DEFAULT gen_random_uuid(),
  job_uid             uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE alert_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "인증된 사용자만 경고 이력 조회" ON alert_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "인증된 사용자만 경고 이력 등록" ON alert_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "인증된 사용자만 경고 확인 처리" ON alert_logs
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────
-- updated_at 자동 갱신 트리거
-- ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_ingredients_updated_at
  BEFORE UPDATE ON ingredients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_ingredient_interactions_updated_at
  BEFORE UPDATE ON ingredient_interactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_patient_contraindications_updated_at
  BEFORE UPDATE ON patient_contraindications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_reimbursement_restrictions_updated_at
  BEFORE UPDATE ON reimbursement_restrictions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_prescriptions_updated_at
  BEFORE UPDATE ON prescriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
