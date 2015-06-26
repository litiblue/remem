Meteor.publish('problemList', function(){
  return ProblemList.find({}, {
    limit: 1,
    sort: {next_time: 1}
  });
});
