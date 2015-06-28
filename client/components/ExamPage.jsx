ReactMeteor.createClass({

  templateName: "ExamPage",

  startMeteorSubscriptions: function() {
    Meteor.subscribe("problemList");
  },

  getInitialState: function() {
    return {step: 1};
  },

  getMeteorState: function() {
    console.log("getMeteorState!");
    var _problem = ProblemList.findOne({
      next_time: { $lte: new Date() }}, {
      //
      sort: {is_first: 1, next_time: 1}
    });

    return {
      problem: _problem
    };
  },

  nextClick: function(event) {
    this.setState({step: 2});
  },

  getNextTime: function(click_level) {
    var recall_level = this.state.problem.recall_level;

    // Adjust recal_level by click_level.
    if (click_level == "high") {
      recall_level += 1;
    }
    else if (click_level == "low") {
      recall_level -= 1;
      if (recall_level < 0) {
        recall_level = 0;
      }
    }

    // Calculate next time by recall_level.
    var now = moment();
    var next_time = null;
    if (recall_level === 0) {
      next_time = now.add(5, 'minutes');
    } else if (recall_level == 1) {
      next_time = now.add(10, 'minutes');
    } else if (recall_level == 2) {
      next_time = now.add(1, 'days');
    } else if (recall_level == 3) {
      next_time = now.add(7, 'days');
    } else if (recall_level == 4) {
      next_time = now.add(30, 'days');
    }

    return {recall_level: recall_level, next_time:next_time};
  },

  levelClick: function(click_level) {

    var ret = this.getNextTime(click_level);

    ProblemList.update(
      {_id:this.state.problem._id},
      {$set: {
        is_first: false,
        recall_level: ret.recall_level,
        next_time: moment(ret.next_time).toDate() }});

    this.setState({step: 1});
  },

  render: function() {
    problem = this.state.problem;

    if (typeof problem === 'undefined') {
      question = answer = '';
    }
    else {
      question = problem.question;
      answer = problem.answer;
    }

    var ButtonGroup = ReactBootstrap.ButtonGroup;
    var Button = ReactBootstrap.Button;
    var Panel = ReactBootstrap.Panel;

    return (
      <div>
        <Panel header='Q'>{question}</Panel>

        {this.state.step == 2 ?
        <Panel header='A'>{answer}</Panel>
        : null}

        {this.state.step == 1 ?
        <Button bsStyle='primary' onClick={this.nextClick}>Next</Button>
        : null}

        {this.state.step == 2 ?
        <ButtonGroup>
          <Button onClick={this.levelClick.bind(this,'high')}>High</Button>
          <Button onClick={this.levelClick.bind(this,'middle')}>Middle</Button>
          <Button onClick={this.levelClick.bind(this,'low')}>Low</Button>
        </ButtonGroup>
        : null}
      </div>
    );
  }
});
