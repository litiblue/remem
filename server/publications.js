Meteor.publish('problemList', function(){
  return ProblemList.find({}, {
    limit: 1,
    sort: {probability: -1}
  });
});
