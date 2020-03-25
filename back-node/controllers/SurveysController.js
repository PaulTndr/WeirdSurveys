var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID
router.use(bodyParser.json());
var mongoose = require('mongoose');

router.get('/', function (req, res) {
    console.log("Request /surveys/")
    surveysDB.collection('surveys').find().toArray(function(err, results) {
        console.log("found "+results.length+" surveys")
        res.json(results);
    })
});

router.post('/post', function (req, res) {
    console.log("Request /surveys/post");
    surveysDB.collection('surveys').insertOne(req.body);
    res.send(req.body);
});

router.post('/vote', function (req, res) {
    console.log("Request /surveys/vote");
    var idSurvey = mongoose.Types.ObjectId(req.body["surveyId"]);
    var optionText = req.body["option"].text;
    console.log(idSurvey)
    surveysDB.collection('surveys').findOne({
        _id: idSurvey
    }, function (findErr, survey) {
        survey.participations+=1
        survey.options.forEach((option)=>{
            if(option.text==optionText){
                option.number+=1
            }
            option.percent=Math.floor(100*option.number/survey.participations)
        })
        surveysDB.collection('surveys').update({
            _id: idSurvey
        },survey);
        res.send(survey);
    });
});


module.exports = router;