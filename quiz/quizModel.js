
Answer = function(score, question, quiz) {
  this.score = score
  this.question = question;
  this.quiz = quiz;
};
//
QuizAnswerHolder = function(quiz, answers) {
  this.quiz = quiz
}

decorateQuiz = function(quiz) {
  this.quiz = quiz

  quiz.maxAndMinPossibleScore = function(variable) {
      var maxAndMinScore = {maxScore:0, minScore:0}
     for(var i in quiz.questions){
        var question = quiz.questions[i]
        var quizVariable = question.variable
        var sign = question.sign

        if (variable === quizVariable) {
          if (sign === 'positive') {
             maxAndMinScore['maxScore'] = maxAndMinScore['maxScore']+5
          }else if (sign === 'negative') {
                maxAndMinScore['minScore'] = maxAndMinScore['minScore']+5
          }
        }
     }
     return maxAndMinScore
  }

  return quiz
}
