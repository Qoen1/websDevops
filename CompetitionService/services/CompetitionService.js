  const Competition = require('../models/Competition');
  const Submission = require('../models/Submission');
  const MessageService = require('./MessageService');

  class CompetitionService{
    messageService;

    constructor (messageService) {
      this.messageService = messageService;
    }

    SaveCompetition(userId, title){
      return new Promise((resolve, reject) => {
        let today = Date();
        let newCompetition = Competition({
          createdAt: today,
          userId: userId,
          title: title
        });
        newCompetition.save().then(data => {
          this.messageService.NotifyCompetitionCreated(data)
          resolve(data)
        });
      });
    }

    GetCompetition(id){
      return new Promise((resolve, reject) => {
        Competition.findById(id).then(x => {
          if(x === undefined || x === null){
            reject({
              statusCode: 404,
              message: 'no competition exists with id ' + id
            })
          }
          resolve(x)
        })
      })
    }

    async RegisterTargetImage(competitionId, targetImageId) {
      try {
          const competition = await Competition.findOne({_id: competitionId});
          if (!competition) {
              return { status: 404, message: "Competition not found." };
          }
          competition.TargetImageId = targetImageId;
          await competition.save();
          
          return { status: 200, message: "Target image registered successfully." };
      } catch (err) {
          console.error('Error registering target image:', err);
          return { status: 500, message: "Internal server error." };
      }
  }

    async RegisterSubmissionImage(imageId, userId, competitionId) {
      console.log('register called');
      console.log(imageId);
      console.log(userId);
      if(userId == false || userId == null || userId == undefined) {
        return { status: 500, message: "User id not provided."}
      }
      try {
          const competition = await Competition.findOne({_id: competitionId});
          if (competition === undefined || competition === null) {
              return { status: 404, message: "Competition not found." };
          }
          let today = new Date();
          let submission = new Submission({
              imageId: imageId,
              userId: userId,
              competitionId: competitionId,
              submittedAt: today
          });
          await submission.save();
          console.log('Submission saved successfully');
      } catch (err) {
          console.error('Error saving submission:', err);
          return { status: 500, message: "Internal server error." };
      }
  }  

  async AddScoreToSubmission(imageId, score) {
      try {
          if (!imageId || score == undefined) {
              throw { status: 400, message: "Image ID and score are required." };
          }

          const submission = await Submission.findOneAndUpdate(
              { imageId: imageId },
              { $set: { score: score } }
          );

          if (!submission) {
              throw { status: 404, message: "Submission not found." };
          }

          return { status: 200, message: "Score added successfully." };
      } catch (error) {
          console.error('Error in AddScoreToSubmission:', error);
          return { status: error.status || 500, message: error.message || "Internal server error." };
      }
  }
}

  module.exports = CompetitionService
