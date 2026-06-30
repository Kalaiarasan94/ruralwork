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

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->complainant_name) && !empty($data->complainant_mobile) && !empty($data->complaint_text)) {
    try {
        $query = "INSERT INTO grievances (complainant_name, complainant_mobile, complaint_text, status) VALUES (?, ?, ?, 'Registered')";
        $stmt = $conn->prepare($query);
        $stmt->execute([$data->complainant_name, $data->complainant_mobile, $data->complaint_text]);

        http_response_code(201);
        echo json_encode(["status" => "success", "message" => "Grievance filed into system tracker."]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Database failure: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Incomplete request parameters."]);
}
?>