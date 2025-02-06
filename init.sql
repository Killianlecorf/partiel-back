-- init.sql
INSERT INTO users (name, email, isAdmin, createdAt, updatedAt, password)
VALUES ('admin', 'admin@admin.com', true, NOW(), NOW(), '$2b$12$gFQ.ATg6ggzRK0kg0AIADuUwRfvYCu8gN3MdikB0f2eszprIxp5yq');
