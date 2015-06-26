ReactMeteor.createClass({

  templateName: "ExamPage",

  startMeteorSubscriptions: function() {
    console.log('getMeteorSubscriptions');
    Meteor.subscribe("problemList");
  },

  getInitialState: function() {
    return {step: 1};
  },

  getMeteorState: function() {
    console.log('getMeteorState');
    return {
      problem: ProblemList.findOne()
    };
  },

  nextClick: function(event) {
    console.log("next click!");
    this.setState({step: 2});
  },

  levelClick: function(level) {
    console.log("level click!");
    console.log(level);

    var _probability = problem.probability;

    if (level == "high") {
      _probability = 0;
    } else if (level == "middle") {
      _probability += 1;
    } else if (level == "low") {
      _probability += 2;
    }

    ProblemList.update(
      {_id:this.state.problem._id},
      {$set: {probability:_probability}});

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
