angular.module('quizApp', [])
  .controller('QuizController', ['$scope', function($scope) {
     $scope.setQuiz = function(quizID) {
          $scope.quiz = retrieveQuiz(quizID)
          console.log('Quiz is: ' + $scope.quiz)
     }

     $scope.submitQuiz = function() {
        var answers = []
        for (questionID in $scope.submitQuiz.answerScore){
           score = parseInt($scope.submitQuiz.answerScore[questionID])
           question = retrieveQuestion($scope.quiz, parseInt(questionID))
           answers.push({score:score, question:question})
        }
        $scope.scoreHolderList = scoreAnswers(answers)
     }

     $scope.validScores = retrieveValidScores()

     $scope.quizzes = retrieveQuizzes()

     //Private functions
     scoreAnswers = function(answers, maxValue, minValue) {

        maxValue = typeof a !== 'undefined' ? maxValue : 5;
        minValue = typeof a !== 'undefined' ? minValue : 5;

        //Initialize Score Map
        var variableScoreMap = {}
        for(var i in answers){
            var answer = answers[i]
            variableScoreMap[answer.question.variable] = 0;
        }

        //Get scores for all answers
        for(var i in answers){
           var answer = answers[i]
           console.log(answer.question.id +":"
                    + answer.question.question + "=" + answer.score);
            var questionRank = parseInt(answer.score);
            var currentScore = variableScoreMap[answer.question.variable];
            variableScoreMap[answer.question.variable] = currentScore + questionRank;
        }

        //Normalize Scores
       var scoreHolderList = []
        for(var variable in variableScoreMap){

            var rawScore = variableScoreMap[variable];

            var normalizedScore = rawScore;
            if(rawScore>0){
                normalizedScore=rawScore/maxValue;
            }else if(rawScore<0){
                normalizedScore=rawScore/minValue;
            }

            scoreHolderList.push({variable:variable, rawScore:rawScore, normalizedScore:normalizedScore})
        }

        return scoreHolderList
     }

  }]);