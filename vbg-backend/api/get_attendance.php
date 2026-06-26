<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db.php';

try {
    $query = "SELECT a.id, w.name as worker_name, w.household_id, w.aadhaar_number, w.mobile_number, 
                     p.project_name, a.check_in_time, a.latitude, a.longitude, a.location_name 
              FROM attendance a
              JOIN workers w ON a.worker_id = w.id
              JOIN projects p ON a.project_id = p.id
              ORDER BY a.check_in_time DESC";
              
    $stmt = $conn->prepare($query);
    $stmt->execute();
    
    $attendance = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "status" => "success",
        "data" => $attendance
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
