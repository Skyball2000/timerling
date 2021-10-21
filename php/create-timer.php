<?php
include_once('util.php');
$returnValue->code = "none";

try {

    // check if the required data is filled out
    if (checkForPOSTParam('owner', 'ownerNotSet', 'Owner has not been set.', $returnValue)
        && checkForPOSTParam('name', 'nameNotSer', 'Name has not been set.', $returnValue)
        && checkForPOSTParam('destination', 'destinationNotSet', 'Destination has not been set.', $returnValue)
        && checkForPOSTParam('method', 'methodNotSet', 'Method has not been set.', $returnValue)) {

        // establish the connection to the database and check if the connection works
        include('db-login.php');
        if ($dbSuccess == true) {
            // get the user owner id aka password and hash it
            $hash = password_hash($_POST['owner'], PASSWORD_DEFAULT);

            // add a row to the database table 'timerling_timers' using the connection variable '$conn'
            $sql = "INSERT INTO timerling_timers (id, name, destination, method, owner) VALUES (NULL, '" . $_POST["name"] . "', '" . $_POST["destination"] . "', '" . $_POST["method"] . "', '" . $hash . "')";
            insertSQL($conn, $sql, 'timerCreated', 'Timer has been created', $returnValue);
        }
    }
} catch (Exception $e) {
    $returnValue->code = "error";
    $returnValue->reason = "unknownError";
    $returnValue->details = "An uncaught error has occurred.";
}
echo json_encode($returnValue);