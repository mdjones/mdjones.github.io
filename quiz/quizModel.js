
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

  maxAndMinPossibleScore = function(variable, maxQuestionScore) {
     var maxAndMinScore = {maxScore:0, minScore:0}
     for(var i in quiz.questions){
        var question = quiz.questions[i]
        var quizVariable = question.variable
        var sign = question.sign

        if (variable === quizVariable) {
          if (sign === 'positive') {
             maxAndMinScore['maxScore'] = maxAndMinScore['maxScore']+maxQuestionScore
          }else if (sign === 'negative') {
             maxAndMinScore['minScore'] = maxAndMinScore['minScore']+maxQuestionScore
          }
        }
     }
     return maxAndMinScore
  }

  quiz.scoreQuiz = function(answers, scoreFunction) {
    validateAnswers(answers)
    return scoreFunction(answers)
  }

  validateAnswers = function(answers) {
    quizID = undefined
    //Initialize Score Map

    for(var i in answers){
        var answer = answers[i]

        if (typeof answer.quiz.id === 'undefined') {
             throw "answer.quiz.id not defined";
        }

        if (typeof quizID === 'undefined') {
            quizID = answer.quiz.id
        } else if(quizID != answer.quiz.id) {
             throw "Answers are not from the same id";
        }
    }
  }

  /*
        Implement a version of the scoring that divides scores based on sign as well as variable

        Quiz Answers = { "1": 4, "2": 0, "23": 0 }

        Directness Positive = ( 4 ) / (4) = 1
        Directness Negative = (0) / (4) = 0
        Directness = 1+0 = 1

        Caring = ( 0 ) / (1*4) = 0

        {"quizName":"Short","directness":1.0,"caring":-0.0}

  */
  quiz.weightedAddedScoreFunction = function(answers) {
            var posVariableScoreMap = {}
            var negVariableScoreMap = {}
            var variables = new Set()

            //Initiate maps and sets
            for(var i in answers){
               var answer = answers[i]
               variables.add(answer.question.variable)
            }

            for(variable of variables){
               posVariableScoreMap[variable] = 0
               negVariableScoreMap[variable] = 0
            }

            //Add scores for all answers
            for(var i in answers){
               var answer = answers[i]

               var score = parseInt(answer.score)-1 //Shift all values by 1
               if(answer.question.sign === 'negative'){
                   negVariableScoreMap[answer.question.variable] = negVariableScoreMap[answer.question.variable] + score
               }else{
                   posVariableScoreMap[answer.question.variable] = posVariableScoreMap[answer.question.variable] + score
               }
            }

            //Normalize Scores
            var scoreHolderMap = {quizName:quizID}
            quiz = retrieveQuiz(quizID)

            maxQuestionScore = 4
            for(variable of variables){
                totPosMaxAndMinScores = maxAndMinPossibleScore(variable, maxQuestionScore)

                maxScore = totPosMaxAndMinScores['maxScore']
                minScore = totPosMaxAndMinScores['minScore']

                var normalizedPosScore = maxScore > 0 ? posVariableScoreMap[variable]/maxScore : 0;
                var normalizedNegScore = minScore > 0 ? negVariableScoreMap[variable]/minScore : 0;

                scoreHolderMap[variable] = normalizedPosScore - normalizedNegScore
            }

            return scoreHolderMap
         }

    /*
     Orginal scoring alg

    */
    quiz.stdWeightedScoreFunction = function(answers) {

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

          maxQuestionScore = 5
          for(var variable in variableScoreMap){
              totPosMaxAndMinScores = quiz.maxAndMinPossibleScore(variable, maxQuestionScore)

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

  return quiz
}
