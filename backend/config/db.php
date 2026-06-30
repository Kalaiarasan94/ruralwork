<?php
// Load environment variables if .env file exists
if (file_exists(__DIR__ . '/../../.env')) {
    $lines = file(__DIR__ . '/../../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        putenv(trim($name) . '=' . trim($value));
    }
}

// Database configuration for Hostinger or Localhost
$host = getenv('DB_HOST') ?: "localhost";
$db_name = getenv('DB_NAME') ?: "u123456789_vbg_ramg";
$username = getenv('DB_USER') ?: "u123456789_user";
$password = getenv('DB_PASS') ?: "YourStrongPassword";
$conn;

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("set names utf8");
} catch(PDOException $exception) {
    echo "Connection error: " . $exception->getMessage();
}
?>
