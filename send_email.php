<?php
// Set headers for CORS and content type
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get form data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$organization = isset($_POST['organization']) ? trim($_POST['organization']) : '';
$serviceType = isset($_POST['serviceType']) ? trim($_POST['serviceType']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Map service type to display name
$serviceOptions = [
    'power' => 'Power-Independent IT Services',
    'internet' => 'Off-Grid Internet & Connectivity',
    'security' => 'Security & Surveillance',
    'it-support' => 'IT Support',
    'smart-solutions' => 'Smart Off-Grid Solutions',
    'training' => 'Training & Capacity Building',
    'maintenance' => 'Maintenance Contracts',
    'hardware' => 'Hardware Sales & Rentals',
    'other' => 'Other / Multiple Services'
];
$serviceDisplay = isset($serviceOptions[$serviceType]) ? $serviceOptions[$serviceType] : $serviceType;

// Validate required fields
$errors = [];
if (empty($name)) $errors[] = 'Full Name is required';
if (empty($email)) $errors[] = 'Email Address is required';
if (empty($phone)) $errors[] = 'Phone Number is required';
if (empty($serviceType)) $errors[] = 'Service Interested In is required';
if (empty($message)) $errors[] = 'Message / Requirements is required';

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Invalid email format';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Validation errors: ' . implode(', ', $errors)]);
    exit;
}

// Prepare email content
$to = 'info@offgridit.co.za';
$subject = 'New Site Assessment Request – OffGrid Solutions';
$emailBody = "New Site Assessment Request\n\n";
$emailBody .= "Full Name: $name\n";
$emailBody .= "Email Address: $email\n";
$emailBody .= "Phone Number: $phone\n";
if (!empty($organization)) {
    $emailBody .= "Organization / Farm / School: $organization\n";
}
$emailBody .= "Service Interested In: $serviceDisplay\n";
$emailBody .= "Message / Requirements:\n$message\n";

// Email headers
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
if (mail($to, $subject, $emailBody, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send email']);
}
?></content>
<parameter name="filePath">/workspaces/mandla-offgrid/send_email.php