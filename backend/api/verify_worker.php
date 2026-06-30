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

$worker_id = isset($_GET['id']) ? $_GET['id'] : null;

if (!$worker_id) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Worker ID is required"]);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT id, name, household_id FROM workers WHERE id = ?");
    $stmt->execute([$worker_id]);
    $worker = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($worker) {
        echo json_encode([
            "status" => "success",
            "exists" => true,
            "data" => $worker
        ]);
    } else {
        echo json_encode([
            "status" => "success",
            "exists" => false,
            "message" => "Worker not registered in the system"
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
