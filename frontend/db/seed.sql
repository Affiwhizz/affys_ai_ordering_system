-- =============================================================================
-- Affy's seed data
--
-- Run AFTER db/schema.sql.
-- Populates: menu items + variants, delivery zones, content blocks,
-- a couple of placeholder blog posts, and a sample promo code.
--
-- Safe to re-run (uses ON CONFLICT DO NOTHING / DO UPDATE where appropriate).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Delivery zones (18 Lisbon Metropolitan Area municipalities + outside-AML)
-- ---------------------------------------------------------------------------

insert into delivery_zones (region, municipality_key, municipality_name, base_fee, parishes) values
  ('Lisbon Metropolitan Area', 'alcochete', 'Alcochete', 25,
    array['Alcochete', 'Samouco', 'São Francisco']),
  ('Lisbon Metropolitan Area', 'almada', 'Almada', 15,
    array['Almada, Cova da Piedade, Pragal e Cacilhas', 'Caparica e Trafaria',
          'Charneca de Caparica e Sobreda', 'Costa de Caparica', 'Laranjeiro e Feijó']),
  ('Lisbon Metropolitan Area', 'amadora', 'Amadora', 7,
    array['Águas Livres', 'Alfragide', 'Encosta do Sol', 'Falagueira-Venda Nova',
          'Mina de Água', 'Venteira']),
  ('Lisbon Metropolitan Area', 'barreiro', 'Barreiro', 18,
    array['Alto do Seixalinho, Santo André e Verderena', 'Barreiro e Lavradio',
          'Palhais e Coina', 'Santo António da Charneca']),
  ('Lisbon Metropolitan Area', 'cascais', 'Cascais', 22,
    array['Alcabideche', 'Carcavelos e Parede', 'Cascais e Estoril', 'São Domingos de Rana']),
  ('Lisbon Metropolitan Area', 'lisboa', 'Lisboa', 12,
    array['Ajuda', 'Alcântara', 'Alvalade', 'Areeiro', 'Arroios', 'Avenidas Novas',
          'Beato', 'Belém', 'Benfica', 'Campo de Ourique', 'Campolide', 'Carnide',
          'Estrela', 'Lumiar', 'Marvila', 'Misericórdia', 'Olivais', 'Parque das Nações',
          'Penha de França', 'Santa Clara', 'Santa Maria Maior', 'Santo António',
          'São Domingos de Benfica', 'São Vicente']),
  ('Lisbon Metropolitan Area', 'loures', 'Loures', 14,
    array['Bucelas', 'Camarate, Unhos e Apelação', 'Fanhões', 'Loures', 'Lousa',
          'Moscavide e Portela', 'Sacavém e Prior Velho',
          'Santa Iria de Azoia, São João da Talha e Bobadela',
          'Santo Antão e São Julião do Tojal',
          'Santo António dos Cavaleiros e Frielas']),
  ('Lisbon Metropolitan Area', 'mafra', 'Mafra', 25,
    array['Azueira e Sobral da Abelheira', 'Carvoeira', 'Encarnação',
          'Enxara do Bispo, Gradil e Vila Franca do Rosário', 'Ericeira',
          'Igreja Nova e Cheleiros', 'Mafra', 'Malveira e São Miguel de Alcainça',
          'Milharado', 'Santo Isidoro', 'Venda do Pinheiro e Santo Estêvão das Galés']),
  ('Lisbon Metropolitan Area', 'moita', 'Moita', 22,
    array['Alhos Vedros', 'Baixa da Banheira e Vale da Amoreira',
          'Gaio-Rosário e Sarilhos Pequenos', 'Moita']),
  ('Lisbon Metropolitan Area', 'montijo', 'Montijo', 25,
    array['Atalaia e Alto Estanqueiro-Jardia', 'Canha', 'Montijo e Afonsoeiro',
          'Pegões', 'Sarilhos Grandes']),
  ('Lisbon Metropolitan Area', 'odivelas', 'Odivelas', 10,
    array['Odivelas', 'Pontinha e Famões', 'Póvoa de Santo Adrião e Olival Basto',
          'Ramada e Caneças']),
  ('Lisbon Metropolitan Area', 'oeiras', 'Oeiras', 12,
    array['Algés, Linda-a-Velha e Cruz Quebrada/Dafundo', 'Barcarena',
          'Carnaxide e Queijas',
          'Oeiras e São Julião da Barra, Paço de Arcos e Caxias', 'Porto Salvo']),
  ('Lisbon Metropolitan Area', 'palmela', 'Palmela', 30,
    array['Palmela', 'Pinhal Novo', 'Poceirão e Marateca', 'Quinta do Anjo']),
  ('Lisbon Metropolitan Area', 'seixal', 'Seixal', 18,
    array['Amora', 'Corroios', 'Fernão Ferro', 'Seixal, Arrentela e Aldeia de Paio Pires']),
  ('Lisbon Metropolitan Area', 'sesimbra', 'Sesimbra', 28,
    array['Castelo', 'Quinta do Conde', 'Santiago']),
  ('Lisbon Metropolitan Area', 'setubal', 'Setúbal', 30,
    array['Azeitão', 'Gâmbia-Pontes-Alto da Guerra', 'Sado', 'Setúbal', 'São Sebastião']),
  ('Lisbon Metropolitan Area', 'sintra', 'Sintra', 17,
    array['Agualva e Mira-Sintra', 'Algueirão-Mem Martins',
          'Almargem do Bispo, Pero Pinheiro e Montelavar', 'Cacém e São Marcos',
          'Casal de Cambra', 'Colares', 'Massamá e Monte Abraão',
          'Queluz e Belas', 'Rio de Mouro',
          'Santa Maria e São Miguel, São Martinho e São Pedro de Penaferrim',
          'São João das Lampas e Terrugem']),
  ('Lisbon Metropolitan Area', 'vila-franca-de-xira', 'Vila Franca de Xira', 22,
    array['Alhandra, São João dos Montes e Calhandriz',
          'Alverca do Ribatejo e Sobralinho',
          'Castanheira do Ribatejo e Cachoeiras',
          'Póvoa de Santa Iria e Forte da Casa', 'Vialonga', 'Vila Franca de Xira']),
  ('Outside AML', 'outside-aml', 'Rest of Portugal (30+ km)', 25, '{}')
on conflict (municipality_key) do update
  set base_fee = excluded.base_fee,
      municipality_name = excluded.municipality_name,
      parishes = excluded.parishes;

-- ---------------------------------------------------------------------------
-- Helper: insert menu item + tray variants (2L/3L/4L feeds 3-4/5/6-7)
-- ---------------------------------------------------------------------------

create or replace function seed_tray_item(
  p_slug text, p_name text, p_name_pt text, p_desc text, p_category text,
  p_monogram text, p_gradient text,
  p_2l numeric, p_3l numeric, p_4l numeric,
  p_channel order_channel default 'form'
) returns void
language plpgsql
as $$
declare
  v_id uuid;
begin
  insert into menu_items (slug, name, name_pt, description, category, monogram, gradient, channel)
  values (p_slug, p_name, p_name_pt, p_desc, p_category, p_monogram, p_gradient, p_channel)
  on conflict (slug) do update set
    name = excluded.name, name_pt = excluded.name_pt,
    description = excluded.description, category = excluded.category
  returning id into v_id;

  delete from menu_variants where menu_item_id = v_id;
  insert into menu_variants (menu_item_id, size_label, serves_label, price, sort_order) values
    (v_id, '2L tray', 'Feeds 3–4', p_2l, 1),
    (v_id, '3L tray', 'Feeds 5',   p_3l, 2),
    (v_id, '4L tray', 'Feeds 6–7', p_4l, 3);
end;
$$;

-- Helper: piece-based item (5/10/15)
create or replace function seed_piece_item(
  p_slug text, p_name text, p_name_pt text, p_desc text, p_category text,
  p_monogram text, p_gradient text,
  p_p1 numeric, p_p2 numeric, p_p3 numeric,
  p_l1 text default '5 pcs', p_l2 text default '10 pcs', p_l3 text default '15 pcs',
  p_serves_1 text default 'Small', p_serves_2 text default 'Medium', p_serves_3 text default 'Large'
) returns void
language plpgsql
as $$
declare
  v_id uuid;
begin
  insert into menu_items (slug, name, name_pt, description, category, monogram, gradient)
  values (p_slug, p_name, p_name_pt, p_desc, p_category, p_monogram, p_gradient)
  on conflict (slug) do update set
    name = excluded.name, name_pt = excluded.name_pt,
    description = excluded.description, category = excluded.category
  returning id into v_id;

  delete from menu_variants where menu_item_id = v_id;
  insert into menu_variants (menu_item_id, size_label, serves_label, price, sort_order) values
    (v_id, p_l1, p_serves_1, p_p1, 1),
    (v_id, p_l2, p_serves_2, p_p2, 2),
    (v_id, p_l3, p_serves_3, p_p3, 3);
end;
$$;

-- ---------------------------------------------------------------------------
-- Rice dishes
-- ---------------------------------------------------------------------------

select seed_tray_item('jollof', 'Jollof Rice', 'Arroz Jollof à Nigeriana',
  'The legendary naija spiced tomato-infused rice.',
  'Rice dishes', 'J', 'from-red via-red-soft to-espresso', 28, 42, 55);

select seed_tray_item('fried-rice', 'Fried Rice', 'Arroz Frito com Legumes e Moelas',
  'Stir-fried rice with veggies and gizzard.',
  'Rice dishes', 'F', 'from-gold via-gold-deep to-espresso', 30.5, 45.5, 60);

select seed_tray_item('native-rice', 'Native Rice', 'Arroz Tradicional',
  'Aromatic rice combo with dried fish, prawns, snail, vegetables and herbs.',
  'Rice dishes', 'N', 'from-red via-espresso to-forest', 45.5, 68, 90);

select seed_tray_item('toast-beef-rice', 'Toast Beef Rice', 'Arroz Salteado com Carne de Vaca',
  'Rice with savory toasted beef chunks.',
  'Rice dishes', 'T', 'from-espresso via-espresso-soft to-red', 35, 52, 70);

select seed_tray_item('coconut-rice', 'Coconut Rice', 'Arroz de Coco',
  'Rice prepared with coconut cream and dried fish.',
  'Rice dishes', 'C', 'from-forest via-forest-soft to-espresso', 35, 52, 70);

select seed_tray_item('plain-white-rice', 'Plain White Rice', 'Arroz Branco Simples',
  'Parboiled long grain / Basmati rice — steamed.',
  'Rice dishes', 'P', 'from-gold via-gold-deep to-espresso', 30, 45, 60);

-- ---------------------------------------------------------------------------
-- Stews
-- ---------------------------------------------------------------------------

select seed_tray_item('chicken-stew', 'Chicken Stew', 'Guisado de Frango à Nigeriana',
  'Tomato-based stew with juicy, spiced chicken.',
  'Stews', 'C', 'from-red via-red-soft to-espresso', 40, 60, 80);

select seed_tray_item('turkey-stew', 'Turkey Stew', 'Guisado de Peru à Nigeriana',
  'Tender turkey, marinated and slow-cooked.',
  'Stews', 'T', 'from-espresso via-espresso-soft to-red', 40, 60, 80);

select seed_tray_item('fish-stew', 'Fish Stew', 'Guisado de Peixe à Nigeriana',
  'Tomato-based stew with grilled/fried fish cutlets.',
  'Stews', 'F', 'from-forest via-espresso to-red', 45, 67, 90);

select seed_tray_item('beef-stew', 'Beef Stew', 'Guisado de Carne de Vaca à Nigeriana',
  'Tomato-based stew with tender beef chunks.',
  'Stews', 'B', 'from-red via-espresso to-forest', 40, 60, 80);

select seed_tray_item('goat-meat-stew', 'Goat Meat Stew', 'Guisado de Cabrito à Nigeriana',
  'Tomato-based stew with soft goat meat chunks.',
  'Stews', 'G', 'from-red via-red-soft to-espresso', 50, 75, 99);

select seed_tray_item('buka-stew', 'Buka Stew', 'Guisado à Buka',
  'Street-style tomato stew in palm oil with mixed proteins.',
  'Stews', 'B', 'from-gold via-gold-deep to-espresso', 40, 60, 80);

-- ---------------------------------------------------------------------------
-- Sauces
-- ---------------------------------------------------------------------------

select seed_tray_item('chicken-curry', 'Chicken Curry', 'Molho de Frango com Caril',
  'Mild curry sauce with tender chicken and sweet peppers.',
  'Sauces', 'C', 'from-gold via-gold-deep to-espresso', 30, 45, 60);

select seed_tray_item('ayamase-sauce', 'Ayamase Sauce', 'Molho de Pimentos Verde Ayamase',
  'Spicy green pepper sauce with assorted meats and boiled egg.',
  'Sauces', 'A', 'from-forest via-forest-soft to-espresso', 40, 60, 79.5);

select seed_tray_item('ofada-sauce', 'Ofada Sauce', 'Molho de Pimentos Vermelhos Ofada',
  'Rich red pepper mix sauce with assorted meats and palm oil.',
  'Sauces', 'O', 'from-red via-red-soft to-espresso', 40, 60, 79.5);

-- ---------------------------------------------------------------------------
-- Soups
-- ---------------------------------------------------------------------------

select seed_tray_item('vegetable-soup', 'Vegetable Soup', 'Sopa de Espinafres (Efo Riro / Edikaikong)',
  'Leafy greens in rich soup with mixed protein.',
  'Soups', 'V', 'from-forest via-forest-soft to-espresso', 49.5, 75, 98);

select seed_tray_item('egusi-soup', 'Egusi Soup', 'Sopa de Sementes de Melão',
  'Melon-seed soup with mixed protein and palm oil.',
  'Soups', 'E', 'from-gold via-gold-deep to-espresso', 49.5, 75, 98);

select seed_tray_item('ogbono-soup', 'Ogbono Soup', 'Sopa de Sementes Dika',
  'Soup with ogbono seeds, leafy greens and mixed protein.',
  'Soups', 'O', 'from-espresso via-espresso-soft to-red', 49.5, 75, 98);

select seed_tray_item('afang-soup', 'Afang Soup', 'Sopa de Folhas de Eru',
  'Soup with afang leaves and mixed protein — regional specialty.',
  'Soups', 'A', 'from-forest via-forest-soft to-espresso', 55, 82.5, 109);

select seed_tray_item('bitterleaf-soup', 'Bitterleaf Soup', 'Sopa de Folha Amarga (Ofe Onugbu)',
  'Traditional soup with bitterleaf greens and mixed protein.',
  'Soups', 'B', 'from-forest via-espresso to-red', 55, 82.5, 109);

select seed_tray_item('banga-soup', 'Banga Soup / Ofe Akwu', 'Sopa de Fruto da Palmeira',
  'Aromatic soup with palm-fruit extracts and mixed protein.',
  'Soups', 'B', 'from-red via-red-soft to-espresso', 55, 82.5, 109);

select seed_tray_item('fisherman-soup', 'Fisherman Soup', 'Sopa de Pescador',
  'Native soup loaded with fresh seafood and palm oil.',
  'Soups', 'F', 'from-espresso via-espresso-soft to-red', 65, 97.5, 130);

select seed_tray_item('seafood-okra-soup', 'Seafood Okra Soup', 'Sopa de Quiabos com Marisco',
  'Okra soup loaded with fresh seafood — prawns and more.',
  'Soups', 'O', 'from-forest via-forest-soft to-espresso', 60, 79.5, 109);

-- ---------------------------------------------------------------------------
-- Peppersoups
-- ---------------------------------------------------------------------------

select seed_tray_item('chicken-peppersoup', 'Chicken Peppersoup', 'Caldo de Frango Picante',
  'Spicy soup with herbs and soft chicken parts.',
  'Peppersoups', 'C', 'from-red via-red-soft to-espresso', 25.5, 38, 50);

select seed_tray_item('turkey-peppersoup', 'Turkey Peppersoup', 'Caldo de Peru Picante',
  'Spicy soup with herbs and soft turkey parts.',
  'Peppersoups', 'T', 'from-gold via-gold-deep to-espresso', 30, 45, 60);

select seed_tray_item('catfish-peppersoup', 'Catfish Peppersoup', 'Caldo de Bagre Picante',
  'Spicy soup with herbs and catfish cutlets.',
  'Peppersoups', 'C', 'from-forest via-espresso to-red', 35, 49.5, 49.5);

select seed_tray_item('goat-peppersoup', 'Goat / Assorted Peppersoup', 'Caldo de Cabra e Variadas Picante',
  'Spicy soup with herbs, goat or assorted meat parts.',
  'Peppersoups', 'G', 'from-red via-espresso to-forest', 40, 60, 80);

-- ---------------------------------------------------------------------------
-- Traditional dishes
-- ---------------------------------------------------------------------------

select seed_tray_item('abacha', 'Abacha', 'Salada de Mandioca',
  'Grated cassava salad with palm oil, dried fish, and traditional spices.',
  'Traditional dishes', 'A', 'from-gold via-gold-deep to-espresso', 45, 67.5, 90);

select seed_tray_item('bole-and-fish', 'Bole & Fish', 'Banana-Pão Grelhada com Peixe',
  'Plantain and grilled fish, with a spicy pepper-and-onion mix.',
  'Traditional dishes', 'B', 'from-red via-red-soft to-espresso', 45, 67.5, 90);

select seed_tray_item('beans-pottage', 'Beans Pottage', 'Feijoada à Nigeriana',
  'Sweet honey beans cooked slowly in a rich palm-oil pepper sauce.',
  'Traditional dishes', 'B', 'from-forest via-forest-soft to-espresso', 25, 37.5, 50);

select seed_tray_item('yam-pottage', 'Yam Pottage / Asaro', 'Inhame Estufado à Nigeriana',
  'Yam cooked in a flavourful vegetable + dried-fish sauce.',
  'Traditional dishes', 'Y', 'from-gold via-gold-deep to-espresso', 35, 52.5, 70);

select seed_tray_item('gizdodo', 'Gizdodo', 'Moelas com Banana Pão',
  'Chicken gizzards & fried plantain in pepper sauce.',
  'Traditional dishes', 'G', 'from-red via-red-soft to-espresso', 30, 45, 60);

select seed_tray_item('asun', 'Asun', 'Cabra Grelhado e Picante',
  'Grilled goat meat in a rich blend of peppers and onions.',
  'Traditional dishes', 'A', 'from-red via-espresso to-forest', 40, 60.5, 80);

-- ---------------------------------------------------------------------------
-- Specials, Sides
-- ---------------------------------------------------------------------------

select seed_piece_item('affys-special-pasta', 'Affy''s Special Pasta', 'Massa Especial da Affy''s',
  'Pasta sautéed with our secret touch, fresh vegetables, and protein of your choice.',
  'Specials', 'S', 'from-gold via-gold-deep to-espresso',
  15, 30, 45, '1L', '2L', '3L', 'Feeds 2', 'Feeds 4–5', 'Feeds 6');

select seed_piece_item('fried-plantains', 'Fried Plantains', 'Banana Pão Frita (Dodo)',
  'Slices of fried ripe plantain, golden and caramelized.',
  'Sides', 'D', 'from-gold via-gold-deep to-espresso',
  7, 15, 20, '1L', '2L', '3L', 'Feeds 2', 'Feeds 4–5', 'Feeds 6');

select seed_piece_item('coleslaw', 'Coleslaw Salad', 'Salada de Repolho',
  'Refreshing and crunchy blend of veggies with a creamy sauce.',
  'Sides', 'C', 'from-forest via-forest-soft to-espresso',
  7, 15, 20, '1L', '2L', '3L', 'Feeds 2', 'Feeds 4–5', 'Feeds 6');

-- ---------------------------------------------------------------------------
-- Protein (5/10/15)
-- ---------------------------------------------------------------------------

select seed_piece_item('moi-moi', 'Moi-Moi', 'Pudim Salgado de Feijão',
  'Steamed bean cake — soft, spicy, comforting.',
  'Protein', 'M', 'from-red via-red-soft to-espresso', 25, 50, 75);

select seed_piece_item('chicken-drumsticks', 'Chicken (drumsticks / thighs)', 'Frango (Coxas/Sobrecoxas)',
  'Grilled, fried or sauced chicken.',
  'Protein', 'C', 'from-gold via-gold-deep to-espresso', 15, 30, 45);

select seed_piece_item('chicken-quarters', 'Chicken Quarters', 'Frango (Quarto)',
  'Grilled, fried or sauced chicken quarters.',
  'Protein', 'Q', 'from-gold via-gold-deep to-espresso', 17.5, 35, 51.5);

select seed_piece_item('turkey-drumette', 'Turkey (drumette / wingette)', 'Peru (Asa ou Coxa)',
  'Grilled, fried or sauced turkey.',
  'Protein', 'T', 'from-red via-red-soft to-espresso', 17.5, 35, 51.5);

select seed_piece_item('beef', 'Beef', 'Carne de Vaca',
  'Fried or stewed beef chunks.',
  'Protein', 'B', 'from-espresso via-espresso-soft to-red', 15, 30, 45);

select seed_piece_item('fish', 'Fish', 'Peixe',
  'Grilled, fried or sauced fish cutlets.',
  'Protein', 'F', 'from-forest via-forest-soft to-espresso', 19.5, 39, 57.5);

select seed_piece_item('goat-lamb', 'Goat Meat / Lamb', 'Cabra / Borrego',
  'Grilled or stewed goat meat or lamb.',
  'Protein', 'G', 'from-red via-espresso to-forest', 17, 35, 50);

-- ---------------------------------------------------------------------------
-- Swallows (3/5/10)
-- ---------------------------------------------------------------------------

select seed_piece_item('eba', 'Eba', 'Massa de Mandioca Torrada',
  'Smooth cassava swallow, perfect with any soup.',
  'Swallows', 'E', 'from-gold via-gold-deep to-espresso',
  7.5, 12.5, 25, '3 pcs', '5 pcs', '10 pcs', 'Small', 'Medium', 'Large');

select seed_piece_item('poundo', 'Poundo', 'Massa de Inhame Pilado',
  'Soft yam/potato swallow, perfect with any soup.',
  'Swallows', 'P', 'from-forest via-forest-soft to-espresso',
  9, 15, 30, '3 pcs', '5 pcs', '10 pcs', 'Small', 'Medium', 'Large');

-- ---------------------------------------------------------------------------
-- Pastries & small chops (5/10/15) + Puff Puff (15/30/50)
-- ---------------------------------------------------------------------------

select seed_piece_item('meatpie', 'Meatpie', 'Pastéis de Carne',
  'Golden flaky pastry filled with minced meat and veggies.',
  'Pastries & small chops', 'M', 'from-gold via-gold-deep to-espresso', 17.5, 35, 52.5);

select seed_piece_item('chickenpie', 'Chickenpie', 'Pastéis de Frango',
  'Golden flaky pastry stuffed with seasoned chicken and veggies.',
  'Pastries & small chops', 'C', 'from-gold via-gold-deep to-espresso', 18.5, 37, 54.5);

select seed_piece_item('fishroll', 'Fish Roll', 'Enrolados de Peixe',
  'Golden flaky pastry roll filled with fish.',
  'Pastries & small chops', 'F', 'from-red via-red-soft to-espresso', 18.5, 38, 54.5);

select seed_piece_item('sausageroll', 'Sausage Roll', 'Enrolados de Salsicha',
  'Golden flaky pastry roll filled with beef sausage.',
  'Pastries & small chops', 'S', 'from-espresso via-espresso-soft to-red', 18.5, 38, 54.5);

select seed_piece_item('springroll', 'Spring Roll', 'Chamuça de Legumes ou Carne',
  'Crunchy roll wrap filled with protein and veggies.',
  'Pastries & small chops', 'S', 'from-forest via-forest-soft to-espresso', 7.5, 15, 22.5);

select seed_piece_item('samosa', 'Samosa', 'Chamuça (Triângulos)',
  'Triangle crunchy pastry filled with protein and veggies.',
  'Pastries & small chops', 'S', 'from-gold via-gold-deep to-espresso', 7.5, 15, 22.5);

select seed_piece_item('chicken-wings', 'Chicken Wings', 'Asinhas de Frango',
  'Spicy and flavorful chicken wings.',
  'Pastries & small chops', 'W', 'from-red via-red-soft to-espresso', 5, 10, 15);

select seed_piece_item('suya-skewers', 'Suya Skewers', 'Espetadas de Carne',
  'Specially spiced and flavorful beef on skewers.',
  'Pastries & small chops', 'S', 'from-red via-espresso to-forest', 25, 45, 70);

select seed_piece_item('puff-puff', 'Puff Puff', 'Bolinhos de Chuva Tradicionais',
  'Soft, sweet dough balls.',
  'Pastries & small chops', 'P', 'from-gold via-gold-deep to-espresso',
  10, 20, 35, '15 pcs', '30 pcs', '50 pcs', 'Small', 'Medium', 'Large');

-- ---------------------------------------------------------------------------
-- Portimão festival menu
-- ---------------------------------------------------------------------------

-- Insert festival items as menu_items with channel='portimao'
do $$
declare v_id uuid;
begin
  -- Jollof Special
  insert into menu_items (slug, name, description, category, monogram, gradient, channel)
  values ('portimao-jollof-special', 'Jollof Special',
    'Smoky party jollof with a proper protein cut and the works.',
    'Festival bowls', 'J', 'from-red via-red-soft to-espresso', 'portimao')
  on conflict (slug) do update set description = excluded.description
  returning id into v_id;
  delete from menu_variants where menu_item_id = v_id;
  insert into menu_variants (menu_item_id, size_label, serves_label, price, sort_order)
    values (v_id, 'Bowl', 'Festival serving', 19, 1);

  -- Jollof Supreme
  insert into menu_items (slug, name, description, category, monogram, gradient, channel)
  values ('portimao-jollof-supreme', 'Jollof Supreme',
    'Jollof loaded — bigger portion, extra protein, fully dressed.',
    'Festival bowls', 'J', 'from-red via-espresso to-forest', 'portimao')
  on conflict (slug) do update set description = excluded.description
  returning id into v_id;
  delete from menu_variants where menu_item_id = v_id;
  insert into menu_variants (menu_item_id, size_label, serves_label, price, sort_order)
    values (v_id, 'Bowl', 'Festival serving', 22, 1);

  -- Vegetable Bowl
  insert into menu_items (slug, name, description, category, monogram, gradient, channel)
  values ('portimao-vegetable-bowl', 'Vegetable Bowl',
    'Mixed seasonal vegetables with a generous helping of jollof.',
    'Festival bowls', 'V', 'from-forest via-forest-soft to-espresso', 'portimao')
  on conflict (slug) do update set description = excluded.description
  returning id into v_id;
  delete from menu_variants where menu_item_id = v_id;
  insert into menu_variants (menu_item_id, size_label, serves_label, price, sort_order)
    values (v_id, 'Bowl', 'Festival serving', 17, 1);

  -- Coleslaw (festival side)
  insert into menu_items (slug, name, description, category, monogram, gradient, channel)
  values ('portimao-coleslaw', 'Coleslaw',
    'Classic, fresh, the right amount of crunch.',
    'Festival sides', 'C', 'from-forest via-forest-soft to-espresso', 'portimao')
  on conflict (slug) do update set description = excluded.description
  returning id into v_id;
  delete from menu_variants where menu_item_id = v_id;
  insert into menu_variants (menu_item_id, size_label, price, sort_order)
    values (v_id, 'Side', 4, 1);

  -- Pepper sauce
  insert into menu_items (slug, name, description, category, monogram, gradient, channel)
  values ('portimao-pepper-sauce', 'Pepper sauce',
    'House-blend scotch bonnet sauce.',
    'Festival sides', 'P', 'from-red via-red-soft to-espresso', 'portimao')
  on conflict (slug) do update set description = excluded.description
  returning id into v_id;
  delete from menu_variants where menu_item_id = v_id;
  insert into menu_variants (menu_item_id, size_label, price, sort_order)
    values (v_id, 'Side', 4, 1);

  -- Chop Life Small
  insert into menu_items (slug, name, description, category, monogram, gradient, channel)
  values ('portimao-chop-life-small', 'Chop Life · Small',
    'Pick-and-mix small chops box for one.',
    'Festival snack boxes', 'C', 'from-gold via-gold-deep to-espresso', 'portimao')
  on conflict (slug) do update set description = excluded.description
  returning id into v_id;
  delete from menu_variants where menu_item_id = v_id;
  insert into menu_variants (menu_item_id, size_label, price, sort_order)
    values (v_id, 'Box', 10, 1);

  -- Chop Life Medium
  insert into menu_items (slug, name, description, category, monogram, gradient, channel)
  values ('portimao-chop-life-medium', 'Chop Life · Medium',
    'Bigger small chops box for sharing.',
    'Festival snack boxes', 'C', 'from-gold via-gold-deep to-espresso', 'portimao')
  on conflict (slug) do update set description = excluded.description
  returning id into v_id;
  delete from menu_variants where menu_item_id = v_id;
  insert into menu_variants (menu_item_id, size_label, price, sort_order)
    values (v_id, 'Box', 18, 1);
end $$;

-- ---------------------------------------------------------------------------
-- Content blocks (homepage hero, this-week dishes, banner, lock toggles)
-- ---------------------------------------------------------------------------

insert into content_blocks (key, label, type, value, description) values
  ('hero.eyebrow', 'Hero eyebrow', 'text',
    '"Bold West-African flavours · Made in Portugal"'::jsonb, null),
  ('hero.headline', 'Hero headline', 'text',
    '"A taste of home, served with care."'::jsonb, null),
  ('hero.body', 'Hero body', 'text',
    '"Bold, comforting, home-style Nigerian meals — preordered, delivered, catered, and brought to life at pop-ups across Portugal. Slow-cooked the way it should be."'::jsonb, null),
  ('hero.video', 'Hero video URL', 'video', '""'::jsonb,
    'Direct .mp4 or Vimeo URL — leave empty to show the placeholder.'),
  ('thisweek.dishes', 'Featured dishes (this week)', 'text',
    '"Smoky party jollof, suya skewers, pepper sauce, and soft plantain."'::jsonb, null),
  ('thisweek.deadline', 'Order deadline', 'text',
    '"Preorders close every Friday · 18:00 WET"'::jsonb, null),
  ('thisweek.pickup', 'Pickup window', 'text',
    '"Mon — Sat · Lisbon"'::jsonb, null),
  ('announce.banner', 'Announcement banner', 'text', '""'::jsonb,
    'Optional banner shown at top of homepage. Leave empty to hide.'),
  ('udia.enabled', 'Enable Ask Udia', 'toggle', 'false'::jsonb,
    'When false, Udia CTAs show "coming soon".'),
  ('normal_ordering.locked', 'Lock normal ordering', 'toggle', 'false'::jsonb,
    'Lock /menu during Portimão pop-ups so festival customers don''t accidentally order weekly meals.'),
  ('portimao.status', 'Portimão campaign status', 'text', '"live"'::jsonb,
    'One of: live | sold-out | off-season.'),
  ('portimao.slots_per_day', 'Portimão slots per day', 'text', '80'::jsonb, null),
  ('portimao.slots_left_today', 'Portimão slots left today', 'text', '28'::jsonb, null),
  ('portimao.campaign_window', 'Portimão campaign window', 'text',
    '"Jul 2 — Jul 7, 2026"'::jsonb, null)
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- Blog placeholder posts
-- ---------------------------------------------------------------------------

insert into blog_posts (slug, title, excerpt, category, read_minutes, status, published_at) values
  ('how-much-food-to-order-for-a-party',
    'How much food to order for a party',
    'A simple rule of thumb for jollof, proteins, sides, and small chops — sized to your guest count and time of day.',
    'Catering', 5, 'published', '2026-05-02'::timestamptz),
  ('what-to-serve-at-a-naming-ceremony',
    'What to serve at a Nigerian naming ceremony',
    'From small chops to the main spread, here''s how we plan the menu for naming ceremonies.',
    'Traditions', 6, 'published', '2026-04-24'::timestamptz),
  ('behind-the-menu-this-weeks-drop',
    'Behind the menu: this week''s drop',
    'What''s cooking on Friday, what''s changed since last week, and a quick word on where the suya beef came from.',
    'Kitchen notes', 3, 'published', '2026-04-18'::timestamptz)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Sample promo code (10% off first order over €40, inactive until launch)
-- ---------------------------------------------------------------------------

insert into promo_codes (code, kind, value, description, min_order, max_uses, is_active) values
  ('WELCOME10', 'percent', 10, '10% off first order over €40', 40, 1000, false)
on conflict (code) do nothing;

-- =============================================================================
-- Done. Drop the helper functions (we only need them for seeding).
-- =============================================================================

drop function if exists seed_tray_item(text, text, text, text, text, text, text, numeric, numeric, numeric, order_channel);
drop function if exists seed_piece_item(text, text, text, text, text, text, text, numeric, numeric, numeric, text, text, text, text, text, text);
