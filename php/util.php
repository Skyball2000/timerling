<?php

function checkForPOSTParam($identifier, $errorReason, $errorDetails, $returnValue)
{
    if (empty($_POST[$identifier])) {
        $returnValue->code = "error";
        $returnValue->reason = $errorReason;
        $returnValue->details = $errorDetails;
        return false;
    }
    return true;
}

function executeSQL($conn, $sql, $successReason, $successDetails, $returnValue)
{
    $result = $conn->query($sql);

    // check if the query was successful
    if ($result == true) {
        $returnValue->code = "success";
        $returnValue->reason = $successReason;
        $returnValue->details = $successDetails;
    } else {
        $returnValue->code = "error";
        $returnValue->reason = "dbFailedQuery";
        $returnValue->details = $conn->error;
    }

    return $result;
}