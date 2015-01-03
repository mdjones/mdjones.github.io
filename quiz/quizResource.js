retrieveQuiz = function(quizID) {
 var rQuiz
    angular.forEach(quizzes, function(quiz){
         if(quizID === quiz.id){
            rQuiz = quiz
         }
     });

     rQuiz = decorateQuiz(rQuiz)
     return rQuiz
}

retrieveQuestion = function(quiz, questionID) {
    var rQuestion
    for (var i in quiz.questions){
        question = quiz.questions[i]
        if(questionID === question.id){
             return question
        }
    }

     return undefined
}

retrieveQuizzes = function() {
    return quizzes
}

retrieveValidScores = function() {
    return [1,2,3,4,5]
}
