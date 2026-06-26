<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->username) && !empty($data->password)) {
    $username = $data->username;
    $password = $data->password;
    $role = isset($data->role) ? $data->role : '';

    try {
        $query = "SELECT * FROM users WHERE username = :username LIMIT 0,1";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // In a real app, use password_verify($password, $row['password'])
            if($password === $row['password']) {
                if ($role && $row['role'] !== $role) {
                    http_response_code(401);
                    echo json_encode(array("message" => "Unauthorized for this role.", "status" => "error"));
                    exit();
                }

                http_response_code(200);
                echo json_encode(array(
                    "message" => "Login successful.",
                    "status" => "success",
                    "user" => array(
                        "id" => $row['id'],
                        "username" => $row['username'],
                        "role" => $row['role'],
                        "full_name" => $row['full_name']
                    )
                ));
            } else {
                http_response_code(401);
                echo json_encode(array("message" => "Invalid password.", "status" => "error"));
            }
        } else {
            http_response_code(401);
            echo json_encode(array("message" => "User not found.", "status" => "error"));
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Database error: " . $e->getMessage(), "status" => "error"));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Incomplete data.", "status" => "error"));
}
?>
