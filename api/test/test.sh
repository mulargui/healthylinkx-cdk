#!/bin/bash

URL=https://5ozb6e0499.execute-api.us-west-2.amazonaws.com/prod/

test () {     
    date +"%T.%3N"
    echo $1 $2
    curl -L -H 'Content-Type: application/json' "$URL/$1?$2" ; echo
}

# testing taxonomy api
test taxonomy

# testing transactions api
test transaction "id=1001004" #one results
test transaction "id=1001009" #two results
test transaction "id=1001000" #three results
test transaction "id=1234567" #not found

#testing short list
test shortlist "NPI1=1003002379"
test shortlist "NPI1=1003002379&NPI2=1134106867"
test shortlist "NPI1=1003002379&NPI2=1134106867&NPI3=1003002536"
test shortlist "NPI1=1234567890" #doesn't exist
test shortlist #no params

# testing providers api

# testing params
test providers "zipcode=98052"
test providers "zipcode=98052&distance=10" 
test providers "lastname1=anderson" 
test providers "lastname1=anderson&lastname2=brock" 
test providers "lastname1=anderson&lastname2=brock&lastname3=tang-xue" 
test providers "specialty=Dentist"

test providers "zipcode=98052&lastname1=anderson" 
test providers "zipcode=98052&lastname1=anderson&gender=f"
test providers "zipcode=98052&lastname1=anderson&gender=f&specialty=Counselor"

test providers "zipcode=98052&distance=10&lastname1=anderson&lastname2=brock&lastname3=tang-xue&gender=f&specialty=Counselor"

#empty result
test providers "zipcode=98052&distance=10&lastname1=anderson&lastname2=brock&lastname3=tang-xue&gender=f&specialty=Dentist"

#insuficient params
test providers "gender=m"
test providers