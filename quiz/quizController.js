angular.module('quizApp', [])
  .controller('QuizController', ['$scope', function($scope) {

   //Scoped variables
   $scope.validScores = retrieveValidScores()
   $scope.quizzes = retrieveQuizzes()
   $scope.scoreHolderList = []

     $scope.setQuiz = function(quizID) {
          $scope.quiz = retrieveQuiz(quizID)
     }

     $scope.submitQuiz = function() {
        var answers = []
        for (questionID in $scope.submitQuiz.answerScore){
           score = parseInt($scope.submitQuiz.answerScore[questionID])
           question = retrieveQuestion($scope.quiz, parseInt(questionID))
           answers.push(new Answer(score, question, $scope.quiz))
        }
        $scope.scoreHolderList.push(quiz.scoreQuiz(answers, quiz.weightedAddedScoreFunction))
       // plotD3Data($scope.scoreHolderList)

      //var sm = new ScatterMatrix('../d3Plotting/demo.csv', DataSourceType.URL);
       var sm = new ScatterMatrix($scope.scoreHolderList, DataSourceType.Array);
       sm.render();
     }

  }]);