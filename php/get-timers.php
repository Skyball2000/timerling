<?php
include_once('util.php');
$returnValue->code = "none";

try {

    // check if the required data is filled out
    if (checkForPOSTParam('owner', 'ownerNotSet', 'Collection has not been set.', $returnValue)) {

        // establish the connection to the database and check if the connection works
        include('db-login.php');
        if ($dbSuccess == true) {
            // get the collection identifier
            $collectionIdentifier = base64_encode($_POST['owner']);

            // select all timers that match the selected
            $sql = "SELECT * FROM timerling_timers WHERE owner = '" . $collectionIdentifier . "'";
            $result = $conn->query($sql);

            // build an array with the returned timers
            $timerData = array();
            if (mysqli_num_rows($result) > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                    // add the timer to the array
                    $entry->uuid = $row['uuid'];
                    $entry->owner = $row['owner'];
                    $entry->destination = $row['destination'];
                    $entry->method = $row['method'];
                    $entry->name = $row['name'];
                    array_push($timerData, $entry);
                }
                $returnValue->code = "success";
                $returnValue->reason = "timerList";
                $returnValue->details = $timerData;
            }
        }
    }
} catch (Exception $e) {
    $returnValue->code = "error";
    $returnValue->reason = "unknownError";
    $returnValue->details = "An uncaught error has occurred.";
}
echo json_encode($returnValue);