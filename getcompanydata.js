async function fetchCompanyData() {

    const response = await fetch('/hptgooglereview/sendcompanydata.php');
    
    var newObj = await response.json().then(function(data) {
        return data;
    }); 
    return newObj;            
    }        

function getRating(ratingNumber) {    
    var stringRating = ratingNumber.toString();
    var firstPortion, secondPortion;
    
    firstPortion = stringRating.split('.')[0];
    secondPortion = stringRating.split('.')[1]; 
 
    var starGradient = [];

    starGradient[0] = parseInt(firstPortion);
    starGradient[1] = parseInt(secondPortion);
    starGradient[2] = parseInt(firstPortion) * 10;
    starGradient[3] = parseInt(secondPortion) * 10;    
    
    return starGradient;
}

function writeCompanyDataToDom(companyName, companyAddress, googlePlaceId, overallRating, gradientArray) {
    
    document.querySelector('.ftmv-title').innerHTML = companyName;
    document.querySelector('.ftmv-address').innerHTML = companyAddress;
    document.querySelector('.ftmv-overall-rating').innerHTML = gradientArray[0]+'.'+gradientArray[1];
    
    var starAmount='';
    for (var i=0; i < gradientArray[0]; i++) {
        starAmount += '★';
    }    
    document.querySelector('.ftmv-star-rating').innerHTML = starAmount;
    document.querySelector('.ftmv-rating').innerHTML = '★';
    document.querySelector('.ftmv-review-count').innerHTML = overallRating;
    
    var googlePlacesUrl = 'https://search.google.com/local/reviews?placeid='
    document.querySelector('.ftmv-review-count-link').querySelector('a').href = googlePlacesUrl + googlePlaceId;
    document.querySelector('.ftmv-review-count-link').querySelector('a').target = '_blank';
    //document.querySelector('.review-count-link').querySelector('a').alt = 'HPT Door \'s Google Reviews page.';
    document.querySelector('.ftmv-review-count-link').querySelector('a').setAttribute('alt', 'HPT Security Door Google Reviews page.');
}

async function main() {
    let companyDataObject = await fetchCompanyData();
    //console.log(companyDataObject);   
    var size = Object.keys(companyDataObject).length;    
    //console.log( companyDataObject[0] );           
    var gradientArray = getRating( companyDataObject[0]['company_average_rating'] );   
    writeCompanyDataToDom(companyDataObject[0]['company_name'], companyDataObject[0]['company_address'], companyDataObject[0]['google_place_id'], companyDataObject[0]['company_review_count'], gradientArray);    
}

main();