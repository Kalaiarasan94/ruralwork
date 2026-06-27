    <?php
    // Set headers for open cross-origin access
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
        // 1. Gather count of total workers
        $stmt1 = $conn->query("SELECT COUNT(*) as total FROM workers");
        $workers_count = $stmt1->fetch(PDO::FETCH_ASSOC)['total'];

        // 2. Gather count of active ongoing projects
        $stmt2 = $conn->query("SELECT COUNT(*) as total FROM projects WHERE status = 'Ongoing'");
        $active_projects = $stmt2->fetch(PDO::FETCH_ASSOC)['total'];

        // 3. Gather count of completed construction projects
        $stmt3 = $conn->query("SELECT COUNT(*) as total FROM projects WHERE status = 'Completed'");
        $completed_assets = $stmt3->fetch(PDO::FETCH_ASSOC)['total'];

        // 4. Gather summary calculation of allocated budgets (simulating used funds)
        $stmt4 = $conn->query("SELECT IFNULL(SUM(allocated_budget), 0.00) as total FROM projects");
        $funds_utilized = $stmt4->fetch(PDO::FETCH_ASSOC)['total'];

        // 5. Send payload back out
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "data" => [
                "registered_workers" => (int)$workers_count,
                "active_projects" => (int)$active_projects,
                "completed_assets" => (int)$completed_assets,
                "total_funds_utilized" => $funds_utilized
            ]
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "SQL Aggregate failure: " . $e->getMessage()]);
    }
    ?>