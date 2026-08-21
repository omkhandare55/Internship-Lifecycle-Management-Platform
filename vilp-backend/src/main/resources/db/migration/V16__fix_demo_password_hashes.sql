-- V16: Fix demo account password hashes
-- Previous V13 used a placeholder bcrypt hash that didn't match Password@123
-- This migration updates all demo accounts with the correct bcrypt hash for Password@123
-- Spring DelegatingPasswordEncoder requires {bcrypt} prefix

UPDATE users SET password_hash = '{bcrypt}$2a$10$SamwzC2DdaruNWNiugZl/OSBEQ.WSQZeI.bqK50ieWKr1pjdWjKPK'
WHERE email IN ('student@vilp.edu', 'recruiter@google.com', 'mentor@vilp.edu', 'tnp.officer@vilp.edu', 'tnp.head@vilp.edu', 'admin@vilp.edu');
