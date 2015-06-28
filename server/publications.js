Meteor.publish('problemList', function(){
  console.log("publish");
  return ProblemList.find({
    next_time: { $lte: new Date() }}, {
    //
    sort: {is_first: 1, next_time: 1},
    limit: 500
  });
});
