<?php
include_once('util.php');
$returnValue->code = "none";

try {

    // check if the required data is filled out
    if (checkForPOSTParam('owner', 'ownerNotSet', 'Collection has not been set.', $returnValue)
        && checkForPOSTParam('uuid', 'uuidNotSet', 'UUID has not been set.', $returnValue)
        && checkForPOSTParam('name', 'nameNotSet', 'Name has not been set.', $returnValue)
        && checkForPOSTParam('destination', 'destinationNotSet', 'Destination has not been set.', $returnValue)
        && checkForPOSTParam('method', 'methodNotSet', 'Method has not been set.', $returnValue)) {

        // establish the connection to the database and check if the connection works
        include('db-login.php');
        if ($dbSuccess == true) {
            // get the collection identifier and all of the other data
            $collectionIdentifier = base64_encode($_POST["owner"]);
            $uuid = base64_encode($_POST["uuid"]);
            $name = base64_encode($_POST["name"]);
            $destination = base64_encode($_POST["destination"]);
            $method = base64_encode($_POST["method"]);

            // check if the database table 'timerling_timers' contains an entry with the same uuid as in '$_POST["uuid"]'
            // and owner as in '$_POST["owner"]' using the connection variable '$conn'
            $sql = "SELECT * FROM timerling_timers WHERE uuid = '" . $uuid . "' AND owner = '" . $collectionIdentifier . "'";
            $result = $conn->query($sql);

            // if the query returns a row, then the timer is already in use
            if (mysqli_num_rows($result) > 0) {
                $sql = "UPDATE timerling_timers SET name = '" . $name . "', destination = '" . $destination . "', method = '" . $method . "' WHERE uuid = '" . $uuid . "'";
                executeSQL($conn, $sql, 'timerUpdated', 'Timer has been updated', $returnValue);
            } else {
                // add a row to the database table 'timerling_timers' using the connection variable '$conn'
                $sql = "INSERT INTO timerling_timers (id, uuid, name, destination, method, owner) VALUES (NULL, '" . $uuid . "', '" . $name . "', '" . $destination . "', '" . $method . "', '" . $collectionIdentifier . "')";
                executeSQL($conn, $sql, 'timerCreated', 'Timer has been created', $returnValue);
            }
        }
    }
} catch (Exception $e) {
    $returnValue->code = "error";
    $returnValue->reason = "unknownError";
    $returnValue->details = "An uncaught error has occurred.";
}
echo json_encode($returnValue);