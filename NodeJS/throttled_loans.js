//#
//# first try at providing reverse geocoded XY locations
//#

//
// This feeds miniloan data to feed BAI
//
const fs = require('fs'); 
const csv = require('csv-parser');
var request = require('request')
,   throttledRequest = require('throttled-request')(request)
,   startedAt = Date.now();
 
throttledRequest.configure({
  requests:20,
  milliseconds: 100
});
 
throttledRequest.on('request', function () {
  console.log('Making a request. Elapsed time: %d ms', Date.now() - startedAt);
});
 

var decisionId = 1
var sample_loan = {
  "__DecisionID__": "12346",
  "loan": {
    "amount": 3,
    "duration": 3,
    "yearlyInterestRate": 10517320,
    "yearlyRepayment": 3,
    "approved": true,
    "messages": [""]
  },
  "borrower": {
    "name": "string",
    "creditScore": 3,
    "yearlyIncome": 3
  }
}

var inputFilePath = "./miniloan_data.csv"

if ( true ){
fs.createReadStream(inputFilePath)
.pipe(csv())
.on('data', function(data){
    try {

        sample_loan.__DecisionID__ =  ""+Date.now()+("0000"+decisionId).slice(-5);
        sample_loan.loan.amount = parseInt(data.amount);
        sample_loan.loan.duration = parseInt(data.duration);
        sample_loan.loan.yearlyInterestRate = parseFloat(data.yearlyInterestRate);
        sample_loan.loan.yearlyRepayment = parseInt(data.annualRepayment);
        sample_loan.borrower.name = data.fname;
        sample_loan.borrower.creditScore = parseInt(data.creditScore);
        sample_loan.borrower.yearlyIncome = parseInt(data.yearlyIncome);        
        //console.log(sample_loan)
        decisionId = decisionId + 1;

        if (true) {
         var url = 'http://localhost:9090/DecisionService/rest/v1/mydeployment/Miniloan_ServiceRuleset';
         throttledRequest(url, {
         body: JSON.stringify(sample_loan),
         headers: {
            'Content-Type': 'application/json'
         }
        }, (error, res, body) => {
          if (error) {
            console.error(error)
            return
          }
          console.log(url)
          console.log(`statusCode: ${res.statusCode}`)
          console.log(body)
        })
      } else {
        console.log(sample_loan)
      }

        
//	    send_miniloan(data); // add at the end 
    }
    catch(err) {
      console.log (err)
      return
        //error handler
    }
})
.on('end',function(){
console.log("Miniloan Data Loaded")
});  

}
