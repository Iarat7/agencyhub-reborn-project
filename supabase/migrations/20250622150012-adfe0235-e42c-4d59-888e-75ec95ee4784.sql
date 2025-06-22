
-- Alterando a senha do usuário Jefferson Hyago para admin123
UPDATE auth.users 
SET encrypted_password = crypt('admin123', gen_salt('bf')),
    updated_at = NOW()
WHERE id = '3fd46dde-c672-4631-b5c5-0172defffb35';
