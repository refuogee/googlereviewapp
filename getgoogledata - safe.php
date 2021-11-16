<?php 

    /* This gets the data from the JSON file from Google maps / places API */
    $url = ''; // path to your JSON file - this is the places API link
    $data = file_get_contents($url); // put the contents of the file into a variable    
    $review_data = json_decode($data, true); // decode the JSON feed

    require_once('dbhandler.php');
    
    $conn = new DBHandler();
   
    // Check if database connection established successfully
    if ($conn->getInstance() === null) {
        die("No database connection");
    }     

    /* Preparing the SQL statement to Query whether the data exists from the API Data in the database - if it does it won't get added */
    
    $select_review_data_statement = $conn->getInstance()->prepare('SELECT * FROM review_data WHERE reviewer_name=:reviewer_name');
    
    
    $select_review_data_statement->bindParam(':reviewer_name', $reviewer_name, PDO::PARAM_STR);
    /* $select_review_data_statement->bindParam(':photo_url', $photo_url, PDO::PARAM_STR);
    $select_review_data_statement->bindParam(':reviewer_url', $reviewer_url, PDO::PARAM_STR);
    $select_review_data_statement->bindParam(':rating', $rating, PDO::PARAM_INT);
    $select_review_data_statement->bindParam(':relative_date', $relative_date, PDO::PARAM_STR);
    $select_review_data_statement->bindParam(':review_text', $review_text, PDO::PARAM_STR);  */

    
    /* Preparing the SQL statement to insert the Review Data from the API Data */
    $insert_review_data_statement = $conn->getInstance()->prepare("INSERT INTO review_data (id, reviewer_name, photo_url, reviewer_url, rating, relative_date, review_text) VALUES (:id, :reviewer_name, :photo_url, :reviewer_url, :rating, :relative_date, :review_text)");

    /* Binding the data to the query */
    $insert_review_data_statement->bindParam(':id', $id);
    $insert_review_data_statement->bindParam(':reviewer_name', $reviewer_name);
    $insert_review_data_statement->bindParam(':photo_url', $photo_url);
    $insert_review_data_statement->bindParam(':reviewer_url', $reviewer_url);
    $insert_review_data_statement->bindParam(':rating', $rating);
    $insert_review_data_statement->bindParam(':relative_date', $relative_date);
    $insert_review_data_statement->bindParam(':review_text', $review_text);

    /* Loops through the data from the API and inserts each piece of data into the database */

    foreach ( ($review_data['result']['reviews']) as $review ) {        

        $id = NULL;
        $reviewer_name = $review['author_name'];
        $photo_url = $review['profile_photo_url'];
        $reviewer_url = $review['author_url'];
        $rating = $review['rating'];        
        $relative_date = $review['relative_time_description'];
        $review_text = $review['text'];
        
        $select_review_data_statement->execute();

        $data = $select_review_data_statement->fetch();
        echo '<br><br>';
        if ( empty( $data ) ) {
            echo 'Data does not exist insert it <br><br>';
            if ($insert_review_data_statement->execute()) {
                echo "New record created successfully";
            } else {
                echo "Unable to create record";
            }
        } else {
            echo 'Data does exist DO NOT insert it <br><br>';
        }
    }   
    
    /* Preparing the SQL statement to Query whether the COMPANY data exists from the API Data in the database - if it does it won't get added */

    $company_name = $review_data['result']['name'];
    $company_address = $review_data['result']['vicinity'];    
    $company_average_rating = (float) str_replace(',', '.', $review_data['result']['rating'] );
    $company_review_count = $review_data['result']['user_ratings_total'];

    //$number = (float) str_replace(',', '.', $amount);

    $google_place_id = $review_data['result']['place_id'];

    //$select_company_data_statement = $conn->prepare('SELECT * FROM company_info WHERE company_name=:company_name AND company_address=:company_address AND company_average_rating=:company_average_rating AND google_place_id=:google_place_id');
    $select_company_data_statement = $conn->getInstance()->prepare('SELECT * FROM company_info WHERE company_name=:company_name AND company_address=:company_address AND google_place_id=:google_place_id');
    
    /* Binding the data to the query */
    $select_company_data_statement->bindParam(':company_name', $company_name, PDO::PARAM_STR);
    $select_company_data_statement->bindParam(':company_address', $company_address, PDO::PARAM_STR);
    $select_company_data_statement->bindParam(':google_place_id', $google_place_id, PDO::PARAM_STR);
    
    $select_company_data_statement->execute();
    $companydata = $select_company_data_statement->fetch();

    /* Preparing the SQL statement to insert the Company Data from the API Data */

    $insert_company_data_statement = $conn->getInstance()->prepare("INSERT INTO company_info (company_name, company_address, company_average_rating, google_place_id, company_review_count) VALUES (:company_name, :company_address, :company_average_rating, :google_place_id, :company_review_count)");

    /* Binding the data to the query */    
    $insert_company_data_statement->bindParam(':company_name', $company_name);
    $insert_company_data_statement->bindParam(':company_address', $company_address);
    $insert_company_data_statement->bindParam(':company_average_rating', $company_average_rating);
    $insert_company_data_statement->bindParam(':company_review_count', $company_review_count);
    
    $insert_company_data_statement->bindParam(':google_place_id', $google_place_id);
    
    if ( empty( $companydata ) ) {
        echo 'Company Data does not exist insert it <br><br>';
        if ($insert_company_data_statement->execute()) {
            echo "New Company Record created successfully";
        } else {
            echo "Unable to create New Company record";
        }
    } else {
        echo 'Company Data does exist DO NOT insert it <br><br>';
    }

    //echo '<a href="https://search.google.com/local/reviews?placeid=' . $review_data['result']['place_id'] . '">Place Maps Review url</a>';    

?>