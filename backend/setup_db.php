<?php
require_once 'config/db.php';

try {
    // Drop existing tables to ensure clean schema
    $conn->exec("SET FOREIGN_KEY_CHECKS = 0");
    $conn->exec("DROP TABLE IF EXISTS attendance");
    $conn->exec("DROP TABLE IF EXISTS grievances");
    $conn->exec("DROP TABLE IF EXISTS projects");
    $conn->exec("DROP TABLE IF EXISTS workers");
    $conn->exec("DROP TABLE IF EXISTS users");
    $conn->exec("SET FOREIGN_KEY_CHECKS = 1");

    // 1. Create Users Table
    $conn->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'supervisor') NOT NULL,
        full_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // 2. Create Workers Table
    $conn->exec("CREATE TABLE IF NOT EXISTS workers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        household_id VARCHAR(50),
        aadhaar_number VARCHAR(12),
        mobile_number VARCHAR(10),
        status ENUM('active', 'inactive') DEFAULT 'active'
    )");

    // 3. Create Projects Table
    $conn->exec("CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_name VARCHAR(255),
        allocated_budget DECIMAL(15, 2),
        status ENUM('Ongoing', 'Completed', 'Planned') DEFAULT 'Planned'
    )");

    // 4. Create Grievances Table
    $conn->exec("CREATE TABLE IF NOT EXISTS grievances (
        complaint_id INT AUTO_INCREMENT PRIMARY KEY,
        complainant_name VARCHAR(100),
        complainant_mobile VARCHAR(15),
        complaint_text TEXT,
        status ENUM('Registered', 'Under Investigation', 'Resolved') DEFAULT 'Registered',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // 5. Create Attendance Table
    $conn->exec("CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        worker_id INT NOT NULL,
        project_id INT NOT NULL,
        check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        location_name VARCHAR(255),
        FOREIGN KEY (worker_id) REFERENCES workers(id),
        FOREIGN KEY (project_id) REFERENCES projects(id)
    )");

    // 6. Insert Default Users
    $default_users = [
        ['admin', 'admin123', 'admin', 'System Administrator'],
        ['supervisor', 'field123', 'supervisor', 'Field Supervisor One']
    ];

    foreach ($default_users as $user) {
        $stmt = $conn->prepare("INSERT IGNORE INTO users (username, password, role, full_name) VALUES (?, ?, ?, ?)");
        $stmt->execute($user);
    }

    echo "Database setup completed successfully!<br>";
    echo "Default Credentials:<br>";
    echo "Admin: admin / admin123<br>";
    echo "Supervisor: supervisor / field123";

} catch (PDOException $e) {
    echo "Error setting up database: " . $e->getMessage();
}
?>
