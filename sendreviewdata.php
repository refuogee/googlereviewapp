<?php
    require_once('dbhandler.php');
    
    $conn = new DBHandler();
   
    // Check if database connection established successfully
    if ($conn->getInstance() === null) {
        die("No database connection");
    }


    $select_review_data_statement = $conn->getInstance()->prepare('SELECT * FROM review_data');
    
    $select_review_data_statement->execute();
    $data = $select_review_data_statement->fetchAll();
   
    $jsonData = json_encode($data, true);
    
    echo $jsonData;


