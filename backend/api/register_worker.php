<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['id']) && !empty($data['name'])) {
    try {
        // Check if ID already exists
        $stmt = $conn->prepare("SELECT id FROM workers WHERE id = ?");
        $stmt->execute([$data['id']]);
        if ($stmt->fetch()) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Worker ID already exists"]);
            exit;
        }

        // Insert new worker
        $stmt = $conn->prepare("INSERT INTO workers (id, name, household_id, aadhaar_number, mobile_number) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['id'], 
            $data['name'], 
            isset($data['household_id']) ? $data['household_id'] : null,
            isset($data['aadhaar_number']) ? $data['aadhaar_number'] : null,
            isset($data['mobile_number']) ? $data['mobile_number'] : null
        ]);
        
        echo json_encode(["status" => "success", "message" => "Worker enrolled successfully"]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Incomplete data. Worker ID and Name are required."]);
}
?>
