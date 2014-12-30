angular.module('quizApp', [])
  .controller('QuizController', ['$scope', function($scope) {

   //Scoped variables
   $scope.validScores = retrieveValidScores()
   $scope.quizzes = retrieveQuizzes()
   $scope.scoreHolderList = []

     $scope.setQuiz = function(quizID) {
          $scope.quiz = retrieveQuiz(quizID)
          console.log('Quiz is: ' + $scope.quiz)
     }

     $scope.submitQuiz = function() {
        var answers = []
        for (questionID in $scope.submitQuiz.answerScore){
           score = parseInt($scope.submitQuiz.answerScore[questionID])
           question = retrieveQuestion($scope.quiz, parseInt(questionID))
           answers.push(new Answer(score, question, $scope.quiz))
        }
        $scope.scoreHolderList.push(scoreAnswers(answers))
       // plotD3Data($scope.scoreHolderList)

      //var sm = new ScatterMatrix('../d3Plotting/demo.csv', DataSourceType.URL);
      var sm = new ScatterMatrix($scope.scoreHolderList, DataSourceType.Array);
       sm.render();
     }



     //Private functions
     // Create an array of maps like
     // {quizName:quizName, caring:normalizedScore, directness:normalizedScore}
     scoreAnswers = function(answers, maxValue, minValue) {

        totPosMaxAndMinScores = getTotalPossibleMaxAndMinScores(answers) //TODO: Build this into a quiz object

        maxScore = totPosMaxAndMinScores['maxScore']
        minScore = totPosMaxAndMinScores['minScore']

        quizName = undefined
        //Initialize Score Map
        var variableScoreMap = {}
        for(var i in answers){
            var answer = answers[i]
            variableScoreMap[answer.question.variable] = 0;

            if (typeof quizName === 'undefined') {
                quizName = answer.quiz.name
            } else if(quizName != answer.quiz.name) {
                 throw "Answers are not from the same quiz";
            }
        }

        //Get scores for all answers
        for(var i in answers){
           var answer = answers[i]
           console.log(answer.question.id +":"
                    + answer.question.question + "=" + answer.score);
            var score = parseInt(answer.score);

            if(answer.question.sign === 'negative'){
                score=-score;
            }


            var currentScore = variableScoreMap[answer.question.variable];
            variableScoreMap[answer.question.variable] = currentScore + score;
        }

        //Normalize Scores
        var scoreHolderMap = {quizName:quizName}
        for(var variable in variableScoreMap){

            var rawScore = variableScoreMap[variable];

            var normalizedScore = rawScore;
            if(rawScore>0){
                normalizedScore=rawScore/maxScore;
            }else if(rawScore<0){
                normalizedScore=rawScore/minScore;
            }

            //scoreHolderList.push({variable:variable, rawScore:rawScore, normalizedScore:normalizedScore})
            scoreHolderMap[variable] = normalizedScore
        }

        return scoreHolderMap
     }

     getTotalPossibleMaxAndMinScores = function(answers){
        maxAndMinScore = {maxScore:0, minScore:0}
        for(var i in answers){
            var answer = answers[i]
            variable = answer.question.variable
            sign = answer.question.sign

            if (sign === 'positive') {
               maxAndMinScore['maxScore'] = maxAndMinScore['maxScore']+5
            }else if (sign === 'negative') {
                  maxAndMinScore['minScore'] = maxAndMinScore['minScore']+5
            }
        }
        return maxAndMinScore
     }

  }]);