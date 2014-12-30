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

        quizID = undefined
        //Initialize Score Map
        var variableScoreMap = {}
        for(var i in answers){
            var answer = answers[i]
            variableScoreMap[answer.question.variable] = 0;

            if (typeof quizID === 'undefined') {
                quizID = answer.quiz.id
            } else if(quizID != answer.quiz.id) {
                 throw "Answers are not from the same id";
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
        var scoreHolderMap = {quizName:quizID}
        quiz = retrieveQuiz(quizID)

        for(var variable in variableScoreMap){
            totPosMaxAndMinScores = quiz.maxAndMinPossibleScore(variable)

            maxScore = totPosMaxAndMinScores['maxScore']
            minScore = totPosMaxAndMinScores['minScore']

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

  }]);