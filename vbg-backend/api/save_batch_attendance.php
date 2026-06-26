<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data) && is_array($data)) {
    try {
        $conn->beginTransaction();

        foreach ($data as $record) {
            $worker_id = $record['id'];
            $worker_name = $record['name'];
            $worker_initial = $record['initial'];
            $project_id = $record['projectId'];
            $latitude = isset($record['latitude']) ? $record['latitude'] : 0;
            $longitude = isset($record['longitude']) ? $record['longitude'] : 0;
            $location_name = isset($record['locationName']) ? $record['locationName'] : 'Unknown';

            // 1. Check if worker exists
            $stmt = $conn->prepare("SELECT id FROM workers WHERE id = ?");
            $stmt->execute([$worker_id]);
            $worker = $stmt->fetch();

            if (!$worker) {
                throw new Exception("Worker with ID $worker_id is not registered. Attendance cannot be recorded.");
            }

            // 2. Check if project exists (basic check, or just assume it does for now as per demo)
            $stmt = $conn->prepare("SELECT id FROM projects WHERE id = ?");
            $stmt->execute([$project_id]);
            $project = $stmt->fetch();

            if (!$project) {
                // Create project if not exists for demo purposes
                $stmt = $conn->prepare("INSERT INTO projects (id, project_name) VALUES (?, ?)");
                $stmt->execute([$project_id, "Project " . $project_id]);
            }

            // 3. Insert attendance
            $stmt = $conn->prepare("INSERT INTO attendance (worker_id, project_id, latitude, longitude, location_name) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$worker_id, $project_id, $latitude, $longitude, $location_name]);
        }

        $conn->commit();
        echo json_encode(["status" => "success", "message" => "Batch attendance saved successfully"]);

    } catch (Exception $e) {
        $conn->rollBack();
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid data"]);
}
?>
