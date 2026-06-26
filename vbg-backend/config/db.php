<?php
// Database configuration for Hostinger or Localhost
$host = "localhost"; // Usually localhost for Hostinger too
$db_name = "u123456789_vbg_ramg"; // Update with your Hostinger DB Name
$username = "u123456789_user";     // Update with your Hostinger DB User
$password = "YourStrongPassword";   // Update with your Hostinger DB Password
$conn;

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("set names utf8");
} catch(PDOException $exception) {
    echo "Connection error: " . $exception->getMessage();
}
?>
