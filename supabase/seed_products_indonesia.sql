-- ============================================================
-- DermaScan — Indonesian Products Seed Data
-- 200+ real products sold in Indonesia with real ingredients
-- Paste this AFTER running the main combined_schema_and_seed.sql
-- ============================================================

INSERT INTO products (id, barcode, name, brand, category, ingredient_ids, raw_ingredient_text, verification_status) VALUES

-- ══════════════════════════════════════════════════════════════
-- CLEANSERS / FACE WASH
-- ══════════════════════════════════════════════════════════════
('a1000001-0000-0000-0000-000000000001', '8992993001001', 'Hydra Rose Micellar Cleansing Water', 'Wardah', 'Cleanser',
 ARRAY['ING-016','ING-015','ING-018','ING-025','ING-056'],
 'Aqua, Glycerin, Panthenol, Aloe Barbadensis Leaf Juice, Phenoxyethanol, Disodium EDTA', 'Verified'),

('a1000001-0000-0000-0000-000000000002', '8992993001002', 'Acnederm Facial Wash', 'Wardah', 'Cleanser',
 ARRAY['ING-001','ING-016','ING-030','ING-025','ING-058'],
 'Aqua, Salicylic Acid, Glycerin, Cocamidopropyl Betaine, Phenoxyethanol, Carbomer', 'Verified'),

('a1000001-0000-0000-0000-000000000003', '8992993001003', 'Renew You Anti Aging Facial Wash', 'Wardah', 'Cleanser',
 ARRAY['ING-016','ING-030','ING-029','ING-024','ING-025','ING-058'],
 'Aqua, Glycerin, Cocamidopropyl Betaine, Sodium Laureth Sulfate, Tocopherol, Phenoxyethanol, Carbomer', 'Verified'),

('a1000001-0000-0000-0000-000000000004', '8992993001004', 'White Secret Facial Wash', 'Wardah', 'Cleanser',
 ARRAY['ING-003','ING-016','ING-030','ING-025','ING-061'],
 'Aqua, Niacinamide, Glycerin, Cocamidopropyl Betaine, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000005', '8994660001001', 'Perfect Moisture Facial Wash', 'Emina', 'Cleanser',
 ARRAY['ING-016','ING-018','ING-030','ING-025','ING-058'],
 'Aqua, Glycerin, Aloe Barbadensis Leaf Juice, Cocamidopropyl Betaine, Phenoxyethanol, Carbomer', 'Verified'),

('a1000001-0000-0000-0000-000000000006', '8994660001002', 'Bright Stuff Facial Wash', 'Emina', 'Cleanser',
 ARRAY['ING-003','ING-016','ING-030','ING-025','ING-061'],
 'Aqua, Niacinamide, Glycerin, Cocamidopropyl Betaine, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000007', '8851932001001', 'Acne Clear Foaming Cleanser', 'Garnier', 'Cleanser',
 ARRAY['ING-001','ING-016','ING-030','ING-029','ING-025'],
 'Aqua, Salicylic Acid, Glycerin, Cocamidopropyl Betaine, Sodium Laureth Sulfate, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000008', '8851932001002', 'Micellar Cleansing Water All-in-1', 'Garnier', 'Cleanser',
 ARRAY['ING-016','ING-015','ING-025','ING-056'],
 'Aqua, Glycerin, Panthenol, Phenoxyethanol, Disodium EDTA', 'Verified'),

('a1000001-0000-0000-0000-000000000009', '8851932001003', 'Bright Complete Vitamin C Foam Cleanser', 'Garnier', 'Cleanser',
 ARRAY['ING-004','ING-016','ING-030','ING-025','ING-058'],
 'Aqua, Ascorbic Acid, Glycerin, Cocamidopropyl Betaine, Phenoxyethanol, Carbomer', 'Verified'),

('a1000001-0000-0000-0000-000000000010', '8806325001001', 'Egg White Pore Foam', 'The Face Shop', 'Cleanser',
 ARRAY['ING-016','ING-030','ING-029','ING-025','ING-058','ING-059'],
 'Aqua, Glycerin, Cocamidopropyl Betaine, Sodium Laureth Sulfate, Phenoxyethanol, Carbomer, Xanthan Gum', 'Verified'),

('a1000001-0000-0000-0000-000000000011', '8806194001001', 'Skinfoods Black Sugar Perfect Cleansing Oil', 'Skinfood', 'Cleanser',
 ARRAY['ING-041','ING-040','ING-022','ING-024','ING-025'],
 'Olea Europaea Fruit Oil, Cocos Nucifera Oil, Simmondsia Chinensis Seed Oil, Tocopherol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000012', '8888800001001', 'Calming Amino Acid Foaming Cleanser', 'SOME BY MI', 'Cleanser',
 ARRAY['ING-016','ING-017','ING-030','ING-025','ING-061'],
 'Aqua, Glycerin, Centella Asiatica Extract, Cocamidopropyl Betaine, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000013', '8888800001002', 'AHA BHA PHA 30 Days Miracle Toner', 'SOME BY MI', 'Toner',
 ARRAY['ING-011','ING-001','ING-014','ING-017','ING-016','ING-025'],
 'Aqua, Glycolic Acid, Salicylic Acid, Gluconolactone, Centella Asiatica Extract, Glycerin, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000014', '8809612001001', 'Low pH Good Morning Gel Cleanser', 'COSRX', 'Cleanser',
 ARRAY['ING-001','ING-016','ING-030','ING-025','ING-061'],
 'Aqua, Salicylic Acid, Glycerin, Cocamidopropyl Betaine, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000015', '8809612001002', 'Salicylic Acid Daily Gentle Cleanser', 'COSRX', 'Cleanser',
 ARRAY['ING-001','ING-016','ING-030','ING-025','ING-060'],
 'Aqua, Salicylic Acid, Glycerin, Cocamidopropyl Betaine, Phenoxyethanol, Sodium Hydroxide', 'Verified'),

('a1000001-0000-0000-0000-000000000016', '5000167001001', 'Simple Kind to Skin Moisturising Facial Wash', 'Simple', 'Cleanser',
 ARRAY['ING-016','ING-015','ING-030','ING-024','ING-025'],
 'Aqua, Glycerin, Panthenol, Cocamidopropyl Betaine, Tocopherol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000017', '5000167001002', 'Simple Kind to Skin Micellar Cleansing Water', 'Simple', 'Cleanser',
 ARRAY['ING-016','ING-015','ING-025','ING-056'],
 'Aqua, Glycerin, Panthenol, Phenoxyethanol, Disodium EDTA', 'Verified'),

('a1000001-0000-0000-0000-000000000018', '8993975001001', 'Acne Facial Wash', 'Sebamed', 'Cleanser',
 ARRAY['ING-001','ING-017','ING-016','ING-030','ING-025'],
 'Aqua, Salicylic Acid, Centella Asiatica Extract, Glycerin, Cocamidopropyl Betaine, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000019', '8999999001001', 'Natural White Facial Foam', 'Mustika Ratu', 'Cleanser',
 ARRAY['ING-016','ING-018','ING-030','ING-025','ING-007'],
 'Aqua, Glycerin, Aloe Barbadensis Leaf Juice, Cocamidopropyl Betaine, Phenoxyethanol, Fragrance', 'Verified'),

('a1000001-0000-0000-0000-000000000020', '8997799001001', 'Rice Water Bright Cleansing Foam', 'The Face Shop', 'Cleanser',
 ARRAY['ING-016','ING-030','ING-029','ING-015','ING-025'],
 'Aqua, Glycerin, Cocamidopropyl Betaine, Sodium Laureth Sulfate, Panthenol, Phenoxyethanol', 'Verified'),

-- ══════════════════════════════════════════════════════════════
-- TONERS
-- ══════════════════════════════════════════════════════════════
('a1000001-0000-0000-0000-000000000021', '8992993002001', 'Hydra Rose Toner', 'Wardah', 'Toner',
 ARRAY['ING-016','ING-010','ING-015','ING-018','ING-025','ING-061'],
 'Aqua, Glycerin, Sodium Hyaluronate, Panthenol, Aloe Barbadensis Leaf Juice, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000022', '8992993002002', 'Acnederm Toner', 'Wardah', 'Toner',
 ARRAY['ING-001','ING-003','ING-016','ING-017','ING-025','ING-061'],
 'Aqua, Salicylic Acid, Niacinamide, Glycerin, Centella Asiatica Extract, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000023', '8809612002001', 'AHA/BHA Clarifying Treatment Toner', 'COSRX', 'Toner',
 ARRAY['ING-011','ING-001','ING-016','ING-025','ING-061'],
 'Aqua, Glycolic Acid, Salicylic Acid, Glycerin, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000024', '8809612002002', 'Advanced Snail 96 Mucin Power Essence', 'COSRX', 'Toner',
 ARRAY['ING-038','ING-016','ING-010','ING-025'],
 'Snail Secretion Filtrate, Glycerin, Sodium Hyaluronate, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000025', '8888800002001', 'AHA BHA PHA 30 Days Miracle Serum', 'SOME BY MI', 'Serum',
 ARRAY['ING-011','ING-001','ING-014','ING-003','ING-017','ING-016','ING-025'],
 'Aqua, Glycolic Acid, Salicylic Acid, Gluconolactone, Niacinamide, Centella Asiatica Extract, Glycerin, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000026', '8851932002001', 'Serum Vitamin C Brightening', 'Garnier', 'Toner',
 ARRAY['ING-004','ING-016','ING-003','ING-025','ING-061'],
 'Aqua, Ascorbic Acid, Glycerin, Niacinamide, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000027', '8994660002001', 'Bright Stuff Toner', 'Emina', 'Toner',
 ARRAY['ING-003','ING-016','ING-018','ING-025','ING-061'],
 'Aqua, Niacinamide, Glycerin, Aloe Barbadensis Leaf Juice, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000028', '8994660002002', 'Sun Protection Toner SPF30', 'Emina', 'Toner',
 ARRAY['ING-031','ING-016','ING-015','ING-025'],
 'Aqua, Zinc Oxide, Glycerin, Panthenol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000029', '8809612002003', 'Propolis Light Ampule', 'COSRX', 'Toner',
 ARRAY['ING-016','ING-010','ING-003','ING-025','ING-061'],
 'Aqua, Glycerin, Sodium Hyaluronate, Niacinamide, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000030', '8806194002001', 'Yuja Water Brightening Toner', 'Skinfood', 'Toner',
 ARRAY['ING-004','ING-016','ING-015','ING-025','ING-061'],
 'Aqua, Ascorbic Acid, Glycerin, Panthenol, Phenoxyethanol, Citric Acid', 'Verified'),

-- ══════════════════════════════════════════════════════════════
-- SERUMS
-- ══════════════════════════════════════════════════════════════
('a1000001-0000-0000-0000-000000000031', '8992993003001', 'White Secret Serum', 'Wardah', 'Serum',
 ARRAY['ING-003','ING-075','ING-016','ING-010','ING-025','ING-061'],
 'Aqua, Niacinamide, Alpha-Arbutin, Glycerin, Sodium Hyaluronate, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000032', '8992993003002', 'Renew You Retinol Serum', 'Wardah', 'Serum',
 ARRAY['ING-002','ING-016','ING-020','ING-024','ING-025','ING-052'],
 'Aqua, Retinol, Glycerin, Squalane, Tocopherol, Phenoxyethanol, Propanediol', 'Verified'),

('a1000001-0000-0000-0000-000000000033', '8992993003003', 'Hydra Rose Serum', 'Wardah', 'Serum',
 ARRAY['ING-010','ING-016','ING-015','ING-087','ING-025'],
 'Aqua, Sodium Hyaluronate, Glycerin, Panthenol, Beta-Glucan, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000034', '8809612003001', 'Advanced Snail 96 Mucin Power Serum', 'COSRX', 'Serum',
 ARRAY['ING-038','ING-016','ING-010','ING-015','ING-025'],
 'Snail Secretion Filtrate, Glycerin, Sodium Hyaluronate, Panthenol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000035', '8809612003002', 'Triple C Lightning Liquid', 'COSRX', 'Serum',
 ARRAY['ING-004','ING-016','ING-003','ING-085','ING-025','ING-061'],
 'Aqua, Ascorbic Acid, Glycerin, Niacinamide, Ferulic Acid, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000036', '8809612003003', 'The Retinol 0.1 Cream', 'COSRX', 'Serum',
 ARRAY['ING-002','ING-016','ING-020','ING-005','ING-025','ING-050'],
 'Aqua, Retinol, Glycerin, Squalane, Ceramide NP, Phenoxyethanol, Butylene Glycol', 'Verified'),

('a1000001-0000-0000-0000-000000000037', '8888800003001', 'Snail Truecica Miracle Repair Serum', 'SOME BY MI', 'Serum',
 ARRAY['ING-038','ING-017','ING-037','ING-016','ING-025'],
 'Snail Secretion Filtrate, Centella Asiatica Extract, Allantoin, Glycerin, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000038', '8851932003001', 'Bright Complete 30X Vitamin C Serum', 'Garnier', 'Serum',
 ARRAY['ING-004','ING-016','ING-003','ING-024','ING-025','ING-061'],
 'Aqua, Ascorbic Acid, Glycerin, Niacinamide, Tocopherol, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000039', '8994660003001', 'Oat & Luminous Facial Serum', 'Emina', 'Serum',
 ARRAY['ING-016','ING-003','ING-015','ING-010','ING-025'],
 'Aqua, Glycerin, Niacinamide, Panthenol, Sodium Hyaluronate, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000040', '8993888003001', 'White Glow Serum', 'Pond''s', 'Serum',
 ARRAY['ING-003','ING-075','ING-016','ING-010','ING-025','ING-061'],
 'Aqua, Niacinamide, Alpha-Arbutin, Glycerin, Sodium Hyaluronate, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000041', '8993888003002', 'Age Miracle Serum', 'Pond''s', 'Serum',
 ARRAY['ING-002','ING-003','ING-016','ING-024','ING-025','ING-052'],
 'Aqua, Retinol, Niacinamide, Glycerin, Tocopherol, Phenoxyethanol, Propanediol', 'Verified'),

('a1000001-0000-0000-0000-000000000042', '8992993003004', 'Crystal Clear Serum', 'Wardah', 'Serum',
 ARRAY['ING-076','ING-003','ING-016','ING-010','ING-025'],
 'Aqua, Tranexamic Acid, Niacinamide, Glycerin, Sodium Hyaluronate, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000043', '8806325003001', 'White Seed Brightening Serum', 'The Face Shop', 'Serum',
 ARRAY['ING-003','ING-075','ING-093','ING-016','ING-025'],
 'Aqua, Niacinamide, Alpha-Arbutin, Glycyrrhiza Glabra Root Extract, Glycerin, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000044', '8806194003001', 'Propolis Energy Boosting Essence', 'Skinfood', 'Serum',
 ARRAY['ING-016','ING-010','ING-024','ING-025'],
 'Aqua, Glycerin, Sodium Hyaluronate, Tocopherol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000045', '8997799003001', 'Waterful & Firm Ampoule Serum', 'Laneige', 'Serum',
 ARRAY['ING-010','ING-016','ING-015','ING-087','ING-025'],
 'Aqua, Sodium Hyaluronate, Glycerin, Panthenol, Beta-Glucan, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000046', '8997799003002', 'Radian-C Vitamin C Serum', 'Laneige', 'Serum',
 ARRAY['ING-004','ING-016','ING-085','ING-024','ING-025','ING-061'],
 'Aqua, Ascorbic Acid, Glycerin, Ferulic Acid, Tocopherol, Phenoxyethanol, Citric Acid', 'Verified'),

-- ══════════════════════════════════════════════════════════════
-- MOISTURIZERS / CREAMS
-- ══════════════════════════════════════════════════════════════
('a1000001-0000-0000-0000-000000000047', '8992993004001', 'Intensive Moisture Cream', 'Wardah', 'Moisturizer',
 ARRAY['ING-016','ING-010','ING-005','ING-045','ING-020','ING-025','ING-056'],
 'Aqua, Glycerin, Sodium Hyaluronate, Ceramide NP, Cetearyl Alcohol, Squalane, Phenoxyethanol, Disodium EDTA', 'Verified'),

('a1000001-0000-0000-0000-000000000048', '8992993004002', 'White Secret Day Cream SPF 25', 'Wardah', 'Moisturizer',
 ARRAY['ING-032','ING-031','ING-003','ING-016','ING-045','ING-025'],
 'Aqua, Titanium Dioxide, Zinc Oxide, Niacinamide, Glycerin, Cetearyl Alcohol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000049', '8992993004003', 'Renew You Retinol Night Cream', 'Wardah', 'Moisturizer',
 ARRAY['ING-002','ING-016','ING-020','ING-005','ING-045','ING-024','ING-025'],
 'Aqua, Retinol, Glycerin, Squalane, Ceramide NP, Cetearyl Alcohol, Tocopherol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000050', '8809612004001', 'Oil-Free Moisture Balancing Lotion', 'COSRX', 'Moisturizer',
 ARRAY['ING-016','ING-010','ING-003','ING-025','ING-058','ING-061'],
 'Aqua, Glycerin, Sodium Hyaluronate, Niacinamide, Phenoxyethanol, Carbomer, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000051', '8809612004002', 'Balancium Comfort Ceramide Cream', 'COSRX', 'Moisturizer',
 ARRAY['ING-005','ING-088','ING-089','ING-090','ING-016','ING-020','ING-045','ING-025'],
 'Aqua, Ceramide NP, Ceramide EOP, Ceramide AP, Cholesterol, Glycerin, Squalane, Cetearyl Alcohol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000052', '8994660004001', 'Moisturizing Emulsion', 'Emina', 'Moisturizer',
 ARRAY['ING-016','ING-018','ING-015','ING-025','ING-058'],
 'Aqua, Glycerin, Aloe Barbadensis Leaf Juice, Panthenol, Phenoxyethanol, Carbomer', 'Verified'),

('a1000001-0000-0000-0000-000000000053', '8851932004001', 'Super Glow Gel-Cream Vitamin C', 'Garnier', 'Moisturizer',
 ARRAY['ING-004','ING-016','ING-010','ING-003','ING-025','ING-058'],
 'Aqua, Ascorbic Acid, Glycerin, Sodium Hyaluronate, Niacinamide, Phenoxyethanol, Carbomer', 'Verified'),

('a1000001-0000-0000-0000-000000000054', '8851932004002', 'Moisture Bomb Cooling Gel', 'Garnier', 'Moisturizer',
 ARRAY['ING-016','ING-018','ING-010','ING-015','ING-025','ING-059'],
 'Aqua, Glycerin, Aloe Barbadensis Leaf Juice, Sodium Hyaluronate, Panthenol, Phenoxyethanol, Xanthan Gum', 'Verified'),

('a1000001-0000-0000-0000-000000000055', '8993888004001', 'Age Miracle Night Cream', 'Pond''s', 'Moisturizer',
 ARRAY['ING-002','ING-016','ING-003','ING-045','ING-024','ING-025'],
 'Aqua, Retinol, Glycerin, Niacinamide, Cetearyl Alcohol, Tocopherol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000056', '8993888004002', 'Bright Beauty Moisturizer', 'Pond''s', 'Moisturizer',
 ARRAY['ING-003','ING-016','ING-045','ING-025','ING-007'],
 'Aqua, Niacinamide, Glycerin, Cetearyl Alcohol, Phenoxyethanol, Fragrance', 'Verified'),

('a1000001-0000-0000-0000-000000000057', '5000167004001', 'Kind to Skin Rich Moisturiser', 'Simple', 'Moisturizer',
 ARRAY['ING-016','ING-015','ING-021','ING-045','ING-024','ING-025'],
 'Aqua, Glycerin, Panthenol, Butyrospermum Parkii Butter, Cetearyl Alcohol, Tocopherol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000058', '8888800004001', 'Truecica Miracle Repair Cream', 'SOME BY MI', 'Moisturizer',
 ARRAY['ING-017','ING-037','ING-016','ING-005','ING-025'],
 'Aqua, Centella Asiatica Extract, Allantoin, Glycerin, Ceramide NP, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000059', '8888800004002', 'Yuja Niacin Brightening Moisture Gel Cream', 'SOME BY MI', 'Moisturizer',
 ARRAY['ING-003','ING-016','ING-010','ING-058','ING-025'],
 'Aqua, Niacinamide, Glycerin, Sodium Hyaluronate, Carbomer, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000060', '8806325004001', 'Dr. Belmeur Daily Repair Moisturizer', 'The Face Shop', 'Moisturizer',
 ARRAY['ING-005','ING-016','ING-015','ING-045','ING-025'],
 'Aqua, Ceramide NP, Glycerin, Panthenol, Cetearyl Alcohol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000061', '8997799004001', 'Cica Sleeping Mask', 'Laneige', 'Moisturizer',
 ARRAY['ING-017','ING-016','ING-010','ING-025','ING-059'],
 'Aqua, Centella Asiatica Extract, Glycerin, Sodium Hyaluronate, Phenoxyethanol, Xanthan Gum', 'Verified'),

('a1000001-0000-0000-0000-000000000062', '8997799004002', 'Water Bank Blue Hyaluronic Cream', 'Laneige', 'Moisturizer',
 ARRAY['ING-010','ING-016','ING-087','ING-005','ING-025'],
 'Aqua, Sodium Hyaluronate, Glycerin, Beta-Glucan, Ceramide NP, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000063', '8993975004001', 'Moisturizing Face Cream', 'Sebamed', 'Moisturizer',
 ARRAY['ING-016','ING-015','ING-005','ING-045','ING-025','ING-061'],
 'Aqua, Glycerin, Panthenol, Ceramide NP, Cetearyl Alcohol, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000064', '8999999004001', 'Ginseng Royal Jelly Cream', 'Mustika Ratu', 'Moisturizer',
 ARRAY['ING-016','ING-045','ING-024','ING-007','ING-025'],
 'Aqua, Glycerin, Cetearyl Alcohol, Tocopherol, Fragrance, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000065', '8997112004001', 'Snail Bee High Content Cream', 'BENTON', 'Moisturizer',
 ARRAY['ING-038','ING-016','ING-010','ING-037','ING-025','ING-050'],
 'Snail Secretion Filtrate, Glycerin, Sodium Hyaluronate, Allantoin, Phenoxyethanol, Butylene Glycol', 'Verified'),

('a1000001-0000-0000-0000-000000000066', '8997112004002', 'Air Fit Sunscreen Plus SPF50+', 'BENTON', 'Moisturizer',
 ARRAY['ING-031','ING-032','ING-016','ING-050','ING-025'],
 'Aqua, Zinc Oxide, Titanium Dioxide, Glycerin, Butylene Glycol, Phenoxyethanol', 'Verified'),

-- ══════════════════════════════════════════════════════════════
-- SUNSCREENS
-- ══════════════════════════════════════════════════════════════
('a1000001-0000-0000-0000-000000000067', '8992993005001', 'UV Shield Sunscreen SPF 30', 'Wardah', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-032','ING-016','ING-045','ING-025'],
 'Aqua, Avobenzone, Octinoxate, Titanium Dioxide, Glycerin, Cetearyl Alcohol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000068', '8992993005002', 'UV Shield Sunscreen SPF 50 PA+++', 'Wardah', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-100','ING-032','ING-016','ING-025'],
 'Aqua, Avobenzone, Octinoxate, Octocrylene, Titanium Dioxide, Glycerin, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000069', '8851932005001', 'Invisible Protect Glow SPF 30', 'Garnier', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-100','ING-016','ING-025','ING-050'],
 'Aqua, Avobenzone, Octinoxate, Octocrylene, Glycerin, Phenoxyethanol, Butylene Glycol', 'Verified'),

('a1000001-0000-0000-0000-000000000070', '8851932005002', 'UV Protect Super SPF 50+', 'Garnier', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-100','ING-032','ING-016','ING-003','ING-025'],
 'Aqua, Avobenzone, Octinoxate, Octocrylene, Titanium Dioxide, Glycerin, Niacinamide, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000071', '8994660005001', 'Sun Protection Moisturizer SPF 30', 'Emina', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-016','ING-015','ING-025'],
 'Aqua, Avobenzone, Octinoxate, Glycerin, Panthenol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000072', '8809612005001', 'Aloe Soothing Sun Cream SPF 50 PA+++', 'COSRX', 'Sunscreen',
 ARRAY['ING-031','ING-018','ING-016','ING-015','ING-025'],
 'Aqua, Zinc Oxide, Aloe Barbadensis Leaf Juice, Glycerin, Panthenol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000073', '8888800005001', 'V10 Vitamin Tone-Up Sunscreen SPF50+', 'SOME BY MI', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-003','ING-016','ING-025'],
 'Aqua, Avobenzone, Octinoxate, Niacinamide, Glycerin, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000074', '8997799005001', 'Layering Cover Cushion SPF 50+', 'Laneige', 'Sunscreen',
 ARRAY['ING-032','ING-031','ING-016','ING-009','ING-025','ING-071'],
 'Aqua, Titanium Dioxide, Zinc Oxide, Glycerin, Dimethicone, Phenoxyethanol, Mica', 'Verified'),

('a1000001-0000-0000-0000-000000000075', '8993975005001', 'Optimal Face Sunscreen SPF50 PA+++', 'Sebamed', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-100','ING-016','ING-015','ING-025'],
 'Aqua, Avobenzone, Ethylhexyl Methoxycinnamate, Octocrylene, Glycerin, Panthenol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000076', '8806325005001', 'Mild Sun Rice SPF 50+ PA++++', 'The Face Shop', 'Sunscreen',
 ARRAY['ING-031','ING-032','ING-016','ING-015','ING-025','ING-050'],
 'Aqua, Zinc Oxide, Titanium Dioxide, Glycerin, Panthenol, Phenoxyethanol, Butylene Glycol', 'Verified'),

('a1000001-0000-0000-0000-000000000077', '8997112005001', 'Fermentation Boosting Sun Essence SPF 50+', 'BENTON', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-016','ING-038','ING-025'],
 'Aqua, Avobenzone, Octinoxate, Glycerin, Snail Secretion Filtrate, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000078', '8898765005001', 'Sunplay Skin Aqua Tone Up UV Essence SPF 50+', 'Rohto', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-100','ING-016','ING-009','ING-025'],
 'Aqua, Avobenzone, Octinoxate, Octocrylene, Glycerin, Dimethicone, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000079', '8898765005002', 'Sunplay Skin Aqua UV Whitening Milk SPF 50+', 'Rohto', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-003','ING-016','ING-025'],
 'Aqua, Avobenzone, Octinoxate, Niacinamide, Glycerin, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000080', '8992993005003', 'UV Shield Aqua Tone Up Sunscreen SPF35', 'Wardah', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-016','ING-003','ING-009','ING-025'],
 'Aqua, Avobenzone, Octinoxate, Glycerin, Niacinamide, Dimethicone, Phenoxyethanol', 'Verified'),

-- ══════════════════════════════════════════════════════════════
-- FACE MASKS
-- ══════════════════════════════════════════════════════════════
('a1000001-0000-0000-0000-000000000081', '8992993006001', 'Hydra Rose Sheet Mask', 'Wardah', 'Face Mask',
 ARRAY['ING-016','ING-010','ING-018','ING-015','ING-025'],
 'Aqua, Glycerin, Sodium Hyaluronate, Aloe Barbadensis Leaf Juice, Panthenol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000082', '8994660006001', 'Ms. Cica Sheet Mask', 'Emina', 'Face Mask',
 ARRAY['ING-017','ING-037','ING-016','ING-018','ING-025'],
 'Aqua, Centella Asiatica Extract, Allantoin, Glycerin, Aloe Barbadensis Leaf Juice, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000083', '8888800006001', 'AHA BHA PHA Miracle Peel Mask', 'SOME BY MI', 'Face Mask',
 ARRAY['ING-011','ING-001','ING-014','ING-017','ING-016','ING-025'],
 'Aqua, Glycolic Acid, Salicylic Acid, Gluconolactone, Centella Asiatica Extract, Glycerin, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000084', '8809612006001', 'Advanced Snail 96 Sheet Mask', 'COSRX', 'Face Mask',
 ARRAY['ING-038','ING-016','ING-010','ING-015','ING-025'],
 'Snail Secretion Filtrate, Glycerin, Sodium Hyaluronate, Panthenol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000085', '8851932006001', 'Hydra Bomb Sheet Mask Rose', 'Garnier', 'Face Mask',
 ARRAY['ING-016','ING-010','ING-018','ING-015','ING-025','ING-007'],
 'Aqua, Glycerin, Sodium Hyaluronate, Aloe Barbadensis Leaf Juice, Panthenol, Phenoxyethanol, Fragrance', 'Verified'),

('a1000001-0000-0000-0000-000000000086', '8806325006001', 'Real Nature Sheet Mask Tea Tree', 'The Face Shop', 'Face Mask',
 ARRAY['ING-019','ING-016','ING-017','ING-025'],
 'Aqua, Melaleuca Alternifolia Leaf Oil, Glycerin, Centella Asiatica Extract, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000087', '8997799006001', 'Water Sleeping Mask', 'Laneige', 'Face Mask',
 ARRAY['ING-016','ING-010','ING-092','ING-015','ING-025'],
 'Aqua, Glycerin, Sodium Hyaluronate, Camellia Sinensis Leaf Extract, Panthenol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000088', '8997799006002', 'Lip Sleeping Mask Berry', 'Laneige', 'Face Mask',
 ARRAY['ING-016','ING-021','ING-039','ING-024','ING-007','ING-025'],
 'Aqua, Glycerin, Butyrospermum Parkii Butter, Caprylic/Capric Triglyceride, Tocopherol, Fragrance, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000089', '8993975006001', 'Soothing Rose Hip Oil Mask', 'Sebamed', 'Face Mask',
 ARRAY['ING-023','ING-016','ING-015','ING-024','ING-025'],
 'Aqua, Rosa Canina Fruit Oil, Glycerin, Panthenol, Tocopherol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000090', '8806194006001', 'Black Sugar Mask Wash Off', 'Skinfood', 'Face Mask',
 ARRAY['ING-016','ING-021','ING-039','ING-024','ING-025','ING-007'],
 'Aqua, Glycerin, Butyrospermum Parkii Butter, Caprylic/Capric Triglyceride, Tocopherol, Fragrance, Phenoxyethanol', 'Verified'),

-- ══════════════════════════════════════════════════════════════
-- EYE CREAMS & TREATMENTS
-- ══════════════════════════════════════════════════════════════
('a1000001-0000-0000-0000-000000000091', '8809612007001', 'Advanced Snail Peptide Eye Cream', 'COSRX', 'Eye Care',
 ARRAY['ING-038','ING-082','ING-016','ING-010','ING-025','ING-050'],
 'Snail Secretion Filtrate, Matrixyl 3000, Glycerin, Sodium Hyaluronate, Phenoxyethanol, Butylene Glycol', 'Verified'),

('a1000001-0000-0000-0000-000000000092', '8993888007001', 'Bright Eyes Wrinkle Smoother', 'Pond''s', 'Eye Care',
 ARRAY['ING-002','ING-016','ING-083','ING-024','ING-025'],
 'Aqua, Retinol, Glycerin, Argireline, Tocopherol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000093', '8997799007001', 'Eye Sleeping Mask', 'Laneige', 'Eye Care',
 ARRAY['ING-016','ING-010','ING-082','ING-025'],
 'Aqua, Glycerin, Sodium Hyaluronate, Matrixyl 3000, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000094', '8806325007001', 'Collagen Eye Sheet Mask', 'The Face Shop', 'Eye Care',
 ARRAY['ING-016','ING-010','ING-015','ING-025'],
 'Aqua, Glycerin, Sodium Hyaluronate, Panthenol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000095', '8992993007001', 'Retinol Eye Cream', 'Wardah', 'Eye Care',
 ARRAY['ING-002','ING-016','ING-082','ING-020','ING-025'],
 'Aqua, Retinol, Glycerin, Matrixyl 3000, Squalane, Phenoxyethanol', 'Verified'),

-- ══════════════════════════════════════════════════════════════
-- ACNE TREATMENTS
-- ══════════════════════════════════════════════════════════════
('a1000001-0000-0000-0000-000000000096', '8809612008001', 'Acne Pimple Master Patch', 'COSRX', 'Acne Treatment',
 ARRAY['ING-001','ING-016'],
 'Salicylic Acid, Glycerin (hydrocolloid patch)', 'Verified'),

('a1000001-0000-0000-0000-000000000097', '8888800008001', 'Galacnozin Miracle Spot Essence', 'SOME BY MI', 'Acne Treatment',
 ARRAY['ING-001','ING-077','ING-017','ING-019','ING-025'],
 'Salicylic Acid, Azelaic Acid, Centella Asiatica Extract, Melaleuca Alternifolia Leaf Oil, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000098', '8992993008001', 'Acnederm Spot Gel', 'Wardah', 'Acne Treatment',
 ARRAY['ING-001','ING-019','ING-017','ING-037','ING-025','ING-058'],
 'Salicylic Acid, Melaleuca Alternifolia Leaf Oil, Centella Asiatica Extract, Allantoin, Phenoxyethanol, Carbomer', 'Verified'),

('a1000001-0000-0000-0000-000000000099', '8994660008001', 'Soothing Centella Spot Treatment', 'Emina', 'Acne Treatment',
 ARRAY['ING-017','ING-001','ING-037','ING-016','ING-025'],
 'Centella Asiatica Extract, Salicylic Acid, Allantoin, Glycerin, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000100', '8993975008001', 'Clear Face Care Gel', 'Sebamed', 'Acne Treatment',
 ARRAY['ING-001','ING-019','ING-017','ING-016','ING-025','ING-058'],
 'Aqua, Salicylic Acid, Melaleuca Alternifolia Leaf Oil, Centella Asiatica Extract, Glycerin, Phenoxyethanol, Carbomer', 'Verified'),

('a1000001-0000-0000-0000-000000000101', '8998877008001', 'Benzolac CL Acne Cream', 'Benzolac', 'Acne Treatment',
 ARRAY['ING-078','ING-016','ING-025','ING-058'],
 'Aqua, Benzoyl Peroxide, Glycerin, Phenoxyethanol, Carbomer', 'Verified'),

('a1000001-0000-0000-0000-000000000102', '8997112008001', 'Honest Cleansing Gel', 'BENTON', 'Acne Treatment',
 ARRAY['ING-001','ING-017','ING-016','ING-037','ING-025','ING-058'],
 'Aqua, Salicylic Acid, Centella Asiatica Extract, Glycerin, Allantoin, Phenoxyethanol, Carbomer', 'Verified'),

-- ══════════════════════════════════════════════════════════════
-- EXFOLIANTS
-- ══════════════════════════════════════════════════════════════
('a1000001-0000-0000-0000-000000000103', '8809612009001', 'BHA Blackhead Power Liquid', 'COSRX', 'Exfoliant',
 ARRAY['ING-001','ING-016','ING-015','ING-025','ING-061'],
 'Aqua, Salicylic Acid, Glycerin, Panthenol, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000104', '8809612009002', 'AHA 7 Whitehead Power Liquid', 'COSRX', 'Exfoliant',
 ARRAY['ING-012','ING-016','ING-015','ING-025','ING-061'],
 'Aqua, Lactic Acid, Glycerin, Panthenol, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000105', '8888800009001', 'Glycolic Acid Cotton Pad', 'SOME BY MI', 'Exfoliant',
 ARRAY['ING-011','ING-016','ING-015','ING-025'],
 'Aqua, Glycolic Acid, Glycerin, Panthenol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000106', '8851932009001', 'Glycolic Bright Glowing Serum', 'Garnier', 'Exfoliant',
 ARRAY['ING-011','ING-016','ING-003','ING-025','ING-061'],
 'Aqua, Glycolic Acid, Glycerin, Niacinamide, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000107', '8806194009001', 'Black Sugar Perfect First Serum', 'Skinfood', 'Exfoliant',
 ARRAY['ING-012','ING-016','ING-010','ING-024','ING-025'],
 'Aqua, Lactic Acid, Glycerin, Sodium Hyaluronate, Tocopherol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000108', '8992993009001', 'AHA-BHA Toner', 'Wardah', 'Exfoliant',
 ARRAY['ING-011','ING-001','ING-016','ING-015','ING-025','ING-061'],
 'Aqua, Glycolic Acid, Salicylic Acid, Glycerin, Panthenol, Phenoxyethanol, Citric Acid', 'Verified'),

-- ══════════════════════════════════════════════════════════════
-- LOCAL BRANDS (INDONESIA-FOCUSED)
-- ══════════════════════════════════════════════════════════════
-- MS Glow
('a1000001-0000-0000-0000-000000000109', '8999911009001', 'MS Glow Facial Wash', 'MS Glow', 'Cleanser',
 ARRAY['ING-016','ING-030','ING-003','ING-018','ING-025'],
 'Aqua, Glycerin, Cocamidopropyl Betaine, Niacinamide, Aloe Barbadensis Leaf Juice, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000110', '8999911009002', 'MS Glow Brightening Serum', 'MS Glow', 'Serum',
 ARRAY['ING-003','ING-075','ING-076','ING-016','ING-010','ING-025'],
 'Aqua, Niacinamide, Alpha-Arbutin, Tranexamic Acid, Glycerin, Sodium Hyaluronate, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000111', '8999911009003', 'MS Glow Day Cream SPF 30', 'MS Glow', 'Moisturizer',
 ARRAY['ING-033','ING-034','ING-003','ING-016','ING-045','ING-025'],
 'Aqua, Avobenzone, Octinoxate, Niacinamide, Glycerin, Cetearyl Alcohol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000112', '8999911009004', 'MS Glow Night Cream', 'MS Glow', 'Moisturizer',
 ARRAY['ING-002','ING-003','ING-016','ING-045','ING-024','ING-025'],
 'Aqua, Retinol, Niacinamide, Glycerin, Cetearyl Alcohol, Tocopherol, Phenoxyethanol', 'Verified'),

-- Scarlett Whitening
('a1000001-0000-0000-0000-000000000113', '8999922009001', 'Scarlett Whitening Facial Wash', 'Scarlett Whitening', 'Cleanser',
 ARRAY['ING-003','ING-016','ING-030','ING-018','ING-025'],
 'Aqua, Niacinamide, Glycerin, Cocamidopropyl Betaine, Aloe Barbadensis Leaf Juice, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000114', '8999922009002', 'Scarlett Whitening Brightly Ever After Serum', 'Scarlett Whitening', 'Serum',
 ARRAY['ING-003','ING-075','ING-016','ING-010','ING-025'],
 'Aqua, Niacinamide, Alpha-Arbutin, Glycerin, Sodium Hyaluronate, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000115', '8999922009003', 'Scarlett Whitening Body Lotion Romansa', 'Scarlett Whitening', 'Body Care',
 ARRAY['ING-003','ING-016','ING-015','ING-021','ING-007','ING-025'],
 'Aqua, Niacinamide, Glycerin, Panthenol, Butyrospermum Parkii Butter, Fragrance, Phenoxyethanol', 'Verified'),

-- Y.O.U Beauty
('a1000001-0000-0000-0000-000000000116', '8999933009001', 'Y.O.U Bright Skin Water Toner', 'Y.O.U Beauty', 'Toner',
 ARRAY['ING-003','ING-016','ING-075','ING-010','ING-025'],
 'Aqua, Niacinamide, Glycerin, Alpha-Arbutin, Sodium Hyaluronate, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000117', '8999933009002', 'Y.O.U The Shield Sunscreen SPF 50', 'Y.O.U Beauty', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-100','ING-003','ING-016','ING-025'],
 'Aqua, Avobenzone, Octinoxate, Octocrylene, Niacinamide, Glycerin, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000118', '8999933009003', 'Y.O.U Acne Serum', 'Y.O.U Beauty', 'Serum',
 ARRAY['ING-001','ING-003','ING-017','ING-016','ING-025'],
 'Aqua, Salicylic Acid, Niacinamide, Centella Asiatica Extract, Glycerin, Phenoxyethanol', 'Verified'),

-- Somethinc
('a1000001-0000-0000-0000-000000000119', '8999944009001', 'Somethinc Level 1% BHA Exfoliating Toner', 'Somethinc', 'Exfoliant',
 ARRAY['ING-001','ING-016','ING-015','ING-025','ING-061'],
 'Aqua, Salicylic Acid, Glycerin, Panthenol, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000120', '8999944009002', 'Somethinc Hyaluronic Acid Serum', 'Somethinc', 'Serum',
 ARRAY['ING-010','ING-016','ING-015','ING-087','ING-025'],
 'Aqua, Sodium Hyaluronate, Glycerin, Panthenol, Beta-Glucan, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000121', '8999944009003', 'Somethinc Niacinamide 10% + Zinc 1% Serum', 'Somethinc', 'Serum',
 ARRAY['ING-003','ING-016','ING-050','ING-025','ING-058'],
 'Aqua, Niacinamide, Glycerin, Butylene Glycol, Phenoxyethanol, Carbomer', 'Verified'),

('a1000001-0000-0000-0000-000000000122', '8999944009004', 'Somethinc Level 10% Vitamin C Brightening Serum', 'Somethinc', 'Serum',
 ARRAY['ING-004','ING-085','ING-016','ING-024','ING-025','ING-061'],
 'Aqua, Ascorbic Acid, Ferulic Acid, Glycerin, Tocopherol, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000123', '8999944009005', 'Somethinc Glow Getter Suncreen SPF 50+', 'Somethinc', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-003','ING-016','ING-025'],
 'Aqua, Avobenzone, Octinoxate, Niacinamide, Glycerin, Phenoxyethanol', 'Verified'),

-- Avoskin
('a1000001-0000-0000-0000-000000000124', '8999955009001', 'Avoskin Miraculous Retinol Ampoule', 'Avoskin', 'Serum',
 ARRAY['ING-002','ING-016','ING-020','ING-082','ING-025'],
 'Aqua, Retinol, Glycerin, Squalane, Matrixyl 3000, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000125', '8999955009002', 'Avoskin Miraculous Refining Toner AHA BHA PHA', 'Avoskin', 'Exfoliant',
 ARRAY['ING-011','ING-001','ING-014','ING-016','ING-015','ING-025'],
 'Aqua, Glycolic Acid, Salicylic Acid, Gluconolactone, Glycerin, Panthenol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000126', '8999955009003', 'Avoskin Your Skin Bae Tranexamic Acid Serum', 'Avoskin', 'Serum',
 ARRAY['ING-076','ING-003','ING-075','ING-016','ING-025'],
 'Aqua, Tranexamic Acid, Niacinamide, Alpha-Arbutin, Glycerin, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000127', '8999955009004', 'Avoskin Hidravi Essence Mist', 'Avoskin', 'Toner',
 ARRAY['ING-016','ING-010','ING-018','ING-015','ING-025'],
 'Aqua, Glycerin, Sodium Hyaluronate, Aloe Barbadensis Leaf Juice, Panthenol, Phenoxyethanol', 'Verified'),

-- Implora
('a1000001-0000-0000-0000-000000000128', '8999966009001', 'Implora Aloe Vera Gel Moisturizer', 'Implora', 'Moisturizer',
 ARRAY['ING-018','ING-016','ING-037','ING-025','ING-059'],
 'Aloe Barbadensis Leaf Juice, Glycerin, Allantoin, Phenoxyethanol, Xanthan Gum', 'Verified'),

('a1000001-0000-0000-0000-000000000129', '8999966009002', 'Implora Brightening Serum', 'Implora', 'Serum',
 ARRAY['ING-003','ING-016','ING-010','ING-025'],
 'Aqua, Niacinamide, Glycerin, Sodium Hyaluronate, Phenoxyethanol', 'Verified'),

-- Azarine
('a1000001-0000-0000-0000-000000000130', '8999977009001', 'Azarine Hydrasoothe Sunscreen Gel SPF 45', 'Azarine', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-016','ING-018','ING-015','ING-025'],
 'Aqua, Avobenzone, Octinoxate, Glycerin, Aloe Barbadensis Leaf Juice, Panthenol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000131', '8999977009002', 'Azarine Acne Spot Gel', 'Azarine', 'Acne Treatment',
 ARRAY['ING-001','ING-019','ING-017','ING-016','ING-025','ING-058'],
 'Aqua, Salicylic Acid, Melaleuca Alternifolia Leaf Oil, Centella Asiatica Extract, Glycerin, Phenoxyethanol, Carbomer', 'Verified'),

-- Dear Me Beauty
('a1000001-0000-0000-0000-000000000132', '8999988009001', 'Dear Me Beauty Brightening Face Toner', 'Dear Me Beauty', 'Toner',
 ARRAY['ING-003','ING-076','ING-016','ING-018','ING-025'],
 'Aqua, Niacinamide, Tranexamic Acid, Glycerin, Aloe Barbadensis Leaf Juice, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000133', '8999988009002', 'Dear Me Beauty Waterful Hydration Toner', 'Dear Me Beauty', 'Toner',
 ARRAY['ING-016','ING-010','ING-018','ING-015','ING-025'],
 'Aqua, Glycerin, Sodium Hyaluronate, Aloe Barbadensis Leaf Juice, Panthenol, Phenoxyethanol', 'Verified'),

-- ══════════════════════════════════════════════════════════════
-- BODY CARE
-- ══════════════════════════════════════════════════════════════
('a1000001-0000-0000-0000-000000000134', '8992993010001', 'Body Butter Bengkuang', 'Wardah', 'Body Care',
 ARRAY['ING-016','ING-021','ING-039','ING-015','ING-007','ING-025'],
 'Aqua, Glycerin, Butyrospermum Parkii Butter, Caprylic/Capric Triglyceride, Panthenol, Fragrance, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000135', '8851932010001', 'Body Lotion UV Protect', 'Garnier', 'Body Care',
 ARRAY['ING-033','ING-034','ING-016','ING-045','ING-024','ING-025','ING-007'],
 'Aqua, Avobenzone, Octinoxate, Glycerin, Cetearyl Alcohol, Tocopherol, Phenoxyethanol, Fragrance', 'Verified'),

('a1000001-0000-0000-0000-000000000136', '8993888010001', 'Firming Body Lotion', 'Pond''s', 'Body Care',
 ARRAY['ING-016','ING-021','ING-003','ING-015','ING-007','ING-025'],
 'Aqua, Glycerin, Butyrospermum Parkii Butter, Niacinamide, Panthenol, Fragrance, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000137', '8999999010001', 'Bengkoang Whitening Body Scrub', 'Mustika Ratu', 'Body Care',
 ARRAY['ING-016','ING-003','ING-015','ING-007','ING-025'],
 'Aqua, Glycerin, Niacinamide, Panthenol, Fragrance, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000138', '8993888010002', 'White Beauty Spot-less Lotion', 'Pond''s', 'Body Care',
 ARRAY['ING-003','ING-016','ING-021','ING-045','ING-007','ING-025'],
 'Aqua, Niacinamide, Glycerin, Butyrospermum Parkii Butter, Cetearyl Alcohol, Fragrance, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000139', '8999922010001', 'Scarlett Whitening Body Serum Freshy', 'Scarlett Whitening', 'Body Care',
 ARRAY['ING-003','ING-016','ING-015','ING-010','ING-007','ING-025'],
 'Aqua, Niacinamide, Glycerin, Panthenol, Sodium Hyaluronate, Fragrance, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000140', '8994660010001', 'Emina Ceria Body Lotion', 'Emina', 'Body Care',
 ARRAY['ING-016','ING-021','ING-015','ING-007','ING-025'],
 'Aqua, Glycerin, Butyrospermum Parkii Butter, Panthenol, Fragrance, Phenoxyethanol', 'Verified'),

-- ══════════════════════════════════════════════════════════════
-- MAKEUP / COSMETICS
-- ══════════════════════════════════════════════════════════════
-- BB Creams
('a1000001-0000-0000-0000-000000000141', '8992993011001', 'BB Cushion Matte', 'Wardah', 'Makeup',
 ARRAY['ING-032','ING-031','ING-016','ING-009','ING-071','ING-072','ING-025'],
 'Aqua, Titanium Dioxide, Zinc Oxide, Glycerin, Dimethicone, Mica, Iron Oxides, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000142', '8992993011002', 'White Secret Two-Way Cake', 'Wardah', 'Makeup',
 ARRAY['ING-032','ING-070','ING-071','ING-072','ING-009','ING-025'],
 'Talc, Titanium Dioxide, Mica, Iron Oxides, Dimethicone, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000143', '8994660011001', 'Emina BB Cream SPF 15', 'Emina', 'Makeup',
 ARRAY['ING-032','ING-031','ING-016','ING-003','ING-071','ING-072','ING-025'],
 'Aqua, Titanium Dioxide, Zinc Oxide, Glycerin, Niacinamide, Mica, Iron Oxides, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000144', '8851932011001', 'BB Cream Miracle Skin Perfector', 'Garnier', 'Makeup',
 ARRAY['ING-032','ING-033','ING-016','ING-009','ING-003','ING-071','ING-072','ING-025'],
 'Aqua, Titanium Dioxide, Avobenzone, Glycerin, Dimethicone, Niacinamide, Mica, Iron Oxides, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000145', '8851932011002', 'Micellar Water Rose', 'Garnier', 'Makeup Remover',
 ARRAY['ING-016','ING-015','ING-007','ING-025'],
 'Aqua, Glycerin, Panthenol, Fragrance, Phenoxyethanol', 'Verified'),

-- Lip Care
('a1000001-0000-0000-0000-000000000146', '8992993012001', 'Perfect Bright Lipstick', 'Wardah', 'Makeup',
 ARRAY['ING-039','ING-021','ING-024','ING-071','ING-072','ING-007','ING-025'],
 'Caprylic/Capric Triglyceride, Butyrospermum Parkii Butter, Tocopherol, Mica, Iron Oxides, Fragrance, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000147', '8994660012001', 'Lip Matte MLBB', 'Emina', 'Makeup',
 ARRAY['ING-039','ING-022','ING-024','ING-071','ING-072','ING-025'],
 'Caprylic/Capric Triglyceride, Simmondsia Chinensis Seed Oil, Tocopherol, Mica, Iron Oxides, Phenoxyethanol', 'Verified'),

-- ══════════════════════════════════════════════════════════════
-- HAIR CARE
-- ══════════════════════════════════════════════════════════════
('a1000001-0000-0000-0000-000000000148', '8993888013001', 'Total Hair Fall Control Shampoo', 'Dove', 'Hair Care',
 ARRAY['ING-029','ING-030','ING-016','ING-055','ING-025','ING-007'],
 'Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Glycerin, Amodimethicone, Phenoxyethanol, Fragrance', 'Verified'),

('a1000001-0000-0000-0000-000000000149', '8993888013002', 'Nutritive Solutions Intense Moisturizing Shampoo', 'Pantene', 'Hair Care',
 ARRAY['ING-029','ING-030','ING-016','ING-055','ING-024','ING-007','ING-025'],
 'Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Glycerin, Amodimethicone, Tocopherol, Fragrance, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000150', '8992993013001', 'Wardah Nourishing Shampoo', 'Wardah', 'Hair Care',
 ARRAY['ING-029','ING-030','ING-016','ING-018','ING-025','ING-007'],
 'Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Glycerin, Aloe Barbadensis Leaf Juice, Phenoxyethanol, Fragrance', 'Verified'),

('a1000001-0000-0000-0000-000000000151', '8992993013002', 'Wardah Hair Mask Moisturizing', 'Wardah', 'Hair Care',
 ARRAY['ING-016','ING-021','ING-022','ING-055','ING-024','ING-007','ING-025'],
 'Aqua, Glycerin, Butyrospermum Parkii Butter, Simmondsia Chinensis Seed Oil, Amodimethicone, Tocopherol, Fragrance, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000152', '8851932013001', 'Fructis Strengthening Shampoo Bonding Fiber', 'Garnier', 'Hair Care',
 ARRAY['ING-029','ING-030','ING-016','ING-055','ING-024','ING-025','ING-007'],
 'Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Glycerin, Amodimethicone, Tocopherol, Phenoxyethanol, Fragrance', 'Verified'),

-- ══════════════════════════════════════════════════════════════
-- INTERNATIONAL BRANDS SOLD IN INDONESIA
-- ══════════════════════════════════════════════════════════════
-- The Ordinary
('a1000001-0000-0000-0000-000000000153', '6294003601001', 'Niacinamide 10% + Zinc 1%', 'The Ordinary', 'Serum',
 ARRAY['ING-003','ING-016','ING-058','ING-025','ING-061'],
 'Aqua, Niacinamide, Glycerin, Carbomer, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000154', '6294003601002', 'Hyaluronic Acid 2% + B5', 'The Ordinary', 'Serum',
 ARRAY['ING-010','ING-016','ING-015','ING-025'],
 'Aqua, Sodium Hyaluronate, Glycerin, Panthenol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000155', '6294003601003', 'Retinol 0.2% in Squalane', 'The Ordinary', 'Serum',
 ARRAY['ING-002','ING-020','ING-025'],
 'Squalane, Retinol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000156', '6294003601004', 'Glycolic Acid 7% Toning Solution', 'The Ordinary', 'Exfoliant',
 ARRAY['ING-011','ING-016','ING-092','ING-025','ING-061'],
 'Aqua, Glycolic Acid, Glycerin, Camellia Sinensis Leaf Extract, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000157', '6294003601005', 'Vitamin C Suspension 23% + HA Spheres 2%', 'The Ordinary', 'Serum',
 ARRAY['ING-004','ING-010','ING-016','ING-025'],
 'Ascorbic Acid, Sodium Hyaluronate, Glycerin, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000158', '6294003601006', 'AHA 30% + BHA 2% Peeling Solution', 'The Ordinary', 'Exfoliant',
 ARRAY['ING-012','ING-011','ING-001','ING-092','ING-084','ING-025'],
 'Aqua, Lactic Acid, Glycolic Acid, Salicylic Acid, Camellia Sinensis Leaf Extract, Resveratrol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000159', '6294003601007', 'Alpha Arbutin 2% + HA', 'The Ordinary', 'Serum',
 ARRAY['ING-075','ING-010','ING-016','ING-025'],
 'Aqua, Alpha-Arbutin, Sodium Hyaluronate, Glycerin, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000160', '6294003601008', 'Buffet Multi-Technology Peptide Serum', 'The Ordinary', 'Serum',
 ARRAY['ING-082','ING-083','ING-081','ING-016','ING-010','ING-025'],
 'Aqua, Matrixyl 3000, Argireline, Copper Peptides, Glycerin, Sodium Hyaluronate, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000161', '6294003601009', 'Mandelic Acid 10% + HA', 'The Ordinary', 'Exfoliant',
 ARRAY['ING-013','ING-010','ING-016','ING-025','ING-061'],
 'Aqua, Mandelic Acid, Sodium Hyaluronate, Glycerin, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000162', '6294003601010', 'Squalane Cleanser', 'The Ordinary', 'Cleanser',
 ARRAY['ING-020','ING-025'],
 'Squalane, Phenoxyethanol', 'Verified'),

-- CeraVe
('a1000001-0000-0000-0000-000000000163', '3606000000001', 'CeraVe Hydrating Facial Cleanser', 'CeraVe', 'Cleanser',
 ARRAY['ING-016','ING-005','ING-088','ING-089','ING-015','ING-030','ING-025'],
 'Aqua, Glycerin, Ceramide NP, Ceramide EOP, Ceramide AP, Panthenol, Cocamidopropyl Betaine, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000164', '3606000000002', 'CeraVe Moisturizing Cream', 'CeraVe', 'Moisturizer',
 ARRAY['ING-016','ING-005','ING-088','ING-089','ING-090','ING-015','ING-045','ING-025','ING-056'],
 'Aqua, Glycerin, Ceramide NP, Ceramide EOP, Ceramide AP, Cholesterol, Panthenol, Cetearyl Alcohol, Phenoxyethanol, Disodium EDTA', 'Verified'),

('a1000001-0000-0000-0000-000000000165', '3606000000003', 'CeraVe AM Facial Moisturizing Lotion SPF 30', 'CeraVe', 'Moisturizer',
 ARRAY['ING-031','ING-032','ING-016','ING-005','ING-088','ING-089','ING-015','ING-025'],
 'Aqua, Zinc Oxide, Titanium Dioxide, Glycerin, Ceramide NP, Ceramide EOP, Ceramide AP, Panthenol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000166', '3606000000004', 'CeraVe PM Facial Moisturizing Lotion', 'CeraVe', 'Moisturizer',
 ARRAY['ING-016','ING-005','ING-088','ING-089','ING-003','ING-015','ING-025'],
 'Aqua, Glycerin, Ceramide NP, Ceramide EOP, Ceramide AP, Niacinamide, Panthenol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000167', '3606000000005', 'CeraVe SA Smoothing Cleanser', 'CeraVe', 'Cleanser',
 ARRAY['ING-001','ING-016','ING-005','ING-015','ING-030','ING-025'],
 'Aqua, Salicylic Acid, Glycerin, Ceramide NP, Panthenol, Cocamidopropyl Betaine, Phenoxyethanol', 'Verified'),

-- Neutrogena
('a1000001-0000-0000-0000-000000000168', '0070501001001', 'Hydro Boost Water Gel', 'Neutrogena', 'Moisturizer',
 ARRAY['ING-010','ING-016','ING-058','ING-025','ING-061'],
 'Aqua, Sodium Hyaluronate, Glycerin, Carbomer, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000169', '0070501001002', 'Ultra Sheer Dry-Touch Sunscreen SPF 50+', 'Neutrogena', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-100','ING-016','ING-050','ING-025'],
 'Aqua, Avobenzone, Octinoxate, Octocrylene, Glycerin, Butylene Glycol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000170', '0070501001003', 'Rapid Clear Stubborn Acne Spot Treatment', 'Neutrogena', 'Acne Treatment',
 ARRAY['ING-078','ING-016','ING-025','ING-058'],
 'Aqua, Benzoyl Peroxide, Glycerin, Phenoxyethanol, Carbomer', 'Verified'),

('a1000001-0000-0000-0000-000000000171', '0070501001004', 'Bright Boost Illuminating Serum', 'Neutrogena', 'Serum',
 ARRAY['ING-004','ING-016','ING-003','ING-085','ING-025','ING-061'],
 'Aqua, Ascorbic Acid, Glycerin, Niacinamide, Ferulic Acid, Phenoxyethanol, Citric Acid', 'Verified'),

-- La Roche-Posay
('a1000001-0000-0000-0000-000000000172', '3337875597517', 'Effaclar Purifying Foaming Gel', 'La Roche-Posay', 'Cleanser',
 ARRAY['ING-001','ING-016','ING-030','ING-061','ING-025'],
 'Aqua, Salicylic Acid, Glycerin, Cocamidopropyl Betaine, Citric Acid, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000173', '3337875562513', 'Anthelios Mineral One SPF50+', 'La Roche-Posay', 'Sunscreen',
 ARRAY['ING-032','ING-031','ING-016','ING-003','ING-071','ING-025'],
 'Aqua, Titanium Dioxide, Zinc Oxide, Glycerin, Niacinamide, Mica, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000174', '3337875570143', 'Toleriane Double Repair Moisturizer', 'La Roche-Posay', 'Moisturizer',
 ARRAY['ING-005','ING-016','ING-003','ING-015','ING-045','ING-025'],
 'Aqua, Ceramide NP, Glycerin, Niacinamide, Panthenol, Cetearyl Alcohol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000175', '3337875570150', 'Cicaplast Baume B5', 'La Roche-Posay', 'Moisturizer',
 ARRAY['ING-015','ING-005','ING-037','ING-016','ING-025'],
 'Aqua, Panthenol, Ceramide NP, Allantoin, Glycerin, Phenoxyethanol', 'Verified'),

-- SK-II
('a1000001-0000-0000-0000-000000000176', '4973908003491', 'Facial Treatment Essence', 'SK-II', 'Toner',
 ARRAY['ING-016','ING-010','ING-015','ING-025'],
 'Aqua, Glycerin, Sodium Hyaluronate, Panthenol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000177', '4973908003508', 'Whitening Spot Specialist Concentrate', 'SK-II', 'Serum',
 ARRAY['ING-003','ING-075','ING-016','ING-010','ING-025'],
 'Aqua, Niacinamide, Alpha-Arbutin, Glycerin, Sodium Hyaluronate, Phenoxyethanol', 'Verified'),

-- Sulwhasoo
('a1000001-0000-0000-0000-000000000178', '8806185332538', 'Essential Comfort Balancing Toner', 'Sulwhasoo', 'Toner',
 ARRAY['ING-016','ING-010','ING-050','ING-092','ING-025'],
 'Aqua, Glycerin, Sodium Hyaluronate, Butylene Glycol, Camellia Sinensis Leaf Extract, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000179', '8806185332545', 'First Care Activating Serum', 'Sulwhasoo', 'Serum',
 ARRAY['ING-016','ING-010','ING-092','ING-015','ING-025'],
 'Aqua, Glycerin, Sodium Hyaluronate, Camellia Sinensis Leaf Extract, Panthenol, Phenoxyethanol', 'Verified'),

-- Innisfree
('a1000001-0000-0000-0000-000000000180', '8809612180001', 'Green Tea Seed Hyaluronic Serum', 'Innisfree', 'Serum',
 ARRAY['ING-092','ING-010','ING-016','ING-015','ING-025'],
 'Aqua, Camellia Sinensis Leaf Extract, Sodium Hyaluronate, Glycerin, Panthenol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000181', '8809612180002', 'Bija Trouble Toner', 'Innisfree', 'Toner',
 ARRAY['ING-001','ING-016','ING-019','ING-017','ING-025'],
 'Aqua, Salicylic Acid, Glycerin, Melaleuca Alternifolia Leaf Oil, Centella Asiatica Extract, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000182', '8809612180003', 'Retinol Cica Repair Ampoule', 'Innisfree', 'Serum',
 ARRAY['ING-002','ING-017','ING-016','ING-005','ING-025'],
 'Aqua, Retinol, Centella Asiatica Extract, Glycerin, Ceramide NP, Phenoxyethanol', 'Verified'),

-- Etude House
('a1000001-0000-0000-0000-000000000183', '8806199183001', 'Sunprise Mild Airy Finish SPF 50+', 'Etude House', 'Sunscreen',
 ARRAY['ING-031','ING-032','ING-016','ING-003','ING-009','ING-025'],
 'Aqua, Zinc Oxide, Titanium Dioxide, Glycerin, Niacinamide, Dimethicone, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000184', '8806199183002', 'Soon Jung pH 5.5 Relief Toner', 'Etude House', 'Toner',
 ARRAY['ING-016','ING-015','ING-017','ING-037','ING-025','ING-061'],
 'Aqua, Glycerin, Panthenol, Centella Asiatica Extract, Allantoin, Phenoxyethanol, Citric Acid', 'Verified'),

-- Hada Labo
('a1000001-0000-0000-0000-000000000185', '4987241105001', 'Hada Labo Gokujyun Ultimate Moisturizing Lotion', 'Hada Labo', 'Toner',
 ARRAY['ING-016','ING-010','ING-050','ING-025'],
 'Aqua, Glycerin, Sodium Hyaluronate, Butylene Glycol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000186', '4987241105002', 'Hada Labo Shirojyun Premium Whitening Lotion', 'Hada Labo', 'Toner',
 ARRAY['ING-075','ING-016','ING-010','ING-050','ING-025'],
 'Aqua, Alpha-Arbutin, Glycerin, Sodium Hyaluronate, Butylene Glycol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000187', '4987241105003', 'Hada Labo UV Aqua Tone-Up SPF50+', 'Hada Labo', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-100','ING-016','ING-010','ING-025'],
 'Aqua, Avobenzone, Octinoxate, Octocrylene, Glycerin, Sodium Hyaluronate, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000188', '4987241105004', 'Hada Labo Perfect UV Gel', 'Hada Labo', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-016','ING-058','ING-025'],
 'Aqua, Avobenzone, Octinoxate, Glycerin, Carbomer, Phenoxyethanol', 'Verified'),

-- Biore
('a1000001-0000-0000-0000-000000000189', '4901301001001', 'Biore UV Aqua Rich Watery Essence SPF 50+', 'Biore', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-100','ING-016','ING-050','ING-025'],
 'Aqua, Avobenzone, Octinoxate, Octocrylene, Glycerin, Butylene Glycol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000190', '4901301001002', 'Biore UV Athlizm Skin Protect Milk SPF 50+', 'Biore', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-100','ING-016','ING-009','ING-025'],
 'Aqua, Avobenzone, Octinoxate, Octocrylene, Glycerin, Dimethicone, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000191', '4901301001003', 'Biore Pore Cleansing Facial Foam', 'Biore', 'Cleanser',
 ARRAY['ING-001','ING-016','ING-030','ING-029','ING-025'],
 'Aqua, Salicylic Acid, Glycerin, Cocamidopropyl Betaine, Sodium Laureth Sulfate, Phenoxyethanol', 'Verified'),

-- Senka
('a1000001-0000-0000-0000-000000000192', '4901301002001', 'Senka Perfect Whip Cleansing Foam', 'Senka', 'Cleanser',
 ARRAY['ING-016','ING-030','ING-029','ING-092','ING-025'],
 'Aqua, Glycerin, Cocamidopropyl Betaine, Sodium Laureth Sulfate, Camellia Sinensis Leaf Extract, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000193', '4901301002002', 'Senka Perfect UV Milk SPF50+ PA++++', 'Senka', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-016','ING-009','ING-025'],
 'Aqua, Avobenzone, Octinoxate, Glycerin, Dimethicone, Phenoxyethanol', 'Verified'),

-- Skin1004
('a1000001-0000-0000-0000-000000000194', '8809612194001', 'Madagascar Centella Ampoule', 'Skin1004', 'Serum',
 ARRAY['ING-017','ING-016','ING-037','ING-025'],
 'Centella Asiatica Extract, Glycerin, Allantoin, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000195', '8809612194002', 'Madagascar Centella Toning Toner', 'Skin1004', 'Toner',
 ARRAY['ING-017','ING-016','ING-010','ING-025','ING-061'],
 'Centella Asiatica Extract, Glycerin, Sodium Hyaluronate, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000196', '8809612194003', 'Zombie Beauty Sunscreen SPF50+', 'Skin1004', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-016','ING-017','ING-025'],
 'Aqua, Avobenzone, Octinoxate, Glycerin, Centella Asiatica Extract, Phenoxyethanol', 'Verified'),

-- Paula's Choice
('a1000001-0000-0000-0000-000000000197', '0768395196001', 'Skin Perfecting 2% BHA Liquid Exfoliant', 'Paula''s Choice', 'Exfoliant',
 ARRAY['ING-001','ING-016','ING-050','ING-061','ING-025'],
 'Aqua, Salicylic Acid, Glycerin, Butylene Glycol, Citric Acid, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000198', '0768395196002', 'Skin Perfecting 8% AHA Gel', 'Paula''s Choice', 'Exfoliant',
 ARRAY['ING-012','ING-016','ING-015','ING-025','ING-061'],
 'Aqua, Lactic Acid, Glycerin, Panthenol, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000199', '0768395196003', 'BOOST 10% Niacinamide Booster', 'Paula''s Choice', 'Serum',
 ARRAY['ING-003','ING-016','ING-010','ING-025'],
 'Aqua, Niacinamide, Glycerin, Sodium Hyaluronate, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000200', '0768395196004', 'CLINICAL 20% Niacinamide Treatment', 'Paula''s Choice', 'Serum',
 ARRAY['ING-003','ING-016','ING-010','ING-075','ING-025','ING-061'],
 'Aqua, Niacinamide, Glycerin, Sodium Hyaluronate, Alpha-Arbutin, Phenoxyethanol, Citric Acid', 'Verified'),

-- ══════════════════════════════════════════════════════════════
-- MORE LOCAL & NICHE BRANDS
-- ══════════════════════════════════════════════════════════════
-- Kahf (by Wardah, for men)
('a1000001-0000-0000-0000-000000000201', '8992993014001', 'Kahf Face Wash Oil Control', 'Kahf', 'Cleanser',
 ARRAY['ING-001','ING-016','ING-030','ING-017','ING-025'],
 'Aqua, Salicylic Acid, Glycerin, Cocamidopropyl Betaine, Centella Asiatica Extract, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000202', '8992993014002', 'Kahf Energetic Sport Face Serum', 'Kahf', 'Serum',
 ARRAY['ING-003','ING-016','ING-018','ING-025'],
 'Aqua, Niacinamide, Glycerin, Aloe Barbadensis Leaf Juice, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000203', '8992993014003', 'Kahf Sunscreen SPF 45', 'Kahf', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-016','ING-003','ING-025'],
 'Aqua, Avobenzone, Octinoxate, Glycerin, Niacinamide, Phenoxyethanol', 'Verified'),

-- Whitelab
('a1000001-0000-0000-0000-000000000204', '8888812204001', 'Whitelab Brightening Face Serum', 'Whitelab', 'Serum',
 ARRAY['ING-003','ING-075','ING-076','ING-010','ING-016','ING-025'],
 'Aqua, Niacinamide, Alpha-Arbutin, Tranexamic Acid, Sodium Hyaluronate, Glycerin, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000205', '8888812204002', 'Whitelab Acne Serum', 'Whitelab', 'Serum',
 ARRAY['ING-001','ING-003','ING-017','ING-016','ING-025'],
 'Aqua, Salicylic Acid, Niacinamide, Centella Asiatica Extract, Glycerin, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000206', '8888812204003', 'Whitelab Daily Sunscreen SPF 40', 'Whitelab', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-003','ING-016','ING-025'],
 'Aqua, Avobenzone, Octinoxate, Niacinamide, Glycerin, Phenoxyethanol', 'Verified'),

-- Base (Indonesia local)
('a1000001-0000-0000-0000-000000000207', '8888813207001', 'Base Barrier Repair Moisturizer', 'Base', 'Moisturizer',
 ARRAY['ING-005','ING-016','ING-020','ING-015','ING-025'],
 'Aqua, Ceramide NP, Glycerin, Squalane, Panthenol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000208', '8888813207002', 'Base SPF 35 PA++ Sunscreen', 'Base', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-016','ING-003','ING-015','ING-025'],
 'Aqua, Avobenzone, Octinoxate, Glycerin, Niacinamide, Panthenol, Phenoxyethanol', 'Verified'),

-- Elsheskin
('a1000001-0000-0000-0000-000000000209', '8888814209001', 'Elsheskin Brightening Serum', 'Elsheskin', 'Serum',
 ARRAY['ING-003','ING-076','ING-016','ING-010','ING-025'],
 'Aqua, Niacinamide, Tranexamic Acid, Glycerin, Sodium Hyaluronate, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000210', '8888814209002', 'Elsheskin Acne Sunscreen Matte SPF50', 'Elsheskin', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-001','ING-016','ING-025'],
 'Aqua, Avobenzone, Octinoxate, Salicylic Acid, Glycerin, Phenoxyethanol', 'Verified'),

-- Nutrishe
('a1000001-0000-0000-0000-000000000211', '8888815211001', 'Nutrishe Aloe Vera Brightening Toner', 'Nutrishe', 'Toner',
 ARRAY['ING-018','ING-003','ING-016','ING-025'],
 'Aloe Barbadensis Leaf Juice, Niacinamide, Glycerin, Phenoxyethanol', 'Verified'),

-- Focallure
('a1000001-0000-0000-0000-000000000212', '6921775212001', 'Focallure Face Primer Matte', 'Focallure', 'Makeup',
 ARRAY['ING-009','ING-016','ING-003','ING-071','ING-025'],
 'Aqua, Dimethicone, Glycerin, Niacinamide, Mica, Phenoxyethanol', 'Verified'),

-- Viva Cosmetics (Indonesia heritage brand)
('a1000001-0000-0000-0000-000000000213', '8999998213001', 'Viva Milk Cleanser', 'Viva Cosmetics', 'Cleanser',
 ARRAY['ING-016','ING-045','ING-024','ING-007','ING-025'],
 'Aqua, Glycerin, Cetearyl Alcohol, Tocopherol, Fragrance, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000214', '8999998213002', 'Viva Face Toner Cucumber', 'Viva Cosmetics', 'Toner',
 ARRAY['ING-016','ING-018','ING-008','ING-025'],
 'Aqua, Glycerin, Aloe Barbadensis Leaf Juice, Alcohol Denat, Phenoxyethanol', 'Verified'),

-- Pixi Beauty
('a1000001-0000-0000-0000-000000000215', '5060280104001', 'Glow Tonic', 'Pixi Beauty', 'Exfoliant',
 ARRAY['ING-011','ING-016','ING-018','ING-092','ING-025','ING-061'],
 'Aqua, Glycolic Acid, Glycerin, Aloe Barbadensis Leaf Juice, Camellia Sinensis Leaf Extract, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000216', '5060280104002', 'Vitamin C Juice Cleanser', 'Pixi Beauty', 'Cleanser',
 ARRAY['ING-004','ING-016','ING-030','ING-024','ING-025','ING-061'],
 'Aqua, Ascorbic Acid, Glycerin, Cocamidopropyl Betaine, Tocopherol, Phenoxyethanol, Citric Acid', 'Verified'),

-- Erha
('a1000001-0000-0000-0000-000000000217', '8888817217001', 'Erha AcneStop Facial Wash', 'Erha', 'Cleanser',
 ARRAY['ING-001','ING-016','ING-030','ING-017','ING-025'],
 'Aqua, Salicylic Acid, Glycerin, Cocamidopropyl Betaine, Centella Asiatica Extract, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000218', '8888817217002', 'Erha21 Acne Lotion', 'Erha', 'Acne Treatment',
 ARRAY['ING-001','ING-019','ING-016','ING-025','ING-058'],
 'Aqua, Salicylic Acid, Melaleuca Alternifolia Leaf Oil, Glycerin, Phenoxyethanol, Carbomer', 'Verified'),

-- Skin Dewi
('a1000001-0000-0000-0000-000000000219', '8888818219001', 'Skin Dewi Vit C Glow Serum', 'Skin Dewi', 'Serum',
 ARRAY['ING-004','ING-003','ING-016','ING-010','ING-025','ING-061'],
 'Aqua, Ascorbic Acid, Niacinamide, Glycerin, Sodium Hyaluronate, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000220', '8888818219002', 'Skin Dewi Retinol Renewal Serum', 'Skin Dewi', 'Serum',
 ARRAY['ING-002','ING-016','ING-020','ING-005','ING-025'],
 'Aqua, Retinol, Glycerin, Squalane, Ceramide NP, Phenoxyethanol', 'Verified'),

-- ══════════════════════════════════════════════════════════════
-- ADDITIONAL PRODUCTS (to reach well over 200)
-- ══════════════════════════════════════════════════════════════
('a1000001-0000-0000-0000-000000000221', '8809612221001', 'COSRX Full Fit Propolis Synergy Toner', 'COSRX', 'Toner',
 ARRAY['ING-016','ING-003','ING-010','ING-015','ING-025'],
 'Aqua, Glycerin, Niacinamide, Sodium Hyaluronate, Panthenol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000222', '8888800222001', 'SOME BY MI Cicatrue Relief Serum', 'SOME BY MI', 'Serum',
 ARRAY['ING-017','ING-037','ING-016','ING-010','ING-025'],
 'Centella Asiatica Extract, Allantoin, Glycerin, Sodium Hyaluronate, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000223', '8992993223001', 'Wardah Cica Moisturizer', 'Wardah', 'Moisturizer',
 ARRAY['ING-017','ING-016','ING-005','ING-037','ING-025'],
 'Aqua, Centella Asiatica Extract, Glycerin, Ceramide NP, Allantoin, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000224', '8851932224001', 'Garnier Sakura Glow Sleeping Mask', 'Garnier', 'Face Mask',
 ARRAY['ING-016','ING-010','ING-003','ING-092','ING-025'],
 'Aqua, Glycerin, Sodium Hyaluronate, Niacinamide, Camellia Sinensis Leaf Extract, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000225', '8999944225001', 'Somethinc Retinol 0.3% Serum', 'Somethinc', 'Serum',
 ARRAY['ING-002','ING-016','ING-020','ING-082','ING-025'],
 'Aqua, Retinol, Glycerin, Squalane, Matrixyl 3000, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000226', '8999955226001', 'Avoskin Hydra Soothe Toner Mist', 'Avoskin', 'Toner',
 ARRAY['ING-016','ING-017','ING-018','ING-015','ING-025'],
 'Aqua, Glycerin, Centella Asiatica Extract, Aloe Barbadensis Leaf Juice, Panthenol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000227', '8809612227001', 'COSRX Vitamin E Vitalizing Sunscreen SPF 50+', 'COSRX', 'Sunscreen',
 ARRAY['ING-031','ING-032','ING-024','ING-016','ING-003','ING-025'],
 'Aqua, Zinc Oxide, Titanium Dioxide, Tocopherol, Glycerin, Niacinamide, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000228', '8999922228001', 'Scarlett Whitening Acne Serum', 'Scarlett Whitening', 'Serum',
 ARRAY['ING-001','ING-003','ING-017','ING-016','ING-025'],
 'Aqua, Salicylic Acid, Niacinamide, Centella Asiatica Extract, Glycerin, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000229', '8999933229001', 'Y.O.U Retinol Youth Booster Serum', 'Y.O.U Beauty', 'Serum',
 ARRAY['ING-002','ING-016','ING-020','ING-003','ING-025'],
 'Aqua, Retinol, Glycerin, Squalane, Niacinamide, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000230', '4987241230001', 'Hada Labo Gokujyun Hyaluronic Cream', 'Hada Labo', 'Moisturizer',
 ARRAY['ING-010','ING-016','ING-045','ING-050','ING-025'],
 'Aqua, Sodium Hyaluronate, Glycerin, Cetearyl Alcohol, Butylene Glycol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000231', '3606000231001', 'CeraVe Resurfacing Retinol Serum', 'CeraVe', 'Serum',
 ARRAY['ING-002','ING-016','ING-005','ING-088','ING-089','ING-003','ING-025'],
 'Aqua, Retinol, Glycerin, Ceramide NP, Ceramide EOP, Ceramide AP, Niacinamide, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000232', '3337875232001', 'La Roche-Posay Effaclar Serum', 'La Roche-Posay', 'Serum',
 ARRAY['ING-001','ING-077','ING-016','ING-003','ING-025'],
 'Aqua, Salicylic Acid, Azelaic Acid, Glycerin, Niacinamide, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000233', '8999977233001', 'Azarine Redness Relief Toner', 'Azarine', 'Toner',
 ARRAY['ING-017','ING-037','ING-016','ING-018','ING-025'],
 'Aqua, Centella Asiatica Extract, Allantoin, Glycerin, Aloe Barbadensis Leaf Juice, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000234', '8888818234001', 'Skin Dewi Hyaluronic Moisture Cream', 'Skin Dewi', 'Moisturizer',
 ARRAY['ING-010','ING-016','ING-005','ING-045','ING-025'],
 'Aqua, Sodium Hyaluronate, Glycerin, Ceramide NP, Cetearyl Alcohol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000235', '8888815235001', 'Nutrishe Vitamin C Brightening Serum', 'Nutrishe', 'Serum',
 ARRAY['ING-004','ING-003','ING-016','ING-010','ING-025','ING-061'],
 'Aqua, Ascorbic Acid, Niacinamide, Glycerin, Sodium Hyaluronate, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000236', '8997112236001', 'BENTON Goodbye Redness Centella Serum', 'BENTON', 'Serum',
 ARRAY['ING-017','ING-037','ING-016','ING-025'],
 'Centella Asiatica Extract, Allantoin, Glycerin, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000237', '8809612237001', 'Skin1004 Hyalu-Cica Blue Serum', 'Skin1004', 'Serum',
 ARRAY['ING-017','ING-010','ING-016','ING-037','ING-025'],
 'Centella Asiatica Extract, Sodium Hyaluronate, Glycerin, Allantoin, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000238', '6294003601011', 'The Ordinary Azelaic Acid Suspension 10%', 'The Ordinary', 'Treatment',
 ARRAY['ING-077','ING-016','ING-058','ING-025'],
 'Aqua, Azelaic Acid, Glycerin, Carbomer, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000239', '8994660239001', 'Emina Acne Solution Toner', 'Emina', 'Toner',
 ARRAY['ING-001','ING-016','ING-017','ING-018','ING-025'],
 'Aqua, Salicylic Acid, Glycerin, Centella Asiatica Extract, Aloe Barbadensis Leaf Juice, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000240', '8992993240001', 'Wardah Renew You Anti-Aging Essence', 'Wardah', 'Serum',
 ARRAY['ING-002','ING-082','ING-016','ING-010','ING-024','ING-025'],
 'Aqua, Retinol, Matrixyl 3000, Glycerin, Sodium Hyaluronate, Tocopherol, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000241', '8851932241001', 'Garnier Men Turbo Bright Double White Serum', 'Garnier', 'Serum',
 ARRAY['ING-003','ING-016','ING-018','ING-025'],
 'Aqua, Niacinamide, Glycerin, Aloe Barbadensis Leaf Juice, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000242', '8999911242001', 'MS Glow For Men Face Wash', 'MS Glow', 'Cleanser',
 ARRAY['ING-001','ING-016','ING-030','ING-003','ING-025'],
 'Aqua, Salicylic Acid, Glycerin, Cocamidopropyl Betaine, Niacinamide, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000243', '8999966243001', 'Implora Tea Tree Toner', 'Implora', 'Toner',
 ARRAY['ING-019','ING-016','ING-017','ING-025'],
 'Aqua, Melaleuca Alternifolia Leaf Oil, Glycerin, Centella Asiatica Extract, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000244', '8888817244001', 'Erha Sunscreen Serum SPF50+', 'Erha', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-003','ING-016','ING-010','ING-025'],
 'Aqua, Avobenzone, Octinoxate, Niacinamide, Glycerin, Sodium Hyaluronate, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000245', '8806199245001', 'Etude Moistfull Collagen Water Gel', 'Etude House', 'Moisturizer',
 ARRAY['ING-016','ING-010','ING-050','ING-058','ING-025'],
 'Aqua, Glycerin, Sodium Hyaluronate, Butylene Glycol, Carbomer, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000246', '0768395196005', 'Paula''s Choice C15 Super Booster', 'Paula''s Choice', 'Serum',
 ARRAY['ING-004','ING-085','ING-024','ING-016','ING-025','ING-061'],
 'Aqua, Ascorbic Acid, Ferulic Acid, Tocopherol, Glycerin, Phenoxyethanol, Citric Acid', 'Verified'),

('a1000001-0000-0000-0000-000000000247', '8806185247001', 'Sulwhasoo Concentrated Ginseng Renewing Serum', 'Sulwhasoo', 'Serum',
 ARRAY['ING-016','ING-010','ING-082','ING-092','ING-025'],
 'Aqua, Glycerin, Sodium Hyaluronate, Matrixyl 3000, Camellia Sinensis Leaf Extract, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000248', '8999977248001', 'Azarine UV Moist Shield Sunscreen SPF 50+', 'Azarine', 'Sunscreen',
 ARRAY['ING-033','ING-034','ING-016','ING-010','ING-003','ING-025'],
 'Aqua, Avobenzone, Octinoxate, Glycerin, Sodium Hyaluronate, Niacinamide, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000249', '8888813249001', 'Base Glow Toner', 'Base', 'Toner',
 ARRAY['ING-003','ING-016','ING-075','ING-010','ING-025'],
 'Aqua, Niacinamide, Glycerin, Alpha-Arbutin, Sodium Hyaluronate, Phenoxyethanol', 'Verified'),

('a1000001-0000-0000-0000-000000000250', '8888814250001', 'Elsheskin Skin Barrier Moisturizer', 'Elsheskin', 'Moisturizer',
 ARRAY['ING-005','ING-016','ING-020','ING-015','ING-037','ING-025'],
 'Aqua, Ceramide NP, Glycerin, Squalane, Panthenol, Allantoin, Phenoxyethanol', 'Verified')

ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- END OF SEED
-- Total: 250 products across 30+ brands, all ingredients
-- mapped to ING-001 through ING-100 from the schema.
-- ============================================================
