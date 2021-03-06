//
// This feeds miniloan data to feed BAI
//
const request = require('request')
const http = require('http')
const fs = require('fs'); 
const csv = require('csv-parser');

const options = {
  url: 'http://localhost:9090/DecisionService/rest/v1/mydeployment/Miniloan_ServiceRuleset',
  headers: {
    'User-Agent': 'request',
    'Content-Type': 'application/json'
  }
}

var decisionId = 1

var loans = []

var sample_loan = {
  "__DecisionID__": "12346",
  "loan": {
    "amount": 3,
    "duration": 3,
    "yearlyInterestRate": 10517320,
    "yearlyRepayment": 3,
    "approved": false,
    "messages": [
      "string"
    ]
  },
  "borrower": {
    "name": "string",
    "creditScore": 3,
    "yearlyIncome": 3
  }
}

var myArgs = process.argv.slice(2);
var limit = myArgs[0] || 200
var speed = myArgs[1] || 600
console.log("Loading "+limit+" records at "+speed+"ms each")


var inputFilePath = "./miniloan_data.csv"

if ( true ){
fs.createReadStream(inputFilePath)
.pipe(csv())
.on('data', function(data){
    try {
        //perform the operation
        sample_loan.__DecisionID__ =  ""+Date.now()+("0000"+decisionId).slice(-5);
        sample_loan.loan.amount = parseInt(data.amount);
        sample_loan.loan.duration = parseInt(data.duration);
        sample_loan.loan.yearlyInterestRate = parseFloat(data.yearlyInterestRate);
        sample_loan.loan.yearlyRepayment = parseInt(data.annualRepayment);
        sample_loan.loan.approved = true;
        sample_loan.loan.messages = [""];
        sample_loan.borrower.name = data.fname;
        sample_loan.borrower.creditScore = parseInt(data.creditScore);
        sample_loan.borrower.yearlyIncome = parseInt(data.yearlyIncome); 

        loans[decisionId-1] = JSON.parse(JSON.stringify(sample_loan));

        //console.log(sample_loan)
        decisionId = decisionId + 1;
        
//      send_miniloan(data); // add at the end 
    }
    catch(err) {
      console.log (err)
      exit()
        //error handler
    }
})
.on('end',function(){
  console.log("Miniloan Data Loaded - starting ODM calls")

  var i = 0
  const intervalObj = setInterval(() => {
    intervalFunc();
  }, speed);

  function intervalFunc() {
    if ( i < limit ) {
      sample_loan = loans[i++];
      if (true) {
        request.post('http://localhost:9090/DecisionService/rest/v1/mydeployment/Miniloan_ServiceRuleset', {
          body: JSON.stringify(sample_loan),
            headers: {
              'Content-Type': 'application/json'
            }
          }, (error, res, body) => {
          if (error) {
            console.error(error)
            return
          }
          console.log(`statusCode: ${res.statusCode}`)
          console.log(body)
        })
      } else {
        console.log(sample_loan)
      }
    } else {
      clearInterval(intervalObj)
      console.log("Miniloan Data Load Complete")
    }
  }
})
}
