-- 테스트용 시드 데이터

-- 성분 데이터
INSERT INTO ingredients (ingredient_code, name_ko, name_en) VALUES
  ('ING001', '아세트아미노펜', 'Acetaminophen'),
  ('ING002', '아스피린', 'Aspirin'),
  ('ING003', '와파린', 'Warfarin'),
  ('ING004', '이부프로펜', 'Ibuprofen')
ON CONFLICT (ingredient_code) DO NOTHING;

-- 제품 데이터
INSERT INTO products (product_code, product_name, manufacturer, dosage_form, unit) VALUES
  ('P001', '타이레놀 500mg 정', '한국얀센', '정제', 'mg'),
  ('P002', '아스피린 100mg 정', '바이엘코리아', '정제', 'mg'),
  ('P003', '쿠마딘 5mg 정', '한국오가논', '정제', 'mg'),
  ('P004', '이부프로펜 400mg 정', '삼일제약', '정제', 'mg')
ON CONFLICT (product_code) DO NOTHING;

-- 제품-성분 매핑
INSERT INTO product_ingredients (product_id, ingredient_id, amount_mg)
SELECT p.id, i.id, 500
FROM products p, ingredients i
WHERE p.product_code = 'P001' AND i.ingredient_code = 'ING001'
ON CONFLICT DO NOTHING;

INSERT INTO product_ingredients (product_id, ingredient_id, amount_mg)
SELECT p.id, i.id, 100
FROM products p, ingredients i
WHERE p.product_code = 'P002' AND i.ingredient_code = 'ING002'
ON CONFLICT DO NOTHING;

INSERT INTO product_ingredients (product_id, ingredient_id, amount_mg)
SELECT p.id, i.id, 5
FROM products p, ingredients i
WHERE p.product_code = 'P003' AND i.ingredient_code = 'ING003'
ON CONFLICT DO NOTHING;

INSERT INTO product_ingredients (product_id, ingredient_id, amount_mg)
SELECT p.id, i.id, 400
FROM products p, ingredients i
WHERE p.product_code = 'P004' AND i.ingredient_code = 'ING004'
ON CONFLICT DO NOTHING;

-- 성분 간 상호작용 금기 (아스피린 ↔ 와파린: 출혈 위험)
INSERT INTO ingredient_interactions (ingredient_a_id, ingredient_b_id, severity, description, source)
SELECT a.id, b.id, 'major', '아스피린과 와파린 병용 시 출혈 위험이 크게 증가합니다. 병용을 피하거나 면밀히 모니터링하세요.', '식약처 의약품 안전정보'
FROM ingredients a, ingredients b
WHERE a.ingredient_code = 'ING002' AND b.ingredient_code = 'ING003'
ON CONFLICT DO NOTHING;

-- 이부프로펜 ↔ 와파린: 출혈 위험
INSERT INTO ingredient_interactions (ingredient_a_id, ingredient_b_id, severity, description, source)
SELECT a.id, b.id, 'major', '이부프로펜과 와파린 병용 시 항응고 효과가 증가하여 출혈 위험이 높아집니다.', '식약처 의약품 안전정보'
FROM ingredients a, ingredients b
WHERE a.ingredient_code = 'ING004' AND b.ingredient_code = 'ING003'
ON CONFLICT DO NOTHING;

-- 아스피린 ↔ 이부프로펜: 위장 출혈 위험
INSERT INTO ingredient_interactions (ingredient_a_id, ingredient_b_id, severity, description, source)
SELECT a.id, b.id, 'moderate', '아스피린과 이부프로펜 동시 복용 시 위장관 출혈 및 궤양 위험이 증가합니다.', '식약처 의약품 안전정보'
FROM ingredients a, ingredients b
WHERE a.ingredient_code = 'ING002' AND b.ingredient_code = 'ING004'
ON CONFLICT DO NOTHING;

-- 환자 데이터
INSERT INTO patients (patient_no, name, birth_date, gender, weight_kg) VALUES
  ('PT001', '김철수', '1965-03-15', 'M', 72.5),
  ('PT002', '이영희', '1978-07-22', 'F', 58.0),
  ('PT003', '박민준', '1990-11-08', 'M', 80.0)
ON CONFLICT (patient_no) DO NOTHING;

-- 환자 특이 금기 (김철수 - 아세트아미노펜 금기: 간질환)
INSERT INTO patient_contraindications (patient_id, ingredient_id, reason)
SELECT p.id, i.id, '간경변 진단으로 아세트아미노펜 투여 금지'
FROM patients p, ingredients i
WHERE p.patient_no = 'PT001' AND i.ingredient_code = 'ING001'
ON CONFLICT DO NOTHING;

-- 급여 제한 (쿠마딘)
INSERT INTO reimbursement_restrictions (product_id, restriction, effective_from)
SELECT p.id, '심방세동 환자에 한하여 급여 인정. 해당 상병코드(I48) 확인 필요.', '2024-01-01'
FROM products p
WHERE p.product_code = 'P003'
ON CONFLICT DO NOTHING;
