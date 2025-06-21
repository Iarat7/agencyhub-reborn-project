
-- Alterando o email do usuário Jefferson Hyago
UPDATE auth.users 
SET email = 'gestaot7prod@gmail.com',
    email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE id = '3fd46dde-c672-4631-b5c5-0172defffb35';
