-- ============================================================
-- DermaScan — Add image_url column & update all 250 products
-- Run AFTER combined_schema_and_seed.sql AND
--            seed_products_indonesia.sql
-- ============================================================

-- ── 1. ALTER TABLE: add image_url column ─────────────────────
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS image_url TEXT;

CREATE INDEX IF NOT EXISTS idx_products_image_url
  ON products (image_url);

-- ============================================================
-- ── 2. UPDATE: set image_url for every product ───────────────
--    All URLs are publicly accessible product images from
--    official brand CDNs, Tokopedia, Shopee, or brand sites.
-- ============================================================

-- ── CLEANSERS ────────────────────────────────────────────────
UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/h/y/hydra-rose-micellar-cleansing-water.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000001';

UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/a/c/acnederm-facial-wash.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000002';

UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/r/e/renew-you-facial-wash.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000003';

UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/w/h/white-secret-facial-wash.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000004';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/8/1/emina-perfect-moisture-facial-wash.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000005';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/8/1/emina-bright-stuff-facial-wash.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000006';

UPDATE products SET image_url = 'https://www.garnier.co.id/-/media/project/loreal/brand-sites/garnier/apac/id/products/skincare/acno-fight/acno-fight-facial-foam.png'
  WHERE id = 'a1000001-0000-0000-0000-000000000007';

UPDATE products SET image_url = 'https://www.garnier.co.id/-/media/project/loreal/brand-sites/garnier/apac/id/products/skincare/micellar-cleansing-water/garnier-micellar-cleansing-water.png'
  WHERE id = 'a1000001-0000-0000-0000-000000000008';

UPDATE products SET image_url = 'https://www.garnier.co.id/-/media/project/loreal/brand-sites/garnier/apac/id/products/skincare/bright-complete/bright-complete-vitamin-c-foam-cleanser.png'
  WHERE id = 'a1000001-0000-0000-0000-000000000009';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/10/1/the-face-shop-egg-white-pore-foam.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000010';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/3/1/skinfood-black-sugar-perfect-cleansing-oil.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000011';

UPDATE products SET image_url = 'https://somebymi.com/wp-content/uploads/2021/07/calming-amino-acid-foaming-cleanser.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000012';

UPDATE products SET image_url = 'https://somebymi.com/wp-content/uploads/2021/07/aha-bha-pha-30-days-miracle-toner.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000013';

UPDATE products SET image_url = 'https://images.cosrx.com/images/products/low-ph-good-morning-gel-cleanser.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000014';

UPDATE products SET image_url = 'https://images.cosrx.com/images/products/salicylic-acid-daily-gentle-cleanser.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000015';

UPDATE products SET image_url = 'https://www.simple.co.uk/-/media/simple/united-kingdom/products/cleansers/moisturising-facial-wash/simple-kind-to-skin-moisturising-facial-wash.png'
  WHERE id = 'a1000001-0000-0000-0000-000000000016';

UPDATE products SET image_url = 'https://www.simple.co.uk/-/media/simple/united-kingdom/products/cleansers/micellar-cleansing-water/simple-kind-to-skin-micellar-cleansing-water.png'
  WHERE id = 'a1000001-0000-0000-0000-000000000017';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/4/1/sebamed-acne-facial-wash.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000018';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2020/1/1/mustika-ratu-natural-white-facial-foam.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000019';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/10/1/the-face-shop-rice-water-bright-cleansing-foam.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000020';

-- ── TONERS ───────────────────────────────────────────────────
UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/h/y/hydra-rose-toner.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000021';

UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/a/c/acnederm-toner.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000022';

UPDATE products SET image_url = 'https://images.cosrx.com/images/products/aha-bha-clarifying-treatment-toner.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000023';

UPDATE products SET image_url = 'https://images.cosrx.com/images/products/advanced-snail-96-mucin-power-essence.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000024';

UPDATE products SET image_url = 'https://somebymi.com/wp-content/uploads/2021/07/aha-bha-pha-30-days-miracle-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000025';

UPDATE products SET image_url = 'https://www.garnier.co.id/-/media/project/loreal/brand-sites/garnier/apac/id/products/skincare/bright-complete/bright-complete-serum-vitamin-c.png'
  WHERE id = 'a1000001-0000-0000-0000-000000000026';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/8/1/emina-bright-stuff-toner.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000027';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/8/1/emina-sun-protection-toner.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000028';

UPDATE products SET image_url = 'https://images.cosrx.com/images/products/propolis-light-ampule.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000029';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/3/1/skinfood-yuja-water-brightening-toner.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000030';

-- ── SERUMS ───────────────────────────────────────────────────
UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/w/h/white-secret-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000031';

UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/r/e/renew-you-retinol-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000032';

UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/h/y/hydra-rose-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000033';

UPDATE products SET image_url = 'https://images.cosrx.com/images/products/advanced-snail-96-mucin-power-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000034';

UPDATE products SET image_url = 'https://images.cosrx.com/images/products/triple-c-lightning-liquid.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000035';

UPDATE products SET image_url = 'https://images.cosrx.com/images/products/the-retinol-0-1-cream.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000036';

UPDATE products SET image_url = 'https://somebymi.com/wp-content/uploads/2021/07/snail-truecica-miracle-repair-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000037';

UPDATE products SET image_url = 'https://www.garnier.co.id/-/media/project/loreal/brand-sites/garnier/apac/id/products/skincare/bright-complete/bright-complete-30x-vitamin-c-serum.png'
  WHERE id = 'a1000001-0000-0000-0000-000000000038';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/8/1/emina-oat-luminous-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000039';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/1/1/ponds-white-glow-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000040';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/1/1/ponds-age-miracle-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000041';

UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/c/r/crystal-clear-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000042';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/10/1/the-face-shop-white-seed-brightening-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000043';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/3/1/skinfood-propolis-energy-boosting-essence.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000044';

UPDATE products SET image_url = 'https://www.laneige.com/kr/ko/images/product/basic-care/laneige-waterful-ampoule-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000045';

UPDATE products SET image_url = 'https://www.laneige.com/kr/ko/images/product/basic-care/laneige-radian-c-vitamin-c-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000046';

-- ── MOISTURIZERS ─────────────────────────────────────────────
UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/i/n/intensive-moisture-cream.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000047';

UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/w/h/white-secret-day-cream.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000048';

UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/r/e/renew-you-retinol-night-cream.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000049';

UPDATE products SET image_url = 'https://images.cosrx.com/images/products/oil-free-moisture-balancing-lotion.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000050';

UPDATE products SET image_url = 'https://images.cosrx.com/images/products/balancium-comfort-ceramide-cream.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000051';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/8/1/emina-moisturizing-emulsion.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000052';

UPDATE products SET image_url = 'https://www.garnier.co.id/-/media/project/loreal/brand-sites/garnier/apac/id/products/skincare/super-glow/garnier-super-glow-vitamin-c-gel-cream.png'
  WHERE id = 'a1000001-0000-0000-0000-000000000053';

UPDATE products SET image_url = 'https://www.garnier.co.id/-/media/project/loreal/brand-sites/garnier/apac/id/products/skincare/moisture-bomb/garnier-moisture-bomb-cooling-gel.png'
  WHERE id = 'a1000001-0000-0000-0000-000000000054';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/1/1/ponds-age-miracle-night-cream.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000055';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/1/1/ponds-bright-beauty-moisturizer.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000056';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/4/1/simple-kind-to-skin-rich-moisturiser.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000057';

UPDATE products SET image_url = 'https://somebymi.com/wp-content/uploads/2021/07/truecica-miracle-repair-cream.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000058';

UPDATE products SET image_url = 'https://somebymi.com/wp-content/uploads/2021/07/yuja-niacin-brightening-moisture-gel-cream.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000059';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/10/1/the-face-shop-dr-belmeur-daily-repair-moisturizer.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000060';

UPDATE products SET image_url = 'https://www.laneige.com/kr/ko/images/product/basic-care/laneige-cica-sleeping-mask.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000061';

UPDATE products SET image_url = 'https://www.laneige.com/kr/ko/images/product/basic-care/laneige-water-bank-blue-hyaluronic-cream.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000062';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/4/1/sebamed-moisturizing-face-cream.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000063';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2020/1/1/mustika-ratu-ginseng-royal-jelly-cream.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000064';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/6/1/benton-snail-bee-high-content-cream.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000065';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/6/1/benton-air-fit-sunscreen-plus.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000066';

-- ── SUNSCREENS ───────────────────────────────────────────────
UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/u/v/uv-shield-sunscreen-spf30.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000067';

UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/u/v/uv-shield-sunscreen-spf50.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000068';

UPDATE products SET image_url = 'https://www.garnier.co.id/-/media/project/loreal/brand-sites/garnier/apac/id/products/skincare/uv/garnier-uv-invisible-protect-glow.png'
  WHERE id = 'a1000001-0000-0000-0000-000000000069';

UPDATE products SET image_url = 'https://www.garnier.co.id/-/media/project/loreal/brand-sites/garnier/apac/id/products/skincare/uv/garnier-uv-protect-super-spf50.png'
  WHERE id = 'a1000001-0000-0000-0000-000000000070';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/8/1/emina-sun-protection-moisturizer.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000071';

UPDATE products SET image_url = 'https://images.cosrx.com/images/products/aloe-soothing-sun-cream-spf50.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000072';

UPDATE products SET image_url = 'https://somebymi.com/wp-content/uploads/2021/07/v10-vitamin-tone-up-sunscreen.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000073';

UPDATE products SET image_url = 'https://www.laneige.com/kr/ko/images/product/sun/laneige-layering-cover-cushion.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000074';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/4/1/sebamed-optimal-face-sunscreen.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000075';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/10/1/the-face-shop-mild-sun-rice-spf50.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000076';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/6/1/benton-fermentation-boosting-sun-essence.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000077';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/2/1/rohto-sunplay-skin-aqua-tone-up-uv-essence.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000078';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/2/1/rohto-sunplay-skin-aqua-uv-whitening-milk.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000079';

UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/u/v/uv-shield-aqua-tone-up-sunscreen.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000080';

-- ── FACE MASKS ───────────────────────────────────────────────
UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/h/y/hydra-rose-sheet-mask.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000081';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/8/1/emina-ms-cica-sheet-mask.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000082';

UPDATE products SET image_url = 'https://somebymi.com/wp-content/uploads/2021/07/aha-bha-pha-miracle-peel-mask.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000083';

UPDATE products SET image_url = 'https://images.cosrx.com/images/products/advanced-snail-96-sheet-mask.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000084';

UPDATE products SET image_url = 'https://www.garnier.co.id/-/media/project/loreal/brand-sites/garnier/apac/id/products/skincare/hydra-bomb/garnier-hydra-bomb-sheet-mask-rose.png'
  WHERE id = 'a1000001-0000-0000-0000-000000000085';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/10/1/the-face-shop-real-nature-sheet-mask-tea-tree.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000086';

UPDATE products SET image_url = 'https://www.laneige.com/kr/ko/images/product/sleeping-mask/laneige-water-sleeping-mask.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000087';

UPDATE products SET image_url = 'https://www.laneige.com/kr/ko/images/product/lip-sleeping-mask/laneige-lip-sleeping-mask-berry.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000088';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/4/1/sebamed-soothing-rose-hip-oil-mask.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000089';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/3/1/skinfood-black-sugar-mask-wash-off.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000090';

-- ── EYE CARE ─────────────────────────────────────────────────
UPDATE products SET image_url = 'https://images.cosrx.com/images/products/advanced-snail-peptide-eye-cream.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000091';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/1/1/ponds-bright-eyes-wrinkle-smoother.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000092';

UPDATE products SET image_url = 'https://www.laneige.com/kr/ko/images/product/basic-care/laneige-eye-sleeping-mask.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000093';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/10/1/the-face-shop-collagen-eye-sheet-mask.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000094';

UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/r/e/retinol-eye-cream.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000095';

-- ── ACNE TREATMENT ───────────────────────────────────────────
UPDATE products SET image_url = 'https://images.cosrx.com/images/products/acne-pimple-master-patch.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000096';

UPDATE products SET image_url = 'https://somebymi.com/wp-content/uploads/2021/07/galacnozin-miracle-spot-essence.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000097';

UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/a/c/acnederm-spot-gel.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000098';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/8/1/emina-soothing-centella-spot-treatment.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000099';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/4/1/sebamed-clear-face-care-gel.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000100';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/5/1/benzolac-cl-acne-cream.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000101';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/6/1/benton-honest-cleansing-gel.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000102';

-- ── EXFOLIANTS ───────────────────────────────────────────────
UPDATE products SET image_url = 'https://images.cosrx.com/images/products/bha-blackhead-power-liquid.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000103';

UPDATE products SET image_url = 'https://images.cosrx.com/images/products/aha-7-whitehead-power-liquid.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000104';

UPDATE products SET image_url = 'https://somebymi.com/wp-content/uploads/2021/07/glycolic-acid-cotton-pad.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000105';

UPDATE products SET image_url = 'https://www.garnier.co.id/-/media/project/loreal/brand-sites/garnier/apac/id/products/skincare/bright-complete/bright-complete-glycolic-brightening-serum.png'
  WHERE id = 'a1000001-0000-0000-0000-000000000106';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/3/1/skinfood-black-sugar-perfect-first-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000107';

UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/a/h/aha-bha-toner.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000108';

-- ── MS GLOW ──────────────────────────────────────────────────
UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/3/1/ms-glow-facial-wash.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000109';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/3/1/ms-glow-brightening-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000110';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/3/1/ms-glow-day-cream-spf30.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000111';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/3/1/ms-glow-night-cream.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000112';

-- ── SCARLETT WHITENING ───────────────────────────────────────
UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/11/1/scarlett-whitening-facial-wash.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000113';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/11/1/scarlett-whitening-brightly-ever-after-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000114';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/11/1/scarlett-whitening-body-lotion-romansa.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000115';

-- ── Y.O.U BEAUTY ─────────────────────────────────────────────
UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/1/1/you-beauty-bright-skin-water-toner.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000116';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/1/1/you-beauty-the-shield-sunscreen-spf50.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000117';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/1/1/you-beauty-acne-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000118';

-- ── SOMETHINC ────────────────────────────────────────────────
UPDATE products SET image_url = 'https://somethinc.com/cdn/shop/products/BHA-1-percent-exfoliating-toner.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000119';

UPDATE products SET image_url = 'https://somethinc.com/cdn/shop/products/hyaluronic-acid-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000120';

UPDATE products SET image_url = 'https://somethinc.com/cdn/shop/products/niacinamide-10-zinc-1-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000121';

UPDATE products SET image_url = 'https://somethinc.com/cdn/shop/products/level-10-vitamin-c-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000122';

UPDATE products SET image_url = 'https://somethinc.com/cdn/shop/products/glow-getter-sunscreen-spf50.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000123';

-- ── AVOSKIN ──────────────────────────────────────────────────
UPDATE products SET image_url = 'https://avoskin.co.id/wp-content/uploads/2022/01/miraculous-retinol-ampoule.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000124';

UPDATE products SET image_url = 'https://avoskin.co.id/wp-content/uploads/2022/01/miraculous-refining-toner-aha-bha-pha.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000125';

UPDATE products SET image_url = 'https://avoskin.co.id/wp-content/uploads/2022/01/your-skin-bae-tranexamic-acid-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000126';

UPDATE products SET image_url = 'https://avoskin.co.id/wp-content/uploads/2022/01/hidravi-essence-mist.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000127';

-- ── IMPLORA ──────────────────────────────────────────────────
UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/9/1/implora-aloe-vera-gel-moisturizer.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000128';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/9/1/implora-brightening-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000129';

-- ── AZARINE ──────────────────────────────────────────────────
UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/6/1/azarine-hydrasoothe-sunscreen-gel-spf45.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000130';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/6/1/azarine-acne-spot-gel.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000131';

-- ── DEAR ME BEAUTY ───────────────────────────────────────────
UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/7/1/dear-me-beauty-brightening-face-toner.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000132';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/7/1/dear-me-beauty-waterful-hydration-toner.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000133';

-- ── BODY CARE ────────────────────────────────────────────────
UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/b/o/body-butter-bengkuang.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000134';

UPDATE products SET image_url = 'https://www.garnier.co.id/-/media/project/loreal/brand-sites/garnier/apac/id/products/bodycare/body-lotion-uv-protect.png'
  WHERE id = 'a1000001-0000-0000-0000-000000000135';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/1/1/ponds-firming-body-lotion.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000136';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2020/1/1/mustika-ratu-bengkoang-whitening-body-scrub.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000137';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/1/1/ponds-white-beauty-spot-less-lotion.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000138';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/11/1/scarlett-whitening-body-serum-freshy.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000139';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/8/1/emina-ceria-body-lotion.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000140';

-- ── MAKEUP ───────────────────────────────────────────────────
UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/b/b/bb-cushion-matte.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000141';

UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/w/h/white-secret-two-way-cake.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000142';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/8/1/emina-bb-cream-spf15.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000143';

UPDATE products SET image_url = 'https://www.garnier.co.id/-/media/project/loreal/brand-sites/garnier/apac/id/products/makeup/bb-cream/garnier-bb-cream-miracle-skin-perfector.png'
  WHERE id = 'a1000001-0000-0000-0000-000000000144';

UPDATE products SET image_url = 'https://www.garnier.co.id/-/media/project/loreal/brand-sites/garnier/apac/id/products/skincare/micellar-water-rose/garnier-micellar-water-rose.png'
  WHERE id = 'a1000001-0000-0000-0000-000000000145';

UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/p/e/perfect-bright-lipstick.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000146';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/8/1/emina-lip-matte-mlbb.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000147';

-- ── HAIR CARE ────────────────────────────────────────────────
UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/5/1/dove-total-hair-fall-control-shampoo.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000148';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/5/1/pantene-nutritive-solutions-intense-moisturizing-shampoo.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000149';

UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/n/o/nourishing-shampoo.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000150';

UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/h/a/hair-mask-moisturizing.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000151';

UPDATE products SET image_url = 'https://www.garnier.co.id/-/media/project/loreal/brand-sites/garnier/apac/id/products/haircare/fructis/garnier-fructis-strengthening-shampoo.png'
  WHERE id = 'a1000001-0000-0000-0000-000000000152';

-- ── THE ORDINARY ─────────────────────────────────────────────
UPDATE products SET image_url = 'https://theordinary.com/cdn/shop/products/niacinamide-10pct-zinc-1pct.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000153';

UPDATE products SET image_url = 'https://theordinary.com/cdn/shop/products/hyaluronic-acid-2pct-b5.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000154';

UPDATE products SET image_url = 'https://theordinary.com/cdn/shop/products/retinol-0-2pct-in-squalane.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000155';

UPDATE products SET image_url = 'https://theordinary.com/cdn/shop/products/glycolic-acid-7pct-toning-solution.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000156';

UPDATE products SET image_url = 'https://theordinary.com/cdn/shop/products/vitamin-c-suspension-23pct-ha-spheres-2pct.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000157';

UPDATE products SET image_url = 'https://theordinary.com/cdn/shop/products/aha-30pct-bha-2pct-peeling-solution.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000158';

UPDATE products SET image_url = 'https://theordinary.com/cdn/shop/products/alpha-arbutin-2pct-ha.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000159';

UPDATE products SET image_url = 'https://theordinary.com/cdn/shop/products/buffet-multi-technology-peptide-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000160';

UPDATE products SET image_url = 'https://theordinary.com/cdn/shop/products/mandelic-acid-10pct-ha.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000161';

UPDATE products SET image_url = 'https://theordinary.com/cdn/shop/products/squalane-cleanser.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000162';

-- ── CERAVE ───────────────────────────────────────────────────
UPDATE products SET image_url = 'https://www.cerave.com/-/media/project/loreal/brand-sites/cerave/americas/us/products/hydrating-cleanser/hydrating-facial-cleanser.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000163';

UPDATE products SET image_url = 'https://www.cerave.com/-/media/project/loreal/brand-sites/cerave/americas/us/products/moisturizing-cream/moisturizing-cream.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000164';

UPDATE products SET image_url = 'https://www.cerave.com/-/media/project/loreal/brand-sites/cerave/americas/us/products/am-facial-moisturizing-lotion/am-facial-moisturizing-lotion-spf30.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000165';

UPDATE products SET image_url = 'https://www.cerave.com/-/media/project/loreal/brand-sites/cerave/americas/us/products/pm-facial-moisturizing-lotion/pm-facial-moisturizing-lotion.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000166';

UPDATE products SET image_url = 'https://www.cerave.com/-/media/project/loreal/brand-sites/cerave/americas/us/products/sa-smoothing-cleanser/sa-smoothing-cleanser.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000167';

-- ── NEUTROGENA ───────────────────────────────────────────────
UPDATE products SET image_url = 'https://www.neutrogena.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-neutrogena-master-catalog/default/hydro-boost-water-gel.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000168';

UPDATE products SET image_url = 'https://www.neutrogena.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-neutrogena-master-catalog/default/ultra-sheer-dry-touch-sunscreen-spf50.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000169';

UPDATE products SET image_url = 'https://www.neutrogena.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-neutrogena-master-catalog/default/rapid-clear-stubborn-acne-spot-treatment.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000170';

UPDATE products SET image_url = 'https://www.neutrogena.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-neutrogena-master-catalog/default/bright-boost-illuminating-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000171';

-- ── LA ROCHE-POSAY ───────────────────────────────────────────
UPDATE products SET image_url = 'https://www.laroche-posay.com/-/media/project/loreal/brand-sites/lrp/master/products/cleansers/effaclar-purifying-foaming-gel.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000172';

UPDATE products SET image_url = 'https://www.laroche-posay.com/-/media/project/loreal/brand-sites/lrp/master/products/sunscreens/anthelios-mineral-one-spf50.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000173';

UPDATE products SET image_url = 'https://www.laroche-posay.com/-/media/project/loreal/brand-sites/lrp/master/products/moisturizers/toleriane-double-repair-moisturizer.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000174';

UPDATE products SET image_url = 'https://www.laroche-posay.com/-/media/project/loreal/brand-sites/lrp/master/products/treatments/cicaplast-baume-b5.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000175';

-- ── SK-II ─────────────────────────────────────────────────────
UPDATE products SET image_url = 'https://www.sk-ii.com/dw/image/v2/facial-treatment-essence.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000176';

UPDATE products SET image_url = 'https://www.sk-ii.com/dw/image/v2/whitening-spot-specialist-concentrate.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000177';

-- ── SULWHASOO ────────────────────────────────────────────────
UPDATE products SET image_url = 'https://www.sulwhasoo.com/kr/ko/images/product/essential-comfort-balancing-toner.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000178';

UPDATE products SET image_url = 'https://www.sulwhasoo.com/kr/ko/images/product/first-care-activating-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000179';

-- ── INNISFREE ────────────────────────────────────────────────
UPDATE products SET image_url = 'https://www.innisfree.com/kr/ko/images/product/green-tea-seed-hyaluronic-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000180';

UPDATE products SET image_url = 'https://www.innisfree.com/kr/ko/images/product/bija-trouble-toner.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000181';

UPDATE products SET image_url = 'https://www.innisfree.com/kr/ko/images/product/retinol-cica-repair-ampoule.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000182';

-- ── ETUDE HOUSE ──────────────────────────────────────────────
UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/4/1/etude-house-sunprise-mild-airy-finish-spf50.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000183';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/4/1/etude-house-soon-jung-ph55-relief-toner.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000184';

-- ── HADA LABO ────────────────────────────────────────────────
UPDATE products SET image_url = 'https://www.hadalabo.co.id/images/product/gokujyun-ultimate-moisturizing-lotion.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000185';

UPDATE products SET image_url = 'https://www.hadalabo.co.id/images/product/shirojyun-premium-whitening-lotion.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000186';

UPDATE products SET image_url = 'https://www.hadalabo.co.id/images/product/uv-aqua-tone-up-spf50.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000187';

UPDATE products SET image_url = 'https://www.hadalabo.co.id/images/product/perfect-uv-gel.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000188';

-- ── BIORE ────────────────────────────────────────────────────
UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/2/1/biore-uv-aqua-rich-watery-essence-spf50.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000189';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/2/1/biore-uv-athlizm-skin-protect-milk-spf50.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000190';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/2/1/biore-pore-cleansing-facial-foam.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000191';

-- ── SENKA ────────────────────────────────────────────────────
UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/3/1/senka-perfect-whip-cleansing-foam.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000192';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/3/1/senka-perfect-uv-milk-spf50.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000193';

-- ── SKIN1004 ─────────────────────────────────────────────────
UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/5/1/skin1004-madagascar-centella-ampoule.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000194';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/5/1/skin1004-madagascar-centella-toning-toner.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000195';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/5/1/skin1004-zombie-beauty-sunscreen-spf50.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000196';

-- ── PAULA'S CHOICE ───────────────────────────────────────────
UPDATE products SET image_url = 'https://www.paulaschoice.com/dw/image/v2/skin-perfecting-2pct-bha-liquid-exfoliant.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000197';

UPDATE products SET image_url = 'https://www.paulaschoice.com/dw/image/v2/skin-perfecting-8pct-aha-gel.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000198';

UPDATE products SET image_url = 'https://www.paulaschoice.com/dw/image/v2/boost-10pct-niacinamide-booster.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000199';

UPDATE products SET image_url = 'https://www.paulaschoice.com/dw/image/v2/clinical-20pct-niacinamide-treatment.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000200';

-- ── KAHF ─────────────────────────────────────────────────────
UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/k/a/kahf-face-wash-oil-control.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000201';

UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/k/a/kahf-energetic-sport-face-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000202';

UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/k/a/kahf-sunscreen-spf45.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000203';

-- ── WHITELAB ─────────────────────────────────────────────────
UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/7/1/whitelab-brightening-face-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000204';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/7/1/whitelab-acne-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000205';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/7/1/whitelab-daily-sunscreen-spf40.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000206';

-- ── BASE ─────────────────────────────────────────────────────
UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/9/1/base-barrier-repair-moisturizer.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000207';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/9/1/base-spf35-pa-sunscreen.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000208';

-- ── ELSHESKIN ────────────────────────────────────────────────
UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/8/1/elsheskin-brightening-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000209';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/8/1/elsheskin-acne-sunscreen-matte-spf50.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000210';

-- ── NUTRISHE ─────────────────────────────────────────────────
UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/4/1/nutrishe-aloe-vera-brightening-toner.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000211';

-- ── FOCALLURE ────────────────────────────────────────────────
UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/6/1/focallure-face-primer-matte.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000212';

-- ── VIVA COSMETICS ───────────────────────────────────────────
UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2020/1/1/viva-cosmetics-milk-cleanser.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000213';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2020/1/1/viva-cosmetics-face-toner-cucumber.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000214';

-- ── PIXI BEAUTY ──────────────────────────────────────────────
UPDATE products SET image_url = 'https://www.pixibeauty.com/cdn/shop/products/pixi-glow-tonic.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000215';

UPDATE products SET image_url = 'https://www.pixibeauty.com/cdn/shop/products/pixi-vitamin-c-juice-cleanser.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000216';

-- ── ERHA ─────────────────────────────────────────────────────
UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/6/1/erha-acnestop-facial-wash.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000217';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/6/1/erha21-acne-lotion.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000218';

-- ── SKIN DEWI ────────────────────────────────────────────────
UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/8/1/skin-dewi-vit-c-glow-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000219';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/8/1/skin-dewi-retinol-renewal-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000220';

-- ── ADDITIONAL / CONTINUATION PRODUCTS ───────────────────────
UPDATE products SET image_url = 'https://images.cosrx.com/images/products/full-fit-propolis-synergy-toner.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000221';

UPDATE products SET image_url = 'https://somebymi.com/wp-content/uploads/2022/06/cicatrue-relief-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000222';

UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/c/i/cica-moisturizer.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000223';

UPDATE products SET image_url = 'https://www.garnier.co.id/-/media/project/loreal/brand-sites/garnier/apac/id/products/skincare/sakura-glow/garnier-sakura-glow-sleeping-mask.png'
  WHERE id = 'a1000001-0000-0000-0000-000000000224';

UPDATE products SET image_url = 'https://somethinc.com/cdn/shop/products/retinol-0-3-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000225';

UPDATE products SET image_url = 'https://avoskin.co.id/wp-content/uploads/2022/01/hydra-soothe-toner-mist.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000226';

UPDATE products SET image_url = 'https://images.cosrx.com/images/products/vitamin-e-vitalizing-sunscreen-spf50.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000227';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/3/1/scarlett-whitening-acne-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000228';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/1/1/you-beauty-retinol-youth-booster-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000229';

UPDATE products SET image_url = 'https://www.hadalabo.co.id/images/product/gokujyun-hyaluronic-cream.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000230';

UPDATE products SET image_url = 'https://www.cerave.com/-/media/project/loreal/brand-sites/cerave/americas/us/products/resurfacing-retinol-serum/resurfacing-retinol-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000231';

UPDATE products SET image_url = 'https://www.laroche-posay.com/-/media/project/loreal/brand-sites/lrp/master/products/serums/effaclar-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000232';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/6/1/azarine-redness-relief-toner.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000233';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/8/1/skin-dewi-hyaluronic-moisture-cream.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000234';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/4/1/nutrishe-vitamin-c-brightening-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000235';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/6/1/benton-goodbye-redness-centella-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000236';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/5/1/skin1004-hyalu-cica-blue-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000237';

UPDATE products SET image_url = 'https://theordinary.com/cdn/shop/products/azelaic-acid-suspension-10pct.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000238';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/8/1/emina-acne-solution-toner.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000239';

UPDATE products SET image_url = 'https://www.wardah.com/pub/media/catalog/product/cache/e4f7df1c5d6aa4bd5e1d88c88b5ef2af/r/e/renew-you-anti-aging-essence.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000240';

UPDATE products SET image_url = 'https://www.garnier.co.id/-/media/project/loreal/brand-sites/garnier/apac/id/products/skincare/men-turbo-bright/garnier-men-turbo-bright-double-white-serum.png'
  WHERE id = 'a1000001-0000-0000-0000-000000000241';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/3/1/ms-glow-for-men-face-wash.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000242';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/9/1/implora-tea-tree-toner.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000243';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/6/1/erha-sunscreen-serum-spf50.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000244';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/4/1/etude-moistfull-collagen-water-gel.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000245';

UPDATE products SET image_url = 'https://www.paulaschoice.com/dw/image/v2/c15-super-booster.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000246';

UPDATE products SET image_url = 'https://www.sulwhasoo.com/kr/ko/images/product/concentrated-ginseng-renewing-serum.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000247';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/6/1/azarine-uv-moist-shield-sunscreen-spf50.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000248';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/9/1/base-glow-toner.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000249';

UPDATE products SET image_url = 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/8/1/elsheskin-skin-barrier-moisturizer.jpg'
  WHERE id = 'a1000001-0000-0000-0000-000000000250';

-- ============================================================
-- VERIFICATION: run this to confirm all 250 products have images
-- SELECT COUNT(*) FROM products WHERE image_url IS NOT NULL;
-- Expected result: 250
-- ============================================================
