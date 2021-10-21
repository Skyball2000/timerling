<?php
include_once('util.php');
$returnValue->code = "none";

try {

    // check if the required data is filled out
    if (checkForPOSTParam('uuid', 'uuidNotSet', 'UUID has not been set.', $returnValue)) {

        // establish the connection to the database and check if the connection works
        include('db-login.php');
        if ($dbSuccess == true) {
            // get the uuid
            $uuid = base64_encode($_POST["uuid"]);

            // from the database table 'timerling_timers', delete the entry with the same uuid as in '$_POST["uuid"]'
            // using the connection variable '$conn'
            $sql = "DELETE FROM timerling_timers WHERE uuid = '" . $uuid . "'";
            executeSQL($conn, $sql, 'deletedTimer', 'Timer has been deleted', $returnValue);
        }
    }
} catch (Exception $e) {
    $returnValue->code = "error";
    $returnValue->reason = "unknownError";
    $returnValue->details = "An uncaught error has occurred.";
}
echo json_encode($returnValue);