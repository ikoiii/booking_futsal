-- Database: futsal_booking
CREATE DATABASE IF NOT EXISTS futsal_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE futsal_booking;

-- Table: users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    no_telp VARCHAR(20) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Table: lapangans
CREATE TABLE lapangans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    gambar VARCHAR(255) DEFAULT NULL,
    harga_per_jam DECIMAL(10,2) NOT NULL,
    deskripsi TEXT,
    alamat TEXT,
    fasilitas TEXT, -- JSON format untuk daftar fasilitas
    kapasitas_min INT DEFAULT 4,
    kapasitas_max INT DEFAULT 6,
    jam_buka TIME DEFAULT '08:00:00',
    jam_tutup TIME DEFAULT '24:00:00',
    status ENUM('aktif', 'nonaktif', 'maintenance') DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_harga (harga_per_jam)
);

-- Table: bookings
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lapangan_id INT NOT NULL,
    tanggal DATE NOT NULL,
    jam_mulai INT NOT NULL, -- Jam dalam format 24 jam (0-23)
    jam_selesai INT NOT NULL,
    durasi_jam INT AS (jam_selesai - jam_mulai) STORED,
    total_harga DECIMAL(10,2) AS (harga_per_jam * (jam_selesai - jam_mulai)) STORED,
    harga_per_jam DECIMAL(10,2) NOT NULL, -- Disimpan saat booking untuk historical data
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    metode_pembayaran ENUM('cash', 'transfer', 'e-wallet') DEFAULT 'cash',
    bukti_pembayaran VARCHAR(255) DEFAULT NULL,
    catatan TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lapangan_id) REFERENCES lapangans(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_lapangan_id (lapangan_id),
    INDEX idx_tanggal (tanggal),
    INDEX idx_status (status),
    UNIQUE KEY unique_booking_time (lapangan_id, tanggal, jam_mulai)
);

-- Table: reviews
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lapangan_id INT NOT NULL,
    booking_id INT NOT NULL, -- Harus ada booking sebelum bisa review
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    komentar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lapangan_id) REFERENCES lapangans(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    UNIQUE KEY unique_review_per_booking (booking_id),
    INDEX idx_user_id (user_id),
    INDEX idx_lapangan_id (lapangan_id),
    INDEX idx_rating (rating)
);

-- Table: payments
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    jumlah DECIMAL(10,2) NOT NULL,
    metode ENUM('cash', 'transfer', 'e-wallet') NOT NULL,
    status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    bukti_pembayaran VARCHAR(255) DEFAULT NULL,
    tanggal_pembayaran TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_booking_id (booking_id),
    INDEX idx_status (status)
);

-- Insert sample data for testing
-- Users
INSERT INTO users (nama, email, password, no_telp, role) VALUES
('Admin Futsal', 'admin@futsalku.com', MD5('admin123'), '081234567890', 'admin'),
('John Doe', 'john@example.com', MD5('user123'), '081234567891', 'user'),
('Jane Smith', 'jane@example.com', MD5('user123'), '081234567892', 'user');

-- Lapangans
INSERT INTO lapangans (nama, gambar, harga_per_jam, deskripsi, alamat, fasilitas) VALUES
('Lapangan A (Sintetis)', 'https://via.placeholder.com/400x200?text=Lapangan+A', 150000, 'Lapangan futsal indoor dengan rumput sintetis berkualitas tinggi.', 'Jl. Sudirman No. 123, Jakarta Pusat', '["Rumput Sintetis Kualitas A", "Kamar Ganti Pria & Wanita", "Area Parkir Luas", "Kantin & Area Tunggu", "Toilet Bersih", "Wi-Fi Gratis"]'),
('Lapangan B (Vinyl)', 'https://via.placeholder.com/400x200?text=Lapangan+B', 120000, 'Lapangan futsal indoor dengan lantai vinyl, cocok untuk kecepatan.', 'Jl. Sudirman No. 123, Jakarta Pusat', '["Lantai Vinyl", "Kamar Ganti Pria & Wanita", "Area Parkir Luas", "Kantin & Area Tunggu", "Toilet Bersih", "Wi-Fi Gratis"]'),
('Lapangan C (Outdoor)', 'https://via.placeholder.com/400x200?text=Lapangan+C', 100000, 'Lapangan futsal outdoor dengan pencahayaan malam.', 'Jl. Thamrin No. 456, Jakarta Pusat', '["Pencahayaan Malam", "Kamar Ganti Pria & Wanita", "Area Parkir Luas", "Toilet Bersih"]');

-- Bookings
INSERT INTO bookings (user_id, lapangan_id, tanggal, jam_mulai, jam_selesai, harga_per_jam, status) VALUES
(2, 1, '2025-11-15', 10, 11, 150000, 'confirmed'),
(2, 1, '2025-11-15', 14, 16, 150000, 'confirmed'),
(3, 2, '2025-11-16', 19, 20, 120000, 'confirmed'),
(3, 1, '2025-11-17', 15, 17, 150000, 'pending');

-- Reviews
INSERT INTO reviews (user_id, lapangan_id, booking_id, rating, komentar) VALUES
(2, 1, 1, 5, 'Lapanganannya sangat bersih dan rumputnya berkualitas tinggi!'),
(3, 2, 3, 4, 'Lapanganannya bagus, cuma agak panas karena vinyl.');

-- Function to calculate total rating for a lapangan
DELIMITER //
CREATE FUNCTION calculate_avg_rating(lapangan_id INT) 
RETURNS DECIMAL(3,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE avg_rating DECIMAL(3,2) DEFAULT 0;
    
    SELECT AVG(rating) INTO avg_rating 
    FROM reviews 
    WHERE lapangan_id = lapangan_id 
    AND status = 'confirmed';
    
    RETURN IFNULL(avg_rating, 0);
END //
DELIMITER ;

-- View to show lapangan with average rating
CREATE VIEW lapangan_with_rating AS
SELECT 
    l.*,
    calculate_avg_rating(l.id) as avg_rating,
    (SELECT COUNT(*) FROM reviews r WHERE r.lapangan_id = l.id) as total_reviews
FROM lapangans l
WHERE l.status = 'aktif';

-- View to show user booking history
CREATE VIEW user_booking_history AS
SELECT 
    b.*,
    u.nama as user_name,
    u.email as user_email,
    l.nama as lapangan_name,
    l.gambar as lapangan_gambar
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN lapangans l ON b.lapangan_id = l.id;

-- Index for better performance on booking searches
CREATE INDEX idx_booking_search ON bookings(lapangan_id, tanggal, jam_mulai, status);
CREATE INDEX idx_lapangan_search ON lapangans(status, harga_per_jam);

-- Trigger to update booking status when payment is confirmed
DELIMITER //
CREATE TRIGGER update_booking_status_after_payment
AFTER UPDATE ON payments
FOR EACH ROW
BEGIN
    IF NEW.status = 'paid' THEN
        UPDATE bookings 
        SET status = 'confirmed' 
        WHERE id = NEW.booking_id;
    END IF;
END //
DELIMITER ;

-- Procedure to check lapangan availability
DELIMITER //
CREATE PROCEDURE check_lapangan_availability(
    IN p_lapangan_id INT,
    IN p_tanggal DATE,
    IN p_jam_mulai INT,
    IN p_jam_selesai INT
)
BEGIN
    SELECT 
        b.id,
        b.user_id,
        b.tanggal,
        b.jam_mulai,
        b.jam_selesai,
        b.status,
        u.nama as booked_by
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    WHERE b.lapangan_id = p_lapangan_id
    AND b.tanggal = p_tanggal
    AND (
        (p_jam_mulai >= b.jam_mulai AND p_jam_mulai < b.jam_selesai) OR
        (p_jam_selesai > b.jam_mulai AND p_jam_selesai <= b.jam_selesai) OR
        (p_jam_mulai <= b.jam_mulai AND p_jam_selesai >= b.jam_selesai)
    )
    AND b.status NOT IN ('cancelled');
END //
DELIMITER ;
