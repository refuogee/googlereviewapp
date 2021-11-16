async function fetchReviewData() {

    const response = await fetch('/hptgooglereview/sendreviewdata.php');
    
    var newObj = await response.json().then(function(data) {
        return data;
    }); 
    return newObj;            
}
        
function writeReviewDataToDom(reviewDataObject) {
    var cardContainer, reviewCard, reviewImgContainer, 
    reviewImg, reviewDetailsContainer, reviewerNameContainer, 
    reviewerName, reviewerStarsContainer, reviewerStars, 
    reviewDate, reviewTextContainer, reviewText, imgLink, nameLink;
        
    var size = Object.keys(reviewDataObject).length;    
    var count;
    for (var i=0; i<size; i++) {
        cardContainer = document.querySelector('.ftmv-card-container');
        reviewCard = document.createElement('div');
        reviewCard.setAttribute('class', 'ftmv-review-card');
        cardContainer.append(reviewCard);

            reviewImgContainer = document.createElement('div');
            reviewImgContainer.setAttribute('class', 'ftmv-review-image-container');
            reviewCard.append(reviewImgContainer);

                imgLink = document.createElement('a');
                imgLink.setAttribute('href', ''+reviewDataObject[i]["reviewer_url"]+'');
                imgLink.setAttribute('target', '_blank');
                reviewImgContainer.append(imgLink);

                reviewImg = document.createElement('img');
                reviewImg.setAttribute('class', 'ftmv-review-image');
                reviewImg.setAttribute('src', ''+reviewDataObject[i]["photo_url"]+'');
                imgLink.append(reviewImg);

            reviewDetailsContainer = document.createElement('div');
            reviewDetailsContainer.setAttribute('class','ftmv-review-details-container');
            reviewCard.append(reviewDetailsContainer);

                reviewerNameContainer = document.createElement('div');
                reviewerNameContainer.setAttribute('class','ftmv-reviewer-name-container');
                reviewDetailsContainer.append(reviewerNameContainer);

                    nameLink = document.createElement('a');
                    nameLink.setAttribute('href', ''+reviewDataObject[i]["reviewer_url"]+'');
                    nameLink.setAttribute('target', '_blank');
                    reviewerNameContainer.append(nameLink);

                    reviewerName = document.createElement('p');
                    reviewerName.setAttribute('class','ftmv-reviewer-name');
                    reviewerName.innerHTML = reviewDataObject[i]['reviewer_name'];
                    nameLink.append(reviewerName);

                reviewerStarsContainer = document.createElement('div');
                reviewerStarsContainer.setAttribute('class','ftmv-reviewer-stars--date-container');
                reviewDetailsContainer.append(reviewerStarsContainer);

                    reviewerStars = document.createElement('p');
                    reviewerStars.setAttribute('class','ftmv-reviewer-stars');
                    
                    var starAmount = '';
                    for (var starCount=0; starCount< reviewDataObject[i]['rating']; starCount++) {
                        starAmount = starAmount + '★';
                    }

                    reviewerStars.innerHTML = starAmount;
                    reviewerStarsContainer.append(reviewerStars);

                    reviewDate = document.createElement('p');
                    reviewDate.setAttribute('class','ftmv-review-date');
                    reviewDate.innerHTML = reviewDataObject[i]['relative_date'];
                    reviewerStarsContainer.append(reviewDate);

                reviewTextContainer = document.createElement('div');
                reviewTextContainer.setAttribute('class','ftmv-review-text-container');
                reviewDetailsContainer.append(reviewTextContainer);

                    reviewText = document.createElement('p');
                    reviewText.setAttribute('class','ftmv-review-text');
                    reviewText.innerHTML = reviewDataObject[i]['review_text'];
                    reviewTextContainer.append(reviewText);
    }
}

async function main() {
    let reviewDataObject = await fetchReviewData();
    //console.log(reviewDataObject);              
    
    writeReviewDataToDom(reviewDataObject);    
}

main();